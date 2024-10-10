import { memo, useMemo } from 'react';
import Big from 'big.js';
import RemoveButton from '../../components/button/remove-button';
import RemoveAmount from '../../components/remove-amount';
import useCollectFee from '../../hooks/use-collect-fee';
import useCollectInfo from '../../hooks/use-collect-info';
import kodiak from '@/configs/pools/kodiak';

const Collect = ({ token0, token1, tokenId, onSuccess }: any) => {
  const { info: feeInfo, loading: infoLoading } = useCollectInfo(
    tokenId,
    kodiak
  );

  const { loading, onCollect } = useCollectFee({
    tokenId,
    dex: kodiak,
    onSuccess: () => {
      onSuccess();
    }
  });

  const [feeAmount0, feeAmount1] = useMemo(() => {
    if (!feeInfo) return [0, 0];
    return [
      new Big(feeInfo.amount0 || 0).div(10 ** token0?.decimals),
      new Big(feeInfo.amount1 || 0).div(10 ** token1?.decimals)
    ];
  }, [feeInfo]);

  return infoLoading ? (
    <div className='flex h-[100px] items-center justify-center'>Loading...</div>
  ) : (
    <>
      <RemoveAmount
        type='V3'
        token0={token0}
        token1={token1}
        feeAmount0={feeAmount0}
        feeAmount1={feeAmount1}
        from='collect'
      />
      <RemoveButton text='Claim' loading={loading} onClick={onCollect} />
    </>
  );
};

export default memo(Collect);
