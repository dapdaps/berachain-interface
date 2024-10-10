"use client"
import useTokenPrice from '@/hooks/use-token-price';
import MainLayoutHeader from '@/layouts/main/header';
import { useEffect } from 'react';

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

  return (
    <div
      className={`min-h-screen relative flex flex-col items-stretch justify-start ${className}`}
      style={style}
    >
      <MainLayoutHeader />
      <div className='grow'>{children}</div>
    </div>
  );
};

export default MainLayout;

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
