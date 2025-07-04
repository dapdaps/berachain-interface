import Card from "@/components/card";
import SwitchTabs from "@/components/switch-tabs";
import { useState } from "react";
import BerapawZap, { ZapSlippage } from "./zap";
import BerapawStake from "./stake";
import useCustomAccount from "@/hooks/use-account";
import Big from "big.js";
import TokenSelector from "@/sections/swap/TokenSelector";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { ethers } from "ethers";
import { numberFormatter } from "@/utils/number-formatter";
import useToast from "@/hooks/use-toast";
import { SLIPPAGE_MAP, useZap } from "@/sections/staking/hooks/use-zap";

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

const BerapawStakeContent = (props: any) => {
  const { data, onSuccess, dexConfig, defaultTab, onStake, onApprove } = props;

  const { chains } = dexConfig ?? {};
  const dAppConfig = chains?.[DEFAULT_CHAIN_ID] ?? {};
  const { vaults } = dAppConfig ?? {};

  const {
    prices,
    inputCurrencyAmount,
    setInputCurrencyAmount,
    outputCurrencyAmount,
    inputCurrency,
    tokenSelectorVisible,
    setTokenSelectorVisible,
    slippage,
    setSlippage,
    tokenData,
    tokenDataLoading,
    tokenList,
    tokenListLoading,
    zapData,
    zapDataLoading,
    getZapData,
    swapLoading,
    handleSwap,
    onTokenSelect,
    currentZapStepText,
  } = useZap({
    token: data?.stakingToken,
    totalStep: !!data?.approved ? 3 : 4,
    onAfterSwap: async (params: any) => {
      const {
        signer,
        route,
        setCurrentZapStep,
        setCurrentZapStepNo
      } = params;
      let { currentStep, toastId } = params;

      //#region set operator
      if (!data?.approved) {
        currentStep = "Set operator";
        setCurrentZapStep("Set operator");
        setCurrentZapStepNo(2);
        const operatorRes = await onApprove?.(data, { isReload: false });
        if (!operatorRes) {
          return {
            currentStep,
            toastId,
          };
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
      setCurrentZapStep("Approve");
      setCurrentZapStepNo(!!data?.approved ? 2 : 3);
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
          setCurrentZapStep("Stake");
          setCurrentZapStepNo(!!data?.approved ? 3 : 4);
          const stakeSuccess = await onStake?.(data, realAmountOut, data?.stakingToken?.symbol === "LBGT" ? "deposit" : "stake");
          if (!stakeSuccess) {
            return {
              currentStep,
              toastId,
            };
          }
          toast.dismiss(toastId);
        }
        //#endregion
      } else {
        currentStep = "Stake";
        setCurrentZapStep("Stake");
        setCurrentZapStepNo(!!data?.approved ? 3 : 4);
        const stakeSuccess = await onStake?.(data, realAmountOut, data?.stakingToken?.symbol === "LBGT" ? "deposit" : "stake");
        if (!stakeSuccess) {
          return {
            currentStep,
            toastId,
          };
        }
        toast.dismiss(toastId);
      }
      //#endregion
      return {
        currentStep,
        toastId,
      };
    },
    onSwapSuccess: () => {
      onSuccess?.();
    }
  });

  const toast = useToast();
  const { account, provider } = useCustomAccount();
  const [stakeAmount, setStakeAmount] = useState<any>();
  const [currentTab, setCurrentTab] = useState<any>(defaultTab ?? TABS[0].value);

  return (
    <Card className="w-[500px] text-black font-Montserrat text-[14px] font-medium leading-normal">
      <div className="text-black font-CherryBomb text-[20px] leading-[90%] flex items-center justify-between">
        <div>Zap into {data?.metadata?.name}</div>
        {
          currentTab === TABS[1].value && (
            <ZapSlippage
              className="translate-x-[-45px]"
              slippage={slippage}
              setSlippage={setSlippage}
              slippageList={Array.from(SLIPPAGE_MAP.values())}
            />
          )
        }
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
            slippageList={Array.from(SLIPPAGE_MAP.values())}
            onSwap={handleSwap}
            onRefresh={getZapData}
            zapData={zapData}
            tokenData={tokenData}
            currentZapStepText={currentZapStepText}
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
