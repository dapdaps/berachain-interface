import useCustomAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import useToast from "@/hooks/use-toast";
import Big from "big.js";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_CHAIN_ID } from "@/configs";
import bedrock from "@/configs/staking/dapps/bedrock";
import useTokensBalance from "@/hooks/use-tokens-balance";
import { usePriceStore } from "@/stores/usePriceStore";
import { STAKE_ABI } from "../constant";
import useUpdaterStore from "@/stores/useUpdaterStore";

export default function useBedrock(productType: 'uniBTC' | 'brBTC' = 'uniBTC') {
  const { addAction } = useAddAction("dapp");
  const { provider, account, chainId } = useCustomAccount();
  const toast = useToast();

  const dappConfig = useMemo(() => {
    const chainConfig = bedrock.chains?.[DEFAULT_CHAIN_ID as keyof typeof bedrock.chains];
    return chainConfig?.[productType];
  }, [productType]);

  const { STAKE_ADDRESS, sourceToken, targetToken } = dappConfig || {};

  const [inAmount, setInAmount] = useState("");

  const tokens = useMemo(() => [sourceToken, targetToken], [sourceToken, targetToken]);
  const { loading: getBalanceLoading, balances, queryBalance } = useTokensBalance(tokens);
  
  const prices = usePriceStore((store) => store.price);
  const updater = useUpdaterStore((state) => state.updater);


  function handleMax() {
    // @ts-ignore
    if (balances?.[sourceToken.address]) setInAmount(balances?.[sourceToken.address]);
  }
  function handleAmountChange(amount: any) {
    setInAmount(amount);
  }

  function handleDeposit(updateState: any) {
    const toastId = toast?.loading({
      title: `Staking...`
    });
    updateState({
      toastId,
      isLoading: true,
      isError: false,
      loadingMsg: "Staking..."
    });
    const wei = ethers.utils.parseUnits(
      Big(inAmount).toFixed(sourceToken?.decimals),
      sourceToken?.decimals
    );
    const contract = new ethers.Contract(
      STAKE_ADDRESS,
      STAKE_ABI,
      provider?.getSigner()
    );

    const stakeMethod = "mint";
    const params: any = [sourceToken.address, wei];

    const createTx = (gasLimit: any) => {
      contract[stakeMethod](...params, { gasLimit })
        .then((tx: any) => tx.wait())
        .then((receipt: any) => {
          const { status, transactionHash } = receipt;
          addAction?.({
            type: "Staking",
            action: "Staking",
            tokens: [
              {
                symbol: sourceToken?.symbol
              }
            ],
            amount: inAmount,
            template: "Bedrock",
            status: status,
            add: 1,
            transactionHash,
            chain_id: chainId,
            sub_type: "Stake"
          });
          updateState({
            isLoading: false,
            isPostTx: true
          });
          setTimeout(() => {
            onSuccess?.();
          }, 3000);

          toast?.dismiss(toastId);
          toast?.success({
            title: "Stake Successful!",
            tx: transactionHash,
            chainId
          });
        })
        .catch((error: Error) => {
          console.log("error: ", error);
          updateState({
            isError: true,
            isLoading: false,
            loadingMsg: error?.message
          });
          toast?.dismiss(toastId);
          toast?.fail({
            title: "Stake Failed!",
            text: error?.message?.includes("user rejected transaction")
              ? "User rejected transaction"
              : error?.message ?? ""
          });
        });
    };
    contract.estimateGas[stakeMethod](...params)
      .then((res: any) => {
        createTx(res);
      })
      .catch((err: any) => {
        console.log("estimateGas failed: %o", err);
        createTx(4000000);
      });
  }
  function onSuccess() {
    setInAmount("");
    queryBalance();
  }

  function handleCopy(address: any) {
    navigator.clipboard.writeText(address as string);
    toast.success({
      title: `Copied address ${address}`
    });
  }

  useEffect(() => {
    queryBalance();
  }, [provider, updater, targetToken]);

  return {
    stakedAmount: balances?.[targetToken?.address],
    stakedAmountUsd: Big(balances?.[targetToken?.address] || 0).times(prices?.[targetToken?.symbol] || 0).toFixed(5),
    availableAmount: balances?.[sourceToken?.address],
    availableAmountUsd: Big(balances?.[sourceToken?.address] || 0).times(prices?.[sourceToken?.symbol] || 0).toFixed(5),
    inAmount,
    handleMax,
    handleAmountChange,
    handleDeposit,
    handleCopy,
    getBalanceLoading,
    balances,
    sourceToken,
    targetToken,
    dappConfig,
    exchangeRate: 1,
    productType, 
  };
}