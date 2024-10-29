'use client';

import ConnectWallet from '@/components/connect-wallet';
import BGTCoin, { CoinType } from '@/layouts/main/BGTCoin';
import Logo from '@/layouts/main/logo';
import IconMap from '@public/images/icon-map.svg';
import useMapModalStore from '@/stores/useMapModalStore';
import { useProgressRouter } from '@/hooks/use-progress-router';

const MainLayoutHeader = (props: Props) => {
  const {
    className,
    style
  } = props;

  const store: any = useMapModalStore();
  const router = useProgressRouter();

  const goHome = () => {
    router.replace('/');
  }

  return (
    <header
      className={`w-full h-[68px] bg-[#96D6FF] stroke-black sticky font-CherryBomb top-0 z-50 ${className} bear-header`}
      style={style}
    >
      <div className="w-full h-full px-[40px] flex justify-between items-center">
        <div className="text-white flex items-center gap-x-[17px]">
          <BGTCoin type={CoinType.BGT} count={0} bp="1001-004" />
          <BGTCoin type={CoinType.iBGT} count={0} bp="1001-005" />
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
};

export default MainLayoutHeader;

interface Props {
  className?: string;
  style?: React.CSSProperties;
}
