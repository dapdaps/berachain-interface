"use client";

import ConnectWallet from "@/components/connect-wallet";
import BGTCoin, { CoinType } from "@/layouts/main/BGTCoin";
import Logo from "@/layouts/main/logo";
import IconMap from "@public/images/icon-map.svg";
import LaptopChain from "@/components/connect-wallet/chain/laptop";
import useMapModalStore from "@/stores/useMapModalStore";
import { useProgressRouter } from "@/hooks/use-progress-router";
import { useBgtCount } from "@/hooks/use-bgt-count";
import { usePathname } from "next/navigation";

const MainLayoutHeader = (props: Props) => {
  const { className, style } = props;

  const store: any = useMapModalStore();
  const router = useProgressRouter();
  const { iBGTCount, BGTCount } = useBgtCount();
  const pathname = usePathname()
  const isNearPage = ['/bintent', '/my-near-wallet-gateway'].includes(pathname);

  const goHome = () => {
    router.replace("/");
  };

  return (
    <header
      className={`w-full h-[68px] stroke-black sticky font-CherryBomb top-0 z-50 ${className} bear-header`}
      style={style}
    >
      <div className="w-full h-full px-[40px] flex justify-between items-center">
        <div className="flex items-center gap-x-[40px]">
          <Logo />
          <div
            data-bp="1010-001"
            onClick={() => store.setOpen(true)}
            className="ml-[-20px] hover:scale-[1.1] ease-in-out duration-300 cursor-pointer"
          >
            <IconMap />
          </div>
          <button
            onClick={goHome}
            className="hover:scale-[1.1] ease-in-out duration-300 before:content-[''] before:block before:absolute before:bottom-0 before:left-0 before:w-full before:h-[30px] before:rounded-[10px] before:bg-[#CCD55B] before:z-0 relative bg-[#EBF479] rounded-[10px] border border-solid border-black px-[25px] py-[9px] leading-none text-black text-center text-[16px] font-[400]"
            data-bp="1010-002"
          >
            <span className="relative z-10">Home</span>
          </button>
        </div>
        <div className="text-white flex items-center gap-x-[17px]">
          <BGTCoin type={CoinType.BGT} count={BGTCount} bp="1010-004" />
          <BGTCoin type={CoinType.iBGT} count={iBGTCount} bp="1010-005" />
          {
            !isNearPage && <LaptopChain />
          }
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
