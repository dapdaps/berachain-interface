import { useEffect, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import usePoolsIslands from "../../use-pools-islands";
import islandAbi from "../abi/island";
import farmAbi from "../abi/farm";
import { multicall, multicallAddresses } from "@/utils/multicall";
import { DEFAULT_CHAIN_ID } from "@/configs";
import Big from "big.js";
import { getTokenAmountsV2 } from "@/sections/pools/helpers";

const rewardToken = {
  icon: "/assets/tokens/kodiak.png",
  symbol: "KDK"
};

export default function useUserList() {
  const [loading, setLoading] = useState(true);
  const { account, provider } = useCustomAccount();
  const [list, setList] = useState<any>([]);
  const { pools, loading: poolLoading } = usePoolsIslands();

  const queryList = async () => {
    try {
      setList([]);
      setLoading(true);
      const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];
      const balanceCalls: any = [];
      const reversesCalls: any = [];
      const totalSupplyCalls: any = [];
      const stakedCalls: any = [];
      const earnedCalls: any = [];
      pools.forEach((pool: any) => {
        balanceCalls.push({
          address: pool.id,
          name: "balanceOf",
          params: [account]
        });
        reversesCalls.push({
          address: pool.id,
          name: "getUnderlyingBalances"
        });
        totalSupplyCalls.push({
          address: pool.id,
          name: "totalSupply"
        });
        if (pool.farmAddress) {
          stakedCalls.push({
            address: pool.farmAddress,
            name: "lockedStakesOf",
            params: [account]
          });
          earnedCalls.push({
            address: pool.farmAddress,
            name: "earned",
            params: [account]
          });
        }
      });
      const args = {
        abi: islandAbi,
        options: {},
        multicallAddress,
        provider
      };

      const [balanceRes, reversesRes, totalSupplyRes, stakedRes, earnedRes] =
        await Promise.all([
          multicall({
            ...args,
            calls: balanceCalls
          }),
          multicall({
            ...args,
            calls: reversesCalls
          }),
          multicall({
            ...args,
            calls: totalSupplyCalls
          }),
          multicall({
            ...args,
            abi: farmAbi,
            calls: stakedCalls
          }),
          multicall({
            ...args,
            abi: farmAbi,
            calls: earnedCalls
          })
        ]);

      let stakedI = 0;

      const _list: any = [];
      pools.forEach((pool: any, i: number) => {
        const _balance = balanceRes[i] ? balanceRes[i].toString() : 0;

        let total = Big(_balance);
        let locked = Big(0);
        let earned = "0";
        const reserve0 = reversesRes[i] ? reversesRes[i][0].toString() : 0;
        const reserve1 = reversesRes[i] ? reversesRes[i][1].toString() : 0;

        if (pool.farmAddress) {
          const staked = stakedRes[stakedI][0];
          if (staked && staked.length) {
            let totalAmount = Big(0);

            staked.forEach((item: any) => {
              totalAmount = totalAmount.add(item.liquidity.toString());
              const unlocked = Big(item.ending_timestamp.toString()).lt(
                Date.now() / 1000
              );
              if (!unlocked) locked = locked.add(item.liquidity.toString());
            });
            total = total.add(totalAmount);
          }

          earned = earnedRes[stakedI][0][0].toString();
          stakedI++;
        }

        if (total.eq(0)) return;

        const { amount0, amount1 } = getTokenAmountsV2({
          liquidity: total.toString(),
          totalSupply: totalSupplyRes[i].toString(),
          reserve0,
          reserve1,
          token0: pool.token0,
          token1: pool.token1
        });

        _list.push({
          pool,
          rewardToken,
          user: {
            total: Big(total.toString()).div(1e18).toString(),
            amount0,
            amount1,
            balance: Big(_balance).div(1e18).toString(),
            locked: Big(locked.toString()).div(1e18).toString(),
            earned: Big(earned).div(1e18).toString()
          }
        });
      });
      setList(_list);
    } catch (err) {
      console.log(149, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account && pools?.length) {
      queryList();
    } else {
      setLoading(false);
    }
  }, [account, pools]);

  return { list, loading: loading || poolLoading };
}
