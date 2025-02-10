import Big from "big.js";
import { Contract, utils } from "ethers";
import { useState } from "react";
import useAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import useToast from "@/hooks/use-toast";
import usePrices from "./use-prices";
import { useSettingsStore } from "@/stores/settings";
import valutAbi from "../abi/balancer-valut";
import poolAbi from "../abi/balancer-pool";
import queryAbi from "../abi/balancer-query";
import beraswap from "@/configs/pools/beraswap";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function usdAdd({ tokens, values, poolIdx, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider, chainId } = useAccount();
  const prices = usePrices();
  const toast = useToast();
  const contracts = beraswap.contracts[DEFAULT_CHAIN_ID];
  const { addAction } = useAddAction("dapp");
  const slippage = useSettingsStore((store: any) => store.slippage);
  const onIncrease = async () => {
    if (!contracts) return;
    setLoading(true);

    let toastId = toast.loading({ title: "Confirming..." });

    try {
      const signer = provider.getSigner(account);
      const valutContract = new Contract(contracts.Vault, valutAbi, signer);
      const [poolAddress] = await valutContract.getPool(poolIdx);
      const poolContract = new Contract(poolAddress, poolAbi, provider);
      const queryContract = new Contract(
        contracts.BalancerQuery,
        queryAbi,
        provider
      );
      const totalSupply = await poolContract.getActualSupply();
      const [assets, balances] = await valutContract.getPoolTokens(poolIdx);
      let val = Big(0);
      let poolValue = Big(0);
      let userValue = Big(0);

      const maxAmountsIn: any = [];
      const amountsIn: any = [];

      assets.forEach((asset: any, i: number) => {
        const token = tokens.find(
          (t: any) => t.address === asset.toLowerCase()
        );
        if (!token) {
          maxAmountsIn.push("0");
          return;
        }

        amountsIn.push(
          Big(values[token.address] || 0)
            .mul(10 ** token.decimals)
            .toFixed(0)
        );
        const price = prices[token.address] || token.token.latestUSDPrice;

        if (token.isNative) {
          val = Big(0).add(values[token.address] || 0);
        }
        const _v = Big(values[token.address] || 0)
          .mul(10 ** token.decimals)
          .toFixed(0);

        maxAmountsIn.push(_v);

        poolValue = poolValue.add(
          Big(balances[i].toString())
            .div(10 ** token.decimals)
            .mul(price)
        );
        userValue = userValue.add(Big(values[token.address] || 0).mul(price));
      });

      const bptPriceUsd = poolValue.div(Big(totalSupply.toString()).div(1e18));
      const initBalances = userValue
        .div(bptPriceUsd)
        .mul(1 - slippage / 100)
        .mul(1e18)
        .toFixed(0);

      const abiCoder = new utils.AbiCoder();

      const [bptOut] = await queryContract.callStatic.queryJoin(
        poolIdx,
        account,
        account,
        [
          assets,
          maxAmountsIn,
          abiCoder.encode(
            ["uint256", "uint256[]", "uint256"],
            [1, amountsIn, initBalances]
          ),
          false
        ]
      );

      const method = "joinPool";
      const params = [
        poolIdx,
        account,
        account,
        [
          assets,
          maxAmountsIn,
          abiCoder.encode(
            ["uint256", "uint256[]", "uint256"],
            [1, amountsIn, bptOut]
          ),
          false
        ]
      ];

      const value = val.times(1e18).toFixed(0);

      let estimateGas: any = new Big(1000000);

      try {
        estimateGas = await valutContract.estimateGas[method](...params, {
          value
        });
      } catch (err: any) {
        console.log("estimateGas err", err);
        if (err?.code === "UNPREDICTABLE_GAS_LIMIT") {
          estimateGas = new Big(3000000);
        }
      }
      console.log("estimateGas", estimateGas.toString());
      const tx = await valutContract[method](...params, {
        value,
        gasLimit: new Big(estimateGas).mul(120).div(100).toFixed(0)
      });

      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending..." });

      const { status, transactionHash } = await tx.wait();

      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Add successfully!",
          tx: transactionHash,
          chainId
        });
        onSuccess();
      } else {
        toast.fail({ title: "Add faily!" });
      }
      addAction({
        type: "Liquidity",
        action: "Add Liquidity",
        template: "Burrbear",
        status,
        transactionHash,
        sub_type: "Add",
        extra_data: JSON.stringify({
          tokens: tokens.map((token: any) => ({
            symbol: token.symbol,
            amount: values[token.address]
          })),
          action: "Add Liquidity",
          type: "univ3"
        })
      });
      setLoading(false);
    } catch (err: any) {
      console.log(err);
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Add faily!`
      });
    }
  };

  return { loading, contracts, onIncrease };
}
