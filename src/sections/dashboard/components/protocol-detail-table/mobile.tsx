import LazyImage from '@/components/layz-image';
import { DefaultIcon } from '@/sections/dashboard/utils';
import { numberFormatter } from '@/utils/number-formatter';
import Big from 'big.js';
import { calcDebtRatio } from './laptop';

const Dex = ({ record }: any) => {
  return (
    <>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-[6px]'>
          {record.assets.map((token: any, idx: number) => (
            <div
              className={`w-[26px] h-[26px] rounded-[50%] shrink-0 ${
                idx && 'ml-[-10px]'
              }`}
              key={idx}
            >
              <LazyImage
                src={token.tokenLogo}
                alt=''
                width={26}
                height={26}
                style={{
                  borderRadius: '50%'
                }}
                fallbackSrc={DefaultIcon}
              />
            </div>
          ))}
          <div className='text-[16px] font-semibold'>
            {record.assets.map((token: any) => token.symbol).join(' / ')}
          </div>
        </div>
        <div className='text-[18px] font-semibold'>
          {numberFormatter(record.totalUsd, 2, true, { prefix: '$' })}
        </div>
      </div>
      <div className='text-[14px] text-[#3D405A]'>Amount</div>
      <div className='text-[14px] font-semibold mt-[6px]'>
        {record.assets.map((asset: any, idx: number) => (
          <span key={idx}>
            {numberFormatter(asset.amount, 6, true)} {asset.symbol}
          </span>
        ))}
      </div>
    </>
  );
};

const Lending = ({ record }: any) => {
  return (
    <>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-[6px]'>
          <div className='w-[26px] h-[26px] rounded-[50%] shrink-0 group:not(:first-child):ml-[-10px]'>
            <LazyImage
              src={record.logo}
              alt=''
              width={26}
              height={26}
              style={{
                borderRadius: '50%'
              }}
              fallbackSrc={DefaultIcon}
            />
          </div>
          <div className='text-[16px] font-semibold'>{record.symbol}</div>
        </div>
        <div className='text-[18px] font-semibold'>
          {numberFormatter(record.totalUsd, 2, true, { prefix: '$' })}
        </div>
      </div>
      <div className='flex items-center'>
        <div className='w-1/3 text-[14px]'>
          <div className='text-[#3D405A]'>Supply</div>
          <div className='font-semibold'>
            {Big(record.supplyAmount).gt(0)
              ? `${numberFormatter(record.supplyAmount, 4, true)} ${
                  record.symbol
                }`
              : '/'}
          </div>
        </div>
        <div className='w-1/3 text-[14px]'>
          <div className='text-[#3D405A] text-center'>Borrow</div>
          <div className='font-semibold text-center'>
            {Big(record.borrowAmount).gt(0)
              ? `${numberFormatter(record.borrowAmount, 4, true)} ${
                  record.symbol
                }`
              : '/'}
          </div>
        </div>
        <div className='w-1/3 text-[14px]'>
          <div className='text-[#3D405A] text-right'>Debt Ratio</div>
          <div className='font-semibold text-right'>
            {calcDebtRatio(record.borrowAmount, record.supplyAmount).toFixed(2)}
            %
          </div>
        </div>
      </div>
    </>
  );
};

const Item = ({ isLending, record }: any) => {
  if (isLending) {
    return <Lending record={record} />;
  }
  return <Dex record={record} />;
};

export default function Mobile({ isLending, tableList }: any) {
  return (
    <div className='h-[50vh] overflow-y-auto flex flex-col pb-[20px]'>
      {tableList.map((item: any, idx: number) => (
        <div
          key={idx}
          className='mt-[10px] p-[10px] rounded-[10px] bg-black/10'
        >
          <Item isLending={isLending} record={item} />
        </div>
      ))}
    </div>
  );
}
