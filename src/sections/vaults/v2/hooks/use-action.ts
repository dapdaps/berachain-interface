import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import handleAction from "../../dapps/action";
import { DEFAULT_CHAIN_ID } from "@/configs";
import useTokenBalance from "@/hooks/use-token-balance";
import Big from "big.js";

export default function useAction() {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");
  const [amount, setAmount] = useState<string>();
  const [inputError, setInputError] = useState<boolean>(false);
  const [inputErrorMessage, setInputErrorMessage] = useState<string>();
  const { currentRecord, actionType, toggleActionVisible } =
    useVaultsV2Context();

  const { tokenBalance, update } = useTokenBalance(
    currentRecord?.token?.address,
    currentRecord?.token?.decimals
  );

  const handleAmountChange = (_amount: string) => {
    setAmount(_amount);
  };

  const onAction = async () => {
    if (!amount || !currentRecord) return;
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      setLoading(true);
      const signer = provider.getSigner(account);
      const tx = await handleAction({
        actionType: actionType.button,
        signer,
        amount: Big(amount)
          .mul(10 ** currentRecord.token.decimals)
          .toFixed(0),
        currentRecord
      });
      toast.dismiss(toastId);
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
      console.log(71, err);
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
    updateBalance: update
  };
}
