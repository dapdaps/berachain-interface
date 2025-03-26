import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import handleClaim from "../../dapps/claim";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function useClaim() {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");
  const { currentRecord, toggleClaimSuccessVisible, toggleClaimVisible } =
    useVaultsV2Context();

  const onClaim = async () => {
    if (!currentRecord) return;
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      const tx = await handleClaim({
        account,
        signer,
        currentRecord
      });
      toast.dismiss(toastId);

      if (!tx) {
        setLoading(false);
        toast.fail({ title: "Claim failed!" });
        return;
      }
      toastId = toast.loading({ title: "Pending..." });
      const { status, transactionHash } = await tx.wait();

      if (status === 1) {
        toast.success({
          title: "Claim successful!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        toggleClaimSuccessVisible(true);
        toggleClaimVisible(false);
      } else {
        toast.fail({ title: "Claim failed!" });
      }
      addAction?.({
        type: "Staking",
        action: "Claim",
        tokens: currentRecord.rewards,
        template: currentRecord.protocol,
        status,
        transactionHash,
        sub_type: "Claim"
      });
      setLoading(false);
    } catch (err: any) {
      console.log("Claim error:", err.message);
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : "Claim failed!"
      });
      setLoading(false);
    }
  };

  return {
    loading,
    onClaim
  };
}
