import { useMemo, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import handleAction from "../../dapps/action";
import { DEFAULT_CHAIN_ID } from "@/configs";
import useTokenBalance from "@/hooks/use-token-balance";
import Big from "big.js";
import { ACTION_TYPE } from "@/sections/vaults/v2/config";

export default function useAction() {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");
  const [amount, setAmount] = useState<string>();
  const [dappParams, setDappParams] = useState<any>({});
  const { currentRecord, actionType, toggleActionVisible } =
    useVaultsV2Context();

  const { tokenBalance, update, isLoading } = useTokenBalance(
    actionType.value === ACTION_TYPE.DEPOSIT
      ? currentRecord?.token?.address
      : currentRecord.protocol !== "Kodiak"
      ? currentRecord?.vaultAddress
      : "",
    currentRecord?.token?.decimals
  );

  const [inputError, inputErrorMessage] = useMemo<
    [boolean, string | undefined]
  >(() => {
    const DEFAULT: [boolean, string | undefined] = [false, void 0];
    if (Big(amount || 0).eq(0)) return [false, "Enter an amount"];
    if (Big(tokenBalance || 0).lt(amount || 0)) {
      return [true, "Insufficient Balance"];
    }
    return DEFAULT;
  }, [tokenBalance, isLoading, actionType, amount]);

  const handleAmountChange = (_amount: string) => {
    setAmount(_amount);
  };

  const onAction = async () => {
    if (!currentRecord) return;
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      const tx = await handleAction({
        actionType: actionType.button,
        signer,
        amount: Big(amount || 0)
          .mul(10 ** currentRecord.token.decimals)
          .toFixed(0),
        currentRecord,
        dappParams
      });
      toast.dismiss(toastId);
      if (!tx) {
        setLoading(false);
        toast.fail({ title: actionType.button + " failed!" });
        return;
      }
      toastId = toast.loading({ title: "Pending..." });
      const { status, transactionHash } = await tx.wait();

      if (status === 1) {
        toast.success({
          title: actionType.button + " successful!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        toggleActionVisible({ visible: false });
      } else {
        toast.fail({ title: actionType.button + " failed!" });
      }
      addAction?.({
        type: "Staking",
        action: actionType.button === "Deposit" ? "Stake" : "Unstake",
        token: currentRecord.token,
        amount,
        template: currentRecord.protocol,
        add: false,
        status,
        transactionHash,
        sub_type: actionType.button === "Deposit" ? "Stake" : "Unstake",
        tokens: [currentRecord.token],
        amounts: [amount],
        extra_data: {}
      });
      setLoading(false);
    } catch (err: any) {
      console.log("Deposit error:", err.message);
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : actionType.button + " failed!"
      });
      setLoading(false);
    }
  };

  return {
    loading,
    onAction,
    amount,
    handleAmountChange,
    inputError,
    inputErrorMessage,
    balance: tokenBalance,
    balanceLoading: isLoading,
    updateBalance: update,
    dappParams,
    setDappParams
  };
}
