import Big from "big.js";
import { Contract, utils } from "ethers";
import { useState } from "react";
import useAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import useToast from "@/hooks/use-toast";
import valutAbi from "../abi/balancer-valut";
import poolAbi from "../abi/balancer-pool";
import queryAbi from "../abi/balancer-query";
import burrbear from "@/configs/pools/burrbear";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function usdAdd({ tokens, values, poolIdx, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider, chainId } = useAccount();
  const toast = useToast();
  const contracts = burrbear.contracts[DEFAULT_CHAIN_ID];
  const { addAction } = useAddAction("dapp");

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
      const totalSupply = await poolContract.totalSupply();
      const [assets, balances] = await valutContract.getPoolTokens(poolIdx);
      let val = Big(0);
      let poolValue = Big(0);
      let userValue = Big(0);
      const maxAmountsIn: any = [];
      tokens.forEach((token: any, i: number) => {
        if (token.isNative) {
          val = Big(0).add(values[token.address]);
        }
        const _v = Big(values[token.address])
          .mul(10 ** token.decimals)
          .toFixed(0);
        maxAmountsIn.push(_v);

        poolValue = poolValue.add(balances[0].toString());
        userValue = userValue.add(_v);
      });

      const initBalances = userValue
        .mul(totalSupply.toString())
        .div(poolValue)
        .toFixed(0);
      const abiCoder = new utils.AbiCoder();

      const method = "joinPool";

      const userData = abiCoder.encode(
        ["uint256", "uint256"],
        [3, initBalances]
      );

      const [bptOut, amountsIn] = await queryContract.queryJoin(
        poolIdx,
        account,
        account,
        [assets, maxAmountsIn, userData, false]
      );

      const params = [
        poolIdx,
        account,
        account,
        [
          assets,
          amountsIn,
          abiCoder.encode(["uint256", "uint256"], [3, bptOut]),
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
