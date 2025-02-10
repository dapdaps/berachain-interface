import Big from "big.js";
import { Contract, utils } from "ethers";
import { useState } from "react";
import useAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import useToast from "@/hooks/use-toast";
import valutAbi from "../abi/balancer-valut";
import queryAbi from "../abi/balancer-query";
import beraswap from "@/configs/pools/beraswap";
import { DEFAULT_CHAIN_ID } from "@/configs";

const Infa = new utils.Interface(valutAbi);
const abiCoder = new utils.AbiCoder();

export default function useRemove({
  data,
  type, // 0 for one token, 1 for tokens
  percent,
  exitToken,
  exitAmount,
  onSuccess
}: any) {
  const [loading, setLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState("");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const { account, provider, chainId } = useAccount();
  const toast = useToast();
  const contracts = beraswap.contracts[DEFAULT_CHAIN_ID];
  const { addAction } = useAddAction("dapp");

  const onQuerySingleAmountOut = async (token: any) => {
    try {
      setBalanceLoading(true);
      const queryContract = new Contract(
        contracts.BalancerQuery,
        queryAbi,
        provider
      );
      let exitTokenIndex = data.tokensList.findIndex(
        (asset: any) => asset.toLowerCase() === token.address
      );
      const types = ["uint256", "uint256", "uint256"];
      const bptMinIn = Big(data.liquidity).toFixed(0);
      const minAmountsOut = data.tokensList.map((asset: any, i: number) => {
        if (asset.toLowerCase() === token.address) {
          exitTokenIndex = i;
        }
        return "0";
      });

      const userData = abiCoder.encode(types, [0, bptMinIn, exitTokenIndex]);
      const [bptIn, amountsOut] = await queryContract.callStatic.queryExit(
        data.id,
        account,
        account,
        [data.tokensList, minAmountsOut, userData, false]
      );
      setTokenBalance(
        Big(amountsOut[exitTokenIndex].toString())
          .div(10 ** token.decimals)
          .toString()
      );
    } catch (err) {
      setTokenBalance("");
    } finally {
      setBalanceLoading(false);
    }
  };

  const onRemove = async () => {
    if (!contracts) return;
    setLoading(true);

    let toastId = toast.loading({ title: "Confirming..." });

    try {
      const signer = provider.getSigner(account);
      const valutContract = new Contract(contracts.Vault, valutAbi, signer);
      const queryContract = new Contract(
        contracts.BalancerQuery,
        queryAbi,
        provider
      );
      let params: any = [];
      let exitKind = 2;
      let bptMinIn = "0";

      if (type === 1) {
        exitKind = 2;
        bptMinIn = Big(data.liquidity)
          .mul(percent / 100)
          .toFixed(0);
        const abiCoder = new utils.AbiCoder();
        const minAmountsOut: any = [];

        data.tokensList.forEach((asset: any, i: number) => {
          if (type === 0) return;
          const token = data.tokens.find(
            (t: any) => t.address === asset.toLowerCase()
          );
          if (!token) {
            minAmountsOut.push("0");
            return;
          }
          const _v = Big(token.amount)
            .mul(10 ** token.decimals)
            .mul(percent / 100)
            .toFixed(0);

          minAmountsOut.push(_v);
        });
        const types = ["uint256", "uint256"];
        const userData = abiCoder.encode(types, [exitKind, bptMinIn]);
        const [bptIn, amountsOut] = await queryContract.callStatic.queryExit(
          data.id,
          account,
          account,
          [data.tokensList, minAmountsOut, userData, false]
        );
        params = [
          data.id,
          account,
          account,
          [
            data.tokensList,
            amountsOut,
            abiCoder.encode(types, [exitKind, bptIn]),
            false
          ]
        ];
      } else {
        exitKind = 0;
        bptMinIn = Big(exitAmount)
          .mul(10 ** exitToken.decimals)
          .toFixed(0);
        const exitTokenIndex = data.tokensList.findIndex(
          (asset: any) => asset.toLowerCase() === exitToken.address
        );
        const types = ["uint256", "uint256", "uint256"];
      }

      const method = "exitPool";

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
        template: "BeraSwap",
        status,
        transactionHash,
        sub_type: "Remove",
        extra_data: JSON.stringify({
          tokens:
            type === 1
              ? data.tokens.map((token: any) => ({
                  symbol: token.symbol,
                  amount: token.value
                }))
              : [{ symbol: exitToken.symbol, amount: exitAmount }],
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

  return {
    loading,
    contracts,
    tokenBalance,
    balanceLoading,
    onRemove,
    onQuerySingleAmountOut
  };
}
