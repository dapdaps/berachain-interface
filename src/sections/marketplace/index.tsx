"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import HoneypotCard from "@/sections/marketplace/components/honeypot-card/index";
import PageBack from "@/components/back";
import PageTitle from "@/components/title";
import Tooltip from "@/components/tooltip";
import dexs from "@/configs/swap";
import SwapModal from "@/sections/swap/SwapModal";
import { useMemo } from "react";
import { beraB } from "@/configs/tokens/bera-bArtio";
import useIsMobile from "@/hooks/use-isMobile";
import MemeTokensGrid from "./components/memeTokensGrid.tsx";

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

const HotTokens = [
  beraB.paw,
  beraB.wbtc,
  beraB.weth,
  beraB.honey,
  beraB.usdc,
  beraB.bera
  // beraB.usdt,
  // beraB.dai
];

const MemeTokens = [
  {
    ...beraB.spepe,
    price: "$0.0000001",
    volume: "$0.9717"
  },
  {
    ...beraB.yeet,
    price: "$0.0000001",
    volume: "$0.9717"
  },
  {
    ...beraB.bebe,
    price: "$0.0000001",
    volume: "$0.9717"
  },
  {
    ...beraB.sproto,
    price: "$0.0000001",
    volume: "$0.9717"
  },
  {
    ...beraB.smonkey,
    price: "$0.0000001",
    volume: "$0.9717"
  },
  {
    ...beraB.croc,
    price: "$0.0000001",
    volume: "$0.9717"
  },
  {
    ...beraB.std,
    price: "$0.0000001",
    volume: "$0.9717"
  },
  {
    ...beraB["0x15p"],
    price: "$0.0000001",
    volume: "$0.9717"
  },
  {
    ...beraB.tedd,
    price: "$0.0000001",
    volume: "$0.9717"
  },
  {
    ...beraB.ooga,
    price: "$0.0000001",
    volume: "$0.9717"
  }
];

export const MoreButton = (props: {
  onClick: () => void;
  classname?: string;
  text?: string;
}) => {
  const { onClick = () => {}, classname = '', text = 'more' } = props;

  return (
    <button
      onClick={onClick}
      className={`lg:pt-[8px] md:pt-[4px] rounded-[16px] border border-black font-CherryBomb text-[20px] md:text-[16px] font-[400]  bg-[#FFAFDF] shadow-shadow1 ${classname}`}
    >
      <div className='lg:rounded-[16px] md:rounded-[16px] bg-[#FF80CC] md:px-[12px] lg:px-[16px] pt-[7px] pb-[15px] leading-none'>
        {text}
      </div>
    </button>
  );
};

const MarketplaceView = () => {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [defaultInputCurrency, setDefaultInputCurrency] = useState<any>(beraB.bera);
  const isMobile = useIsMobile();

  const TOKENS_PER_PAGE = 9;
  const [displayCount, setDisplayCount] = useState(TOKENS_PER_PAGE);

  const List = [
    {
      key: "price",
      label: "Price",
      value: "$0.0000001"
    },
    {
      key: "volume",
      label: "Volume",
      value: "$0.9717"
    }
  ];

  // const onMore = () => {
  //   router.push('/marketplace/tokens');
  // };

  const onFooterMore = () => {
    router.push("/marketplace/tokens");
  };

  const [protocols, allTokens, totalTokens] = useMemo(() => {
    const _tokens: any[] = [];
    const hasTokens: any = {};
    const _protocols: string[] = [];
    Object.values(dexs).forEach((item) => {
      _protocols.push(item.name);
      item.tokens[80084].forEach((token: any) => {
        if (
          // hide BERA
          token.isNative ||
          // do not display Meme tokens in the Hot section, ensuring there is no overlap with the sections below.
          MemeTokens.some((meme) => meme.address.toLowerCase() === token.address.toLowerCase())
        ) {
          return;
        }
        if (!hasTokens[token.symbol]) {
          _tokens.push(token);
          hasTokens[token.symbol] = true;
        }
      });
    });
    return [_protocols, splitArray(_tokens), _tokens.length];
  }, [dexs]);


    const visibleTokens = useMemo(() => {
      const groupsToShow = Math.ceil(displayCount / 3);
      console.log('====allTokens', allTokens)
      return allTokens.slice(0, groupsToShow);
    }, [allTokens, displayCount]);
  
    const onMore = () => {
      setDisplayCount(prev => Math.min(prev + TOKENS_PER_PAGE, totalTokens));
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
    let _defaultInput = beraB.bera;
    if (item.address.toLowerCase() === beraB.bera.address.toLowerCase()) {
      _defaultInput = beraB.honey;
    }
    setDefaultInputCurrency(_defaultInput);
    setSelectedRecord(item);
  };

  return (
    <div className='relative md:overflow-y-scroll overflow-x-hidden md:h-[calc(100dvh_-_62px)]'>
      {
        !isMobile && (<>
          <PageBack className='absolute left-[40px] top-[31px]' />
          <PageTitle className='pt-[30px] mb-[75px] hidden lg:block'>
            Marketplace
          </PageTitle>
        </>
      )}
      <img
        src="/images/mobile/market-header.png"
        className="w-full h-[30.769vw] absolute top-[0px] z-[1] hidden md:block"
        alt=""
      />

      <div className="relative mt-[100px] lg:w-[1200px] md:w-full mx-auto rounded-[20px] lg:mb-[100px] md:mb-[50px] p-[12px] md:pt-[56px] border-[2px] border-black bg-[#D5AD67] shadow-shadow1">
        <div className="absolute z-[2] border-black leading-none rounded-[20px] border bg-[#FF80CC] lg:text-[32px] md:text-[18px] rotate-[-5deg] md:px-[12px] lg:px-[24px] lg:pt-[18px] lg:pb-[22px] md:py-[10px] shadow-shadow1 font-CherryBomb lg:top-[-30px] lg:left-[50%] lg:translate-x-[-50%] md:left-0 md:top-[30px]">
          Hot Sell Tokens
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
                        onSwap={() => onSwap(it)}
                      />
                    </div>
                  ))}
              </div>
              {(isMobile || (index !== visibleTokens.length - 1 && !isMobile)) && (
                <div className="w-full h-[16px] relative top-[-2px] rounded-[10px] border-black border-[2px] lg:bg-[#D5AD67] md:bg-[#9E762F] shadow-shadow1"></div>
              )}
            </div>
          ))}
        </div>
        <div className='absolute w-[10px] right-[2px] bottom-0 h-[90%] bg-[#D5AD67]'></div>
        {showMoreButton && (
        <MoreButton
          classname='absolute bottom-[-17px] lg:right-[-12px] md:right-[0]'
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
              onSwap={onSwap}
              onFooterMore={onFooterMore}
            />
          </div>
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
