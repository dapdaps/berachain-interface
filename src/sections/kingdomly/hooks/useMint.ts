import { Contract  } from "ethers";
import NFTAbi from "../abis/mint.json";
import { NFTCollectionWithStatus } from "../types";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import useTokenBalance from "@/hooks/use-token-balance";

interface EligibilityGroup {
  id: number;
  name: string;
  quota: number;
}

interface EligibilityResponse {
  name: string;
  slug: string;
  eligible_mint_groups: EligibilityGroup[];
}

export const checkEligibility = async (
  slug: string,
  address: string
): Promise<EligibilityResponse | null> => {
  try {
    const response = await fetch(
      `/api.kingdomly/api/eligibilityChecker?slug=${slug}&addressToCheck=${address}`,
      {
        headers: {
          accept: "application/json",
          "API-Key": "THEFOCUSEDMINDCANPIERCETHROUGHSTONE",
        },
      }
    );

    const data = await response.json();

    if ("error" in data) {
      return null;
    }

    return data as EligibilityResponse;
  } catch (error) {
    console.error("Error checking eligibility:", error);
    return null;
  }
};

export const useMint = () => {
  const { chainId, account, provider } = useCustomAccount();
  const toast = useToast();
  const { tokenBalance } = useTokenBalance('native', 18, chainId);  

  const handleMint = async (
    collection: NFTCollectionWithStatus,
    currentGroupId: number,
    amount: number,
  ) => {
    if (!account || !chainId) return;

    try {

      const contract = new Contract(collection.contract_address, NFTAbi, provider.getSigner());
      
      const currentGroup = collection.mint_group_data.find(g => g.id === currentGroupId);
      if (!currentGroup) throw new Error("Invalid mint group");

      const [feeAmount, totalCostWithFee] = await contract.quoteBatchMint(currentGroupId, amount);

      if (tokenBalance < feeAmount) {
        toast.fail({
          title: `Sorry sire, you don't have enough Bera to mint NFT.`,
        });
        return null;
      }

      const max_mint_per_wallet = await contract.maxMintPerWallet(currentGroupId); 
      
      const balance = await contract.balanceOf(account);

      if (balance.add(amount) > max_mint_per_wallet) {
        toast.fail({
          title: `Sorry sire, you can only mint up to ${max_mint_per_wallet} NFTs`,
        });
        return null;
      }

      const [hasEligibilityResult, errorTips] = await contract.canMintCheck(amount, currentGroup.id, account);

      if (!hasEligibilityResult || errorTips) {
        toast.fail({
          title: `Sorry sire, ${errorTips}`,
        });
        return null;
      }

      const tx = await contract.batchMint(amount, currentGroupId, {
        value: feeAmount.toString(),
      });
      return await tx.wait();
    } catch (error: any) {
      if (error?.code === 4001 || error?.message?.includes('user rejected')) {
        toast.fail({
          title: "Transaction was cancelled",
        });
      } else {
        console.error("Mint batchMint:", error);
      }
    }
  };

  return { handleMint };
};
