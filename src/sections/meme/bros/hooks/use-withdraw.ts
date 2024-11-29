import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import { Contract } from "ethers";
import stakeAbi from "../abi/stake";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function useWithdraw({ token, idx, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");

  const onWithdraw = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      const StakeContract = new Contract(token.stake_address, stakeAbi, signer);

      const estimateGas = await StakeContract.estimateGas.withdraw(idx);
      console.log("estimateGas", estimateGas.toString());
      const tx = await StakeContract.withdraw(idx);

      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending..." });
      const { status, transactionHash } = await tx.wait();
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Withdraw successfully!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        onSuccess();
      } else {
        toast.fail({ title: "Withdraw faily!" });
      }
      addAction?.({
        type: "Staking",
        action: "UnStake",
        token: token.token,
        amount: token.amount,
        template: "supermemebros",
        status: status,
        transactionHash,
        chain_id: DEFAULT_CHAIN_ID,
        sub_type: "Withdraw"
      });
    } catch (err: any) {
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Withdraw faily!`
      });
    }
  };

  return { loading, onWithdraw };
}
