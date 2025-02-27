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
          <div className="cursor-pointer flex items-center justify-center w-[130px] h-[30px] rounded-[18px] border border-black bg-[#4485FF] active:shadow-none active:translate-y-[3px] shadow-[0_3px_0_0_black] bg-[url('/images/icon-hall-button-bg.svg')] bg-center"
            onClick={() => {
              router.replace("/hall")
            }}
          >
            <div className="-mt-[2px] w-[113px]">
              <img src="/images/icon-hall-button.svg" alt="icon-hall-button" />
            </div>
          </div>
          <div className="cursor-pointer relative -top-[8px] w-[57px]"
            onClick={() => {
              router.replace("/kingdomly")
            }}
          >
            <img src="/images/icon-nft.png" alt="icon-nft" />
          </div>

          <div className="grayscale w-[107px] h-[30px] rounded-[43px] border border-[#88FFB6] bg-[#AEAEAE]  shadow-[0_3px_0_0_black] cursor-not-allowed">
            <div className="-ml-[12px] w-[111px]">
              <img src="/images/icon-launchpad-bg.png" alt="icon-launchpad-bg" />
            </div>
          </div>
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
