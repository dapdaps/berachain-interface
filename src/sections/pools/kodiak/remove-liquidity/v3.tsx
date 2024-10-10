import { memo, useMemo, useState } from 'react';
import Big from 'big.js';
import Tokens from '../../components/tokens';
import RemovePercent from '../../components/remove-percent';
import RemoveButton from '../../components/button/remove-button';
import RemoveAmount from '../../components/remove-amount';
import useRemove from '../../hooks/use-remove-v3';
import usePoolV3Detail from '../../hooks/use-detail-v3';
import useCollectInfo from '../../hooks/use-collect-info';
import kodiak from '@/configs/pools/kodiak';

const Remove = ({ token0, token1, fee, tokenId, onSuccess }: any) => {
  const { info = {}, loading: infoLoading } = usePoolV3Detail({
    token0,
    token1,
    fee,
    dex: kodiak
  });
  const { info: feeInfo } = useCollectInfo(tokenId, kodiak);
  const { amount0, amount1, liquidity } = info || {};
  const [percent, setPercent] = useState(0);

  const { loading, onRemove } = useRemove({
    detail: info,
    percent,
    amount0,
    amount1,
    dex: kodiak,
    onSuccess: () => {
      onSuccess(percent);
    }
  });

  const errorTips = useMemo(() => {
    if (!percent) return 'Select a percent';
    return '';
  }, [percent]);

  const [feeAmount0, feeAmount1] = useMemo(() => {
    if (!feeInfo || !info.token0) return [0, 0];
    return [
      new Big(feeInfo.amount0 || 0).div(10 ** info.token0?.decimals),
      new Big(feeInfo.amount1 || 0).div(10 ** info.token1?.decimals)
    ];
  }, [feeInfo, info]);

  return infoLoading ? (
    <div className='flex h-[100px] items-center justify-center'>Loading...</div>
  ) : (
    <>
      <Tokens type='V3' liquidity={liquidity} token0={token0} token1={token1} />
      <RemovePercent percent={percent} setPercent={setPercent} />
      <RemoveAmount
        type='V3'
        amount0={amount0}
        amount1={amount1}
        token0={token0}
        token1={token1}
        percent={percent}
        feeAmount0={feeAmount0}
        feeAmount1={feeAmount1}
      />
      <RemoveButton
        text='Remove Liquidity'
        loading={loading}
        onClick={onRemove}
        errorTips={errorTips}
      />
    </>
  );
};

export default memo(Remove);
