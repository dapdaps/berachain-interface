import { Contract, ethers, providers } from "ethers";
import NFTAbi from "../abis/mint.json";
import { CHAIN_RPC_URLS } from "./usePartnerCollections";
import { NFTCollectionWithStatus } from "../types";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import Big from "big.js";

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
  const { chainId, account } = useCustomAccount();
  const toast = useToast();

  const handleMint = async (
    collection: NFTCollectionWithStatus,
    currentGroupId: number,
    amount: number,
  ) => {
    if (!account || !chainId) return;

    try {
      const rpcUrl = CHAIN_RPC_URLS[chainId];
      if (!rpcUrl) {
        console.error(`No RPC URL found for chain ID ${chainId}`);
        return 'closed';
      }
  
      const provider = new providers.JsonRpcProvider(rpcUrl);
      const contract = new Contract(collection.contract_address, NFTAbi, provider);
      
      const currentGroup = collection.mint_group_data.find(g => g.id === currentGroupId);
      if (!currentGroup) throw new Error("Invalid mint group");
         
      const max_mint_per_wallet = await contract.maxMintPerWallet(currentGroupId);   
      const balance = await contract.balanceOf(account);
      const [feeAmount, totalCostWithFee] = await contract.quoteBatchMint(currentGroupId, amount);

      if (Big(balance).lt(feeAmount)) {
        toast.fail({
          title: `Sorry sire, you don't have enough balance to mint NFT.`,
        });
        return null;
      }

      if (balance.add(amount) > max_mint_per_wallet) {
        toast.fail({
          title: `Sorry sire, you can only mint up to ${max_mint_per_wallet} NFTs`,
        });
        return null;
      }

      const [hasEligibilityResult, errorTips] = await contract.canMintCheck(20, currentGroup.id, account);

      if (!hasEligibilityResult || errorTips) {
        toast.fail({
          title: `Sorry sire, ${errorTips}`,
        });
        return null;
      }

      const tx = await contract.batchMint(amount, currentGroupId, {
        value: totalCostWithFee.toString(),
      });
      
      return await tx.wait();
    } catch (error) {
      console.error("Mint error:", error);
      throw error;
    }
  };

  return { handleMint };
};
