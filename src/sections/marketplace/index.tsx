"use client";

import PageBack from "@/components/back";
import PageTitle from "@/components/title";
import dexs from "@/configs/swap";
import { bera } from "@/configs/tokens/bera";
import useIsMobile from "@/hooks/use-isMobile";
import HoneypotCard from "@/sections/marketplace/components/honeypot-card/index";
import SwapModal from "@/sections/swap/SwapModal";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import MemeTokensGrid from "./components/memeTokensGrid.tsx";
import useTokenVolume from "./hooks/use-token-volume";
import { usePrice7d } from '@/sections/marketplace/hooks/use-price-7d';
import { useDebounce } from "ahooks";
import { AnimatePresence, motion } from "framer-motion";

const splitArray = (list: Record<string, any>[]) => {
  const length = list.length;
  if (!length) {
    return [];
  }
  const listAfter = [];
  for (let i = 0; i < length; i += 3) {
    listAfter.push(list.slice(i, i + 3));
  }
  return listAfter;
};
const MemeTokens: any = [
  bera.yeet,
  // bera.bonga,
  bera.bblast,
  bera.bm,
  bera.henlo,
  // bera.lbgt,
  // bera.azt,
  // bera.artio,
  bera.bitcoin
];

export const MoreButton = (props: {
  onClick: () => void;
  classname?: string;
  text?: string;
}) => {
  const { onClick = () => { }, classname = "", text = "more" } = props;

  return (
    <button
      onClick={onClick}
      className={`lg:pt-[8px] md:pt-[4px] rounded-[16px] border border-black font-CherryBomb text-[20px] md:text-[16px] font-[400]  bg-[#FFAFDF] shadow-shadow1 ${classname}`}
    >
      <div className="lg:rounded-[16px] md:rounded-[16px] bg-[#FF80CC] md:px-[12px] lg:px-[16px] pt-[7px] pb-[15px] leading-none">
        {text}
      </div>
    </button>
  );
};

