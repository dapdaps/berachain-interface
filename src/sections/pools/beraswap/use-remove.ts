import Big from "big.js";
import { Contract, utils } from "ethers";
import { useState, useMemo, useRef, useEffect } from "react";
import useAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import useToast from "@/hooks/use-toast";
import valutAbi from "../abi/balancer-valut";
import queryAbi from "../abi/balancer-query";
import beraswap from "@/configs/pools/beraswap";
import { DEFAULT_CHAIN_ID } from "@/configs";

const abiCoder = new utils.AbiCoder();

export default function useRemove({
  data,
  type, // 0 for one token, 1 for tokens
  percent,
  exitAmount,
  onSuccess
}: any) {
  const [loading, setLoading] = useState(false);
  const [amounts, setAmounts] = useState<any>({});
  const [balanceLoading, setBalanceLoading] = useState(false);
  const { account, provider, chainId } = useAccount();
  const [exitToken, setExitToken] = useState<any>();
  const toast = useToast();
  const contracts = beraswap.contracts[DEFAULT_CHAIN_ID];
  const assetsRef = useRef<any>();
  const { addAction } = useAddAction("dapp");

  const onQueryAmountsOut = async () => {
    try {
      setBalanceLoading(true);
      const queryContract = new Contract(
        contracts.BalancerQuery,
        queryAbi,
        provider
      );

      if (!assetsRef.current) {
        const valutContract = new Contract(contracts.Vault, valutAbi, provider);

        const { tokens } = await valutContract.getPoolTokens(data.id);

        assetsRef.current = tokens;
      }

      let exitTokenIndex = assetsRef.current.findIndex(
        (asset: any) => asset.toLowerCase() === exitToken.address
      );

      const bptMinIn = Big(data.balance).mul(1e18).toFixed(0);
      const minAmountsOut = assetsRef.current.map(
        (asset: any, i: number) => "0"
      );

      const userData =
        type === 0
          ? abiCoder.encode(
              ["uint256", "uint256", "uint256"],
              [0, bptMinIn, exitTokenIndex]
            )
          : abiCoder.encode(
              ["uint256", "uint256"],
              [data.type === "COMPOSABLE_STABLE" ? 2 : 1, bptMinIn]
            );
      console.log(67, [assetsRef.current, minAmountsOut, userData, false]);
      const [bptIn, amountsOut] = await queryContract.callStatic.queryExit(
        data.id,
        account,
        account,
        [assetsRef.current, minAmountsOut, userData, false]
      );

      const _amounts: any = {};

      assetsRef.current.forEach((address: any, i: number) => {
        const token = data.tokens.find(
          (token: any) => token.address.toLowerCase() === address.toLowerCase()
        );
        if (!token) return;
        _amounts[address.toLowerCase()] = Big(amountsOut[i].toString())
          .div(10 ** token.decimals)
          .toString();
      });

      setAmounts(_amounts);
    } catch (err) {
      setAmounts({});
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
      if (!assetsRef.current) {
        const { tokens } = await valutContract.getPoolTokens(data.id);
        assetsRef.current = tokens;
      }
      const queryContract = new Contract(
        contracts.BalancerQuery,
        queryAbi,
        provider
      );
      let params: any = [];
      let exitKind = 2;
      let bptMinIn = "0";

      if (type === 1) {
        exitKind = data.type === "COMPOSABLE_STABLE" ? 2 : 1;
        bptMinIn = Big(data.balance).mul(1e18).toFixed(0);
        const abiCoder = new utils.AbiCoder();
        const minAmountsOut: any = [];

        assetsRef.current.forEach((asset: any, i: number) => {
          if (type === 0) return;
          const token = data.tokens.find(
            (t: any) => t.address === asset.toLowerCase()
          );
          if (!token) {
            minAmountsOut.push("0");
            return;
          }
          const _v = Big(amounts[asset.toLowerCase()])
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
          [assetsRef.current, minAmountsOut, userData, false]
        );
        params = [
          data.id,
          account,
          account,
          [
            assetsRef.current,
            amountsOut,
            abiCoder.encode(["uint256", "uint256"], [exitKind, bptIn]),
            false
          ]
        ];
      } else {
        exitKind = 0;
        const _percent = Big(exitAmount).div(amounts[exitToken.address]);
        bptMinIn = Big(data.balance)
          .mul(_percent)
          .mul(10 ** 18)
          .toFixed(0);

        const types = ["uint256", "uint256", "uint256"];
        let exitTokenIndex = assetsRef.current.findIndex(
          (asset: any) => asset.toLowerCase() === exitToken.address
        );
        const userData = abiCoder.encode(types, [0, bptMinIn, exitTokenIndex]);
        const minAmountsOut = assetsRef.current.map(
          (asset: any, i: number) => "0"
        );

        const [bptIn, amountsOut] = await queryContract.callStatic.queryExit(
          data.id,
          account,
          account,
          [assetsRef.current, minAmountsOut, userData, false]
        );

        params = [
          data.id,
          account,
          account,
          [
            assetsRef.current,
            amountsOut,
            abiCoder.encode(types, [0, bptIn, exitTokenIndex]),
            false
          ]
        ];
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
        tokens: type === 1 ? data.tokens : [exitToken],
        amounts:
          type === 1
            ? data.tokens.map((token: any) => token.value)
            : [exitAmount],
        extra_data: {
          action: "Remove Liquidity",
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
          : `Remove faily!`
      });
    }
  };

  useEffect(() => {
    if (type === 1 && !exitToken) return;
    onQueryAmountsOut();
  }, [type, exitToken]);

  return {
    loading,
    contracts,
    amounts,
    balanceLoading,
    exitToken,
    setExitToken,
    onRemove,
    onQueryAmountsOut
  };
}
