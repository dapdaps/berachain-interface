import Big from "big.js";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import useToast from "@/hooks/use-toast";

import type { Token } from "@/types";

import { useAccount } from "wagmi";

export const MAX_APPROVE =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

export const APPROVE_ABI = [
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" }
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  }
];

export default function useApprove({
  token,
  amount,
  spender,
  isSkip,
  isMax,
  onSuccess
}: {
  token?: Token;
  amount?: string;
  spender?: string;
  isSkip?: boolean;
  isMax?: boolean;
  onSuccess?: VoidFunction;
  checkApproved?: VoidFunction;
}) {
  const [approved, setApproved] = useState(false);
  const [approving, setApproving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [allowance, setAllowance] = useState<any>(0);
  const { address, connector } = useAccount();
  const toast = useToast();

  const checkApproved = async () => {
    if (!token?.address || !amount || !spender) return;
    if (
      token?.address === "0x0000000000000000000000000000000000000000" ||
      token?.address === "native"
    ) {
      setApproved(true);
      setChecking(false);
      return;
    }
    try {
      const walletProvider: any = await connector?.getProvider();
      const provider = new ethers.providers.Web3Provider(walletProvider, "any");
      const signer = provider.getSigner(address);

      setChecking(true);
      const TokenContract = new Contract(
        token.address,
        APPROVE_ABI,
        signer
      );
      const allowanceRes = await TokenContract.allowance(address, spender);

      const _allowance = ethers.utils.formatUnits(
        allowanceRes.toString(),
        token.decimals
      );

      const needApproved = Big(_allowance).lt(amount || "0");
      setAllowance(_allowance);
      setApproved(!needApproved);
      setChecking(false);
    } catch (err) {
      console.log("check approved failed: %o", err);
      setChecking(false);
    }
  };

  const approve = async () => {
    if (!token?.address || !amount || !spender) return;
    setApproving(true);
    try {
      const walletProvider: any = await connector?.getProvider();
      const provider = new ethers.providers.Web3Provider(walletProvider, "any");
      const signer = provider.getSigner(address);
      const TokenContract = new Contract(
        token.address,
        APPROVE_ABI,
        signer
      );
      let approveValue = amount;
      if (isMax) {
        approveValue = Big(MAX_APPROVE)
          .div(Big(10).pow(token.decimals))
          .toFixed(token.decimals);
      }
      const params = [
        spender,
        Big(approveValue)
          .times(10 ** token.decimals)
          .toFixed(0)
      ];
      let estimateGas;
      try {
        estimateGas = await TokenContract.estimateGas.approve(...params);
      } catch (err) {}
      const tx = await TokenContract.approve(...params, {
        gasLimit: estimateGas
          ? Big(estimateGas.toString()).mul(1.2).toFixed(0)
          : 5000000
      });
      console.log("estimateGas", estimateGas?.toString());
      const res = await tx.wait();
      setApproving(false);
      if (res.status === 1) {
        setApproved(true);
        onSuccess?.();
        toast.success({
          title: "Approve Successful!"
        });
      }
    } catch (err: any) {
      console.log("err", err);
      toast.fail({
        title: "Approve Failed!",
        text: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : ""
      });
      setApproving(false);
    }
  };

  useEffect(() => {
    if (
      token?.isNative ||
      isSkip ||
      token?.address === "0x0000000000000000000000000000000000000000" ||
      token?.address === "native"
    ) {
      setApproved(true);
      return;
    }

    if (token && amount && spender) checkApproved();
  }, [token, amount, spender, isSkip]);

  return { approved, approve, approving, checking, allowance, checkApproved };
}
