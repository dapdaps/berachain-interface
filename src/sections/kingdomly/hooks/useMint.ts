import { Contract, ethers, providers } from "ethers";
import NFTAbi from "../abis/NFT.json";
import { CHAIN_RPC_URLS } from "./usePartnerCollections";
import { NFTCollectionWithStatus } from "../types";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";

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
  const { provider, account } = useCustomAccount();
  const toast = useToast();

  const handleMint = async (
    collection: NFTCollectionWithStatus,
    currentGroupId: number,
    amount: number,
  ) => {
    if (!provider || !account) return;

    try {
      const signer = provider.getSigner();
      const contract = new Contract(collection.contract_address, NFTAbi, signer);
      
      const currentGroup = collection.mint_group_data.find(g => g.id === currentGroupId);
      if (!currentGroup) throw new Error("Invalid mint group");

      const isPublicMint = currentGroup.name.toLowerCase().includes('public') ||
                          currentGroup.mint_group_description?.toLowerCase().includes('public');

      // 获取当前余额
      const balance = await contract.balanceOf(account);
      
      if (isPublicMint) {
        // Public mint 逻辑
        // 1. 获取其他组的配额总和
        const otherGroupsQuota = await calculateOtherGroupsQuota(collection, account);
        // 2. 实际的 public mint 数量 = 总余额 - 其他组配额
        const publicMintCount = balance.sub(otherGroupsQuota);
        // 3. 检查是否超过限制
        if (publicMintCount.add(amount) > currentGroup.max_mint_per_wallet) {
          toast.fail({
            title: "Sorry sire, you have exceeded the maximum mint per wallet for public sale.",
          });
          return;
        }
      } else {
        const eligibilityResult = await checkEligibility(collection.slug, account);
        if (!eligibilityResult) {
          toast.fail({
            title: "Sorry sire, the address is not allowlisted. Please ask the owner if you believe this is an error.",
          });
          return;
        }

        // 找到当前组的配额
        const currentGroupQuota = eligibilityResult.eligible_mint_groups.find(
          group => group.id === currentGroupId
        )?.quota || 0;

        if (!currentGroupQuota) {
          toast.fail({
            title: "Sorry sire, you don't have quota for this group.",
          });
          return;
        }

        if (amount > currentGroupQuota) {
          toast.fail({
            title: `Sorry sire, you can only mint up to ${currentGroupQuota} NFTs in this group.`,
          });
          return;
        }
      }

      const [feeAmount, totalCostWithFee] = await contract.quoteBatchMint(currentGroupId, amount);

      const tx = await contract.batchMint(amount, currentGroupId, {
        value: totalCostWithFee.toString(),
      });
      
      return await tx.wait();
    } catch (error) {
      console.error("Mint error:", error);
      throw error;
    }
  };

  const calculateOtherGroupsQuota = async (
    collection: NFTCollectionWithStatus,
    address: string
  ): Promise<ethers.BigNumber> => {
    let totalQuota = ethers.BigNumber.from(0);

    const eligibilityResult = await checkEligibility(collection.slug, address);
    if (eligibilityResult?.eligible_mint_groups) {
      for (const group of eligibilityResult.eligible_mint_groups) {
        if (!group.name.toLowerCase().includes('public')) {
          totalQuota = totalQuota.add(group.quota);
        }
      }
    }

    return totalQuota;
  };

  return { handleMint };
};
