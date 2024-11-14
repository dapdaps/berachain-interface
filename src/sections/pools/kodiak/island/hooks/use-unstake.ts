import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import { Contract } from "ethers";
import farmAbi from "../abi/farm";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function useUnstake({
  farmContract,
  kekIds,
  token,
  amount,
  onSuccess
}: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");

  const onUnstake = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      const FarmContract = new Contract(farmContract, farmAbi, signer);
      const tx = await FarmContract.withdrawLockedMultiple(kekIds);
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending..." });
      const { status, transactionHash } = await tx.wait();
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Unstake successfully!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        onSuccess();
      } else {
        toast.fail({ title: "Unstake faily!" });
      }
      addAction?.({
        type: "Staking",
        action: "Unstake",
        token,
        amount,
        template: "Kodiak",
        add: false,
        status,
        transactionHash
      });
    } catch (err: any) {
      console.log(35, err);
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Unstake faily!`
      });
    }
  };

  return { loading, onUnstake };
}
