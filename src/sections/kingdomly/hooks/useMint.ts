import { Contract, ethers, providers } from "ethers";
import NFTAbi from "../abis/mint.json";
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
      return data;
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
      const eligibilityResult = await checkEligibility(collection.slug, account);
      if (eligibilityResult && 'error' in eligibilityResult) {
        toast.fail({
          title: `Sorry sire, ${eligibilityResult.error}`,
        });
        return null;
      }

      const isPublicMint = currentGroup.name.toLowerCase().includes('public') ||
                          currentGroup.mint_group_description?.toLowerCase().includes('public');
                          
      const max_mint_per_wallet = await contract.maxMintPerWallet(currentGroupId);   
      
      const balance = await contract.balanceOf(account);


      if (isPublicMint) {
        // Public mint 逻辑
        if (!eligibilityResult?.eligible_mint_groups || eligibilityResult.eligible_mint_groups.length === 0) {
          if (balance.add(amount) > max_mint_per_wallet) {
            toast.fail({
              title: `Sorry sire, you can only mint up to ${max_mint_per_wallet} NFTs in public sale.`,
            });
            return null;
          }
        } else {
          let otherGroupsBalance = 0;
          
          if (!eligibilityResult?.eligible_mint_groups) {
            console.warn('No eligible groups found');
            return null;
          }
          
          // 使用Promise.all并行获取所有组的mintQuotas
          const quotaPromises = eligibilityResult.eligible_mint_groups
            .filter(group => !group.name.toLowerCase().includes('public'))
            .map(async group => {
              const mintQuota = await contract.mintQuotas(group.id, account);
              console.log(`Group ${group.id} mintQuota:`, mintQuota.toString());
              return {
                groupId: group.id,
                quota: mintQuota
              };
            });
            
          const quotaResults = await Promise.all(quotaPromises);
          
          // 计算其他组已mint的总数
          for (const {groupId, quota} of quotaResults) {
            if (quota.gt(0)) {
              const groupMaxMint = await contract.maxMintPerWallet(groupId);
              const groupBalance = groupMaxMint.sub(quota);
              console.log(`Group ${groupId}: max=${groupMaxMint}, quota=${quota}, balance=${groupBalance}`);
              otherGroupsBalance += Number(groupBalance.toString());
            }
          }
          
          // 转换余额并计算
          const balanceNumber = Number(balance.toString());
          const publicMintCount = balanceNumber - otherGroupsBalance;
          
          console.log('Final calculation:', {
            balance: balanceNumber,
            otherGroupsBalance,
            publicMintCount,
            maxAllowed: max_mint_per_wallet.toString(),
            amount
          });
          
          if (publicMintCount + amount > max_mint_per_wallet) {
            toast.fail({
              title: `Sorry sire, you can only mint up to ${max_mint_per_wallet} NFTs in public sale.`,
            });
            return null;
          }
        }
      } else {
        // 其他组的 mint 逻辑
        if (!eligibilityResult) {
          toast.fail({
            title: "Sorry sire, the address is not allowlisted. Please ask the owner if you believe this is an error.",
          });
          return null;
        }

        const eligibleGroup = eligibilityResult.eligible_mint_groups.find(
          group => group.id === currentGroupId
        );

        if (!eligibleGroup) {
          toast.fail({
            title: "Sorry sire, you don't have access to this group.",
          });
          return null;
        }

        // 从合约获取实际的quota
        const currentQuota = await contract.mintQuotas(currentGroupId, account);
        
        if (currentQuota.eq(0)) {
          toast.fail({
            title: "Sorry sire, you don't have quota for this group.",
          });
          return null;
        }

        if (amount > Number(currentQuota.toString())) {
          toast.fail({
            title: `Sorry sire, you can only mint up to ${currentQuota.toString()} NFTs in this group.`,
          });
          return null;
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

  return { handleMint };
};
