import { useEffect, useMemo, useState } from 'react';
import { sortTokens } from '../utils';
import usePoolInfo from './use-pool-info';
import bex from '@/configs/pools/bex';
import { DEFAULT_CHAIN_ID } from '@/configs';

export default function useData({ defaultToken0, defaultToken1 }: any) {
  const [token0, setToken0] = useState<any>(defaultToken0);
  const [token1, setToken1] = useState<any>(defaultToken1);
  const [value0, setValue0] = useState<any>();
  const [value1, setValue1] = useState<any>();
  const [fee, setFee] = useState<any>(0.3);
  const [noPair, setNoPair] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    info,
    loading: infoLoading,
    queryPool
  } = usePoolInfo({ token0, token1, fee });

  const onCleanAll = () => {
    setToken0(null);
    setToken1(null);
    setFee('');
    setValue0('');
    setValue1('');
    setNoPair(false);
  };

  const onSelectToken = (token: any, type: number) => {
    if (type === 0) {
      setToken0(token);
      if (token.address === token1?.address) {
        setToken1(null);
      }
    } else {
      setToken1(token);
      if (token.address === token0?.address) {
        setToken0(null);
      }
    }
  };

  const onSelectFee = (fee: number) => {
    setFee(fee);
  };

  const onExchangeTokens = () => {
    const [_token1, _token0] = [token0, token1];
    setToken0(_token0);
    setToken1(_token1);
  };

  const reverse = useMemo(() => {
    if (!token0 || !token1) return false;
    const [_token0] = sortTokens(token0, token1);

    return _token0.address === token1.address;
  }, [token0, token1]);

  useEffect(() => {
    if (infoLoading) {
      setLoading(true);
      return;
    }
    setNoPair(!info);
    setLoading(false);
  }, [info, infoLoading]);

  return {
    token0,
    token1,
    value0,
    value1,
    fee,
    noPair,
    loading,
    info,
    reverse,
    routerAddress: bex.contracts[DEFAULT_CHAIN_ID].CrocSwapDex,
    onCleanAll,
    onSelectToken,
    onSelectFee,
    onExchangeTokens,
    setValue0,
    setValue1,
    setToken0,
    setToken1,
    setNoPair,
    queryPool
  };
}
