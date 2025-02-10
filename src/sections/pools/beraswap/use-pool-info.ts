import { useCallback, useEffect, useState } from "react";
import Big from "big.js";
import axios from "axios";
import { Contract } from "ethers";
import { beraB } from "@/configs/tokens/bera-bArtio";
import beraswap from "@/configs/pools/beraswap";
import { DEFAULT_CHAIN_ID } from "@/configs";
import poolAbi from "../abi/balancer-pool";
import valutAbi from "../abi/balancer-valut";
import useCustomAccount from "@/hooks/use-account";

const TOKENS: Record<string, any> = Object.values(beraB).reduce(
  (acc, curr) => ({ ...acc, [curr.address.toLowerCase()]: curr }),
  {}
);

export default function usePoolInfo(poolIdx: string) {
  const [info, setInfo] = useState<any>();
  const [userInfo, setUserInfo] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const contracts = beraswap.contracts[DEFAULT_CHAIN_ID];

  const queryPool = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post("", {
        query:
          "query Pools($skip: Int, $first: Int, $orderBy: Pool_orderBy, $orderDirection: OrderDirection, $where: Pool_filter, $block: Block_height) {\n  pools(\n    skip: $skip\n    first: $first\n    orderBy: $orderBy\n    orderDirection: $orderDirection\n    where: $where\n    block: $block\n  ) {\n    ...SubgraphPool\n  }\n}\n\nfragment SubgraphPool on Pool {\n  id\n  address\n  poolType\n  poolTypeVersion\n  factory\n  strategyType\n  symbol\n  name\n  swapEnabled\n  swapFee\n  protocolYieldFeeCache\n  protocolSwapFeeCache\n  owner\n  totalWeight\n  totalSwapVolume\n  totalSwapFee\n  totalLiquidity\n  totalShares\n  tokens(first: 100, orderBy: index) {\n    ...SubgraphPoolToken\n  }\n  swapsCount\n  holdersCount\n  tokensList\n  amp\n  priceRateProviders(first: 100) {\n    ...SubgraphPriceRateProvider\n  }\n  expiryTime\n  unitSeconds\n  createTime\n  principalToken\n  baseToken\n  wrappedIndex\n  mainIndex\n  lowerTarget\n  upperTarget\n  sqrtAlpha\n  sqrtBeta\n  root3Alpha\n  isInRecoveryMode\n  isPaused\n  alpha\n  beta\n  c\n  s\n  lambda\n  tauAlphaX\n  tauAlphaY\n  tauBetaX\n  tauBetaY\n  u\n  v\n  w\n  z\n  dSq\n  delta\n  epsilon\n  quoteToken\n}\n\nfragment SubgraphPoolToken on PoolToken {\n  id\n  symbol\n  name\n  decimals\n  address\n  balance\n  managedBalance\n  weight\n  priceRate\n  isExemptFromYieldProtocolFee\n  token {\n    ...TokenTree\n  }\n}\n\nfragment TokenTree on Token {\n  latestUSDPrice\n  latestFXPrice\n  pool {\n    ...SubgraphSubPool\n    tokens(first: 100, orderBy: index) {\n      ...SubgraphSubPoolToken\n      token {\n        latestUSDPrice\n        pool {\n          ...SubgraphSubPool\n          tokens(first: 100, orderBy: index) {\n            ...SubgraphSubPoolToken\n            token {\n              latestUSDPrice\n              pool {\n                ...SubgraphSubPool\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment SubgraphSubPool on Pool {\n  id\n  totalShares\n  address\n  poolType\n  mainIndex\n}\n\nfragment SubgraphSubPoolToken on PoolToken {\n  address\n  balance\n  weight\n  priceRate\n  symbol\n  decimals\n  isExemptFromYieldProtocolFee\n}\n\nfragment SubgraphPriceRateProvider on PriceRateProvider {\n  address\n  token {\n    address\n  }\n}\n",
        variables: {
          first: 999,
          orderBy: "totalLiquidity",
          orderDirection: "desc",
          where: {
            id_not_in: [
              "0x4dff2ceaf65cac188a8d481f34f3be9cd3d54d6c000000000000000000000007",
              "0x143ab24a1562bfec7a0695dde552e1ee5daace1b000200000000000000000001",
              "0xdda245377ce251114929beefcc8bbb6793e22cbd000000000000000000000003",
              "0xecaa8ee11396d52421a1388d229dffb85bf4c3f2000200000000000000000002",
              "0xd6671d907b7f791de7d9f89fba1a04d55d669a8300000000000000000000000c"
            ],
            id_in: [poolIdx],
            tokensList_contains: [],
            poolType_in: [
              "Weighted",
              "ComposableStable",
              "FX",
              "AaveLinear",
              "Linear",
              "EulerLinear",
              "ERC4626Linear",
              "BeefyLinear",
              "GearboxLinear",
              "MidasLinear",
              "ReaperLinear",
              "SiloLinear",
              "TetuLinear",
              "YearnLinear"
            ],
            totalLiquidity_gt: -1
          },
          chainId: DEFAULT_CHAIN_ID
        },
        operationName: "Pools"
      });
      const _info = response.data.data.pools[0];
      _info.tokens = _info.tokens
        .filter((token: any) => token.symbol !== _info.symbol)
        .map((token: any) => {
          return {
            ...token,
            icon: TOKENS[token.address].icon
          };
        });
      setInfo(_info);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setInfo(null);
    }
  }, [poolIdx]);

  const queryAccountInfo = useCallback(async () => {
    try {
      const response = await axios.post(beraswap.graph, {
        query: `"query PoolShares{\n  poolShares(first: 1000,where: {balance_gt: 0.000001,poolId_in: [\"${poolIdx}\"], userAddress:\"${account?.toLowerCase()}\"}){\n     poolId { id,address } \n     balance \n  }\n}"`
      });
      const item = response.data.data.poolShares[0];
      const valutContract = new Contract(contracts.Vault, valutAbi, provider);
      const poolContract = new Contract(item.poolId.address, poolAbi, provider);
      const actualSupply = await poolContract.getActualSupply();
      const [assets, balances] = await valutContract.getPoolTokens(poolIdx);

      const amounts: any = {};
      const _l = Big(item.balance).mul(1e18);
      const _s = _l.div(actualSupply);

      balances.for((balance: any, i: number) => {
        amounts[assets[i]] = _s.mul(balance);
      });

      setUserInfo({
        liquidity: item.balance,
        amounts
      });
    } catch (err) {
      setUserInfo(null);
    }
  }, [poolIdx, account]);

  useEffect(() => {
    if (!poolIdx) return;
    queryPool();
  }, [poolIdx]);

  useEffect(() => {
    if (account) queryAccountInfo();
  }, [poolIdx, account]);

  return { info, userInfo, loading, queryPool };
}
