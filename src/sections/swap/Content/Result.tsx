import Big from 'big.js';
import { useMemo, useState } from 'react';

export default function Result({
  inputCurrency,
  outputCurrency,
  inputCurrencyAmount,
  outputCurrencyAmount,
  priceImpactType
}: any) {
  const [reserve, setReserve] = useState(false);

  const priceString = useMemo(
    () =>
      reserve
        ? `1 ${outputCurrency.symbol} ={' '}
  ${Big(inputCurrencyAmount || 0)
    .div(Big(outputCurrencyAmount || 0).eq(0) ? 1 : outputCurrencyAmount)
    .toFixed(4)}{' '}
  ${inputCurrency.symbol}`
        : `1 ${inputCurrency.symbol} ={' '}
  ${Big(outputCurrencyAmount || 0)
    .div(Big(inputCurrencyAmount || 0).eq(0) ? 1 : inputCurrencyAmount)
    .toFixed(4)}{' '}
  ${outputCurrency.symbol}`,
    [reserve]
  );

  return (
    <div className='flex items-center justify-between pt-[10px] text-[14px] font-medium'>
      <div className='flex items-center gap-[5px]'>
        <div>{priceString}</div>
        <svg
          className='cursor-pointer'
          width='12'
          height='12'
          viewBox='0 0 12 12'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          onClick={() => {
            setReserve(!reserve);
          }}
        >
          <path
            d='M1.01514 6.11148C0.887128 4.95763 1.55283 3.03456 3.70343 3.03456C5.85402 3.03456 10.9999 3.03456 10.9999 3.03456M10.9999 3.03456L9.01977 1M10.9999 3.03456L9.01977 5'
            stroke='black'
          />
          <path
            d='M10.9849 5.88071C11.1129 7.03456 10.4472 8.95763 8.29657 8.95763C6.14598 8.95763 1.00006 8.95763 1.00006 8.95763M1.00006 8.95763L3.01978 11M1.00006 8.95763L3.01978 7'
            stroke='black'
          />
        </svg>
      </div>
      <div className='flex items-center gap-2'>
        {priceImpactType === 2 && (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='18'
            height='16'
            viewBox='0 0 18 16'
            fill='none'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M7.10016 1C7.86996 -0.333334 9.79446 -0.333333 10.5643 1L17.3935 12.8286C18.1633 14.1619 17.201 15.8286 15.6614 15.8286H2.00298C0.463382 15.8286 -0.498867 14.1619 0.270933 12.8286L7.10016 1ZM7.91793 6.22857C7.91793 5.72363 8.32727 5.31429 8.83221 5.31429C9.33716 5.31429 9.7465 5.72363 9.7465 6.22857V9.88572C9.7465 10.3907 9.33716 10.8 8.83221 10.8C8.32727 10.8 7.91793 10.3907 7.91793 9.88572V6.22857ZM8.83221 11.7143C8.32727 11.7143 7.91793 12.1236 7.91793 12.6286C7.91793 13.1335 8.32727 13.5429 8.83221 13.5429C9.33716 13.5429 9.7465 13.1335 9.7465 12.6286C9.7465 12.1236 9.33716 11.7143 8.83221 11.7143Z'
              fill='#FF547D'
            />
          </svg>
        )}
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
            stroke-linecap='round'
          />
        </svg>
      </div>
    </div>
  );
}
