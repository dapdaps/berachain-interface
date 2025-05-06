import axios from "axios";
import { useEffect, useState } from "react";
import Big from "big.js";

export default function usePoolsApr(pools: any) {
  const [loading, setLoading] = useState(false);
  const [poolsWithApr, setPoolsWithApr] = useState<any>([]);

  const onQueryApr = async () => {
    setLoading(true);
    const _apr: any = {};
    const _pools: any = pools.reduce((acc: any, curr: any) => {
      acc[curr.address] = curr;
      try {
        const _a = Big(curr.snapshots[0].swapFees)
          .minus(curr.snapshots[1].swapFees)
          .div(curr.snapshots[0].liquidity)
          .mul(365 * 100)
          .toString();

        _apr[curr.address] = _a;
      } catch (err) {}

      return acc;
    }, {});

    try {
      const bgtApr = await axios.post("https://api.berachain.com/", {
        query:
          "query GetRewardVaults($chainIn: [GqlChain!]!, $addressIn: [String!]!) {\n  rewardVaults: polGetRewardVaults(\n    where: {chainIn: $chainIn, stakingTokensIn: $addressIn}\n    first: 1000\n  ) {\n    vaults {\n      isVaultWhitelisted\n      stakingTokenAddress\n      vaultAddress\n      dynamicData {\n        apr\n      }\n    }\n  }\n}\n",
        variables: {
          chainIn: ["BERACHAIN"],
          addressIn: [
            "0xd10e65a5f8ca6f835f2b1832e37cf150fb955f23",
            "0x567f32e86be3e3963cdbc1887b5043b701f113d9",
            "0xe416c064946112c1626d6700d1081a750b1b1dd7",
            "0xd170e25f6bcb5ace2108628c647be47d59900ade",
            "0x7ce7cb1893cfbd680cbfb9dd2a9ae6a62bde66a8",
            "0x935553cd13b5e0fc4c17bbd105b15b5e62a2eb71",
            "0xac8a437d1e6905e419431662aead90fb04ac3008"
          ]
        },
        operationName: "GetRewardVaults"
      });

      bgtApr.data.data.rewardVaults.vaults.forEach((vault: any) => {
        if (_apr[vault.stakingTokenAddress]) {
          _apr[vault.stakingTokenAddress] = Big(_apr[vault.stakingTokenAddress])
            .add(Big(vault.dynamicData.apr).mul(100))
            .toString();
        } else {
          _apr[vault.stakingTokenAddress] = Big(vault.dynamicData.apr)
            .mul(100)
            .toString();
        }

        // console.log(vault.dynamicData.apr, _apr[vault.stakingTokenAddress]);
      });
    } catch (error) {}

    // wbera & plug
    try {
      const wberaApr = await axios.post(
        "https://api.goldsky.com/api/public/project_cluukfpdrw61a01xag6yihcuy/subgraphs/burr-rewards-subgraph/0.0.7/gn",
        {
          query:
            '\n    {\n      rewardDatas(where: { isActive: true }) {\n        rewardsContract\n        rewardTokenPerSecond\n        totalAllocPoint\n        rewardToken {\n          address\n          symbol\n          decimals\n        }\n        lps {\n          allocPoint\n          poolId\n          totalStaked\n          token {\n            address\n          }\n        }\n      }\n      users(where: { userAddress: "" }) {\n        rewardContracts {\n          rewardContract\n          userInfo {\n            poolId\n            stakedAmount\n            claimedRewards\n          }\n        }\n      }\n    }\n  '
        }
      );
      wberaApr.data.data.rewardDatas.forEach((reward: any) => {
        reward.lps.forEach((lp: any) => {
          if (lp.allocPoint === "0") return;
          const pool = _pools[lp.token.address];
          if (!pool) return;
          const poolPrice = Big(pool.tvl).div(pool.totalShares);

          const totalRewardsTokens = Big(reward.rewardTokenPerSecond)
            .div(1e18)
            .mul(31536000)
            .mul(lp.allocPoint)
            .div(reward.totalAllocPoint);
          const totalStakeTokens = Big(lp.totalStaked).div(1e18);
          const apr = totalRewardsTokens.div(totalStakeTokens).mul(100);
          if (_apr[pool.address]) {
            _apr[pool.address] = Big(_apr[pool.address]).add(apr).toString();
          } else {
            _apr[pool.address] = apr.toString();
          }
          // console.log(pool.symbol, apr.toString());
        });
      });
    } catch (error) {
      console.log(error);
    }

    setPoolsWithApr(
      pools.map((pool: any) => ({
        ...pool,
        aprLoading: false,
        apr: _apr[pool.address]
      }))
    );
  };

  useEffect(() => {
    if (pools?.length) {
      onQueryApr();
    } else {
      setPoolsWithApr(
        pools.map((pool: any) => ({ ...pool, aprLoading: false }))
      );
    }
  }, [pools]);

  return { loading, poolsWithApr };
}
