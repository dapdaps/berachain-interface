import { useState, forwardRef, useImperativeHandle } from 'react';
import Loading from '@/components/circle-loading';
import AddButton from '../../components/button/increase-button';
import useIncrease from '../../hooks/use-add-v3';
import DepositAmounts from '../../components/deposit-amounts/v3';
import Chart from '../../components/chart';
import Empty from '../../components/empty';
import OutRangeHints from '../../components/out-range-hints';
import PoolNoExsitHints from '../../components/pool-no-exsit-hints';
import SelectPriceRange from '../../components/select-price-range';
import StartingPrice from '../../components/starting-price';
import TokenSwitcher from '../../components/token-switcher';
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
    onSelectToken,
    onCleanAll,
    onSelectFee,
    onExchangeTokens,
    onPriceChange,
    onPointChange,
    setValue0,
    setValue1,
    setCurrentPrice,
    onSetPriceByTick
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

  useImperativeHandle(
    ref,
    () => {
      return {
        onClearAll: onCleanAll
      };
    },
    []
  );

  return (
    <>
      {loading ? (
        <div className='h-[300px] flex justify-center items-center'>
          <Loading size={30} />
        </div>
      ) : (
        <>
          <div className='flex items-center justify-between'>
            <div className='text-[16px] font-semibold'>Set Price Range</div>
            {token0 && token1 && (
              <TokenSwitcher
                token0={token0}
                token1={token1}
                reverse={!reverse}
                onExchangeTokens={onExchangeTokens}
              />
            )}
          </div>
          {currentPrice && token0 && token1 && fee && !noPair ? (
            <Chart
              currentPrice={currentPrice}
              fee={fee}
              lowerPrice={lowerPrice}
              highPrice={upperPrice === '∞' ? 2 ** 96 : upperPrice}
              token0={token0}
              token1={token1}
              onPriceChange={onPriceChange}
            />
          ) : (
            <Empty />
          )}
          {noPair && token0 && token1 && <PoolNoExsitHints />}
          <SelectPriceRange
            lowerPrice={lowerPrice}
            upperPrice={upperPrice}
            currentPrice={currentPrice}
            token0={token0}
            token1={token1}
            reverse={reverse}
            noPair={noPair}
            rangeType={rangeType}
            onExchangeTokens={() => {
              onExchangeTokens();
            }}
            onPointChange={onPointChange}
            onPriceChange={onPriceChange}
            onSetPriceByTick={onSetPriceByTick}
          />
          {[1, 2].includes(rangeType) && !noPair && (
            <OutRangeHints type={rangeType} />
          )}
          {/* 
          {noPair && (
            <StartingPrice
              token0={token0}
              token1={token1}
              price={currentPrice}
              setPrice={(_price: any) => {
                setCurrentPrice(_price);
                setValue0('');
                setValue1('');
              }}
            />
          )} */}
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
        text='Add Liquidity'
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
