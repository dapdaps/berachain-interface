import { Contract } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import useAccount from '@/hooks/use-account';
import { multicall, multicallAddresses } from '@/utils/multicall';
import factoryAbi from '../abi/factory-v3';
import poolAbi from '../abi/pool-v3';
import positionAbi from '../abi/position';
import { wrapNativeToken, sortTokens } from '../utils';
import { DEFAULT_CHAIN_ID } from '@/configs';
import { getTokenAmounts } from '../helpers';

export default function usePoolInfo({
  token0,
  token1,
  fee,
  tokenId,
  dex
}: any) {
  const [info, setInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { provider } = useAccount();
  const contracts = dex.contracts[DEFAULT_CHAIN_ID];

  const queryPool = useCallback(async () => {
    if (!contracts) return;
    setLoading(true);

    try {
      const { FactoryV3, PositionManager } = contracts;
      const FactoryContract = new Contract(FactoryV3, factoryAbi, provider);
      const poolAddress = await FactoryContract.getPool(
        wrapNativeToken(token0).address,
        wrapNativeToken(token1).address,
        fee
      );
      const PositionContract = new Contract(
        PositionManager,
        positionAbi,
        provider
      );
      let position: any = {};

      if (tokenId) {
        position = await PositionContract.positions(tokenId);
      }

      if (
        !poolAddress ||
        poolAddress === '0x0000000000000000000000000000000000000000'
      ) {
        setInfo(null);
        setLoading(false);
        return;
      }

      const calls = [
        {
          address: poolAddress,
          name: 'slot0'
        },
        { address: poolAddress, name: 'tickSpacing' },
        {
          address: poolAddress,
          name: 'liquidity'
        }
      ];

      const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];

      const [_token0, _token1] = sortTokens(token0, token1);

      const [slot0, tickSpacing, liquidity] = await multicall({
        abi: poolAbi,
        calls: calls,
        options: {},
        multicallAddress,
        provider
      });

      const [amount0, amount1] = getTokenAmounts({
        liquidity: position.liquidity ? position.liquidity.toString() : '0',
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        currentTick: slot0.tick,
        token0: _token0,
        token1: _token1
      });

      setInfo({
        currentTick: slot0.tick,
        tickSpacing: tickSpacing[0],
        sqrtPriceX96: slot0.sqrtPriceX96.toString(),
        poolAddress,
        liquidity: position.liquidity ? position.liquidity.toString() : '0',
        positionManager: PositionManager,
        amount0,
        amount1,
        token0: _token0,
        token1: _token1,
        tokenId
      });

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setInfo(null);
    }
  }, [token0, token1, fee, provider]);

  useEffect(() => {
    if (!token0 || !token1 || !provider) return;

    if (fee) queryPool();
  }, [token0, token1, fee, provider]);

  return { info, loading };
}
