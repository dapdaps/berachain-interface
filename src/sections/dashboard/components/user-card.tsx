import React, { useEffect } from 'react';
import LazyImage from '@/components/layz-image';
import Skeleton from 'react-loading-skeleton';
import { numberFormatter } from '@/utils/number-formatter';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import useUser from '@/hooks/use-user';

export default function UserCard({ loading, totalBalance }: any) {
  const modal = useWeb3Modal();
  const { address } = useAccount();
  const { accessToken, getUserInfo, userInfo } = useUser();

  useEffect(() => {
    if (!accessToken) return;
    getUserInfo();
  }, [accessToken]);
  return (
    <div className='bg-[#FFDC50] py-[18px] pl-[25px] pr-[13px] rounded-[10px] flex items-center gap-[18px] mb-[32px] md:mb-0 md:rounded-t-[20px] md:rounded-b-none md:gap-[6px]'>
      {!address || !userInfo.avatar ? (
        <div className='w-[85px] h-[85px] md:w-[46px] md:h-[46px] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#00D1FF_0deg,#FF008A_360deg)]' />
      ) : (
        <div className='w-[85px] h-[85px] shrink-0 md:w-[46px] md:h-[46px]'>
          <LazyImage src={userInfo.avatar} className='rounded-full shrink-0 ' />
        </div>
      )}
      {!address ? (
        <button
          className='underline'
          type='button'
          onClick={() => {
            modal.open();
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <div className='grow'>
            <div className='font-CherryBomb text-black text-[32px] md:text-[20px] font-[400] mb-[6px] leading-none'>
              @{userInfo.username}
            </div>
            <div className='text-[14px] text-[#3D405A] font-Montserrat'>
              {address ? address.slice(0, 6) + '...' + address.slice(-4) : ''}
            </div>
          </div>
          <div className='flex-shrink-0'>
            <div className='font-CherryBomb text-black text-[32px] md:text-[20px] font-[400] mb-[6px] leading-none'>
              {loading ? (
                <Skeleton width={140} height={32} />
              ) : (
                numberFormatter(totalBalance, 2, true, { prefix: '$' })
              )}
            </div>
            <div className='text-[14px] text-[#3D405A] font-Montserrat text-center'>
              Total assets value
            </div>
          </div>
        </>
      )}
    </div>
  );
}
