import Big from "big.js";
import { utils } from "ethers";
import { useState } from "react";
import useAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import useToast from "@/hooks/use-toast";
import positionAbi from "../abi/position";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function useRemove({
  detail,
  percent,
  amount0,
  amount1,
  onSuccess,
  dex
}: any) {
  const [loading, setLoading] = useState(false);
  const { contracts, poolType } = dex;
  const { account, provider } = useAccount();
  const toast = useToast();
  const { addAction } = useAddAction("dapp");

  const onRemove = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const liquidity = new Big(detail.liquidity).mul(percent / 100).toFixed(0);
      const hasNativeToken = detail.token0.isNative
        ? detail.token0
        : detail.token1.isNative
        ? detail.token1
        : "";
      const deadline = Math.ceil(Date.now() / 1000) + 180;
      const Interface = new utils.Interface(positionAbi);
      const calldatas: string[] = [];

      calldatas.push(
        Interface.encodeFunctionData("decreaseLiquidity", [
          {
            tokenId: detail.tokenId,
            liquidity,
            amount0Min: 0,
            amount1Min: 0,
            deadline
          }
        ])
      );

      const { PositionManager } = contracts[DEFAULT_CHAIN_ID];

      calldatas.push(
        Interface.encodeFunctionData("collect", [
          {
            tokenId: detail.tokenId,
            recipient: hasNativeToken ? PositionManager : account,
            amount0Max: "340282366920938463463374607431768211455",
            amount1Max: "340282366920938463463374607431768211455"
          }
        ])
      );

      if (hasNativeToken) {
        calldatas.push(
          Interface.encodeFunctionData(
            poolType === "algebra" ? "unwrapWNativeToken" : "unwrapWETH9",
            ["0", account]
          )
        );
        calldatas.push(
          Interface.encodeFunctionData("sweepToken", [
            hasNativeToken.address === detail.token0.address
              ? detail.token1.address
              : detail.token0.address,
            "0",
            account
          ])
        );
      }

      const txn: any = {
        to: PositionManager,
        data:
          calldatas.length === 1
            ? calldatas[0]
            : Interface.encodeFunctionData("multicall", [calldatas])
      };

      const signer = provider.getSigner(account);

      let estimateGas = new Big(1000000);
      try {
        estimateGas = await signer.estimateGas(txn);
      } catch (err: any) {
        if (err?.code === "UNPREDICTABLE_GAS_LIMIT") {
          estimateGas = new Big(6000000);
        }
      }
      console.log("estimateGas", estimateGas.toString());
      const newTxn = {
        ...txn,
        gasLimit: estimateGas.mul(120).div(100).toString()
      };

      const tx = await signer.sendTransaction(newTxn);

      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending..." });

      const { status, transactionHash } = await tx.wait();
      setLoading(false);
      addAction({
        type: "Liquidity",
        action: "Remove Liquidity",
        tokens: [detail.token0, detail.token1],
        amounts: [amount0 * (percent / 100), amount1 * (percent / 100)],
        template: dex.name,
        status,
        transactionHash,
        sub_type: "Remove",
        extra_data: {
          action: "Remove Liquidity",
          type: "univ3"
        }
      });
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Remove successful!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        onSuccess();
      } else {
        toast.fail({ title: "Remove failed!" });
      }
    } catch (err: any) {
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Remove failed!`
      });
    }
  };

  return { loading, onRemove };
}
