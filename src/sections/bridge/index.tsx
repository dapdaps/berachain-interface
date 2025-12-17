import MenuButton from "@/components/mobile/menuButton";
import useIsMobile from "@/hooks/use-isMobile";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PageBack from "@/components/back";
import { useActivityStore } from "@/stores/useActivityStore";
import clsx from "clsx";
import History from "./History";
import { useMemo, useState, useEffect } from "react";
import BridgeContent from "./content";
import Setting from "../swap/Header/Setting";

export default function Bridge({ type, defaultFromChain, defaultToChain, defaultFromToken, defaultToToken, showRoute }: { type?: string, defaultFromChain?: number, defaultToChain?: number, defaultFromToken?: string, defaultToToken?: string, showRoute?: boolean }) {
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const { isDefaultTheme } = useActivityStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("pending");
  const [historyShow, setHistoryShow] = useState(false);
  const [currentTab, setCurrentTab] = useState<'bridge' | 'super-swap'>(type === 'super-swap' ? 'super-swap' : 'bridge');

  useEffect(() => {
    if (type === 'super-swap') {
      setCurrentTab('super-swap');
    } else {
      setCurrentTab('bridge');
    }
  }, [type]);

  return (
    <div className="h-full overflow-auto md:pb-[100px]">
      {isMobile ? null : (
        <div className="absolute left-[36px] md:left-[15px] top-[31px] md:top-[14px] z-[12]" />
      )}
      <div className="lg:w-[520px] md:w-[92.307vw] m-auto relative z-10">

        <div className="relative mb-0">
          <div className="flex items-end relative z-[2] h-[62px]">
            <button
              onClick={() => setCurrentTab('bridge')}
              className={clsx(
                "relative px-8 flex-1 rounded-t-[16px] border border-black border-b-0 font-bold text-[18px] cursor-pointer",
                currentTab === 'super-swap'
                  ? "bg-[#E9E3B5] text-black z-0  h-[52px] top-[-1px]"
                  : "bg-[#FFFDEB] text-black  z-10 h-[62px]"
              )}
            >
              Bridge
              {currentTab === 'bridge' ? <RightCorner /> : null}
            </button>

            <button
              onClick={() => setCurrentTab('super-swap')}
              className={clsx(
                "relative px-8  flex-1 rounded-t-[16px] border border-black border-b-0 font-bold text-[18px] cursor-pointer",
                currentTab === 'super-swap'
                  ? "bg-[#FFFDEB] text-black z-10 h-[62px]"
                  : "bg-[#E9E3B5] text-black z-0  h-[52px] top-[-1px]"
              )}
            >
              Swap
              {currentTab === 'super-swap' ? <LeftCorner /> : null}
              {currentTab === 'super-swap' ? <RightCorner /> : null}
            </button>

            <div className="w-[60px] h-full flex items-center justify-center relative z-[50]">
              <Setting />
            </div>
          </div>

          <div className="relative top-[-1px] z-[1]">
            {
              currentTab === 'bridge' ? (
                <BridgeContent
                  type='bridge'
                  defaultFromChain={defaultFromChain || 1}
                  defaultToChain={defaultToChain || 80094}
                  defaultFromToken={defaultFromToken || 'ETH'}
                  defaultToToken={defaultToToken || 'WETH'}
                  onShowHistory={() => {
                    setHistoryShow(true);
                    setActiveTab("pending");
                  }}
                  showRoute={true}
                />
              ) : <BridgeContent
                type='super-swap'
                defaultFromChain={80094}
                defaultToChain={80094}
                defaultFromToken={searchParams.get("fromToken") || defaultFromToken || 'BERA'}
                defaultToToken={searchParams.get("toToken") || defaultToToken || 'HONEY'}
                showRoute={false}
              />
            }

            {
              currentTab !== 'super-swap' && <>
                <History
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  isOpen={historyShow}
                  setIsOpen={setHistoryShow}
                />
              </>
            }
          </div>
        </div>
      </div>



    </div >
  );
}

const RightCorner = () => {
  return <svg width="62" height="62" className="shrink-0 absolute right-[-35px] bottom-0" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_22123_389)"><g filter="url(#filter0_d_22123_389)"><path d="M-263 20C-263 8.95429 -254.046 0 -243 0L11 0C22.0457 0 31 8.95431 31 20V40.5496C31 51.5952 39.9543 60.5495 51 60.5495L307 60.5497C318.046 60.5497 327 69.504 327 80.5497V730C327 741.046 318.046 750 307 750H-535C-546.046 750 -555 741.046 -555 730V80.5495C-555 69.5038 -546.046 60.5495 -535 60.5495H-283C-271.954 60.5495 -263 51.5952 -263 40.5495V20Z" fill="#FFFDEB"></path><path d="M-262.5 20C-262.5 9.23043 -253.77 0.5 -243 0.5H11C21.7696 0.5 30.5 9.23045 30.5 20V40.5496C30.5 51.8714 39.6782 61.0495 51 61.0495L307 61.0497C317.77 61.0497 326.5 69.7802 326.5 80.5497V730C326.5 740.77 317.77 749.5 307 749.5H-535C-545.77 749.5 -554.5 740.77 -554.5 730V80.5495C-554.5 69.78 -545.77 61.0495 -535 61.0495H-283C-271.678 61.0495 -262.5 51.8714 -262.5 40.5495V20Z" stroke="black"></path></g></g><defs><filter id="filter0_d_22123_389" x="-555" y="0" width="892" height="760" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dx="10" dy="10"></feOffset><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_22123_389"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_22123_389" result="shape"></feBlend></filter><clipPath id="clip0_22123_389"><rect width="62" height="62" fill="white"></rect></clipPath></defs></svg>
};

const LeftCorner = () => {
  return <svg width="62" height="62" className="shrink-0 absolute left-[-35px] bottom-0" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_22123_388)">
      <g filter="url(#filter0_d_22123_388)">
        <path d="M31 20C31 8.95429 39.9543 0 51 0L305 0C316.046 0 325 8.95431 325 20V40.5496C325 51.5952 333.954 60.5495 345 60.5495L601 60.5497C612.046 60.5497 621 69.504 621 80.5497V730C621 741.046 612.046 750 601 750H-241C-252.046 750 -261 741.046 -261 730V80.5495C-261 69.5038 -252.046 60.5495 -241 60.5495H11C22.0457 60.5495 31 51.5952 31 40.5495V20Z" fill="#FFFDEB" />
        <path d="M31.5 20C31.5 9.23043 40.2305 0.5 51 0.5H305C315.77 0.5 324.5 9.23045 324.5 20V40.5496C324.5 51.8714 333.678 61.0495 345 61.0495L601 61.0497C611.77 61.0497 620.5 69.7802 620.5 80.5497V730C620.5 740.77 611.77 749.5 601 749.5H-241C-251.77 749.5 -260.5 740.77 -260.5 730V80.5495C-260.5 69.78 -251.77 61.0495 -241 61.0495H11C22.3219 61.0495 31.5 51.8714 31.5 40.5495V20Z" stroke="black" />
      </g>
    </g>
    <defs>
      <filter id="filter0_d_22123_388" x="-261" y="0" width="892" height="760" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dx="10" dy="10" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_22123_388" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_22123_388" result="shape" />
      </filter>
      <clipPath id="clip0_22123_388">
        <rect width="62" height="62" fill="white" />
      </clipPath>
    </defs>
  </svg>
};