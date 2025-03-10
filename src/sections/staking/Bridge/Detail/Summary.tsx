import { formatValueDecimal } from '@/utils/balance';
import Big from 'big.js';
import { useRouter } from 'next/navigation';
import { numberFormatter } from '@/utils/number-formatter';
import { format } from 'date-fns';
import Skeleton from 'react-loading-skeleton';

const DetailSummary = (props: any) => {
  const { data, loading } = props;

  const router = useRouter();

  const protocol = data?.initialData?.pool?.protocol;

  const isBerps = data?.name === 'Berps';

  console.log('====data=====', data)
  return (
    <div
      className='relative mb-[24px] py-[16px] pr-[16px] rounded-[10px] bg-[#FFDC50]'
      style={{
        paddingLeft: isBerps ? 16 : 73,
      }}
    >
      {
        !isBerps && (
          <div
            className="cursor-pointer absolute top-[24px] left-[19px]"
            onClick={() => {
              router.back();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
            >
              <rect
                x="0.5"
                y="0.5"
                width="33"
                height="33"
                rx="10.5"
                fill="white"
                stroke="#373A53"
              />
              <path
                d="M20 11L15.2 17L20 23"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )
      }
      <div className="mb-[17px] flex items-center justify-between gap-[14px]">
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
            {data?.id || data?.tokens?.[0] || 'iBGT'}
          </div>
        </div>
        {
          isBerps && (
            <div className="flex items-center gap-[26px] pr-[64px]">
              <div className="flex flex-col gap-[12px]">
                <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">
                  Start
                </div>
                <Item
                  loading={loading}
                  width={186}
                  height={18}
                  className="whitespace-nowrap"
                  value={data?.currentEpochStart && format(data?.currentEpochStart, 'MM/dd/yyyy, h:mmaa')}
                />
              </div>
              <div className="flex flex-col gap-[12px]">
                <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">
                  End
                </div>
                <Item
                  loading={loading}
                  width={186}
                  height={18}
                  className="whitespace-nowrap"
                  value={data?.currentEpochEnd && format(data?.currentEpochEnd, 'MM/dd/yyyy, h:mmaa')}
                />
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
          <Item
            loading={loading}
            width={100}
            height={18}
            className=""
            value={formatValueDecimal(data?.tvl, isBerps ? '' : '$', 2, true)}
          />
        </div>
        <div className="flex flex-col gap-[12px]">
          <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
            APY up to
          </div>
          <Item
            loading={loading}
            width={100}
            height={18}
            className=""
            value={`${Big(data?.apy ?? 0).toFixed(2)}%`}
          />
        </div>
        <div className="flex flex-col gap-[12px]">
          <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
            Protocol
          </div>
          <Item
            loading={loading}
            width={60}
            height={18}
            className=""
            value={data?.initialData?.protocol?.name === "BEX" ? "Bex" : (data?.initialData?.protocol?.name || '-')}
          />
        </div>
        {
          isBerps ? (
            <>
              <div className="flex flex-col gap-[12px]">
                <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">
                  Price
                </div>
                <Item
                  loading={loading}
                  width={60}
                  height={18}
                  className=""
                  value={numberFormatter(data?.withdrawTokenPrice, 2, true, { prefix: '$' })}
                />
              </div>
              <div className="flex flex-col gap-[12px]">
                <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium whitespace-nowrap">
                  Collateralization Ratio
                </div>
                <Item
                  loading={loading}
                  width={100}
                  height={18}
                  className=""
                  value={data?.collateralizationRatio}
                />
              </div>
              <div className="flex flex-col gap-[12px]">
                <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">
                  {data?.withdrawToken?.symbol} Supply
                </div>
                <Item
                  loading={loading}
                  width={100}
                  height={18}
                  className=""
                  value={numberFormatter(data?.totalSupply, 2, true, { isShort: true })}
                />
              </div>
              <div className="flex flex-col gap-[12px]">
                <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">
                  Epoch
                </div>
                <Item
                  loading={loading}
                  width={45}
                  height={18}
                  className="whitespace-nowrap"
                  value={data?.currentEpoch}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-[12px]">
                <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">
                  Type
                </div>
                <Item
                  loading={loading}
                  width={100}
                  height={18}
                  className=""
                  value={data?.protocolType}
                />
              </div>
            </>
          )
        }
      </div>
    </div>
  );
};

export default DetailSummary;

const Item = (props: any) => {
  const { width, height, loading, value, className, style } = props;

  return loading ? (
    <Skeleton width={width} height={height} borderRadius={10} />
  ) : (
    <div className={`text-black font-Montserrat text-[20px] font-semibold leading-[90%] ${className}`} style={style}>
      {value}
    </div>
  );
};
