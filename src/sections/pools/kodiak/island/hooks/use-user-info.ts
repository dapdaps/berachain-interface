import { Contract } from "ethers";
import { useEffect, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import islandAbi from "../abi/island";
import farmAbi from "../abi/farm";
import { getTokenAmountsV2 } from "../../../helpers";
import Big from "big.js";

const rewardToken = {
  icon: "/assets/tokens/kodiak.png",
  symbol: "KDK"
};

export default function useUserInfo({
  islandContract,
  farmContract,
  price
}: any) {
  const [info, setInfo] = useState<any>({
    rewardToken
  });
  const [loading, setLoading] = useState(true);
  const { account, provider } = useCustomAccount();

  const queryInfo = async () => {
    try {
      setLoading(true);
      const IslandContract = new Contract(islandContract, islandAbi, provider);
      const balanceRes = await IslandContract.balanceOf(account);
      const reverses = await IslandContract.getUnderlyingBalances();
      const totalSupply = await IslandContract.totalSupply();

      const balance = Big(balanceRes.toString() || 0)
        .div(1e18)
        .toString();
      const balanceUsd = Big(balance || 0)
        .mul(price || 0)
        .toString();

      const FarmContract = new Contract(farmContract, farmAbi, provider);
      const stakedRes = await FarmContract.lockedStakesOf(account);
      const earnedRes = await FarmContract.earned(account);
      let locked = null;
      let total = Big(balanceRes.toString());
      if (stakedRes && stakedRes.length) {
        let totalAmount = Big(0);
        const items: any = [];

        stakedRes.forEach((item: any) => {
          totalAmount = totalAmount.add(item.liquidity.toString());
          const unlocked = Big(item.ending_timestamp.toString()).lt(
            Date.now() / 1000
          );
          const { amount0, amount1 } = getTokenAmountsV2({
            liquidity: item.liquidity.toString(),
            totalSupply: totalSupply.toString(),
            reserve0: reverses[0].toString(),
            reserve1: reverses[1].toString()
          });
          items.push({
            multiplier: Big(item.lock_multiplier.toString())
              .div(1e18)
              .toFixed(2),
            ending_timestamp: item.ending_timestamp.toString(),
            start_timestamp: item.start_timestamp.toString(),
            kek_id: item.kek_id,
            unlocked,
            liquidity: item.liquidity.toString(),
            amount0,
            amount1
          });
        });
        total = total.add(totalAmount);
        const amount = totalAmount.div(1e18).toString();
        locked = {
          amount,
          amountUsd: Big(amount || 0)
            .mul(price || 0)
            .toString(),
          items
        };
      }
      const { amount0, amount1 } = getTokenAmountsV2({
        liquidity: total.toString(),
        totalSupply: totalSupply.toString(),
        reserve0: reverses[0].toString(),
        reserve1: reverses[1].toString()
      });

      const { amount0: withdrawAmount0, amount1: withdrawAmount1 } =
        getTokenAmountsV2({
          liquidity: balanceRes.toString(),
          totalSupply: totalSupply.toString(),
          reserve0: reverses[0].toString(),
          reserve1: reverses[1].toString()
        });

      setInfo({
        token0Amount: amount0,
        token1Amount: amount1,
        total: total.toString(),
        balanceUsd,
        balance,
        rewardToken,
        locked,
        earned: Big(earnedRes?.[0] || 0)
          .div(1e18)
          .toString(),
        withdraw: {
          amount0: withdrawAmount0,
          amount1: withdrawAmount1
        }
      });
    } catch (err) {
      console.log(err);
      setInfo({
        rewardToken
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      queryInfo();
    } else {
      setLoading(false);
    }
  }, [account]);

  return { info, loading, queryInfo };
}