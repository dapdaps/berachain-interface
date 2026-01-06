import { GACHA_CONTRACT_ADDRESS } from "../config";
import gachaAbi from "../abi";
import { multicall, multicallAddresses } from "@/utils/multicall";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { RPC_LIST } from "@/configs/rpc";
import Big from "big.js";
import { useRequest } from "ahooks";
import { useEffect, useState, useMemo } from "react";
import { providers } from "ethers";
import { get } from "@/utils/http";

async function getNftRarityRank(address: string, tokenIds: string[]): Promise<Record<string, number>> {
  try {
    const ids = tokenIds.join(',');
    const result = await get('/api/go/nft/assets', {
      address,
      ids
    });
    
    if (result.code === 200 && result.data) {
      const rankMap: Record<string, any> = {};
      result.data.forEach((item: { address: string; tokenId: string; rarityRank: number }) => {
        if (rankMap[item.address.toLowerCase()]) {
          rankMap[item.address.toLowerCase()][item.tokenId] = item.rarityRank;
        } else {
          rankMap[item.address.toLowerCase()] = {
            [item.tokenId]: item.rarityRank
          };
        }
      });
      return rankMap;
    }
    
    return {};
  } catch (error) {
    console.error('Failed to fetch NFT rarity rank:', error);
    return {};
  }
}

export default function useConfig() {
  const provider = useMemo(() => {
    return new providers.JsonRpcProvider(RPC_LIST.default.url, {
      chainId: DEFAULT_CHAIN_ID,
      name: "Berachain Mainnet",
    });
  }, []);
  const [tokenIdMap, setTokenIdMap] = useState<Record<string, string[]>>({});
  const [rarityRankMap, setRarityRankMap] = useState<Record<string, any>>({});

  const { runAsync: getConfig, data: config } = useRequest(
    async () => {
      try {
        const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];

        const result = await multicall({
          abi: gachaAbi,
          options: {},
          calls: [
            {
              address: GACHA_CONTRACT_ADDRESS,
              name: "getTierConfig",
              params: [0]
            },
            {
              address: GACHA_CONTRACT_ADDRESS,
              name: "getTierConfig",
              params: [1]
            },
            {
              address: GACHA_CONTRACT_ADDRESS,
              name: "getTierConfig",
              params: [2]
            }
          ],
          multicallAddress,
          provider
        });

        return result.map((item: any) => item.config);
      } catch (err: any) {}
    },
    {
      manual: false
    }
  );
  
  useEffect(() => {
    if (config) {
      const newTokenIdMap: Record<string, string[]> = {};
      config.forEach((item: any) => {
        item.rewards.forEach((reward: any) => {
          if (reward.rewardType === 0) {
            return;
          }
          const tokenAddress = reward.tokenAddress.toLowerCase();
          reward.nftTokenIds.forEach((id: number) => {
            if (newTokenIdMap[tokenAddress]) {
              newTokenIdMap[tokenAddress].push(id.toString());
            } else {
              newTokenIdMap[tokenAddress] = [id.toString()];
            }
          });
        });
      });
      setTokenIdMap(newTokenIdMap);
    }
  }, [config]);

  useEffect(() => {
    if (Object.keys(tokenIdMap).length > 0) {
      const fetchRarityRanks = async () => {
        const allRankMaps: Record<string, number> = {};
        
        for (const [address, tokenIds] of Object.entries(tokenIdMap)) {
          if (tokenIds.length > 0) {
            const rankMap = await getNftRarityRank(address.toLowerCase(), tokenIds);
            Object.assign(allRankMaps, rankMap);
          }
        }
        
        setRarityRankMap(allRankMaps);
      };
      
      fetchRarityRanks();
    }
  }, [tokenIdMap]);


  return {
    config,
    tokenIdMap,
    rarityRankMap,
  };
}
