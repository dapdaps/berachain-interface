import Big from "big.js";
import { Contract, utils } from "ethers";
import { useState, useRef, useEffect } from "react";
import useAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import useToast from "@/hooks/use-toast";
import { useSettingsStore } from "@/stores/settings";
import { useDebounceFn } from "ahooks";
import valutAbi from "../abi/balancer-valut";
import queryAbi from "../abi/balancer-query";
import poolAbi from "../abi/balancer-pool";
import bex from "@/configs/pools/bex";
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
  const contracts = bex.contracts[DEFAULT_CHAIN_ID];
  const assetsRef = useRef<any>();
  const slippage = useSettingsStore((store: any) => store.slippage / 100);
  const { addAction } = useAddAction("dapp");
  const cachedAmounts = useRef<any>({});

  const onQueryAmountsOut = async () => {
    try {
      setBalanceLoading(true);
      const queryContract = new Contract(
        contracts.BalancerQuery,
        queryAbi,
        provider
      );
      const poolContract = new Contract(data.address, poolAbi, provider);

      const balanceRes = await poolContract.balanceOf(account);

      const _balance = balanceRes.toString();
      if (!assetsRef.current) {
        const valutContract = new Contract(contracts.Vault, valutAbi, provider);

        const { tokens } = await valutContract.getPoolTokens(data.id);

        assetsRef.current = tokens;
      }

      let exitTokenIndex = assetsRef.current
        .filter((asset: any) =>
          data.type === "COMPOSABLE_STABLE"
            ? data.tokens.find(
                (token: any) =>
                  token.address.toLowerCase() === asset.toLowerCase()
              )
            : true
        )
        .findIndex(
          (asset: any) =>
            asset.toLowerCase() === exitToken.address.toLowerCase()
        );

      const bptMinIn = Big(_balance).toFixed(0);
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

      if (type === 1) {
        cachedAmounts.current["tokens"] = _amounts;
      } else {
        cachedAmounts.current[exitToken.address] = _amounts;
      }
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
      const poolContract = new Contract(data.address, poolAbi, provider);

      const balanceRes = await poolContract.balanceOf(account);

      const _balance = balanceRes.toString();
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
      let _amountsOut: any = [];

      if (type === 1) {
        exitKind = data.type === "COMPOSABLE_STABLE" ? 2 : 1;
        bptMinIn = Big(_balance)
          .mul(percent / 100)
          .toFixed(0);
        const abiCoder = new utils.AbiCoder();
        const minAmountsOut: any = [];

        assetsRef.current.forEach((asset: any, i: number) => {
          const token = data.tokens.find(
            (t: any) => t.address === asset.toLowerCase()
          );
          if (!token) {
            minAmountsOut.push("0");
            return;
          }

          minAmountsOut.push(0);
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
            amountsOut.map((amount: any) =>
              Big(amount.toString())
                .mul(1 - slippage)
                .toFixed(0)
            ),
            abiCoder.encode(["uint256", "uint256"], [exitKind, bptIn]),
            false
          ]
        ];
        _amountsOut = amountsOut;
      } else {
        exitKind = 0;
        const _percent = Big(exitAmount).div(amounts[exitToken.address]);
        bptMinIn = Big(_balance).mul(_percent).toFixed(0);

        const types = ["uint256", "uint256", "uint256"];
        let exitTokenIndex = assetsRef.current.findIndex(
          (asset: any) => asset.toLowerCase() === exitToken.address
        );
        exitTokenIndex =
          exitTokenIndex === 0
            ? 0
            : exitTokenIndex - (data.type === "COMPOSABLE_STABLE" ? 1 : 0);
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
        _amountsOut = amountsOut;
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
      const _tokens = type === 1 ? data.tokens : [exitToken];
      const _amounts: any = [];

      _tokens.forEach((token: any, i: number) => {
        const idx = assetsRef.current.findIndex(
          (asset: any) => asset.toLowerCase() === token.address.toLowerCase()
        );
        if (idx !== -1) {
          _amounts.push(
            Big(_amountsOut[idx].toString())
              .div(10 ** token.decimals)
              .toString()
          );
        }
      });

      addAction({
        type: "Liquidity",
        action: "Remove Liquidity",
        template: "Bex",
        status,
        transactionHash,
        sub_type: "Remove",
        tokens: _tokens,
        amounts: _amounts,
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
  const { run: onQueryAmountsOutDebounce } = useDebounceFn(
    () => {
      if (type === 1 && cachedAmounts.current.tokens) {
        setAmounts(cachedAmounts.current.tokens);
      } else if (type === 0 && cachedAmounts.current[exitToken.address]) {
        setAmounts(cachedAmounts.current[exitToken.address]);
      } else {
        onQueryAmountsOut();
      }
    },
    {
      wait: 500
    }
  );

  useEffect(() => {
    if (type === 0 && !exitToken) return;
    onQueryAmountsOutDebounce();
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
