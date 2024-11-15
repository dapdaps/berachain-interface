import { formatValueDecimal } from '@/utils/balance';
import Big from 'big.js';
import { useRouter } from 'next/navigation';
import { numberFormatter } from '@/utils/number-formatter';
import { format } from 'date-fns';

const DetailSummary = (props: any) => {
  const { data } = props;

  const router = useRouter();

  const protocol = data?.initialData?.pool?.protocol;

  return (
    <div className='relative mb-[24px] py-[16px] pl-[73px] pr-[16px] rounded-[10px] bg-[#FFDC50]'>
      <div
        className='cursor-pointer absolute top-[24px] left-[19px]'
        onClick={() => {
          router.back();
        }}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='34'
          height='34'
          viewBox='0 0 34 34'
          fill='none'
        >
          <rect
            x='0.5'
            y='0.5'
            width='33'
            height='33'
            rx='10.5'
            fill='white'
            stroke='#373A53'
          />
          <path
            d='M20 11L15.2 17L20 23'
            stroke='black'
            strokeWidth='3'
            strokeLinecap='round'
          />
        </svg>
      </div>
      <div className='mb-[17px] flex items-center justify-between gap-[14px]'>
        <div className=" flex items-center gap-[14px]">
          <div className="flex items-center">
            {data?.images[0] && (
              <img
                className="w-[48px] h-[48px] rounded-full"
                src={data?.images[0]}
              />
            )}
            {data?.images[1] && (
              <img
                className="ml-[-16px] w-[48px] h-[48px] rounded-full"
                src={data?.images[1]}
                style={{ objectPosition: 'left' }}
              />
            )}
          </div>
          <div className="text-black font-Montserrat text-[26px] font-semibold leading-[100%]">
            {data?.initialData?.pool?.name || data?.tokens?.[0] || 'iBGT'}
          </div>
        </div>
        {
          data?.name === 'Berps' && (
            <div className="flex items-center gap-[26px]">
              <div className="flex flex-col gap-[12px]">
                <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">
                  Start
                </div>
                <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%] whitespace-nowrap">
                  {data?.currentEpochStart && format(data?.currentEpochStart, 'MM/dd/yyyy, h:mmaa')}
                </div>
              </div>
              <div className="flex flex-col gap-[12px]">
                <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">
                  End
                </div>
                <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%] whitespace-nowrap">
                  {data?.currentEpochEnd && format(data?.currentEpochEnd, 'MM/dd/yyyy, h:mmaa')}
                </div>
              </div>
            </div>
          )
        }
      </div>
      <div className="flex items-center gap-[30px]">
        <div className="flex flex-col gap-[12px]">
          <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">
            TVL
          </div>
          <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">
            {formatValueDecimal(data?.tvl, '$', 2, true)}
          </div>
        </div>
        <div className='flex flex-col gap-[12px]'>
          <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
            APY up to
          </div>
          <div className='text-black font-Montserrat text-[20px] font-semibold leading-[90%]'>
            {Big(data?.apy ?? 0).toFixed(2)}%
          </div>
        </div>
        <div className='flex flex-col gap-[12px]'>
          <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
            Protocol
          </div>
          <div className='text-black font-Montserrat text-[20px] font-semibold leading-[90%]'>
            {data?.initialData?.pool?.protocol || '-'}
          </div>
        </div>
        {
          data?.name === 'Berps' ? (
            <>
              <div className="flex flex-col gap-[12px]">
                <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">
                  Price
                </div>
                <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">
                  {numberFormatter(data?.withdrawTokenPrice, 2, true, { prefix: '$' })}
                </div>
              </div>
              <div className="flex flex-col gap-[12px]">
                <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium whitespace-nowrap">
                  Collateralization Ratio
                </div>
                <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">
                  {data?.collateralizationRatio}
                </div>
              </div>
              <div className="flex flex-col gap-[12px]">
                <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">
                  {data?.withdrawToken?.symbol} Supply
                </div>
                <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">
                  {numberFormatter(data?.totalSupply, 2, true, { isShort: true })}
                </div>
              </div>
              <div className="flex flex-col gap-[12px]">
                <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">
                  Epoch
                </div>
                <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%] whitespace-nowrap">
                  {data?.currentEpoch}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-[12px]">
                <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">
                  Type
                </div>
                <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">
                  {data?.protocolType}
                </div>
              </div>
            </>
          )
        }
      </div>
    </div>
  );
};

export default DetailSummary;
