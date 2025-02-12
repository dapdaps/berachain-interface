import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import { Contract } from "ethers";
import farmAbi from "../abi/farm";
import islandAbi from "../abi/island";
import { DEFAULT_CHAIN_ID } from "@/configs";
import Big from "big.js";
import { getTokenAmountsV2 } from "../../../helpers";

export default function useStake({
  farmContract,
  amount,
  days,
  token,
  data,
  onSuccess
}: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");

  const onStake = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      const FarmContract = new Contract(farmContract, farmAbi, signer);
      const IslandContract = new Contract(data.id, islandAbi, provider);
      const reverses = await IslandContract.getUnderlyingBalances();
      const totalSupply = await IslandContract.totalSupply();
      const secs = days * 86400;
      const liquidity = Big(amount).mul(1e18).toFixed(0);
      const { amount0, amount1 } = getTokenAmountsV2({
        liquidity,
        totalSupply: totalSupply.toString(),
        reserve0: reverses[0].toString(),
        reserve1: reverses[1].toString(),
        token0: data.token0,
        token1: data.token1
      });
      const tx = await FarmContract.stakeLocked(liquidity, secs);
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending..." });
      const { status, transactionHash } = await tx.wait();
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Stake successful!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        onSuccess();
      } else {
        toast.fail({ title: "Stake failed!" });
      }

      addAction?.({
        type: "Staking",
        action: "Stake",
        token,
        amount,
        template: "Kodiak",
        add: false,
        status,
        transactionHash,
        sub_type: "Stake",
        tokens: [data.token0, data.token1],
        amounts: [amount0, amount1],
        extra_data: {}
      });
    } catch (err: any) {
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Stake failed!`
      });
    }
  };

  return { loading, onStake };
}
