import { useRequest } from "ahooks";
import { Contract, utils } from "ethers";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import { GACHA_CONTRACT_ADDRESS, GACHA_TABS } from "../config";
import gachaAbi from "../abi";
import { useState } from "react";

export default function usePlayGame(config: any) {
  const { account, chainId, provider } = useCustomAccount();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [gameRequest, setGameRequest] = useState<any>(null);

  const { runAsync: playGame } = useRequest(
    async (tier: number) => {
      if (!provider || !account) {
        throw new Error("Please connect your wallet");
      }

      let toastId = toast.loading({
        title: "Confirming..."
      });
      setLoading(true);
      setGameRequest(null);
      try {
        const signer = provider.getSigner(account);
        const contract = new Contract(GACHA_CONTRACT_ADDRESS, gachaAbi, signer);
        const tierConfig = config[tier];

        // Generate random bytes32
        const buffer = crypto.getRandomValues(new Uint8Array(32));
        const hexString = Array.from(buffer)
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("");
        const userRandomNumber = "0x" + hexString;

        // Parse value to wei (BERA has 18 decimals)
        const valueInWei = tierConfig.entryFee.toString();

        const options: any = {
          value: valueInWei
        };

        console.log(tier, userRandomNumber, options);

        // Estimate gas
        try {
          const estimatedGas = await contract.estimateGas.playGame(
            tier,
            userRandomNumber,
            options
          );
          options.gasLimit = Math.floor(Number(estimatedGas) * 1.2);
        } catch (err) {
          options.gasLimit = 10000000;
          console.error("estimate gas failed: %o", err);
        }

        // Execute transaction
        const tx = await contract.playGame(tier, userRandomNumber, options);

        toast.dismiss(toastId);
        toastId = toast.loading({
          title: "Pending...",
          chainId,
          tx: tx.hash
        });
        console.log("tx", tx);
        const receipt = await tx.wait();
        console.log("receipt", receipt);
        const { status, transactionHash, logs } = receipt;

        if (status !== 1) {
          toast.fail({
            title: "Play game failed",
            tx: transactionHash,
            chainId
          });
          return;
        }

        const sequence = logs[0].topics[3];

        console.log("sequence", sequence);

        let pollCount = 0;
        const maxPollCount = 20;
        const pollInterval = 1000; // 1 second

        const pollGameRequest = async (): Promise<void> => {
          if (pollCount >= maxPollCount) {
            toast.dismiss(toastId);
            toast.fail({
              title: "Play game timeout",
              text: "Request timed out after 20 seconds"
            });

            return;
          }

          try {
            const gameRequest = await contract.getGameRequest(sequence);

            if (gameRequest.fulfilled) {
              toast.dismiss(toastId);
              toast.success({
                title: "Play game successful!",
                tx: transactionHash,
                chainId
              });
              setGameRequest(gameRequest);
              setLoading(false);
              console.log("gameRequest", gameRequest);
              return;
            }

            // Continue polling
            pollCount++;
            setTimeout(pollGameRequest, pollInterval);
          } catch (error: any) {
            console.log("Poll game request failed: %o", error);
            // Continue polling even if there's an error
            pollCount++;
            if (pollCount < maxPollCount) {
              setTimeout(pollGameRequest, pollInterval);
            }
          }
        };

        toast.dismiss(toastId);
        toastId = toast.loading({
          title: "Checking...",
          chainId,
          tx: transactionHash
        });
        // Start polling after a short delay
        setTimeout(pollGameRequest, pollInterval);
      } catch (error: any) {
        console.log("Play game failed: %o", error);
        toast.dismiss(toastId);
        toast.fail({
          title: "Play game failed",
          text: error?.message?.includes("user rejected transaction")
            ? "User rejected transaction"
            : error?.message || "Transaction failed"
        });
        setLoading(false);
        throw error;
      }
    },
    {
      manual: true
    }
  );

  return {
    playGame,
    loading,
    gameRequest
  };
}
