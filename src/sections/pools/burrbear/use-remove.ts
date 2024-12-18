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

export default function usdAdd({
  tokens,
  liquidity,
  amounts,
  poolIdx,
  onSuccess
}: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider, chainId } = useAccount();
  const toast = useToast();
  const contracts = burrbear.contracts[DEFAULT_CHAIN_ID];
  const { addAction } = useAddAction("dapp");

  const onRemove = async () => {
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
      const [assets, balances] = await valutContract.getPoolTokens(poolIdx);

      const initBalances = Big(liquidity).mul(1e18).toFixed(0);
      const abiCoder = new utils.AbiCoder();

      const method = "exitPool";

      const minAmountsOut: any = [];
      tokens.forEach((token: any, i: number) => {
        const _v = Big(amounts[token.address])
          .mul(10 ** token.decimals)
          .toFixed(0);
        minAmountsOut.push(_v);
      });

      const userData = abiCoder.encode(
        ["uint256", "uint256"],
        [3, initBalances]
      );

      const [bptOut, amountsIn] = await queryContract.queryExit(
        poolIdx,
        account,
        account,
        [assets, minAmountsOut, userData, false]
      );

      const params = [
        poolIdx,
        account,
        account,
        [
          assets,
          amountsIn,
          abiCoder.encode(["uint256", "uint256"], [1, bptOut]),
          false
        ]
      ];

      let estimateGas: any = new Big(1000000);

      try {
        estimateGas = await valutContract.estimateGas[method](...params);
      } catch (err: any) {
        console.log("estimateGas err", err);
        if (err?.code === "UNPREDICTABLE_GAS_LIMIT") {
          estimateGas = new Big(3000000);
        }
      }
      console.log("estimateGas", estimateGas.toString());
      const tx = await valutContract[method](...params, {
        gasLimit: new Big(estimateGas).mul(120).div(100).toFixed(0)
      });

      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending..." });

      const { status, transactionHash } = await tx.wait();

      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Remove successfully!",
          tx: transactionHash,
          chainId
        });
        onSuccess();
      } else {
        toast.fail({ title: "Remove faily!" });
      }
      addAction({
        type: "Liquidity",
        action: "Remove Liquidity",
        template: "Burrbear",
        status,
        transactionHash,
        sub_type: "Remove",
        extra_data: JSON.stringify({
          tokens: tokens.map((token: any) => ({
            symbol: token.symbol,
            amount: token.value
          })),
          action: "Remove Liquidity",
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
          : `Remove faily!`
      });
    }
  };

  return { loading, contracts, onRemove };
}
