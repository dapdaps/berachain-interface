import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import { Contract } from "ethers";
import farmAbi from "../abi/farm";
import bexFarmAbi from "../abi/bex-farm";
import { DEFAULT_CHAIN_ID } from "@/configs";
import Big from "big.js";
export default function useClaim({ earned, farm, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");

  const onClaim = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      const FarmContract = new Contract(
        farm.id,
        farm.provider === "kodiak" ? farmAbi : bexFarmAbi,
        signer
      );
      const params = farm.provider === "kodiak" ? [] : [account, account];

      const estimateGas = await FarmContract.estimateGas.getReward(...params);

      console.log("estimateGas", estimateGas.toString());

      const tx = await FarmContract.getReward(...params, {
        gasLimit: estimateGas
          ? Big(estimateGas.toString()).mul(1.2).toFixed(0)
          : 5000000
      });
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending..." });
      const { status, transactionHash } = await tx.wait();
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Claim successful!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        onSuccess();
      } else {
        toast.fail({ title: "Claim failed!" });
      }
      addAction?.({
        type: "Staking",
        action: "Claim",
        tokens: farm.rewardTokens,
        amounts: earned,
        template: "Kodiak",
        status: status,
        transactionHash,
        chain_id: DEFAULT_CHAIN_ID,
        sub_type: "Claim",
        extra_data: {}
      });
    } catch (err: any) {
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Claim failed!`
      });
    }
  };

  return { loading, onClaim };
}
