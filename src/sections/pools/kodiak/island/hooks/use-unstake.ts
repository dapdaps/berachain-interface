import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import { Contract, utils } from "ethers";
import farmAbi from "../abi/farm";
import bexFarmAbi from "../abi/bex-farm";
import { DEFAULT_CHAIN_ID } from "@/configs";
import Big from "big.js";
import { BAULT_ROUTER_ABI } from "../../baults/abi";
export default function useUnstake({
  kekIds,
  token,
  amount,
  amount0,
  amount1,
  data,
  onSuccess,
  dapp,
  currentTab,
  baultTokenShareAmount
}: any) {
  const { poolConfig } = dapp ?? {};
  const { baultRouter } = poolConfig ?? {};
  const { baults, tokenLp } = data ?? {};

  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");

  const onUnstake = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      let FarmContract = new Contract(
        data.farm.id,
        data.farm.provider === "kodiak" ? farmAbi : bexFarmAbi,
        signer
      );
      if (currentTab === "autoCompound") {
        FarmContract = new Contract(
          baultRouter,
          BAULT_ROUTER_ABI,
          signer
        );
      }

      let method = "";
      let params = [];

      if (data.farm.provider === "kodiak") {
        method = "withdrawLockedMultiple";
        params = [kekIds];
      } else {
        method = "withdraw";
        params = [Big(amount).mul(1e18).toFixed(0)];
      }

      if (currentTab === "autoCompound" && baultRouter && baults[0]?.id) {
        method = "redeemFromBault";
        params = [
          baults[0].id,
          Big(amount).mul(1e18).toFixed(0),
          utils.parseUnits(Big(baultTokenShareAmount.amount || 0).times(0.98).toFixed(tokenLp.decimals), tokenLp.decimals),
          account
        ];
      }

      const estimateGas = await FarmContract.estimateGas[method](...params);
      console.log("estimateGas", estimateGas.toString());
      const tx = await FarmContract[method](...params, {
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
          title: "Unstake successful!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        onSuccess();
      } else {
        toast.fail({ title: "Unstake failed!" });
      }

      addAction?.({
        type: "Staking",
        action: "Unstake",
        token,
        amount,
        template: "Kodiak",
        add: false,
        status,
        transactionHash,
        tokens: [data.token0, data.token1],
        amounts: [amount0, amount1],
        extra_data: {},
        sub_type: "Unstake"
      });
    } catch (err: any) {
      console.log(err);
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Unstake failed!`
      });
    }
  };

  return { loading, onUnstake };
}
