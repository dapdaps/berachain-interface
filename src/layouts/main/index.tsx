"use client"
import useTokenPrice from '@/hooks/use-token-price';
import MainLayoutHeader from '@/layouts/main/header';
import { useEffect } from 'react';
import MapModal from '@/sections/home/map-modal';
import useUser from '@/hooks/use-user';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import Image from 'next/image';


const MainLayout = (props: Props) => {
  const {
    children,
    className,
    style,
  } = props;

  const { initializePrice } = useTokenPrice()

  useEffect(() => {
    initializePrice()
  }, [])
  const { address } = useAccount();
  const { getAccessToken } = useUser();

  useEffect(() => {
    getAccessToken();
  }, [address]);

  

  return (
    <div
      className={`min-h-screen relative flex flex-col items-stretch justify-start ${className}`}
      style={style}
    >
      <MainLayoutHeader />
      <div className='grow'>{children}</div>
      <Link className='z-[4] hover:scale-110 ease-in-out duration-300 absolute left-[16px] bottom-[16px] w-[124px] h-[36px] rounded-full bg-[rgba(217,217,217,0.5)]' href='https://app.dapdap.net?from=berachain' target='_blank'>
        <Image
          src="/images/dapdap.svg"
          alt="dapdap-link"
          width={124}
          height={36}
          className="cursor-pointer"
        />
      </Link>
      <MapModal />
    </div>
  );
};

export default MainLayout;

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
