'use client';

import useTokenPrice from '@/hooks/use-token-price';
import MainLayoutHeader from '@/layouts/main/header';
import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import MapModal from '@/sections/home/map-modal';
import useUser from '@/hooks/use-user';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import Image from 'next/image';
import TipsModal from '@/components/tips-modal';
import useClickTracking from '@/hooks/use-click-tracking';

const MainLayout = (props: Props) => {
  const { children, style } = props;

  const { handleTrack } = useClickTracking();
  const { initializePrice } = useTokenPrice();
  const pathname = usePathname();

  useEffect(() => {
    initializePrice();
  }, []);

  const { address } = useAccount();
  const { getAccessToken } = useUser();

  useEffect(() => {
    getAccessToken();
  }, [address]);

  const isVaults = useMemo(() => pathname === '/vaults', [pathname]);

  const routes = ['/earn']

  return (
    <div
      id='layout'
      className={`min-h-screen relative flex flex-col items-stretch justify-start ${
        isVaults ? 'bg-transparent h-full' : 'bg-[var(--background)]'
      }`}
      style={style}
      onClick={handleTrack}
    >
      <MainLayoutHeader className={routes.includes(pathname) ? 'bg-transparent !fixed' : '' }/>
      <div className={isVaults ? 'h-full w-full absolute' : 'grow'}>
        {children}
      </div>
      <div className='absolute left-[16px] bottom-[16px] z-[11] flex items-center gap-[10px]'>
        <Link
          className='hover:scale-110 ease-in-out duration-300 w-[124px] h-[36px] rounded-full bg-[rgba(217,217,217,0.5)]'
          href='https://app.dapdap.net?from=berachain'
          target='_blank'
          data-bp='1010-011'
        >
          <Image
            src='/images/dapdap.svg'
            alt='dapdap-link'
            width={124}
            height={36}
          />
        </Link>
        <Link
          className='hover:scale-110 ease-in-out duration-300 w-[26px] h-[26px] rounded-full bg-white/50 flex items-center justify-center'
          href='https://dapdap.mirror.xyz/FSRc-5-o7gHVfTnFDgYPFOMktA7kWreb-m0S3paQCdk'
          target='_blank'
          data-bp='1010-014'
        >
          <Image
            src='/images/mirror.png'
            alt='Mirror'
            width={16}
            height={16}
            className='cursor-pointer'
          />
        </Link>
      </div>
      <MapModal />
      <TipsModal />
    </div>
  );
};

export default MainLayout;

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
