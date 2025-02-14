import { useEffect, useState } from "react";
import multicallAddresses from "@/configs/contract/multicall";
import { multicall } from "@/utils/multicall";
import { ContractAddresses, ChainId, abi } from "@/configs/airdrop";
import useCustomAccount from "./use-account";
import useToast from "@/hooks/use-toast";
import { Contract } from "ethers";
import Big from "big.js";

export default function useAirdropClaim() {
  const [info, setInfo] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const { provider, account } = useCustomAccount();
  const toast = useToast();

  const query = async () => {
    try {
      setLoading(true);
      const multicallAddress = multicallAddresses[ChainId];
      const contractAddress = ContractAddresses[ChainId];
      const calls = [
        { address: contractAddress, name: "claimPeriodEnd" },
        { address: contractAddress, name: "claimableTokens", params: [account] }
      ];
      const result = await multicall({
        abi,
        options: {},
        calls,
        multicallAddress,
        provider
      });
      setInfo({
        endTime: result[0][0].toString() * 1000,
        claimed: new Big(result[1][0].toString()).eq(0)
      });
    } catch (err) {
      console.log(34, err);
    } finally {
      setLoading(false);
    }
  };

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
        setInfo({ ...info, claimed: true });
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
    console.log(93, account, provider);
    if (account && provider) query();
  }, [provider, account]);

  return { onClaim, loading, info, claiming };
}
