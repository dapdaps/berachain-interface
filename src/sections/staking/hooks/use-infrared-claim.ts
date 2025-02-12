import { useState } from "react";
import useToast from "@/hooks/use-toast";
import useCustomAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import { ethers } from "ethers";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function useInfrared({
  amount,
  vaultAddress,
  tokens,
  onSuccess
}: any) {
  const [loading, setLoading] = useState(false);
  const { provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");

  const onClaim = async () => {
    let toastId = toast?.loading({ title: "Claiming..." });
    setLoading(true);
    try {
      const abi = [
        {
          constant: false,
          inputs: [],
          name: "getReward",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        }
      ];
      const contract = new ethers.Contract(
        vaultAddress,
        abi,
        provider?.getSigner()
      );
      const tx = await contract.getReward();
      const { status, transactionHash } = await tx.wait();

      addAction?.({
        type: "Staking",
        action: "Claim",
        tokens,
        amount,
        template: "Infrared",
        status: status,
        add: 1,
        transactionHash,
        chain_id: DEFAULT_CHAIN_ID,
        sub_type: "Claim"
      });

      setTimeout(() => {
        onSuccess?.();
      }, 3000);

      toast?.dismiss(toastId);
      toast?.success({ title: "Claimed Successful!" });
    } catch (err: any) {
      toast?.dismiss(toastId);
      toast?.fail({
        title: "Claimed Failed!",
        text: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : err?.message ?? ""
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, onClaim };
}
