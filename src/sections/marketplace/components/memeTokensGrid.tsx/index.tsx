import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Tooltip from "@/components/tooltip";
import { MoreButton } from "../..";
import { numberFormatter } from "@/utils/number-formatter";
import useIsMobile from "@/hooks/use-isMobile";
import { usePriceStore } from "@/stores/usePriceStore";

const TokenRow = ({
  tokens,
  voulmes,
  onSwap,
  setHoveredIndex,
  startIndex
}: any) => {
  const getAnimationName = (index: any) => {
    if (index === null) return "default";
    return index === setHoveredIndex ? "hover" : "default";
  };
  const prices = usePriceStore((store: any) => store.price);
  return (
    <div className="lg:h-[86px] md:h-[50px] w-full rounded-t-[10px] bg-[#D5AD67] border border-black border-b-0 p-[12px] md:mt-[-16px]">
      <div className="w-full lg:h-[91px] md:h-[40px] relative top-[-50%] overflow-hidden">
        <div className="w-full absolute bottom-0 lg:h-[62px] md:h-[30px] bg-[#402E10] border border-black rounded-[10px] flex flex-nowrap lg:px-[32px] md:px-[16px] lg:gap-x-[32px] md:gap-x-[16px]">
          {tokens.map((item: any, index: any) => {
            let _price: any = prices[item.priceKey || item.symbol];
            let _volume: any = voulmes
              ? voulmes[item.priceKey || item.symbol]
              : "";
            return (
              <Tooltip
                key={"tooltip" + (startIndex + index)}
                isShake={true}
                offset={30}
                tooltip={
                  <div>
                    <div className="flex items-end gap-x-[3px] mb-[16px]">
                      <div className="text-[20px] font-CherryBomb leading-none">
                        {item.symbol}
                      </div>
                      {/* <div className="text-[#3D405A] text-[14px] font-Montserrat">
                    blackcat
                  </div> */}
                    </div>
                    <div className="flex flex-nowrap mb-[16px] last:mb-0 items-start justify-between gap-x-[20px] text-[#3D405A] text-[14px] font-Montserrat">
                      <div className="grow">Price</div>
                      <div className="font-[600] flex-shrink-0">
                        {_price
                          ? numberFormatter(_price, 6, true, { prefix: "$" })
                          : "-"}
                      </div>
                    </div>
                    <div className="flex flex-nowrap mb-[16px] last:mb-0 items-start justify-between gap-x-[20px] text-[#3D405A] text-[14px] font-Montserrat">
                      <div className="grow">Volume</div>
                      <div className="font-[600] flex-shrink-0">
                        {_volume
                          ? numberFormatter(_volume, 2, true, {
                              prefix: "$",
                              isShort: true
                            })
                          : "-"}
                      </div>
                    </div>
                  </div>
                }
              >
                <motion.div
                  onHoverStart={() => setHoveredIndex(startIndex + index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  className="shadow-shadow1 rounded-full"
                  animate={{
                    x: [1200, -10, 0]
                  }}
                  transition={{
                    duration: 3.5,
                    times: [0, 0.85, 1]
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, -1090, -1080]
                    }}
                    transition={{
                      duration: 3.5,
                      times: [0, 0.85, 1]
                    }}
                  >
                    <motion.div
                      className="cursor-pointer bg-[#ffffff] rounded-[50%] lg:w-[80px] lg:h-[80px] md:w-[50px] md:h-[50px] p-0 md:top-[-8px] md:relative"
                      animate={getAnimationName(startIndex + index)}
                      variants={{
                        hover: { scale: 1.5 },
                        default: { scale: 1 },
                        prev: {},
                        next: {}
                      }}
                    >
                      <motion.img
                        alt=""
                        className="cursor-pointer lg:w-[80px] lg:h-[80px] md:w-[50px] md:h-[50px]"
                        src={item.icon}
                        style={{
                          borderRadius: "50%",
                          objectFit: "cover"
                        }}
                        onClick={() => onSwap(item)}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MemeTokensGrid = ({ MemeTokens, voulmes, onSwap }: any) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const isMobile = useIsMobile();
  const [displayCount, setDisplayCount] = useState(10);

  const TOKENS_PER_ROW = isMobile ? 5 : 10;

  useEffect(() => {
    setDisplayCount(isMobile ? 5 : 10);
  }, [isMobile]);

  const visibleTokenRows = useMemo(() => {
    const tokens = MemeTokens.slice(0, displayCount);
    const rows = [];
    for (let i = 0; i < tokens.length; i += TOKENS_PER_ROW) {
      rows.push(tokens.slice(i, Math.min(i + TOKENS_PER_ROW, tokens.length)));
    }
    return rows;
  }, [MemeTokens, displayCount, TOKENS_PER_ROW]);

  const onFooterMore = () => {
    setDisplayCount((prev) =>
      Math.min(prev + TOKENS_PER_ROW, MemeTokens.length)
    );
  };

  const showMoreButton = displayCount < MemeTokens.length;

  return (
    <>
      {visibleTokenRows.map((rowTokens, rowIndex) => (
        <React.Fragment key={rowIndex}>
          <TokenRow
            tokens={rowTokens}
            voulmes={voulmes}
            onSwap={onSwap}
            setHoveredIndex={setHoveredIndex}
            startIndex={rowIndex * TOKENS_PER_ROW}
          />
          {
            <div className="relative">
              {rowIndex === visibleTokenRows.length - 1 && (
                <div className="absolute top-[9px] lg:left-[50%] lg:right-0 md:left-0 lg:translate-x-[-50%] z-10 font-CherryBomb lg:text-[32px] md:text-[18px] leading-[0.9] lg:p-[21px] md:p-[12px] bg-[#B2E946] border border-black rounded-[20px] rotate-[5deg] shadow-shadow1 w-fit">
                  Meme Tokens
                </div>
              )}
              {rowIndex === visibleTokenRows.length - 1 && showMoreButton && (
                <MoreButton
                  classname="absolute top-[50%] translate-y-[-50%] right-[-12px]"
                  onClick={onFooterMore}
                />
              )}
              <div className="z-0 lg:shadow-shadow1 w-full h-[44px] bg-[#9E762F] rounded-b-[10px] border border-black mb-[7px] md:font-CherryBomb md:text-[#D5AD67] md:pl-4 md:text-[18px] md:pt-1">
                {isMobile ? "Meme tokens" : ""}
              </div>
              <div className="hidden lg:block z-0 shadow-shadow1 w-full h-[44px] bg-[#9E762F] rounded-[10px] border border-black" />
            </div>
          }
        </React.Fragment>
      ))}
    </>
  );
};

export default MemeTokensGrid;
