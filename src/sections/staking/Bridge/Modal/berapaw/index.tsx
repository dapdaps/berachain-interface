import Card from "@/components/card";
import SwitchTabs from "@/components/switch-tabs";
import { usePriceStore } from "@/stores/usePriceStore";
import { useEffect, useState } from "react";
import BerapawZap from "./zap";
import BerapawStake from "./stake";
import { bera } from "@/configs/tokens/bera";
import { useRequest } from "ahooks";
import useCustomAccount from "@/hooks/use-account";
import axios from "axios";
import Big from "big.js";
import TokenSelector from "@/sections/swap/TokenSelector";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { getTokenLogo } from "@/sections/dashboard/utils";
import { ethers, utils } from "ethers";
import { numberFormatter } from "@/utils/number-formatter";
import useToast from "@/hooks/use-toast";

const TABS = [
  {
    label: "Stake",
    value: "stake"
  },
  {
    label: "Zap",
    value: "zap"
  }
];

const SLIPPAGE_MAP = new Map([
  [10, {
    label: "0.1%",
    value: 10
  }],
  [25, {
    label: "0.25%",
    value: 25
  }],
  [50, {
    label: "0.5%",
    value: 50
  }],
  [100, {
    label: "1%",
    value: 100
  }],
]);

const BerapawStakeContent = (props: any) => {
  const { data, onSuccess, dexConfig, defaultTab, onStake, onApprove } = props;

  const { chains } = dexConfig ?? {};
  const dAppConfig = chains?.[DEFAULT_CHAIN_ID] ?? {};
  const { vaults } = dAppConfig ?? {};
  const { queryTokenUrl } = vaults ?? {};

  const toast = useToast();
  const { account, provider } = useCustomAccount();
  const prices = usePriceStore((store: any) => store.beraTownPrice);
  const [stakeAmount, setStakeAmount] = useState<any>();
  const [inputCurrencyAmount, setInputCurrencyAmount] = useState<any>();
  const [inputCurrency, setInputCurrency] = useState<any>(bera["bera"]);
  const [outputCurrencyAmount, setOutputCurrencyAmount] = useState<any>();
  const [currentTab, setCurrentTab] = useState<any>(defaultTab ?? TABS[0].value);
  const [tokenSelectorVisible, setTokenSelectorVisible] = useState<boolean>(false);
  const [slippage, setSlippage] = useState<number>(SLIPPAGE_MAP.get(50)?.value ?? 50);

  const onTokenSelect = (_token: any) => {
    setInputCurrency(_token || bera["bera"]);
    setTokenSelectorVisible(false);
  };

  const { data: tokenList, loading: tokenListLoading } = useRequest(async () => {
    const res = await axios.get(`https://api.enso.finance/api/v1/wallet/balances?useEoa=true&chainId=80094&eoaAddress=${account}`);
    if (res.status !== 200) return [];
    const _tokenList = res.data?.map((item: any) => ({
      ...item,
      address: item.token === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" ? "native" : item.token,
      icon: item.logoUri || getTokenLogo(item.symbol),
      balance: utils.formatUnits(item.amount, item.decimals),
      chainId: DEFAULT_CHAIN_ID,
      value: Big(utils.formatUnits(item.amount, item.decimals) || 0).times(item.price || 0),
    }))?.sort((a: any, b: any) => {
      if (Big(a.value).gt(b.value)) {
        return -1;
      }
      return 1;
    });
    // setInputCurrency(_tokenList[0] ?? bera["bera"]);
    return _tokenList;
  }, { refreshDeps: [account], ready: !!account });

  const { runAsync: getZapData, data: zapData, loading: zapDataLoading } = useRequest(async () => {
    if (!inputCurrencyAmount || Big(inputCurrencyAmount).lte(0) || !account || !inputCurrency) {
      return {};
    }
    const amountIn = utils.parseUnits(inputCurrencyAmount, inputCurrency.decimals);

    const approveUrl = new URL("https://api.enso.finance/api/v1/wallet/approve");
    approveUrl.searchParams.set("fromAddress", account);
    approveUrl.searchParams.set("tokenAddress", inputCurrency.address === "native" ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" : inputCurrency.address);
    approveUrl.searchParams.set("chainId", DEFAULT_CHAIN_ID + "");
    approveUrl.searchParams.set("amount", amountIn.toString());
    approveUrl.searchParams.set("routingStrategy", "router");

    if (!data?.stakingToken?.address) {
      return {};
    }

    const routeUrl = new URL("https://api.enso.finance/api/v1/shortcuts/route");
    routeUrl.searchParams.set("amountIn", amountIn.toString());
    routeUrl.searchParams.set("tokenIn", inputCurrency.address === "native" ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" : inputCurrency.address);
    routeUrl.searchParams.set("tokenOut", data?.stakingToken?.address);
    routeUrl.searchParams.set("slippage", slippage.toString());
    routeUrl.searchParams.set("fromAddress", account);
    routeUrl.searchParams.set("receiver", account);
    routeUrl.searchParams.set("spender", account);
    routeUrl.searchParams.set("routingStrategy", "router");
    routeUrl.searchParams.set("chainId", DEFAULT_CHAIN_ID + "");
    const [approveRes, routeRes] = await Promise.all([
      axios.get(approveUrl.toString()),
      axios.get(routeUrl.toString())
    ]);

    if (approveRes.status !== 200 || routeRes.status !== 200) {
      return {};
    }
    return { approve: approveRes.data, route: routeRes.data };
  }, { refreshDeps: [inputCurrencyAmount, inputCurrency, data?.stakingToken?.address, account, slippage], debounceWait: 0.5 });

  const { runAsync: handleSwap, loading: swapLoading } = useRequest(async () => {
    if (!zapData || !account || !provider) return;
    const { route = {} } = zapData ?? {};
    const signer = provider.getSigner(account);
    let toastId = toast.loading({ title: "Confirming..." });
    let currentStep = "Swap";
    try {
      const tx = await signer.sendTransaction(route.tx);
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending...", tx: tx.hash, chainId: DEFAULT_CHAIN_ID });
      const txReceipt = await tx.wait();
      toast.dismiss(toastId);

      const { status, transactionHash } = txReceipt;

      if (status === 1) {
        toast.dismiss(toastId);
        toastId = toast.success({
          title: `Swap Successful!`,
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        //#region set operator
        if (!data?.approved) {
          currentStep = "Set operator";
          const operatorRes = await onApprove?.(data, { isReload: false });
          if (!operatorRes) {
            return;
          }
        }
        //#endregion
        //#region get balance of staking token
        const contract = new ethers.Contract(
          data?.stakingToken?.address,
          [
            {
              inputs: [
                { internalType: 'address', name: 'account', type: 'address' }
              ],
              name: 'balanceOf',
              outputs: [
                { internalType: 'uint256', name: '', type: 'uint256' }
              ],
              stateMutability: 'view',
              type: 'function'
            }
          ],
          provider
        );
        const balance = await contract.balanceOf(account);
        const realBalance = ethers.utils.formatUnits(balance, data?.stakingToken?.decimals);
        const estimatedAmountOut = ethers.utils.formatUnits(route.amountOut, data?.stakingToken?.decimals);
        let realAmountOut = estimatedAmountOut;
        if (Big(realBalance).lt(estimatedAmountOut)) {
          realAmountOut = realBalance;
        }
        //#endregion
        //#region check stake amount approved
        currentStep = "Approve";
        const spenderAddress = data?.vaultAddress;
        const tokenContract = new ethers.Contract(
          data?.stakingToken?.address,
          [
            {
              inputs: [
                { internalType: "address", name: "", type: "address" },
                { internalType: "address", name: "", type: "address" }
              ],
              name: "allowance",
              outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
              stateMutability: "view",
              type: "function"
            },
            {
              inputs: [
                { internalType: "address", name: "spender", type: "address" },
                { internalType: "uint256", name: "value", type: "uint256" }
              ],
              name: "approve",
              outputs: [{ internalType: "bool", name: "", type: "bool" }],
              stateMutability: "nonpayable",
              type: "function"
            }
          ],
          signer
        );
        const allowanceRes = await tokenContract.allowance(account, spenderAddress);
        const allowanceAmount = ethers.utils.formatUnits(
          allowanceRes.toString(),
          data?.stakingToken?.decimals
        );
        //#endregion
        //#region approve stake amount
        if (Big(allowanceAmount).lt(realAmountOut)) {
          const encodedRealAmount = ethers.utils.parseUnits(realAmountOut, data?.stakingToken?.decimals);
          let estimateGas = "5000000";
          try {
            const estimateGasRes = await tokenContract.estimateGas.approve(spenderAddress, encodedRealAmount);
            estimateGas = Big(estimateGasRes.toString()).times(1.2).toFixed(0);
          } catch (err) {
            console.log("get estimate gas err: %o", err);
          }
          const approveTx = await tokenContract.approve(spenderAddress, encodedRealAmount, { gasLimit: estimateGas });
          toastId = toast.loading({ title: "Pending...", tx: approveTx.hash, chainId: DEFAULT_CHAIN_ID });
          const approveTxReceipt = await approveTx.wait();
          //#region stake
          if (approveTxReceipt.status === 1) {
            toast.dismiss(toastId);
            toastId = toast.success({
              title: "Approve Successful!"
            });

            currentStep = "Stake";
            const stakeSuccess = await onStake?.(data, realAmountOut, data?.stakingToken?.symbol === "LBGT" ? "deposit" : "stake");
            if (!stakeSuccess) {
              return;
            }
            toast.dismiss(toastId);
          }
          //#endregion
        }
        //#endregion
        onSuccess?.();
      } else {
        toast.fail({ title: `Swap failed!` });
      }
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `${currentStep} failed!`
      });
      console.log(err);
    }
  }, { manual: true, throttleWait: 1 });

  const { data: tokenData, loading: tokenDataLoading } = useRequest(async () => {
    const res = await axios.get(queryTokenUrl({ address: data?.stakingToken?.address }));
    if (res.status !== 200 || !res.data || !res.data?.data || !res.data?.data?.length) return {};
    return res.data?.data?.[0];
  }, { refreshDeps: [queryTokenUrl, data?.stakingToken?.address] });

  useEffect(() => {
    const { route = {} } = zapData ?? {};
    const { amountOut = "" } = route ?? {};
    if (!amountOut) {
      setOutputCurrencyAmount("");
      return;
    }
    setOutputCurrencyAmount(utils.formatUnits(amountOut, data?.stakingToken?.decimals));
  }, [zapData]);

  return (
    <Card className="w-[500px] text-black font-Montserrat text-[14px] font-medium leading-normal">
      <div className="text-black font-CherryBomb text-[20px] leading-[90%]">
        Zap into {data?.metadata?.name}
      </div>
      <SwitchTabs
        className="mt-[20px]"
        tabs={TABS}
        current={currentTab}
        onChange={(value) => {
          setCurrentTab(value);
        }}
      />
      {
        currentTab === TABS[0].value && (
          <BerapawStake
            {...props}
            amount={stakeAmount}
            onAmountChange={(_amount: string) => {
              setStakeAmount(_amount);
            }}
            prices={prices}
            tokenData={tokenData}
          />
        )
      }
      {
        currentTab === TABS[1].value && (
          <BerapawZap
            {...props}
            prices={prices}
            inputCurrencyAmount={inputCurrencyAmount}
            setInputCurrencyAmount={setInputCurrencyAmount}
            outputCurrencyAmount={outputCurrencyAmount}
            inputCurrency={inputCurrency}
            loading={tokenListLoading || zapDataLoading || swapLoading}
            onOpenTokenSelector={() => {
              setTokenSelectorVisible(true);
            }}
            slippage={slippage}
            setSlippage={setSlippage}
            slippageList={Array.from(SLIPPAGE_MAP.values())}
            onSwap={handleSwap}
            onRefresh={getZapData}
            zapData={zapData}
            tokenData={tokenData}
          />
        )
      }
      <TokenSelector
        display={tokenSelectorVisible}
        tokens={tokenList ?? []}
        selectedTokenAddress={inputCurrency?.address}
        chainId={DEFAULT_CHAIN_ID}
        account={account}
        onSelect={onTokenSelect}
        onClose={() => {
          setTokenSelectorVisible(false);
        }}
        showSearch={false}
        isSortByBalance={false}
        customBalanceFormatter={(currency: any, balance: string) => {
          return numberFormatter(currency.value, 2, true, { prefix: "$", isShort: true, isShortUppercase: true, isZeroPrecision: true });
        }}
      />
    </Card>
  );
};

export default BerapawStakeContent;
