import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import Big from "big.js";
import { Contract } from "ethers";
import rewardAbi from "../abi/reward";
import { DEFAULT_CHAIN_ID } from "@/configs";
export default function useAddIncentives({
  token,
  data,
  rewardAddress,
  amount,
  onSuccess
}: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");

  const onAdd = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      const RewardContract = new Contract(rewardAddress, rewardAbi, signer);
      const _amount = Big(amount)
        .mul(10 ** token.decimals)
        .toFixed(0);
      const tx = await RewardContract.deposit(
        data.stake_address,
        token.address,
        _amount,
        {
          value: token.isNative ? _amount : 0
        }
      );
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending..." });
      const res = await tx.wait();
      const { status, transactionHash } = res;
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Add incentives successfully!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        onSuccess();
      } else {
        toast.fail({ title: "Add incentives faily!" });
      }
      addAction({
        type: "Staking",
        action: "Stake",
        amount: amount,
        token: token,
        template: "supermemebros",
        status,
        transactionHash,
        chain_id: DEFAULT_CHAIN_ID,
        sub_type: "deposit_reward"
      });
    } catch (err: any) {
      console.log(err);
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Add incentives faily!`
      });
    }
  };

  return { loading, onAdd };
}