const MarketplaceView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openFrom = searchParams.get("from");

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [defaultInputCurrency, setDefaultInputCurrency] = useState<any>(
    bera.bera
  );
  const isMobile = useIsMobile();
  const { voulmes } = useTokenVolume();
  const [searchVal, setSearchVal] = useState("");
  const [showHenloBubble, setShowHenloBubble] = useState(false);
  const TOKENS_PER_PAGE = 9;
  const [displayCount, setDisplayCount] = useState(TOKENS_PER_PAGE);

  const inputSearchVal = useDebounce(searchVal, { wait: 500 });
  const onFooterMore = () => {
    router.push("/marketplace/tokens");
  };

  const [protocols, allTokens, totalTokens] = useMemo(() => {
    const _tokens: any[] = [];
    const hasTokens: any = {};
    const _protocols: string[] = [];
    Object.values(dexs).forEach((item) => {
      _protocols.push(item.name);
      item.tokens[80094].forEach((token: any) => {
        if (
          // hide BERA
          // @Amy Add a BERA token to the marketplace, with the swap defaulting to display HONEY-BERA
          // token.isNative ||
          // do not display Meme tokens in the Hot section, ensuring there is no overlap with the sections below.
          MemeTokens.some(
            (meme: any) =>
              meme.address.toLowerCase() === token.address.toLowerCase()
          )
        ) {
          return;
        }
        if (!hasTokens[token.symbol]) {
          if (inputSearchVal) {
            if (token.symbol.toLowerCase().includes(inputSearchVal.toLowerCase())
              || token.name.toLowerCase().includes(inputSearchVal.toLowerCase())
              || token.address.toLowerCase().includes(inputSearchVal.toLowerCase())
            ) {
              _tokens.push(token);
              hasTokens[token.symbol] = true;
            }
          } else {
            _tokens.push(token);
            hasTokens[token.symbol] = true;
          }

        }
      });
    });

    return [_protocols, splitArray(swapPosition(_tokens)), _tokens.length];
  }, [dexs, inputSearchVal]);

  function swapPosition(_tokens: any) {
    let i = -1
    let j = -1
    _tokens?.forEach((_token: any, index: number) => {
      if (_token.symbol === "iBERA") {
        i = index
      }
      if (_token?.symbol === "HOLD") {
        j = index
      }
    })

    if (i > -1 && j > -1) {
      _tokens?.splice(i, 0, _tokens.splice(j, 1)[0])
    }
    return _tokens
  }
  const visibleTokens = useMemo(() => {
    const groupsToShow = Math.ceil(displayCount / 3);
    return allTokens.slice(0, groupsToShow);
  }, [allTokens, displayCount]);

  const { data: price7dData, fullData: price7dFullData } = usePrice7d({ visibleTokens });

  const onMore = () => {
    setDisplayCount((prev) => Math.min(prev + TOKENS_PER_PAGE, totalTokens));
  };

  const showMoreButton = displayCount < totalTokens;

  const getAnimationName = (idx: number) => {
    if (hoveredIndex === null) {
      return "default";
    }
    if (hoveredIndex === idx) {
      return "hover";
    }
    if (hoveredIndex > 0 && hoveredIndex - 1 === idx) {
      return "prev";
    }
    if (hoveredIndex < 11 && hoveredIndex + 1 === idx) {
      return "next";
    }

    return "default";
  };

  const onSwap = (item: any) => {
    let _defaultInput = bera.bera;
    if (item.address.toLowerCase() === bera.bera.address.toLowerCase()) {
      _defaultInput = bera.honey;
    }
    setDefaultInputCurrency(_defaultInput);
    setSelectedRecord(item);
  };

  useEffect(() => {
    if (openFrom !== "bera-price") {
      return;
    }
    onSwap(bera.bera);
  }, [openFrom]);

  return (
    <div className="relative md:overflow-y-scroll overflow-x-hidden md:h-[calc(100dvh_-_62px)]" onClick={() => setShowHenloBubble(false)}>
      {!isMobile && (
        <>
          <PageBack className="absolute left-[40px] top-[31px]" />
          <PageTitle className="pt-[30px] mb-[75px] hidden lg:block">
            Token Marketplace
          </PageTitle>
        </>
      )}
      <img
        src="/images/mobile/market-header.png"
        className="w-full h-[30.769vw] absolute top-[0px] z-[11] hidden md:block"
        alt=""
      />

      {
        !isMobile && <div className="flex justify-end lg:w-[1200px] md:w-full mx-auto">
          <div className="flex items-center rounded-[10px] border overflow-hidden border-black/50 bg-white px-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="#3D4159" strokeWidth="2" opacity="0.4" fill="white" />
              <line x1="16.2" y1="16.2" x2="21" y2="21" stroke="#3D4159" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            </svg>
            <input className="w-[200px] h-[40px] px-2 text-black text-[14px]" placeholder="Search token" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} />
          </div>
        </div>
      }

      <div className="relative z-[10] mt-[20px] md:mt-[26vw] lg:w-[1200px] md:w-full mx-auto rounded-[20px] lg:mb-[100px] md:mb-[50px] p-[12px] md:pt-[56px] border-[2px] border-black bg-[#D5AD67] shadow-shadow1">
        <div className="absolute z-[2] border-black leading-none rounded-[20px] border bg-[#FF80CC] lg:text-[32px] md:text-[18px] rotate-[-5deg] md:px-[12px] lg:px-[24px] lg:pt-[18px] lg:pb-[22px] md:py-[10px] shadow-shadow1 font-CherryBomb lg:top-[-30px] lg:left-[50%] lg:translate-x-[-50%] md:left-0 md:top-[30px]">
          Hot Tokens
        </div>
        <div
          style={{ boxShadow: "inset 10px 10px rgba(0,0,0,0.25)" }}
          className="rounded-[20px] border-[2px] border-black bg-[#695d5d] overflow-visible md:pb-[40px]"
        >
          {visibleTokens.map((item, index) => (
            <div
              key={"pots" + index}
              className="overflow-hidden pb-[10px] last:overflow-visible last:pb-[0] last:mb-[-2px]"
            >
              <div className="pt-[36px] px-[22px] md:pl-0 flex flex-nowrap">
                {item.length > 0 &&
                  item.map((it: any, idx) => (
                    <div className="basis-1/3" key={"pot" + idx}>
                      <HoneypotCard
                        name={it.symbol}
                        color={it.color}
                        icon={it.icon}
                        {...it}
                        onSwap={() => onSwap(it)}
                        voulmes={voulmes}
                        priceData={price7dData[it.symbol]}
                        priceFullData={price7dFullData[it.symbol]}
                      />
                    </div>
                  ))}
              </div>
              {(isMobile ||
                (index !== visibleTokens.length - 1 && !isMobile)) && (
                  <div className="w-full h-[16px] relative top-[-2px] rounded-[10px] border-black border-[2px] lg:bg-[#D5AD67] md:bg-[#9E762F] shadow-shadow1"></div>
                )}
            </div>
          ))}
        </div>
        {/* <div className="absolute w-[10px] right-[2px] bottom-0 h-[90%] bg-[#D5AD67]"></div> */}
        {showMoreButton && (
          <MoreButton
            classname="absolute bottom-[-17px] lg:right-[-12px] md:right-[0]"
            onClick={onMore}
          />
        )}
      </div>
      <div className="relative md:px-4 w-full bg-[#7990F4] pb-[40px]">
        <div className="lg:mx-auto lg:w-[1200px] md:w-full relative md:top-3 pb-[40px]">
          <div className="absolute bottom-[-31px] left-[50%] translate-x-[-50%] z-0 rounded-[12px] border border-black w-[1172px] h-[126px] bg-[#F5BD61] hidden lg:block" />
          <div className="relative z-10 lg:w-[1196px]">
            <MemeTokensGrid
              MemeTokens={MemeTokens}
              voulmes={voulmes}
              onSwap={onSwap}
              onFooterMore={onFooterMore}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-[10px] left-1/2 transform -translate-x-1/2 lg:w-[1200px] md:w-full z-30 h-[240px] md:hidden">
        <div className="w-[150px] h-[240px] absolute bottom-[0] right-[-100px]" onClick={(e) => {
          e.stopPropagation();
          setShowHenloBubble(true);
        }}>
          <AnimatePresence>
            {showHenloBubble && (
              <motion.div
                initial={{ scale: 0, opacity: 0, originX: 1, originY: 1 }}
                animate={{ scale: 1, opacity: 1, originX: 1, originY: 1 }}
                exit={{ scale: 0, opacity: 0, originX: 1, originY: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-[124px] h-[101px] absolute top-[-105px] left-[-40px]"
              >
                <img src="/images/market-place/pao.png" alt="cloud" className="w-full h-full absolute top-0 left-0" />
                <div className="w-full h-full absolute top-0 left-0 font-CherryBomb text-[18px] text-center leading-[90%] pt-[10px]">
                  Henlo!<br /> I heard you liked <br />$HENLO
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <img src="/images/market-place/henlo-body.png" alt="cloud" className="w-full h-full absolute top-0 left-0" />
          <motion.img
            src="/images/market-place/henlo-arm.png"
            alt="cloud"
            className="absolute w-[60px] h-[50px] left-[108px] top-[112px]"
            style={{ transformOrigin: "left bottom" }}
            animate={{ rotate: [0, 20, 0, 20, 0, 0] }}
            transition={{
              duration: 9,
              times: [
                0,
                0.055,
                0.111,
                0.166,
                0.221,
                1
              ],
              repeat: Infinity,
              repeatType: "loop",
              ease: [
                "easeInOut",
                "easeInOut",
                "easeInOut",
                "easeInOut",
                "linear"
              ]
            }}
          />
          <img src="/images/market-place/henlo-cloth.png" alt="cloud" className="w-[101px] h-[62px] absolute top-[140px] left-[23px]" />
        </div>
      </div>

      {selectedRecord && (
        <SwapModal
          defaultOutputCurrency={selectedRecord}
          defaultInputCurrency={defaultInputCurrency}
          outputCurrencyReadonly={true}
          show={!!selectedRecord}
          protocols={protocols}
          onClose={() => {
            setSelectedRecord(null);
          }}
          from="marketplace"
        />
      )}
    </div>
  );
};

export default MarketplaceView;
