import { Contract } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import useAccount from '@/hooks/use-account';
import { multicall, multicallAddresses } from '@/utils/multicall';
import positionAbi from '../abi/position';
import { tickToPrice } from '../tick-math';
import { balanceFormated } from '@/utils/balance';
import weth from '@/configs/contract/weth';
import getPoolsInfo from '../query/getPoolsInfo';
import { DEFAULT_CHAIN_ID, TOKENS } from '@/configs';

export default function usePoolsV3({ dex }: any) {
  const { provider, account } = useAccount();
  const [ticksInfo, setTicksInfo] = useState({});
  const [pools, setPools] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const queryPools = useCallback(async () => {
    setLoading(true);
    setPools([]);
    try {
      const { PositionManager, FactoryV3 } = dex.contracts[DEFAULT_CHAIN_ID];
      const PositionContract = new Contract(
        PositionManager,
        positionAbi,
        provider
      );

      const balance = (await PositionContract.balanceOf(account)).toNumber();

      if (!balance) {
        setLoading(false);
        return;
      }

      const tokenIdCalls = new Array(balance).fill(1).map((num, i) => ({
        address: PositionManager,
        name: 'tokenOfOwnerByIndex',
        params: [account, i]
      }));

      const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];

      const tokenIds = await multicall({
        abi: positionAbi,
        calls: tokenIdCalls,
        options: {},
        multicallAddress,
        provider
      });

      const positionsCalls = tokenIds.map((tokenId: any) => ({
        address: PositionManager,
        name: 'positions',
        params: [tokenId[0].toString()]
      }));

      const positions = await multicall({
        abi: positionAbi,
        calls: positionsCalls,
        options: {},
        multicallAddress,
        provider
      });

      const _pools: any = [];
      const list: any = [];
      positions.forEach((position: any, i: number) => {
        const _weth = weth[DEFAULT_CHAIN_ID].toLowerCase();
        const _token0Address = position.token0.toLowerCase();
        const _token1Address = position.token1.toLowerCase();
        const token0 =
          TOKENS[_token0Address === _weth ? 'native' : _token0Address];
        const token1 =
          TOKENS[_token1Address === _weth ? 'native' : _token1Address];

        if (!token0 || !token1) return;
        let lowerPrice: string | number = '';
        let upperPrice: string | number = '';
        if (position.tickLower < -887000 && position.tickUpper > 887000) {
          lowerPrice = '0';
          upperPrice = '∞';
        } else {
          lowerPrice = balanceFormated(
            tickToPrice({
              tick: position.tickLower,
              token0,
              token1
            }),
            4
          );
          upperPrice = balanceFormated(
            tickToPrice({
              tick: position.tickUpper,
              token0,
              token1
            }),
            4
          );
        }

        const item = {
          tokenId: tokenIds[i].toString(),
          liquidity: position.liquidity,
          lowerPrice,
          upperPrice,
          tickLower: position.tickLower,
          tickUpper: position.tickUpper,
          token0: { ...token0, address: _token0Address },
          token1: { ...token1, address: _token1Address },
          fee: position.fee,
          id: tokenIds[i].toString()
        };
        list.push({
          token0: position.token0,
          token1: position.token1,
          fee: position.fee,
          tokenId: tokenIds[i].toString()
        });
        if (position.liquidity.gt(0)) {
          _pools.unshift(item);
        } else {
          _pools.push(item);
        }
      });

      getPoolsInfo({
        pools: list,
        factory: FactoryV3,
        provider,
        onSuccess(res: any) {
          setTicksInfo(res);
        }
      });

      setPools(_pools);
      setLoading(false);
    } catch (err) {
      console.log('Query Your Positions failure: %o', err);
      setLoading(false);
    }
  }, [provider, account]);

  useEffect(() => {
    if (provider && account) {
      queryPools();
    } else {
      setLoading(false);
    }
  }, [provider, account]);

  return { pools, loading, ticksInfo, queryPools };
}
