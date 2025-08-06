import Big from "big.js";
import { useCallback, useEffect, useRef, useState } from "react";
import useAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import useToast from "@/hooks/use-toast";
import { stake, unstake, quote, getApr, getWithdrawalRequests, withdraw } from "@/sdk/stake";

export default function useTrade({ chainId, template, from, onSuccess, dapp }: any) {
  const [loading, setLoading] = useState(false);
  const [trade, setTrade] = useState<any>();
  const { account, provider } = useAccount();
  const toast = useToast();
  const { addAction } = useAddAction(from || "dapp");
  const lastestCachedKey = useRef("");
  const cachedTokens = useRef<any>();
  const [apr, setApr] = useState(0);
  const [quoteNumber, setQuoteNumber] = useState("0");
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
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

      const signer = provider.getSigner(account);

      const amount = Big(inputCurrencyAmount)
        .mul(10 ** inputCurrency.decimals)
        .toFixed(0);

      try {
        setLoading(true);

        const quoteResult = await quote(dapp.name, {
          inputCurrency,
          outputCurrency,
          inputCurrencyAmount,
          signer
        });

        if (quoteResult) {
          setTrade({
            outputCurrencyAmount: quoteResult.outputCurrencyAmount,
            routerAddress: quoteResult.routerAddress,
            txn: quoteResult.txn,
            inputCurrencyAmount,
            inputCurrency,
            outputCurrency,
            template: dapp.name
          });
        } else {
          setTrade(null);
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
        setTrade(null);
        setLoading(false);
      }
    },
    [account, provider, prices, cachedTokens]
  );

  const onSwap = useCallback(async () => {
    if (!provider) return;
    const signer = provider.getSigner(account);
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
          tradeFrom: trade.template
        });
      } else {
        toast.fail({ title: `Stake failed!` });
      }
      addAction({
        type: "Stake",
        inputCurrencyAmount: trade.inputCurrencyAmount,
        inputCurrency: trade.inputCurrency,
        outputCurrencyAmount: trade.outputCurrencyAmount,
        outputCurrency: trade.outputCurrency,
        template: dapp.name,
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
          : `Stake failed!`
      });
      console.log(err);
      setLoading(false);
    }
  }, [account, provider, trade]);

  const onWithdraw = useCallback(async (item: any) => {
    if (!provider) return;
    const signer = provider.getSigner(account);
    setLoading(true);
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      const tx = await withdraw(dapp.name, {
        signer,
        inputCurrencyAmount: item.amount,
      });
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending...", tx: tx.hash, chainId });
      const { status, transactionHash } = await tx.wait();
      if (status === 1) {
        toast.success({
          title: `Withdraw Successful!`,
          tx: transactionHash,
          chainId
        });
      }
      setLoading(false);
      toast.dismiss(toastId);
    } catch (err: any) {
      toast.dismiss(toastId);
    }
  }, [account, provider]);

  useEffect(() => {
    const fetchApr = async () => {
      if (!provider || !dapp.name) return;
      const apr = await getApr(dapp.name, {
        provider
      });

      const quoteResult = await quote(dapp.name, {
        inputCurrency: {
          address: "0x0000000000000000000000000000000000000000",
          decimals: 18,
          symbol: "BERA",
          isNative: true
        },
        inputCurrencyAmount: '1',
        signer: provider,
        needTxn: false
      });

      if (account) {
        const withdrawalRequests = await getWithdrawalRequests(dapp.name, {
          address: account,
          provider
        });

        setWithdrawalRequests(withdrawalRequests || []);

        console.log("withdrawalRequests", withdrawalRequests);
      }

      setQuoteNumber(quoteResult?.outputCurrencyAmount || "0");
      setApr(apr || 0);
    };
    fetchApr();
  }, [provider, dapp, account]);

  return { loading, trade, onQuoter, onSwap, apr, quoteNumber, withdrawalRequests, onWithdraw };
}
