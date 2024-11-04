import Image from 'next/image';
import { formatValueDecimal } from '@/utils/balance';
import clsx from 'clsx';

const UserInfo = ({ data, className }: any) => {
  return (
    <div className={clsx('flex items-center gap-[30px]', className)}>
      <div>
        <div className='text-[14px]'>You Staked</div>
        <div className='mt-[3px] flex items-center gap-[3px]'>
          <span className='text-[16px] font-semibold'>
            {formatValueDecimal(data?.usdDepositAmount, '$', 2, true, false)}
          </span>
          <span className='text-[12px] font-medium'>
            {data?.id || 'iBGT'}-LP
          </span>
        </div>
      </div>
      <div>
        <div className='text-[14px]'>Rewards</div>
        <div className='mt-[3px] flex items-center gap-[6px]'>
          <span className='text-[16px] font-semibold'>
            {formatValueDecimal(data?.earned, '', 2, true, false)}
          </span>
          <span className='text-[12px] font-medium'>
            <Image
              src={'/images/dapps/infrared/ibgt.svg'}
              width={20}
              height={20}
              alt='Reward Token'
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
