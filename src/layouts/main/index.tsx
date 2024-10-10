"use client"
import useTokenPrice from '@/hooks/use-token-price';
import MainLayoutHeader from '@/layouts/main/header';
import { useEffect } from 'react';
import MapModal from '@/sections/home/map-modal';
import useUser from '@/hooks/use-user';
import { useAccount } from 'wagmi';


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
