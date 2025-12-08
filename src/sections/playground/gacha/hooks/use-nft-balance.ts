import { useCallback, useEffect, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import { GACHA_CONTRACT_ADDRESS, GACHA_TABS } from "../config";
import gachaAbi from "../abi";
import { multicall, multicallAddresses } from "@/utils/multicall";
import { DEFAULT_CHAIN_ID } from "@/configs";
import Big from "big.js";

export default function useNftBalance() {
  const [nftBalance, setNftBalance] = useState<Record<string, string> | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { provider } = useCustomAccount();

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
          if (_balance[reward.tokenAddress]) {
            _balance[reward.tokenAddress] = Big(_balance[reward.tokenAddress])
              .add(remainingStock)
              .toString();
          } else {
            _balance[reward.tokenAddress] = remainingStock;
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

  useEffect(() => {
    if (provider) {
      queryInventory();
    }
  }, [provider]);

  return {
    nftBalance,
    loading
  };
}
