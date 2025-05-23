import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import handleClaim from "../../dapps/claim";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { cloneDeep } from "lodash";
import useClickTracking from "@/hooks/use-click-tracking";

export default function useClaim() {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("vaults");
  const {
    currentProtocol,
    currentReward,
    toggleClaimSuccessVisible,
    toggleClaimVisible
  } = useVaultsV2Context();

  const { handleReport } = useClickTracking();

  const onClaim = async () => {
    if (!currentProtocol) return;
    handleReport("1022-001-012", currentProtocol.vaultAddress);

    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      const tx = await handleClaim({
        account,
        signer,
        currentRecord: currentProtocol
      });
      toast.dismiss(toastId);

      if (!tx) {
        setLoading(false);
        toast.fail({ title: "Claim failed!" });
        return;
      }
      toastId = toast.loading({ title: "Pending..." });
      const { status, transactionHash } = await tx.wait();
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Claim successful!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        toggleClaimSuccessVisible(true, cloneDeep(currentReward));
        toggleClaimVisible(false);
      } else {
        toast.fail({ title: "Claim failed!" });
      }
      addAction?.({
        type: "Staking",
        action: "Claim",
        tokens: currentProtocol.reward_tokens,
        template: currentProtocol.protocol,
        amounts: (currentReward.splice ? currentReward : [currentReward]).map(
          (token: any) => token.amount
        ),
        status,
        transactionHash,
        sub_type: "Claim",
        extra_data: {}
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
