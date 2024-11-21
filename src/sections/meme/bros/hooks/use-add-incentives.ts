import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import Big from "big.js";
import { Contract } from "ethers";
import rewardAbi from "../abi/reward";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { RewardContractAddress } from "../config";

export default function useAddIncentives({ token, amount, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");

  const onAdd = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      const RewardContract = new Contract(
        RewardContractAddress,
        rewardAbi,
        signer
      );
      const _amount = Big(amount)
        .mul(10 ** token.decimals)
        .toFixed(0);
      const tx = await RewardContract.deposit(
        token.stakeAddress,
        token.address,
        _amount
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
      // addAction({
      //   type: "Liquidity",
      //   action: "Add Liquidity",
      //   template: "Kodiak",
      //   status,
      //   transactionHash,
      //   sub_type: "Add"
      // });
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
