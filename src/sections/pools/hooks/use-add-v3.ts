import Big from "big.js";
import { utils } from "ethers";
import { useState } from "react";
import { MAX_TICK, MIN_TICK } from "@/configs/pools";
import useAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import useToast from "@/hooks/use-toast";
import { useSettingsStore } from "@/stores/settings";
import { wrapNativeToken, sortTokens } from "../utils";
import positionAbi from "../abi/position";
import { nearestUsableTick, priceToUsableTick } from "../tick-math";

export default function useIncrease({
  token0,
  token1,
  value0,
  value1,
  tokenId,
  noPair,
  fee,
  currentPrice,
  lowerPrice,
  upperPrice,
  info,
  dex,
  onSuccess
}: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider, chainId } = useAccount();
  const toast = useToast();
  const slippage = useSettingsStore((store: any) => store.slippage);

  const { addAction } = useAddAction("dapp");

  const onIncrease = async () => {
    setLoading(true);
    const { PositionManager } = dex.contracts[token0.chainId];
    let toastId = toast.loading({ title: "Confirming..." });

    try {
      const [_token0, _token1] = sortTokens(
        wrapNativeToken(token0),
        wrapNativeToken(token1)
      );
      const hasNativeToken = token0.isNative
        ? token0
        : token1.isNative
        ? token1
        : "";
      const Interface = new utils.Interface(positionAbi);
      const calldatas: string[] = [];
      const isReverse =
        _token0.address !== token0.address &&
        _token1.address !== token1.address;
      const _value0 = isReverse ? value1 : value0;
      const _value1 = isReverse ? value0 : value1;
      const _amount0 = new Big(_value0 || 0)
        .mul(10 ** _token0.decimals)
        .toFixed(0);
      const _amount1 = new Big(_value1 || 0)
        .mul(10 ** _token1.decimals)
        .toFixed(0);
      const _amount0Min = new Big(_amount0)
        .mul(1 - (slippage || 0.05))
        .toFixed(0);
      const _amount1Min = new Big(_amount1)
        .mul(1 - (slippage || 0.05))
        .toFixed(0);
      const _deadline = Math.ceil(Date.now() / 1000) + 600;

      if (noPair) {
        const _price = new Big(isReverse ? 1 / currentPrice : currentPrice).div(
          10 ** (_token0.decimals - _token1.decimals)
        );
        const _sqrtPriceX96 = new Big(_price.toFixed())
          .sqrt()
          .mul(2 ** 96)
          .toFixed(0);

        const params = [_token0.address, _token1.address, fee, _sqrtPriceX96];
        calldatas.push(
          Interface.encodeFunctionData(
            "createAndInitializePoolIfNecessary",
            params
          )
        );
      }

      if (!tokenId) {
        const tickLower =
          lowerPrice === "0"
            ? nearestUsableTick({
                tick: MIN_TICK,
                fee,
                tickSpacing: info.tickSpacing
              })
            : priceToUsableTick({
                price: lowerPrice,
                token0,
                token1,
                fee,
                tickSpacing: info.tickSpacing
              });
        const tickUpper =
          upperPrice === "∞"
            ? nearestUsableTick({
                tick: MAX_TICK,
                fee,
                tickSpacing: info.tickSpacing
              })
            : priceToUsableTick({
                price: upperPrice,
                token0,
                token1,
                fee,
                tickSpacing: info.tickSpacing
              });

        const _tickLower = tickLower > tickUpper ? tickUpper : tickLower;
        const _tickUpper = tickLower > tickUpper ? tickLower : tickUpper;

        const mintParams: Record<string, any> = {
          token0: _token0.address,
          token1: _token1.address,
          tickLower: _tickLower,
          tickUpper: _tickUpper,
          amount0Desired: _amount0,
          amount1Desired: _amount1,
          amount0Min: _amount0Min,
          amount1Min: _amount1Min,
          recipient: account,
          deadline: _deadline,
          fee
        };

        calldatas.push(Interface.encodeFunctionData("mint", [mintParams]));
      } else {
        calldatas.push(
          Interface.encodeFunctionData("increaseLiquidity", [
            {
              tokenId: tokenId,
              amount0Desired: _amount0,
              amount1Desired: _amount1,
              amount0Min: _amount0Min,
              amount1Min: _amount1Min,
              deadline: _deadline
            }
          ])
        );
      }

      let value = "0";

      if (hasNativeToken) {
        value = _token0.isNative ? _amount0 : _amount1;
        calldatas.push(Interface.encodeFunctionData("refundETH"));
      }
      const txn: any = {
        to: PositionManager,
        data:
          calldatas.length === 1
            ? calldatas[0]
            : Interface.encodeFunctionData("multicall", [calldatas]),
        value
      };

      const signer = provider.getSigner(account);

      let estimateGas = new Big(1000000);

      try {
        estimateGas = await signer.estimateGas(txn);
      } catch (err: any) {
        console.log("estimateGas err", err);
        if (err?.code === "UNPREDICTABLE_GAS_LIMIT") {
          estimateGas = new Big(3000000);
        }
      }
      console.log("estimateGas", estimateGas.toString());
      const gasPrice = await provider.getGasPrice();
      const newTxn = {
        ...txn,
        gasLimit: new Big(estimateGas).mul(120).div(100).toFixed(0),
        gasPrice: gasPrice
      };

      const tx = await signer.sendTransaction(newTxn);

      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending..." });

      const { status, transactionHash } = await tx.wait();

      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Add Successful!",
          tx: transactionHash,
          chainId
        });
        onSuccess();
      } else {
        toast.fail({ title: "Add failed!" });
      }
      addAction({
        type: "Liquidity",
        action: "Add Liquidity",
        tokens: [token0, token1],
        amounts: [value0, value1],
        template: dex.name,
        status,
        transactionHash,
        sub_type: "Add",
        extra_data: {
          action: "Add Liquidity",
          type: "univ3"
        }
      });
      setLoading(false);
    } catch (err: any) {
      console.log(err);
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Add failed!`
      });
    }
  };

  return { loading, onIncrease };
}
