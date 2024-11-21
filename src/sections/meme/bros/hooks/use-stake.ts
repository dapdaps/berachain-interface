import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import { Contract } from "ethers";
import stakeAbi from "../abi/stake";
import { DEFAULT_CHAIN_ID } from "@/configs";
import Big from "big.js";

export default function useStake({ token, amount, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");

  const onStake = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      const StakeContract = new Contract(token.stakeAddress, stakeAbi, signer);
      const _amount = Big(amount)
        .mul(10 ** token.decimals)
        .toFixed(0);
      const tx = await StakeContract.stake(_amount);
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
          : `Stake faily!`
      });
    }
  };

  return { loading, onStake };
}
