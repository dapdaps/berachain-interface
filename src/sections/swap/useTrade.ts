import Big from "big.js";
import { useCallback, useRef, useState } from "react";
import weth from "@/configs/contract/weth";
import useAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import useToast from "@/hooks/use-toast";
import { useSettingsStore } from "@/stores/settings";
import checkGas from "./checkGas";
import formatTrade from "./formatTrade";
import getWrapOrUnwrapTx from "./getWrapOrUnwrapTx";
import quoter from "@/sdk/smart-router";

export default function useTrade({ chainId, template, from, onSuccess }: any) {
  const slippage: any = useSettingsStore((store: any) => store.slippage);
  const [loading, setLoading] = useState(false);
  const [trade, setTrade] = useState<any>();
  const { account, provider } = useAccount();
  const toast = useToast();
  const { addAction } = useAddAction(from || "dapp");
  const lastestCachedKey = useRef("");
  const cachedTokens = useRef<any>();
  const prices = {};

  const onQuoter = useCallback(
    async ({
      inputCurrency,
      outputCurrency,
      inputCurrencyAmount,
      template: _template
    }: any) => {
      setTrade(null);
      if (
        !inputCurrency ||
        !outputCurrency ||
        !inputCurrencyAmount ||
        !provider ||
        !account
      ) {
        return;
      }
      const wethAddress = weth[inputCurrency.chainId];

      const wrapType =
        inputCurrency.isNative &&
        outputCurrency.address.toLowerCase() === wethAddress.toLowerCase()
          ? 1
          : inputCurrency.address.toLowerCase() === wethAddress.toLowerCase() &&
            outputCurrency.isNative
          ? 2
          : 0;

      const amount = Big(inputCurrencyAmount)
        .mul(10 ** inputCurrency.decimals)
        .toFixed(0);
      lastestCachedKey.current = `${inputCurrency.address}-${outputCurrency.address}-${inputCurrencyAmount}`;

      try {
        setLoading(true);

        const rawBalance = await provider.getBalance(account);
        const gasPrice = await provider.getGasPrice();

        if (wrapType) {
          const signer = provider.getSigner(account);
          const { txn, gasLimit } = await getWrapOrUnwrapTx({
            signer,
            wethAddress,
            type: wrapType,
            amount
          });

          const { isGasEnough, gas } = checkGas({
            rawBalance,
            gasPrice,
            gasLimit
          });

          setTrade({
            inputCurrency,
            inputCurrencyAmount,
            outputCurrency,
            outputCurrencyAmount: inputCurrencyAmount,
            noPair: false,
            txn,
            routerAddress: wethAddress,
            gas,
            isGasEnough
          });
          setLoading(false);

          return;
        }

        const params: any = {
          inputCurrency,
          outputCurrency,
          inputAmount: inputCurrencyAmount,
          slippage: slippage / 100 || 0.005,
          account
        };

        if (typeof template === "string") {
          params.template = template;
        } else {
          params.templates = template;
        }

        const data = await quoter(params);

        if (!data) {
          throw new Error("No Data.");
        }
        setLoading(false);
        if (
          `${inputCurrency.address}-${outputCurrency.address}-${inputCurrencyAmount}` !==
          lastestCachedKey.current
        )
          return;
        if (typeof template === "string") {
          const _trade = {
            ...formatTrade({
              market: { ...data, template },
              rawBalance,
              gasPrice,
              prices,
              inputCurrency,
              outputCurrency,
              inputCurrencyAmount
            })
          };

          setTrade(_trade);
          return;
        }

        const _markets = data
          .filter((item: any) => Big(item.outputCurrencyAmount || 0).gt(0))
          .sort(
            (a: any, b: any) => b.outputCurrencyAmount - a.outputCurrencyAmount
          )
          .map((item: any) => {
            return formatTrade({
              market: item,
              rawBalance,
              gasPrice,
              prices,
              inputCurrency,
              outputCurrency,
              inputCurrencyAmount
            });
          });
        setTrade(_markets[0]);
        console.log("trade from", _markets[0].name);
      } catch (err) {
        console.log(err);
        setTrade(null);
        setLoading(false);
      }
    },
    [account, provider, slippage, prices, cachedTokens]
  );

  const onSwap = useCallback(async () => {
    if (!provider) return;
    const signer = provider.getSigner(account);
    const wethAddress = weth[trade.inputCurrency.chainId];
    setLoading(true);
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      const tx = await signer.sendTransaction(trade.txn);
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending...", tx: tx.hash, chainId });
      const { status, transactionHash } = await tx.wait();
      setLoading(false);
      toast.dismiss(toastId);

      if (status === 1) {
        toast.success({
          title: `Swap Successful!`,
          tx: transactionHash,
          chainId
        });
        onSuccess?.({
          inputCurrency: trade.inputCurrency,
          outputCurrency: trade.outputCurrency,
          inputCurrencyAmount: trade.inputCurrencyAmount,
          outputCurrencyAmount: trade.outputCurrencyAmount,
          transactionHash: transactionHash,
          tradeFrom: trade.name
        });
      } else {
        toast.fail({ title: `Swap failed!` });
      }
      addAction({
        type: "Swap",
        inputCurrencyAmount: trade.inputCurrencyAmount,
        inputCurrency: trade.inputCurrency,
        outputCurrencyAmount: trade.outputCurrencyAmount,
        outputCurrency: trade.outputCurrency,
        template:
          wethAddress === trade.routerAddress ? "Wrap and Unwrap" : trade.name,
        status,
        transactionHash,
        add: 0,
        token_in_currency: trade.inputCurrency,
        token_out_currency: trade.outputCurrency
      });
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Swap failed!`
      });
      console.log(err);
      setLoading(false);
    }
  }, [account, provider, trade]);

  return { loading, trade, onQuoter, onSwap };
}
