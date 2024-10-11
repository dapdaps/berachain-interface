'use client';

import { memo, useMemo, useState } from 'react';
import Tokens from '../components/tokens';
import RemovePercent from '../components/remove-percent';
import RemoveButton from '../components/button/remove-button';
import RemoveAmount from '../components/remove-amount';
import useRemove from './use-remove';
import usePoolV2Detail from './use-detail-v2';
import usePoolInfo from './use-pool-info';

const Remove = ({ token0, token1, onSuccess }: any) => {
  const [percent, setPercent] = useState(0);
  const { info, loading: infoLoading } = usePoolInfo({ token0, token1 });
  const { detail, loading, queryDetail } = usePoolV2Detail(info);
  const { amount0, amount1, liquidity } = detail;

  const { loading: removing, onRemove } = useRemove({
    detail,
    info,
    percent,
    amount0,
    amount1,
    onSuccess: () => {
      onSuccess();
    }
  });

  const lpToken = useMemo(
    () =>
      info
        ? {
            address: info.lpAddress,
            decimals: 18,
            symbol: `${token0.symbol}-${token1.symbol}`
          }
        : null,
    [info]
  );

  const errorTips = useMemo(() => {
    if (!percent) return 'Select a percent';
    return '';
  }, [percent]);

  return infoLoading || loading ? (
    <div className='flex h-[100px] items-center justify-center'>Loading...</div>
  ) : (
    <>
      <Tokens type='V2' liquidity={liquidity} token0={token0} token1={token1} />
      <RemovePercent percent={percent} setPercent={setPercent} />
      <RemoveAmount
        type='V2'
        amount0={amount0}
        amount1={amount1}
        token0={token0}
        token1={token1}
        percent={percent}
      />
      {lpToken && (
        <RemoveButton
          text='Remove Liquidity'
          loading={removing}
          onClick={onRemove}
          errorTips={errorTips}
        />
      )}
    </>
  );
};

export default memo(Remove);
