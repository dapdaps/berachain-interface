import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import bex from '@/configs/pools/bex';
import { DEFAULT_CHAIN_ID } from '@/configs';
import { wrapNativeToken, sortTokens } from '../utils';

export default function usePoolInfo({ token0, token1 }: any) {
  const [info, setInfo] = useState<any>();
  const [loading, setLoading] = useState(false);

  const queryPool = useCallback(async () => {
    setLoading(true);

    try {
      const [_token0, _token1] = sortTokens(
        wrapNativeToken(token0),
        wrapNativeToken(token1)
      );
      const pools = await axios.post(bex.graph[DEFAULT_CHAIN_ID], {
        query: `{\npools(\nwhere: {\nbase: \"${_token0.address}\"\nquote: \"${_token1.address}\"\n}\n) {\nid\nbase\nquote\npoolIdx\nbaseAmount\nquoteAmount\nshareAddress{\n  address\n}\n}\n}`
      });
      const pool = pools.data.data.pools[0];
      if (!pool) throw Error('No Pool');
      setInfo({
        isReverse:
          token0.address !== _token0.address &&
          token1.address !== _token1.address,
        poolIdx: pool.poolIdx,
        token0: _token0,
        token1: _token1,
        reserve0: pool.baseAmount,
        reserve1: pool.quoteAmount,
        lpAddress: pool.shareAddress.address,
        routerAddress: bex.contracts[DEFAULT_CHAIN_ID].CrocSwapDex
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setInfo(null);
    }
  }, [token0, token1]);

  useEffect(() => {
    if (!token0 || !token1) return;
    queryPool();
  }, [token0, token1]);

  return { info, loading, queryPool };
}
