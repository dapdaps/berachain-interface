import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import { Contract } from "ethers";
import rewardAbi from "../abi/reward";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { RewardContractAddress } from "../config";

export default function useClaim({
  tokens,
  amounts,
  signature,
  onSuccess
}: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");

  const onClaim = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      const RewardContract = new Contract(
        RewardContractAddress,
        rewardAbi,
        signer
      );
      const tx = await RewardContract.claim(
        account,
        tokens,
        amounts,
        signature
      );
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending..." });
      const { status, transactionHash } = await tx.wait();
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Claim successfully!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        onSuccess();
      } else {
        toast.fail({ title: "Claim faily!" });
      }
      // addAction?.({
      //   type: "Staking",
      //   action: "Claim",
      //   token: {
      //     symbol: "KDK"
      //   },
      //   amount: earned,
      //   template: "Kodiak",
      //   status: status,
      //   transactionHash,
      //   chain_id: DEFAULT_CHAIN_ID,
      //   sub_type: "Claim"
      // });
    } catch (err: any) {
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Claim faily!`
      });
    }
  };

  return { loading, onClaim };
}
