import Big from 'big.js';
import Fee from './Fee';

const COLOR: Record<number, string> = {
  1: 'text-[#ff9445]',
  2: 'text-[#ff547d]'
};

export default function Routes({
  priceImpactType,
  priceImpact,
  gasUsd,
  routerStr,
  outputCurrencyAmount
}: any) {
  return (
    <div className='border border-[#373A53] rounded-[12px] mt-[10px] p-[10px]'>
      <Fee
        name='Price impact'
        value={`${priceImpact}%`}
        valueClassName={COLOR[priceImpactType] || 'text-[#33b65f]'}
      />
      <Fee name='Gas fee' value={gasUsd} />
      <Fee
        name='Minimum received'
        value={Big(outputCurrencyAmount || 0).toFixed(8)}
      />
      <Fee name='Route' value={routerStr} />
    </div>
  );
}
