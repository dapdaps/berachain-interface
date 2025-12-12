import { useCallback, useEffect, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import { GACHA_CONTRACT_ADDRESS, GACHA_TABS } from "../config";
import gachaAbi from "../abi";
import { multicall, multicallAddresses } from "@/utils/multicall";
import { DEFAULT_CHAIN_ID } from "@/configs";
import Big from "big.js";
import { get } from "@/utils/http";

export default function useNftBalance() {
  const [nftBalance, setNftBalance] = useState<Record<string, string> | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { provider } = useCustomAccount();
  const [nftPrice, setNftPrice] = useState<any>({});

  const queryInventory = useCallback(async () => {
    if (!provider) {
      return;
    }

    try {
      setLoading(true);
      const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];

      const result = await multicall({
        abi: gachaAbi,
        options: {},
        calls: [
          {
            address: GACHA_CONTRACT_ADDRESS,
            name: "getTierRewards",
            params: [0]
          },
          {
            address: GACHA_CONTRACT_ADDRESS,
            name: "getTierRewards",
            params: [1]
          },
          {
            address: GACHA_CONTRACT_ADDRESS,
            name: "getTierRewards",
            params: [2]
          }
        ],
        multicallAddress,
        provider
      });

      const _balance: Record<string, string> = {};

      result.forEach((item: any) => {
        item.rewards.forEach((reward: any) => {
          if (reward.rewardType === 0) {
            return;
          }
          const remainingStock = reward.remainingStock.toString();
          const tokenAddress = reward.tokenAddress.toLowerCase();
          if (_balance[tokenAddress]) {
            _balance[tokenAddress] = Big(_balance[tokenAddress])
              .add(remainingStock)
              .toString();
          } else {
            _balance[tokenAddress] = remainingStock;
          }
        });
      });

      setNftBalance(_balance);
    } catch (err: any) {
      console.log("Query inventory failed: %o", err);
      setNftBalance(null);
    } finally {
      setLoading(false);
    }
  }, [provider]);

  // const getNftPrice = useCallback(async () => {
  //   try {
  //     const res = await get('/api/go/nft/floorPrice')
  //     if (res.code !== 200) {
  //       return null;
  //     }

  //     setNftPrice(res.data);
  //   } catch (error) {
  //     console.log("Get nft price failed: %o", error);
  //   }
  // }, []);

  useEffect(() => {
    if (provider) {
      queryInventory();
    }
  }, [provider]);

  // useEffect(() => {
  //   getNftPrice();
  // }, []);

  return {
    nftBalance,
    nftPrice,
    loading
  };
}
