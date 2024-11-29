import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import { Contract } from "ethers";
import rewardAbi from "../abi/reward";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { get } from "@/utils/http";

export default function useClaim({ data, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");
  const [info, setInfo] = useState<any>();

  const onQuery = async () => {
    setLoading(true);
    try {
      const response = await get(
        `/api/meme/claimSign?round=${data.round}&account=${account}&nonce=0`
      );

      setInfo(response.data);
      setLoading(false);
    } catch (err) {
      setInfo(null);
      setLoading(false);
    }
  };

  const onClaim = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setClaiming(true);
      const signer = provider.getSigner(account);
      const RewardContract = new Contract(
        data.reward_address,
        rewardAbi,
        signer
      );
      const { tokens, amounts, signature } = info;
      const _amounts = amounts.map((amount: number) => String(amount));

      const estimateGas = await RewardContract.estimateGas.claim(
        account,
        tokens,
        _amounts,
        signature
      );
      console.log("estimate gas", estimateGas.toString());
      const tx = await RewardContract.claim(
        account,
        tokens,
        _amounts,
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
      setClaiming(false);
      addAction?.({
        type: "Staking",
        action: "Claim",
        template: "supermemebros",
        status: status,
        transactionHash,
        chain_id: DEFAULT_CHAIN_ID,
        sub_type: "Claim",
        extra_data: {}
      });
    } catch (err: any) {
      console.log("claim error: ", err);
      toast.dismiss(toastId);
      setClaiming(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Claim faily!`
      });
    }
  };

  return { loading, claiming, info, onQuery, onClaim };
}
