import Big from "big.js";
import { Contract } from "ethers";
import { useEffect, useState } from "react";
import useAccount from "@/hooks/use-account";
import { multicall, multicallAddresses } from "@/utils/multicall";
import factoryAbi from "../abi/factory-v2";
import poolAbi from "../abi/pool-v2";
import { wrapNativeToken, sortTokens } from "../utils";
import { getTokenAmountsV2 } from "../helpers";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function usePoolInfoV2({ token0, token1, dex }: any) {
  const [info, setInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { provider, account } = useAccount();
  const contracts = dex.contracts[DEFAULT_CHAIN_ID];

  const queryPool = async () => {
    if (!contracts) return;
    setLoading(true);

    try {
      const factoryAddress = contracts.FactoryV2;

      const FactoryContract = new Contract(
        factoryAddress,
        factoryAbi,
        provider
      );

      const poolAddress = await FactoryContract.getPair(
        wrapNativeToken(token0).address,
        wrapNativeToken(token1).address
      );

      if (
        !poolAddress ||
        poolAddress === "0x0000000000000000000000000000000000000000"
      ) {
        setInfo(null);
        setLoading(false);
        return;
      }

      const calls = [
        {
          address: poolAddress,
          name: "balanceOf",
          params: [account]
        },
        {
          address: poolAddress,
          name: "totalSupply"
        },
        {
          address: poolAddress,
          name: "getReserves"
        }
      ];

      const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];

      const [liquidity, totalSupply, reserves] = await multicall({
        abi: poolAbi,
        calls: calls,
        options: {},
        multicallAddress,
        provider
      });

      const { amount0, amount1 } = getTokenAmountsV2({
        liquidity: liquidity ? liquidity[0].toString() : "0",
        totalSupply: totalSupply?.[0].toString() || "0",
        reserve0: reserves[0],
        reserve1: reserves[1],
        token0,
        token1
      });

      setInfo({
        reserve0: reserves
          ? Big(reserves[0] || 0).eq(0)
            ? 0
            : reserves[0]
          : 0,
        reserve1: reserves
          ? Big(reserves[1] || 0).eq(0)
            ? 0
            : reserves[1]
          : 0,
        routerAddress: contracts.RouterV2,
        poolAddress,
        amount0,
        amount1,
        liquidity: liquidity ? liquidity[0].toString() : "0"
      });

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setInfo({});
    }
  };

  useEffect(() => {
    if (!token0 || !token1 || !provider) return;
    queryPool();
  }, [token0, token1, provider, account]);

  return { info, loading, queryPool };
}
