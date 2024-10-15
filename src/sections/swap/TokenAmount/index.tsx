'use client';
import { useMemo, useEffect } from 'react';
import useTokenBalance from '@/hooks/use-token-balance';
import { balanceFormated } from '@/utils/balance';
import Loading from '@/components/circle-loading';

export default function TokenAmout({
  type,
  amount,
  disabled,
  currency,
  prices,
  outputCurrencyReadonly,
  onCurrencySelectOpen,
  onAmountChange,
  onUpdateCurrencyBalance,
  updater
}: any) {
  const tokenPrice = useMemo(
    () => (currency ? prices[currency.priceKey || currency.symbol] : 0),
    [prices, currency]
  );
  const { tokenBalance, isLoading, update } = useTokenBalance(
    currency?.isNative ? 'native' : currency?.address,
    currency?.decimals,
    currency?.chainId
  );
  useEffect(() => {
    if (tokenBalance && onUpdateCurrencyBalance)
      onUpdateCurrencyBalance(tokenBalance);
  }, [tokenBalance]);

  useEffect(() => {
    update();
  }, [updater]);

  return (
    <div className='border border-[#000] rounded-[12px] p-[14px] bg-white'>
      <div className='flex items-center justify-between gap-[10px]'>
        <div
          className={`${
            outputCurrencyReadonly ? '' : 'border bg-[#FFFDEB]'
          } flex items-center justify-between border-[#000] rounded-[8px]  w-[176px] h-[46px] px-[7px]`}
          onClick={() => {
            onCurrencySelectOpen();
          }}
        >
          {currency ? (
            <div className='flex items-center gap-[10px]'>
              <div className='relative'>
                <img
                  className='w-[26px] h-[26px]'
                  src={currency.icon || '/assets/tokens/default_icon.png'}
                />
              </div>
              <div>
                <div className='text-[16px] font-[600]'>{currency?.symbol}</div>
              </div>
            </div>
          ) : (
            <div className='text-[16px] font-[600]'>
              Select a token
            </div>
          )}
          {!outputCurrencyReadonly && (
            <svg
              width='12'
              height='7'
              viewBox='0 0 12 7'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M1 1L6 5L11 1'
                stroke='black'
                stroke-width='2'
                strokeLinecap='round'
              />
            </svg>
          )}
        </div>
        <div className='flex-1'>
          <input
            className='w-[100%] h-[100%] text-[26px] text-right'
            value={amount}
            onChange={(ev) => {
              if (isNaN(Number(ev.target.value))) return;
              onAmountChange?.(ev.target.value.replace(/\s+/g, ''));
            }}
            placeholder='0'
          />
        </div>
      </div>

      <div
        onClick={() => {
          const formatedBalance = balanceFormated(tokenBalance);
          if (!['-', 'Loading', '0'].includes(formatedBalance))
            onAmountChange?.(tokenBalance);
        }}
        className='flex items-center justify-between text-[#3D405A] mt-[10px] font-medium text-[12px]'
      >
        <div className='flex items-center gap-[4px]'>
          balance:{' '}
          {isLoading ? (
            <Loading />
          ) : (
            <span
              style={{
                textDecoration: disabled ? 'none' : 'underline'
              }}
            >
              {currency ? balanceFormated(tokenBalance) : '-'}
            </span>
          )}
        </div>
        <div>$-</div>
      </div>
    </div>
  );
}
