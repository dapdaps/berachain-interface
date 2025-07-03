import { useCallback, useMemo, useRef, useState } from "react";
import useAddAction from "./use-add-action";
import useTokenBalance from "./use-token-balance";
import useAccount from "./use-account";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { numberFormatter } from "@/utils/number-formatter";
import { post } from "@/utils/http";
import Big from "big.js";

export function useHaiku(props: Props) {
  const { input_token, output_token, haiku, onSuccess, from } = props;

  const { addAction } = useAddAction(from);
  const [approved, setApproved] = useState(false);
  const [approving, setApproving] = useState(false);
  const permitSignature = useRef("");

  const {
    tokenBalance,
    isLoading,
    update: updateBalance
  } = useTokenBalance(input_token.address, input_token.decimals);

  const outputAmount = useMemo(() => {
    if (!haiku) return;
    if (!haiku.permit2Datas) setApproved(true);
    if (!haiku.balances?.[0]?.amount) return "-";
    return numberFormatter(haiku.balances[0].amount, 2, true);
  }, [haiku]);

  const [loading, setLoading] = useState(false);
  const { account, provider, chainId } = useAccount();

  const step = useMemo(() => {
    if (chainId !== DEFAULT_CHAIN_ID) return 1;
    if (!tokenBalance) return 0;
    if (Big(tokenBalance).lt(input_token.amount || 0)) {
      return 1;
    }
    return approved ? 3 : 2;
  }, [input_token, tokenBalance, approved]);

  const onConfirm = useCallback(async () => {
    const baseReturn = {
      inputCurrencyAmount: input_token.amount,
      inputCurrency: input_token,
      outputCurrencyAmount: outputAmount,
      outputCurrency: output_token
    };
    try {
      setLoading(true);
      const res = await post("/api/go/haiku/solveIntent", {
        quoteId: haiku.quoteId,
        permit2Signature: permitSignature.current
      });

      if (res.code === -500) {
        onSuccess?.({
          ...baseReturn,
          isSuccess: false
        });
        return { isSuccess: false };
      }
      const signer = provider.getSigner(account);
      const txn = {
        data: res.data.data,
        to: res.data.to,
        value: typeof res.data.value === "string" ? res.data.value : Big(Number(res.data.value.hex)).toFixed(0)
      };

      const estimateGas = haiku.gas?.amount
        ? Big(haiku.gas.amount).mul(1.5)
        : new Big(5000000);

      const tx = await signer.sendTransaction(txn, {
        gasLimit: estimateGas.toFixed(0)
      });

      const { status, transactionHash } = await tx.wait();
      // // setTxHash(transactionHash);

      addAction({
        type: "Swap",
        inputCurrencyAmount: input_token.amount,
        inputCurrency: input_token,
        outputCurrencyAmount: outputAmount,
        outputCurrency: output_token,
        template: "Haiku",
        status,
        transactionHash,
        add: 0,
        token_in_currency: input_token,
        token_out_currency: output_token
      });
      onSuccess?.({
        transactionHash,
        ...baseReturn,
        isSuccess: status === 1
      });
      return { isSuccess: status === 1, transactionHash, status };
    } catch (err: any) {
      console.log("swap err", err);
    } finally {
      setLoading(false);
    }
    return { isSuccess: false };
  }, [provider, account, outputAmount, haiku]);

  const onApprove = useCallback(async (approveParams?: { isMax?: boolean; }) => {
    try {
      setApproving(true);
      const signer = provider.getSigner(account);

      if (haiku.approvals.length > 0) {
        console.log(
          "Granting one-time ERC20 Approvals to centralised Permit2 contract..."
        );
        await Promise.all(
          haiku.approvals.map((approval: any) =>
            signer.sendTransaction({ to: approval.to, data: approval.data })
          )
        );
      }
      let permit2Values = haiku.permit2Datas.values;
      if (Array.isArray(permit2Values.details)) {
        // Multiple input token case
        permit2Values.details = permit2Values.details.map((detail: any) => ({
          ...detail,
          amount: BigInt(detail.amount.hex).toString()
        }));
      } else if (permit2Values.details && permit2Values.details.amount) {
        // Single input token case
        permit2Values.details.amount = BigInt(
          permit2Values.details.amount?.hex || permit2Values.details.amount
        ).toString();
      }

      // Sign the Permit2 data to grant allowances for this trade
      const signature = await signer._signTypedData(
        haiku.permit2Datas.domain,
        haiku.permit2Datas.types,
        haiku.permit2Datas.values
      );

      permitSignature.current = signature;
      setApproved(true);
      return { isSuccess: true };
    } catch (err) {
      console.log("signature err", err);
    } finally {
      setApproving(false);
    }
    return { isSuccess: false };
  }, [haiku, provider, account]);

  return {
    chainId,
    approved,
    approving,
    permitSignature,
    step,
    onConfirm,
    onApprove,
    loading,
    tokenBalance,
    tokenBalanceLoading: isLoading,
    updateTokenBalance: updateBalance,
    outputAmount,
    setApproved,
  };
}

interface Props {
  input_token: Token;
  output_token: Token;
  haiku: {
    permit2Datas?: any;
    balances?: any;
    gas?: any;
    approvals?: any;
    quoteId?: string;
  };
  onSuccess?(data: any): void;
  from: string;
}

interface Token {
  chainId: number;
  isNative?: boolean;
  name: string;
  icon: string;
  symbol: string;
  address: string;
  decimals: number;
  amount: string;
}
