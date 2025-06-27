import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import { Contract, utils } from "ethers";
import farmAbi from "../abi/farm";
import bexFarmAbi from "../abi/bex-farm";
import { DEFAULT_CHAIN_ID } from "@/configs";
import Big from "big.js";
import { getTokenAmountsV2 } from "../../../helpers";
import { BAULT_ROUTER_ABI } from "../../baults/abi";

export default function useStake({
  amount,
  days,
  token,
  data,
  info,
  onSuccess,
  dapp,
  autoCompound,
  baultTokenShareAmount
}: any) {
  const { poolConfig } = dapp ?? {};
  const { baultRouter } = poolConfig ?? {};
  const { baults, tokenLp } = data ?? {};

  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");

  const onStake = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      let FarmContract = new Contract(
        data.farm.id,
        data.farm.provider === "kodiak" ? farmAbi : bexFarmAbi,
        signer
      );
      if (autoCompound && baultRouter) {
        FarmContract = new Contract(baultRouter, BAULT_ROUTER_ABI, signer);
      }
      const totalSupply = Big(data.tokenLp.totalSupply || 0)
        .mul(10 ** data.tokenLp.decimals)
        .toString();
      const secs = days * 86400;
      const liquidity = Big(amount).mul(1e18).toFixed(0);
      const { amount0, amount1 } = getTokenAmountsV2({
        liquidity,
        totalSupply: totalSupply.toString(),
        reserve0: info.reserve0,
        reserve1: info.reserve0,
        token0: data.token0,
        token1: data.token1
      });

      let method = "";
      let params: any = [];

      if (data.farm.provider === "kodiak") {
        method = "stakeLocked";
        params = [liquidity, secs];
      } else {
        method = "stake";
        params = [liquidity];
      }

      if (autoCompound && baultRouter && baults[0]?.id) {
        method = "depositIntoBault";
        params = [
          baults[0].id,
          liquidity,
          utils.parseUnits(Big(baultTokenShareAmount.amount || 0).times(0.98).toFixed(tokenLp.decimals), tokenLp.decimals),
          account
        ];
      }

      console.log(data.farm.provider, method, params);
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
      console.log(err);
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
