import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import { Contract } from "ethers";
import farmAbi from "../abi/farm";
import { DEFAULT_CHAIN_ID } from "@/configs";
import Big from "big.js";

export default function useStake({
  farmContract,
  amount,
  days,
  onSuccess
}: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();

  const onStake = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      const FarmContract = new Contract(farmContract, farmAbi, signer);
      const secs = days * 86400;
      const liquidity = Big(amount).mul(1e18).toFixed(0);
      const tx = await FarmContract.stakeLocked(liquidity, secs);
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending..." });
      const { status, transactionHash } = await tx.wait();
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Stake successfully!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        onSuccess();
      } else {
        toast.fail({ title: "Stake faily!" });
      }
    } catch (err: any) {
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Stake faily!`
      });
    }
  };

  return { loading, onStake };
}
