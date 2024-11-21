import { useCallback, useEffect, useState } from 'react';
import useAccount from '@/hooks/use-account';
import { multicall, multicallAddresses } from '@/utils/multicall';
import poolV2 from '../abi/pool-v2';
import { getTokenAmountsV2 } from '../helpers';
import { DEFAULT_CHAIN_ID } from '@/configs';
import Big from 'big.js';

export default function usePoolV2Detail(info: any) {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any>({});
  const { provider, account } = useAccount();

  const queryDetail = useCallback(async () => {
    if (!info?.lpAddress || !account || !provider) return;
    setLoading(true);

    try {
      const calls = [
        {
          address: info.lpAddress,
          name: 'balanceOf',
          params: [account]
        },
        {
          address: info.lpAddress,
          name: 'totalSupply'
        }
      ];
      const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];

      const result = await multicall({
        abi: poolV2,
        options: {},
        calls,
        multicallAddress,
        provider
      });

      const { amount0, amount1 } = getTokenAmountsV2({
        liquidity: result?.[0]?.[0]?.toString?.() || '0',
        totalSupply: result?.[1]?.[0]?.toString?.() || '0',
        reserve0: Big(info.reserve0)
          .mul(10 ** info.token0.decimals)
          .toString(),
        reserve1: Big(info.reserve1)
          .mul(10 ** info.token1.decimals)
          .toString()
      });

      setDetail({
        amount0,
        amount1,
        chainId: DEFAULT_CHAIN_ID,
        liquidity: result?.[0]?.[0]?.toString?.() || '0'
      });
      setLoading(false);
    } catch (err) {
      console.log('err', err);
      setLoading(false);
      setDetail({});
    }
  }, [info, account, provider]);

  useEffect(() => {
    queryDetail();
  }, [info, account, provider]);

  return { detail, loading, queryDetail };
}
