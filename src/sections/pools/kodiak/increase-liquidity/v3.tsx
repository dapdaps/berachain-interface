import { useState, forwardRef, useImperativeHandle } from 'react';
import Loading from '@/components/circle-loading';
import AddButton from '../../components/button/increase-button';
import useIncrease from '../../hooks/use-add-v3';
import DepositAmounts from '../../components/deposit-amounts/v3';
import SelectedRange from '../../components/selected-range';
import TokenSwitcher from '../../components/token-switcher';
import RemoveAmount from '../../components/remove-amount';
import useData from '../../hooks/use-data-v3';
import kodiak from '@/configs/pools/kodiak';

export default forwardRef(function Add(
  { onSuccess, tokenSelectable, defaultToken0, defaultToken1, defaultFee }: any,
  ref
) {
  const [errorTips, setErrorTips] = useState('');

  const {
    token0,
    token1,
    value0,
    value1,
    noPair,
    fee,
    loading,
    currentPrice,
    lowerPrice,
    upperPrice,
    reverse,
    rangeType,
    info,
    onExchangeTokens,
    setValue0,
    setValue1
  } = useData({ defaultToken0, defaultToken1, defaultFee, dex: kodiak });

  const { loading: adding, onIncrease } = useIncrease({
    token0,
    token1,
    value0,
    value1,
    fee,
    noPair,
    currentPrice,
    lowerPrice,
    upperPrice,
    info,
    dex: kodiak,
    onSuccess() {
      onSuccess?.();
    }
  });

  return (
    <>
      {loading ? (
        <div className='h-[300px] flex justify-center items-center'>
          <Loading size={30} />
        </div>
      ) : (
        <>
          <div className='flex items-center justify-between'>
            <div className='text-[16px] font-semibold'>Selected Range</div>
            {token0 && token1 && (
              <TokenSwitcher
                token0={token0}
                token1={token1}
                reverse={!reverse}
                onExchangeTokens={onExchangeTokens}
              />
            )}
          </div>
          <SelectedRange
            from='increase'
            token0={token0}
            token1={token1}
            lowerPrice={lowerPrice}
            upperPrice={upperPrice}
            currentPrice={currentPrice}
            isFullRange={rangeType === 3}
          />
        </>
      )}
      <div className='h-[20px]' />
      <DepositAmounts
        label='Deposit amounts'
        token0={token0}
        token1={token1}
        value0={value0}
        value1={value1}
        setValue0={setValue0}
        setValue1={setValue1}
        rangeType={rangeType}
        upperPrice={upperPrice}
        lowerPrice={lowerPrice}
        currentPrice={currentPrice}
        onError={(tips: string) => {
          setErrorTips(tips);
        }}
      />
      <AddButton
        text='Increase Liquidity'
        errorTips={errorTips}
        loading={loading || adding}
        onClick={() => {
          onIncrease();
        }}
        value0={value0}
        value1={value1}
        token0={token0}
        token1={token1}
        spender={info?.positionManager}
      />
    </>
  );
});
