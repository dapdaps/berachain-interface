
import CircleLoading from '@/components/circle-loading';
import Empty from '@/components/empty';
import { useVaultList } from "@/sections/bgt/hooks/useList";
import { addThousandSeparator } from '@/utils/number-formatter';
import { useDebounceFn } from 'ahooks';
import Big from 'big.js';
import { useRouter } from "next/navigation";
const AllVaults = (props: any) => {

  const {
    data,
    isLoading,
    onDeposit
  } = props

  return (
    <div className="p-[12px] flex flex-col gap-[12px]">
      {
        data?.map((record: any, idx: number) => (
          <div className="px-[12px] pt-[16px] pb-[14px] bg-black/[0.06] rounded-[10px]">
            <div className='flex items-center justify-between mb-[20px]'>
              <div className='flex items-center gap-[16px]'>
                <div className='relative'>
                  <div className='w-[30px] h-[30px] rounded-full overflow-hidden'>
                    <img src={record?.metadata?.logoURI || "/images/bgt-logo.svg"} />
                  </div>
                  <div className="absolute right-[-6px] bottom-[-2px] w-[16px]">
                    <img src={record?.metadata?.productMetadata?.logoURI ||
                      "/images/bgt-logo-1.svg"} />
                  </div>
                </div>
                <div className="flex flex-col gap-[5px]">
                  <div className='text-black font-Montserrat text-[16px] font-semibold leading-[90%]'>{record?.name}</div>
                  <div className='text-black font-Montserrat text-[12px] font-medium leading-[90%]'>{record?.productMetadata?.name}</div>
                </div>
              </div>
              <div className="w-[95px] h-[32px] rounded-[10px] bg-white border border-black flex items-center justify-center cursor-pointer text-[16px] font-Montserrat"
                onClick={() => {
                  onDeposit?.(record)
                }}
              >
                Deposit
              </div>
            </div>

            <div className='mb-[23px] flex items-center justify-between'>
              <div className='flex flex-col gap-[5px]'>
                <div className='text-[#3D405A] text-[14px] font-Montserrat font-medium'>Total Incentive Value</div>
                <div className='text-black text-[16px] font-Montserrat font-semibold leading-[90%]'>{"$" +
                  addThousandSeparator(record?.activeIncentivesInHoney.toFixed(2))}</div>
              </div>
              <div className='flex flex-col items-end gap-[5px]'>
                <div className='text-[#3D405A] text-[14px] font-Montserrat font-medium'>BGT Capture</div>
                <div className='text-black text-[16px] font-Montserrat font-semibold leading-[90%]'>{Big(record?.bgtInflationCapture).div(100).toFixed(2) + "%"}</div>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              {/* <div className='flex flex-col gap-[5px]'>
                <div className='text-[#3D405A] text-[14px] font-Montserrat font-medium'>Validators</div>
                <div className='text-black text-[16px] font-Montserrat font-semibold leading-[90%]'>$5,452,700.42</div>
              </div> */}
              <div className='flex flex-col gap-[5px]'>
                <div className='text-[#3D405A] text-[14px] font-Montserrat font-medium'>Incentives</div>
                <div className='flex items-center gap-[8px] text-black text-[16px] font-Montserrat font-semibold leading-[90%]'>{record?.activeIncentives.map((v: any) => (
                  <div className="w-fit rounded-lg border p-1">
                    <span className="text-[10px]">{v.token.symbol}</span>
                  </div>
                ))}</div>
              </div>
            </div>
          </div>
        ))
      }

      {isLoading && (
        <div className='flex justify-center'>
          <CircleLoading />
        </div>
      )}

      {!isLoading && !data.length && (
        <div className='w-full flex justify-center items-center mt-[100px]'>
          <Empty desc='No Records found' />
        </div>
      )}
    </div>
  );
};

export default AllVaults;