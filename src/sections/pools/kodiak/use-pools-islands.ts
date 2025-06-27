import axios from "axios";
import { useEffect, useState } from "react";
import config from "@/configs/pools/kodiak";
import { tickToPrice } from "../tick-math";
import { balanceFormated } from "@/utils/balance";
import { useKodiakTokensStore } from "@/stores/kodiak-tokens";
import useAccount from "@/hooks/use-account";
import { useDebounceFn } from "ahooks";

export default function usePoolsIslands(props?: { withBaults?: boolean; setPageLoading?: (loading: boolean) => void }) {
  const { withBaults, setPageLoading } = props ?? {};

  const [pools, setPools] = useState<any>();
  const [loading, setLoading] = useState(true);
  const kodiakTokensStore: any = useKodiakTokensStore();
  const { account } = useAccount();

  const queryPools = async () => {
    setPageLoading?.(true);
    try {
      const vaultsUrl = new URL("https://staging.backend.kodiak.finance/vaults");
      vaultsUrl.searchParams.set("orderBy", "totalApr");
      vaultsUrl.searchParams.set("orderDirection", "desc");
      vaultsUrl.searchParams.set("limit", "100");
      vaultsUrl.searchParams.set("offset", "0");
      vaultsUrl.searchParams.set("chainId", "80094");
      vaultsUrl.searchParams.set("minimumTvl", "10000");
      vaultsUrl.searchParams.set("user", account);
      vaultsUrl.searchParams.set("withBaults", !!withBaults + "");
      const calls = [
        axios.get(vaultsUrl.toString())
      ];
      if (Object.values(kodiakTokensStore.tokens).length === 0) {
        calls.push(
          axios.get("https://api.panda.kodiak.finance/80094/tokenList.json")
        );
        calls.push(
          axios.get(
            "https://static.kodiak.finance/tokenLists/berachain_mainnet.json"
          )
        );
      }
      const [topPoolsResult, pandaResponse, normalResponse] = await Promise.all(
        calls
      );

      let tokens: any = kodiakTokensStore.tokens;
      if (pandaResponse && normalResponse) {
        const _tokens = [
          ...pandaResponse.data.tokens,
          ...normalResponse.data.tokens
        ].map((token: any) => ({
          ...token,
          icon: token.logoURI
        }));
        tokens = _tokens.reduce(
          (acc, curr) => ({ ...acc, [curr.address.toLowerCase()]: curr }),
          {}
        );
        kodiakTokensStore.set({
          tokens
        });
      }

      const getToken = (token: any) => {
        return token.id === "0x6969696969696969696969696969696969696969" &&
          tokens["native"]
          ? tokens["native"]
          : tokens[token.id.toLowerCase()] || { ...token, address: token.id };
      };

      setPools(
        topPoolsResult.data.data.map((item: any) => {
          const _token0 = getToken(item.token0);
          const _token1 = getToken(item.token1);

          if (item.farm?.rewardTokens.length > 0) {
            item.farm.rewardTokens.forEach((rewardToken: any) => {
              rewardToken.icon =
                rewardToken.symbol === "BGT"
                  ? "/images/icon-bgt.svg"
                  : getToken(rewardToken)?.icon ||
                    "/assets/tokens/default_icon.png";
            });
          }

          const lowerPrice =
            item.lowerTick < -887000
              ? "0"
              : balanceFormated(
                  tickToPrice({
                    tick: item.lowerTick,
                    token0: _token0,
                    token1: _token1
                  }),
                  2
                );
          const upperPrice =
            item.upperTick > 887000
              ? "∞"
              : balanceFormated(
                  tickToPrice({
                    tick: item.upperTick,
                    token0: _token0,
                    token1: _token1
                  }),
                  2
                );
          return {
            token0: {
              ..._token0,
              icon: _token0.icon || "/assets/tokens/default_icon.png"
            },
            token1: {
              ..._token1,
              icon: _token1.icon || "/assets/tokens/default_icon.png"
            },
            fee: item.feeTier,
            poolTvl: item.tvl,
            // version: item.pool.tick ? "v3" : "v2",
            type: item.provider === "kodiak" ? "island" : "v2",
            apr: item.totalApr,
            lowerPrice,
            upperPrice,
            id: item.id,
            farm: item.farm,
            balanceUSD: item.balanceUSD,
            pool: {
              lowerTick: item.lowerTick,
              upperTick: item.upperTick,
              tick: item.currentTick
            },
            router:
              item.provider === "kodiak"
                ? config.stakingRouter
                : config.contracts[80094].RouterV2,
            tokenLp: item.tokenLp,
            icon: "/assets/tokens/kodiak.png",
            baults: item.baults
          };
        })
      );
    } catch (err) {
      console.log(128, err);
    } finally {
      setLoading(false);
      setPageLoading?.(false);
    }
  };

  const { run: runQueryPools } = useDebounceFn(queryPools, {
    wait: 500
  });

  useEffect(() => {
    runQueryPools();
  }, [account, withBaults]);

  return { pools, loading };
}
