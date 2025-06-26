import { DEFAULT_CHAIN_ID } from "@/configs";
import { bera } from "@/configs/tokens/bera";
import useCustomAccount from "@/hooks/use-account";
import { useHaiku } from "@/hooks/use-haiku";
import useToast from "@/hooks/use-toast";
import { getTokenLogo } from "@/sections/dashboard/utils";
import { usePriceStore } from "@/stores/usePriceStore";
import { post } from "@/utils/http";
import { useRequest } from "ahooks";
import axios from "axios";
import Big from "big.js";
import { utils } from "ethers";
import { useEffect, useMemo, useState } from "react";

export const SLIPPAGE_MAP = new Map([
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

export function useZap(props: any) {
  const { token, onAfterSwap, onSwapSuccess, totalStep } = props;

  const toast = useToast();
  const { account, provider } = useCustomAccount();
  const prices = usePriceStore((store: any) => store.beraTownPrice);
  const [inputCurrencyAmount, setInputCurrencyAmount] = useState<any>();
  const [inputCurrency, setInputCurrency] = useState<any>(token?.symbol === "BERA" ? bera["honey"] : bera["bera"]);
  const [outputCurrencyAmount, setOutputCurrencyAmount] = useState<any>();
  const [tokenSelectorVisible, setTokenSelectorVisible] = useState<boolean>(false);
  const [slippage, setSlippage] = useState<number>(SLIPPAGE_MAP.get(50)?.value ?? 50);
  const [quoteData, setQuoteData] = useState<any>({});
  const [currentZapStep, setCurrentZapStep] = useState<string>();
  const [currentZapStepNo, setCurrentZapStepNo] = useState<number>();

  const currentZapStepText = useMemo(() => {
    if (!currentZapStepNo || !currentZapStep) return "";
    return `Step ${currentZapStepNo}/${totalStep}: ${currentZapStep}`;
  }, [currentZapStep, currentZapStepNo, totalStep]);

  const {
    approved,
    approving,
    permitSignature,
    onConfirm,
    onApprove,
    setApproved,
  } = useHaiku({
    input_token: {
      ...inputCurrency,
      amount: inputCurrencyAmount,
    },
    output_token: {
      ...token,
      amount: outputCurrencyAmount,
    },
    haiku: quoteData.haiku?.response,
    from: "vaults",
    onSuccess: (data) => { }
  });

  const onTokenSelect = (_token: any) => {
    if (_token.address.toLowerCase() === token.address.toLowerCase()) {
      setTokenSelectorVisible(false);
      return;
    }
    setInputCurrency(_token || bera["bera"]);
    setTokenSelectorVisible(false);
  };

  // get user balances from enso
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

  const { runAsync: quoteEnsoData, data: ensoData, loading: ensoDataLoading } = useRequest(async () => {
    const amountIn = utils.parseUnits(inputCurrencyAmount, inputCurrency.decimals);
    const inputCurrencyAddress = inputCurrency.address === "native" ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" : inputCurrency.address;
    const tokenAddress = token?.address === "native" ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" : token?.address;

    // get approve spender address
    const approveUrl = new URL("https://api.enso.finance/api/v1/wallet/approve");
    approveUrl.searchParams.set("fromAddress", account);
    approveUrl.searchParams.set("tokenAddress", inputCurrencyAddress);
    approveUrl.searchParams.set("chainId", DEFAULT_CHAIN_ID + "");
    approveUrl.searchParams.set("amount", amountIn.toString());
    approveUrl.searchParams.set("routingStrategy", "router");

    if (!token?.address) {
      return false;
    }

    const routeUrl = new URL("https://api.enso.finance/api/v1/shortcuts/route");
    routeUrl.searchParams.set("amountIn", amountIn.toString());
    routeUrl.searchParams.set("tokenIn", inputCurrencyAddress);
    routeUrl.searchParams.set("tokenOut", tokenAddress);
    routeUrl.searchParams.set("slippage", slippage.toString());
    routeUrl.searchParams.set("fromAddress", account);
    routeUrl.searchParams.set("receiver", account);
    routeUrl.searchParams.set("spender", account);
    routeUrl.searchParams.set("routingStrategy", "router");
    routeUrl.searchParams.set("chainId", DEFAULT_CHAIN_ID + "");

    try {
      const [approveRes, routeRes] = await Promise.all([
        axios.get(approveUrl.toString()),
        axios.get(routeUrl.toString())
      ]);

      if (approveRes.status !== 200 || routeRes.status !== 200) {
        return false;
      }
      return {
        approve: approveRes.data,
        route: routeRes.data,
        name: "Enso",
        logo: "/images/dapps/enso.png",
      };
    } catch (err: any) {
      console.log(err);
    }

    return false;
  }, { manual: true });

  const { runAsync: quoteHaikuData, data: haikuData, loading: haikuDataLoading } = useRequest(async () => {
    const amountIn = utils.parseUnits(inputCurrencyAmount, inputCurrency.decimals);
    const inputCurrencyAddress = inputCurrency.address === "native" ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" : inputCurrency.address;
    const tokenAddress = token?.address === "native" ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" : token?.address;

    const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

    if (!token?.address) {
      return false;
    }

    const params = {
      input_token: inputCurrencyAddress,
      input_token_amount: inputCurrencyAmount,
      output_token: tokenAddress,
      receiver: account,
      slippage: slippage / 10000,
    };

    try {
      const res = await post("/api/go/haiku/quoteIntent", params);
      if (res.code !== 200) return false;
      const { balances, gas } = res.data ?? {};

      return {
        approve: { spender: PERMIT2_ADDRESS },
        route: {
          amountOut: Big(balances[0].amount || 0).times(10 ** token.decimals).toFixed(0),
          gas: gas.amount,
          tx: "",
          route: []
        },
        name: "Haiku",
        logo: "/images/dapps/haiku.jpg",
        response: res.data,
      };
    } catch (err: any) {
      console.log(err);
    }
    return false;
  }, { manual: true });

  const zapData = useMemo<any>(() => {
    console.log("quoteData: %o", quoteData);
    const quoteList = Object.values(quoteData);
    if (quoteList.length === 0) return {};
    // return quoteData.haiku;
    // find the best quote
    const bestQuote = quoteList.reduce((prev: any, curr: any) => {
      return Big(prev.route.amountOut).gt(curr.route.amountOut) ? prev : curr;
    }, quoteList[0]);
    return bestQuote;
  }, [quoteData]);

  const { runAsync: getZapData } = useRequest(async () => {
    if (!inputCurrencyAmount || Big(inputCurrencyAmount).lte(0) || !account || !inputCurrency) {
      return;
    }
    const [_ensoData, _haikuData] = await Promise.all([
      quoteEnsoData(),
      quoteHaikuData(),
    ]);
    const _quoteData: any = {};
    if (_ensoData) {
      _quoteData.enso = _ensoData;
    }
    if (_haikuData) {
      _quoteData.haiku = _haikuData;
    }
    setQuoteData(_quoteData);
  }, { refreshDeps: [inputCurrencyAmount, inputCurrency, token?.address, account, slippage], debounceWait: 0.5 });

  const { runAsync: handleSwap, loading: swapLoading } = useRequest(async () => {
    if (!zapData || !account || !provider) return;
    const { route = {} } = zapData ?? {};
    const signer = provider.getSigner(account);
    let toastId = toast.loading({ title: "Confirming..." });

    let currentStep = "Swap";
    setCurrentZapStep("Swap");
    setCurrentZapStepNo(1);

    if (zapData.name === "Haiku") {
      console.log("approved: %o", approved);
      if (!approved) {
        const res = await onApprove?.();
        if (!res.isSuccess) {
          toast.dismiss(toastId);
          toast.fail({ title: `Approve signature failed!` });
          getZapData();
          setCurrentZapStep(void 0);
          setApproved(false);
          return;
        }
      }
      const swapRes = await onConfirm?.();
      toast.dismiss(toastId);
      if (!swapRes.isSuccess) {
        toast.fail({ title: `Swap failed!` });
        getZapData();
        setCurrentZapStep(void 0);
        setApproved(false);
        return;
      }
      toastId = toast.success({
        title: `Swap Successful!`,
        tx: swapRes.transactionHash,
        chainId: DEFAULT_CHAIN_ID
      });
      const afterRes = await onAfterSwap?.({
        currentStep,
        toastId,
        signer,
        route,
        toast,
        setCurrentZapStep,
        setCurrentZapStepNo
      });
      currentStep = afterRes?.currentStep ?? currentStep;
      toastId = afterRes?.toastId ?? toastId;
      onSwapSuccess?.();
      setApproved(false);
    } else {
      try {
        const tx = await signer.sendTransaction(route.tx);
        toast.dismiss(toastId);
        toastId = toast.loading({ title: "Pending...", tx: tx.hash, chainId: DEFAULT_CHAIN_ID });
        const txReceipt = await tx.wait();
        toast.dismiss(toastId);

        const { status, transactionHash } = txReceipt;

        toast.dismiss(toastId);
        if (status === 1) {
          toastId = toast.success({
            title: `Swap Successful!`,
            tx: transactionHash,
            chainId: DEFAULT_CHAIN_ID
          });
          const afterRes = await onAfterSwap?.({
            currentStep,
            toastId,
            signer,
            route,
            toast,
            setCurrentZapStep,
            setCurrentZapStepNo
          });
          currentStep = afterRes?.currentStep ?? currentStep;
          toastId = afterRes?.toastId ?? toastId;
          onSwapSuccess?.();
        } else {
          toast.fail({ title: `Swap failed!` });
          getZapData();
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
    }

    setCurrentZapStep(void 0);
  }, { manual: true, throttleWait: 1 });

  // get token data from enso
  const { data: tokenData, loading: tokenDataLoading } = useRequest(async () => {
    const res = await axios.get(`https://api.enso.finance/api/v1/tokens?address=${token?.address}&chainId=80094&includeMetadata=true&page=1`);
    if (res.status !== 200 || !res.data || !res.data?.data || !res.data?.data?.length) return {};
    return res.data?.data?.[0];
  }, { refreshDeps: [token?.address] });

  useEffect(() => {
    const { route = {} } = zapData ?? {};
    const { amountOut = "" } = route ?? {};
    if (!amountOut) {
      setOutputCurrencyAmount("");
      return;
    }
    setOutputCurrencyAmount(utils.formatUnits(amountOut, token?.decimals));
  }, [zapData]);

  return {
    account,
    provider,
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
    zapDataLoading: ensoDataLoading || haikuDataLoading,
    getZapData,
    swapLoading,
    handleSwap,
    onTokenSelect,
    currentZapStepText,
  };
}

const HAIKU_ABI = [
  {
    "inputs": [
      {
        "internalType": "bytes[]",
        "name": "permit2Datas",
        "type": "bytes[]"
      },
      {
        "components": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "to",
                "type": "address"
              },
              {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "token",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "balanceBps",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amountOrOffset",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct DataType.Input[]",
                "name": "inputs",
                "type": "tuple[]"
              },
              {
                "internalType": "enum DataType.WrapMode",
                "name": "wrapMode",
                "type": "uint8"
              },
              {
                "internalType": "address",
                "name": "approveTo",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "callback",
                "type": "address"
              }
            ],
            "internalType": "struct DataType.Logic[]",
            "name": "logics",
            "type": "tuple[]"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "token",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "internalType": "bytes32",
                "name": "metadata",
                "type": "bytes32"
              }
            ],
            "internalType": "struct DataType.Fee[]",
            "name": "fees",
            "type": "tuple[]"
          },
          {
            "internalType": "bytes32[]",
            "name": "referrals",
            "type": "bytes32[]"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct DataType.LogicBatch",
        "name": "logicBatch",
        "type": "tuple"
      },
      {
        "internalType": "address",
        "name": "signer",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      },
      {
        "internalType": "address[]",
        "name": "tokensReturn",
        "type": "address[]"
      }
    ],
    "name": "executeWithSignerFee",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];
