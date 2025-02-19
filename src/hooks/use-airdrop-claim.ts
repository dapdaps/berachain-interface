import { useCallback, useEffect, useState } from "react";
import { ContractAddresses, ChainId, abi } from "@/configs/airdrop";
import useCustomAccount from "./use-account";
import useToast from "@/hooks/use-toast";
import { providers, Contract } from "ethers";
import chains from "@/configs/chains";
import Big from "big.js";

export default function useAirdropClaim() {
  const [endTime, setEndTime] = useState<any>();
  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const { provider, account } = useCustomAccount();
  const toast = useToast();

  const queryTime = useCallback(async () => {
    if (endTime) return;
    const rpcUrl = chains[ChainId]?.rpcUrls?.default.http[0];
    try {
      setLoading(true);
      const ClaimContract = new Contract(
        ContractAddresses[ChainId],
        abi,
        new providers.JsonRpcProvider(rpcUrl)
      );
      const result = await ClaimContract.claimPeriodEnd();

      setEndTime(result.toString() * 1000);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [provider, endTime]);

  const queryClaimable = useCallback(async () => {
    if (!account) return;
    const ClaimContract = new Contract(
      ContractAddresses[ChainId],
      abi,
      provider
    );
    const result = await ClaimContract.claimableTokens(account);
    setClaimed(result ? new Big(result.toString()).eq(0) : true);
  }, [provider, account]);

  const onClaim = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setClaiming(true);
      const signer = provider.getSigner(account);
      const ClaimContract = new Contract(
        ContractAddresses[ChainId],
        abi,
        signer
      );
      let estimateGas: any = new Big(1000000);
      try {
        estimateGas = await ClaimContract.estimateGas.claim();
      } catch (err: any) {
        console.log("estimateGas err", err);
        if (err?.code === "UNPREDICTABLE_GAS_LIMIT") {
          estimateGas = new Big(3000000);
        }
      }
      console.log("estimateGas", estimateGas.toString());
      const tx = await ClaimContract.claim({
        gasLimit: new Big(estimateGas).mul(120).div(100).toFixed(0)
      });
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending..." });

      const { status, transactionHash } = await tx.wait();

      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Claim successful!",
          tx: transactionHash,
          chainId: ChainId
        });
        setClaimed(true);
      } else {
        toast.fail({ title: "Claim failed!" });
      }
    } catch (err: any) {
      console.log(err);
      toast.dismiss(toastId);

      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Claim failed!`
      });
    } finally {
      setClaiming(false);
    }
  };

  useEffect(() => {
    if (!provider) {
      return;
    }
    queryClaimable();
  }, [provider, account]);

  useEffect(() => {
    queryTime();
  }, []);

  return { onClaim, loading, claimed, endTime, claiming };
}
