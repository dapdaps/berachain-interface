import Big from 'big.js';
import { memo, useMemo, useState } from 'react';
import Tokens from '../../components/tokens';
import RemovePercent from '../../components/remove-percent';
import RemoveButton from '../../components/button/remove-button';
import RemoveAmount from '../../components/remove-amount';
import useRemove from '../../hooks/use-remove-v2';
import usePoolV2Detail from '../../hooks/use-detail-v2';
import kodiak from '@/configs/pools/kodiak';

const Remove = ({ token0, token1, onSuccess }: any) => {
  const { info = {}, loading: infoLoading } = usePoolV2Detail({
    token0,
    token1,
    dex: kodiak
  });
  const { amount0, amount1, liquidity, poolAddress, routerAddress } = info;
  const [percent, setPercent] = useState(0);

  const { loading, onRemove } = useRemove({
    detail: info,
    percent,
    amount0,
    amount1,
    token0,
    token1,
    dex: kodiak,
    routerAddress,
    onSuccess: () => {
      onSuccess(percent);
    }
  });

  const value = useMemo(() => {
    if (Big(liquidity || 0).eq(0)) return '';
    if (percent === 0) return '';
    return Big(liquidity || 0)
      .mul(percent / 100)
      .div(1e18)
      .toFixed(18);
  }, [liquidity, percent]);

  const lpToken = useMemo(
    () => ({
      address: poolAddress,
      decimals: 18,
      symbol: `${token0.symbol}-${token1.symbol}`
    }),
    [poolAddress]
  );

  const errorTips = useMemo(() => {
    if (!percent) return 'Select a percent';
    return '';
  }, [percent]);

  return (
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
      <RemoveButton
        text='Remove Liquidity'
        loading={loading || infoLoading}
        onClick={onRemove}
        value={value}
        token={lpToken}
        spender={kodiak.contracts[token0.chainId].RouterV2}
        errorTips={errorTips}
      />
    </>
  );
};

export default memo(Remove);
