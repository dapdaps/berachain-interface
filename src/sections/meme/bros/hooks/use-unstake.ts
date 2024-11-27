import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import { Contract } from "ethers";
import stakeAbi from "../abi/stake";
import { DEFAULT_CHAIN_ID } from "@/configs";
import Big from "big.js";

export default function useUnstake({ token, amount, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");

  const onUnstake = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      const StakeContract = new Contract(token.stake_address, stakeAbi, signer);
      const _amount = Big(amount)
        .mul(10 ** token.token.decimals)
        .toFixed(0);
      const tx = await StakeContract.unstake(_amount);
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
        action: "Stake",
        token: token.token,
        amount: amount,
        template: "supermemebros",
        status: status,
        transactionHash,
        chain_id: DEFAULT_CHAIN_ID,
        sub_type: "Unstake"
      });
    } catch (err: any) {
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
