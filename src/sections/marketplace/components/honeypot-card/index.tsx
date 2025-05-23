"use client";

import Popover, { PopoverPlacement } from "@/components/popover";
import { balanceFormated } from "@/utils/balance";
import { useMemo, useRef } from "react";
import { usePriceStore } from "@/stores/usePriceStore";
import useIsMobile from "@/hooks/use-isMobile";
import { numberFormatter } from "@/utils/number-formatter";
import { Line, LineChart, Tooltip, YAxis } from 'recharts';
import Big from 'big.js';

const HoneypotCard = (props: any) => {
  const {
    color,
    name,
    priceKey,
    symbol,
    icon,
    data = {},
    voulmes,
    priceData,
    priceFullData,
    onSwap = () => {}
  } = props;

  const prices = usePriceStore((store) => store.price);
  const isMobile = useIsMobile();

  const Honeypot = (props: any) => (
    <>
      <Popover
        placement={PopoverPlacement.Center}
        content={
          isMobile ? (
            <div className="w-[118px] h-[118px] rounded-[18px] p-[10px] bg-[#FFE5B8] border border-[#000] flex flex-col justify-center items-center gap-[7px] shadow-shadow1">
              <div className="text-[18px] font-[400] leading-[18px] text-center font-CherryBomb text-[#F7F9EA] text-stroke-2">
                {symbol}
              </div>
              <div className="text-[12px] font-[400] leading-[14.4px] text-left font-Montserrat">
                Volume
              </div>
              <div className="flex gap-1">
                <div className="text-[14px] font-[600] leading-[12.6px] font-Montserrat">
                  {props.volume?.value}
                </div>
                <div className="text-[10px] font-[600] leading-[9px] font-Montserrat text-[#06B000]">
                  {/* {props.volume?.type} */}
                  {/* {props.volume?.rate} */}
                </div>
              </div>
              <div
                onClick={onSwap}
                className="border-[2px] border-[#4B371F] w-[98px] leading-[32px] h-[32px] rounded-[30px] bg-[#FFF5A9] text-center font-[700] text-[14px] font-Montserrat"
              >
                Get
              </div>
            </div>
          ) : null
        }
      >
        <div className="relative left-[26px] flex-shrink-0 ml-[-26px] z-[3] md:flex md:justify-center md:w-[100px]">
          <div className="absolute lg:top-[42%] lg:left-[32%] md:top-[40%] md:left-[36%] lg:w-[42px] lg:h-[42px] md:w-[28px] md:h-[28px] rounded-[50%] border border-black overflow-hidden">
            <img alt="" src={icon} className="w-full h-full object-contain" />
          </div>
          <svg
            className="md:w-[70px] md:h-[64px]"
            width="110"
            height="101"
            viewBox="0 0 110 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M55.1045 23.9387C25.2234 23.9387 1 21.2153 1 53.0588C1 72.4146 9.94989 89.5428 23.6802 100H86.5288C100.259 89.5428 109.209 72.4146 109.209 53.0588C109.209 21.2153 84.9855 23.9387 55.1045 23.9387Z"
              fill="#8D5B1B"
              stroke="black"
            />
            <path
              d="M1.25061 47.7612C1.08482 49.4112 1 51.1745 1 53.0588C1 63.6442 3.67678 73.5634 8.34834 82.0896H101.861C106.532 73.5634 109.209 63.6442 109.209 53.0588C109.209 51.1745 109.124 49.4112 108.958 47.7612H1.25061Z"
              fill={color}
              stroke="black"
            />
            <circle
              cx="55.4776"
              cy="63.4329"
              r="25.8731"
              fill="#FBFFCF"
              stroke="black"
            />
            <mask id="path-4-inside-1_22057_76" fill="white">
              <path d="M95.1658 0H13.7363C10.4975 0 7.87194 2.51436 7.87194 5.61598V6.17758C7.87194 10.0987 9.0454 12.4625 11.1244 15.5596C13.2034 18.6567 10.6677 20.703 7.0198 26.0106C1.42299 34.1538 1.18722 38.7011 2.23494 40.8929C6.76666 50.3731 15.2289 28.7313 21.9453 29.4776C28.6617 30.2239 30.1543 38.085 42.8409 36.9403C56.2661 35.729 57.7663 28.1406 65.229 26.0106C72.6916 23.8806 80.5275 29.5029 81.2737 38.085C82.02 46.667 82.7663 54.4776 90.0339 52.9673C95.8831 51.7518 94.7066 42.2969 90.9752 34.1538C88.624 29.0225 94.721 28.8841 100.304 32.8358C102.165 34.1538 105.154 39.0078 107.02 38.806C108.886 38.6041 110.805 33.4126 106.274 28.3582C101.742 23.3038 95.826 20.8955 96.5723 16.4179C98.4379 11.5672 101.03 10.0987 101.03 6.17758V5.61598C101.03 2.51436 98.4046 0 95.1658 0Z" />
            </mask>
            <path
              d="M95.1658 0H13.7363C10.4975 0 7.87194 2.51436 7.87194 5.61598V6.17758C7.87194 10.0987 9.0454 12.4625 11.1244 15.5596C13.2034 18.6567 10.6677 20.703 7.0198 26.0106C1.42299 34.1538 1.18722 38.7011 2.23494 40.8929C6.76666 50.3731 15.2289 28.7313 21.9453 29.4776C28.6617 30.2239 30.1543 38.085 42.8409 36.9403C56.2661 35.729 57.7663 28.1406 65.229 26.0106C72.6916 23.8806 80.5275 29.5029 81.2737 38.085C82.02 46.667 82.7663 54.4776 90.0339 52.9673C95.8831 51.7518 94.7066 42.2969 90.9752 34.1538C88.624 29.0225 94.721 28.8841 100.304 32.8358C102.165 34.1538 105.154 39.0078 107.02 38.806C108.886 38.6041 110.805 33.4126 106.274 28.3582C101.742 23.3038 95.826 20.8955 96.5723 16.4179C98.4379 11.5672 101.03 10.0987 101.03 6.17758V5.61598C101.03 2.51436 98.4046 0 95.1658 0Z"
              fill="#FFDC50"
            />
            <path
              d="M11.1244 15.5596L10.2941 16.117L11.1244 15.5596ZM7.0198 26.0106L6.19568 25.4442H6.19568L7.0198 26.0106ZM2.23494 40.8929L1.33272 41.3242H1.33272L2.23494 40.8929ZM21.9453 29.4776L21.8349 30.4715L21.9453 29.4776ZM42.8409 36.9403L42.9308 37.9363H42.9308L42.8409 36.9403ZM81.2737 38.085L80.2775 38.1716L81.2737 38.085ZM90.0339 52.9673L89.8304 51.9882L90.0339 52.9673ZM90.9752 34.1538L90.0661 34.5703V34.5703L90.9752 34.1538ZM107.02 38.806L107.128 39.8002L107.02 38.806ZM106.274 28.3582L105.529 29.0258L106.274 28.3582ZM96.5723 16.4179L95.6389 16.0589L95.6025 16.1535L95.5859 16.2535L96.5723 16.4179ZM100.304 32.8358L100.881 32.0196V32.0196L100.304 32.8358ZM13.7363 1H95.1658V-1H13.7363V1ZM100.03 5.61598V6.17758H102.03V5.61598H100.03ZM8.87194 6.17758V5.61598H6.87194V6.17758H8.87194ZM95.1658 1C97.8935 1 100.03 3.107 100.03 5.61598H102.03C102.03 1.92172 98.9156 -1 95.1658 -1V1ZM13.7363 -1C9.98646 -1 6.87194 1.92173 6.87194 5.61598H8.87194C8.87194 3.10699 11.0086 1 13.7363 1V-1ZM11.9547 15.0023C9.9307 11.9871 8.87194 9.81958 8.87194 6.17758H6.87194C6.87194 10.3778 8.1601 12.9379 10.2941 16.117L11.9547 15.0023ZM10.2941 16.117C10.7286 16.7642 10.8747 17.2808 10.8731 17.7495C10.8715 18.2353 10.7111 18.7822 10.3366 19.487C9.95879 20.198 9.40432 20.996 8.68399 21.9855C7.97547 22.9588 7.11788 24.1024 6.19568 25.4442L7.84392 26.577C8.74567 25.265 9.57299 24.1625 10.3009 23.1626C11.017 22.1789 11.6505 21.2765 12.1028 20.4254C12.5584 19.568 12.87 18.6909 12.8731 17.7561C12.8763 16.8042 12.5597 15.9036 11.9547 15.0023L10.2941 16.117ZM6.19568 25.4442C3.35712 29.5742 1.83386 32.8544 1.16747 35.4334C0.501075 38.0123 0.677463 39.9534 1.33272 41.3242L3.13716 40.4617C2.7447 39.6406 2.51511 38.2122 3.10387 35.9337C3.69264 33.6552 5.08567 30.5902 7.84392 26.577L6.19568 25.4442ZM1.33272 41.3242C1.94617 42.6075 2.70694 43.5429 3.68408 43.9996C4.7019 44.4753 5.7454 44.3376 6.68896 43.9173C7.61009 43.5069 8.51434 42.7971 9.3801 41.976C10.2547 41.1466 11.1455 40.1493 12.032 39.1091C13.8351 36.9933 15.6035 34.7275 17.3699 32.9931C18.2455 32.1334 19.074 31.4531 19.85 31.0121C20.6259 30.5711 21.2779 30.4096 21.8349 30.4715L22.0557 28.4837C20.9336 28.359 19.8519 28.7106 18.8618 29.2733C17.8717 29.836 16.9018 30.6499 15.9687 31.566C14.1179 33.3833 12.2281 35.7955 10.5098 37.8119C9.63542 38.8378 8.79962 39.7701 8.00384 40.5248C7.19926 41.2878 6.48948 41.8166 5.87506 42.0904C5.28307 42.3541 4.8695 42.346 4.5309 42.1877C4.15163 42.0105 3.65665 41.5484 3.13716 40.4617L1.33272 41.3242ZM21.8349 30.4715C23.3103 30.6354 24.5154 31.1874 25.7192 31.9608C26.3274 32.3516 26.9258 32.7924 27.5648 33.2698C28.1963 33.7415 28.8687 34.2499 29.5895 34.7433C32.5472 36.7677 36.3196 38.5327 42.9308 37.9363L42.751 35.9443C36.6756 36.4925 33.3584 34.8993 30.7191 33.0928C30.0406 32.6284 29.4071 32.1496 28.7617 31.6675C28.1239 31.191 27.4746 30.7114 26.8002 30.2781C25.4387 29.4034 23.9385 28.6929 22.0557 28.4837L21.8349 30.4715ZM42.9308 37.9363C49.8712 37.31 53.7792 35.0167 56.8835 32.6103C60.0217 30.1776 62.0174 27.9672 65.5034 26.9722L64.9545 25.049C60.9778 26.184 58.4921 28.8328 55.6582 31.0296C52.7904 33.2527 49.2358 35.3593 42.751 35.9443L42.9308 37.9363ZM65.5034 26.9722C72.2927 25.0344 79.5793 30.1422 80.2775 38.1716L82.27 37.9983C81.4756 28.8636 73.0906 22.7268 64.9545 25.049L65.5034 26.9722ZM80.2775 38.1716C80.6456 42.4053 81.0238 46.6843 82.286 49.6972C82.9276 51.2287 83.8397 52.5436 85.1943 53.3463C86.5657 54.1589 88.2444 54.3606 90.2374 53.9464L89.8304 51.9882C88.1896 52.3292 87.0496 52.1209 86.2138 51.6256C85.3611 51.1204 84.6774 50.2295 84.1307 48.9244C83.0162 46.2641 82.6481 42.3467 82.27 37.9983L80.2775 38.1716ZM90.2374 53.9464C91.9973 53.5806 93.2599 52.5722 94.0488 51.1433C94.8164 49.7528 95.1127 48.0117 95.0972 46.1501C95.0662 42.426 93.7838 37.8825 91.8843 33.7372L90.0661 34.5703C91.898 38.5682 93.0695 42.8237 93.0973 46.1667C93.1112 47.8386 92.8381 49.1981 92.2979 50.1767C91.7788 51.117 90.995 51.7462 89.8304 51.9882L90.2374 53.9464ZM107.128 39.8002C108.027 39.7029 108.725 39.0503 109.176 38.3294C109.646 37.5771 109.96 36.5895 110.043 35.4766C110.212 33.2295 109.452 30.4047 107.018 27.6907L105.529 29.0258C107.627 31.3661 108.173 33.6642 108.049 35.327C107.985 36.169 107.752 36.833 107.48 37.2689C107.188 37.7361 106.946 37.8081 106.912 37.8118L107.128 39.8002ZM100.03 6.17758C100.03 7.87086 99.4887 9.03075 98.6442 10.4333C97.7957 11.8423 96.6125 13.5277 95.6389 16.0589L97.5056 16.7769C98.3977 14.4573 99.4434 12.9831 100.358 11.465C101.276 9.94032 102.03 8.40541 102.03 6.17758H100.03ZM107.018 27.6907C105.841 26.3779 104.583 25.2461 103.39 24.229C102.176 23.1936 101.08 22.3166 100.12 21.4354C98.1883 19.6603 97.2778 18.2676 97.5587 16.5823L95.5859 16.2535C95.1205 19.0458 96.7949 21.0961 98.7673 22.9082C99.7603 23.8205 100.946 24.7732 102.092 25.7508C103.26 26.7467 104.44 27.8113 105.529 29.0258L107.018 27.6907ZM91.8843 33.7372C91.3466 32.5637 91.4199 31.9419 91.5546 31.6658C91.6698 31.4295 91.9784 31.1579 92.7582 31.0842C94.3516 30.9338 97.0324 31.7455 99.7258 33.652L100.881 32.0196C97.9922 29.9745 94.8332 28.8795 92.5702 29.0931C91.4219 29.2015 90.2981 29.6796 89.757 30.789C89.2353 31.8585 89.4282 33.1782 90.0661 34.5703L91.8843 33.7372ZM99.7258 33.652C100.089 33.9092 100.559 34.3813 101.132 35.0205C101.41 35.3315 101.699 35.6649 101.999 36.0117C102.297 36.356 102.606 36.7126 102.916 37.0584C103.528 37.7417 104.184 38.4264 104.829 38.9312C105.426 39.3986 106.241 39.8961 107.128 39.8002L106.912 37.8118C106.866 37.8167 106.607 37.7832 106.062 37.356C105.563 36.9662 105.005 36.393 104.405 35.7232C104.108 35.3925 103.811 35.0489 103.511 34.7027C103.214 34.3591 102.913 34.0119 102.621 33.6856C102.051 33.0503 101.449 32.4214 100.881 32.0196L99.7258 33.652Z"
              fill="black"
              mask="url(#path-4-inside-1_22057_76)"
            />
          </svg>
          <button className="hidden md:block absolute md:bottom-[-24px] md:z-[10] border border-black md:bg-[#E9B965] rounded-[10px] md:px-[12px] py-[7px] leading-none font-Montserrat font-[600] text-[#000] md:text-sm">
            {symbol}
          </button>
        </div>
      </Popover>
    </>
  );

  const list = useMemo(() => {
    let _price: any = prices[priceKey || symbol];
    let _rate: any = 0;
    let _volume: any = voulmes ? voulmes[priceKey || symbol] : "";

    return [
      {
        label: "Price",
        key: "price",
        type: "+",
        rate: balanceFormated(_rate, 2) + "%",
        value: _price ? numberFormatter(_price, 6, true, { prefix: "$" }) : "-"
      },
      {
        label: "Volume",
        key: "volume",
        type: "+",
        rate: balanceFormated(Math.random() * 10, 2) + "%",
        value: _volume
          ? numberFormatter(_volume, 2, true, { prefix: "$", isShort: true })
          : "-"
      }
    ];
  }, [name, prices, voulmes]);

  const getCustomDomain = (data: any[], key: string) => {
    if (!data?.length) return [0, 0];
    const values = data.map(item => item[key]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    return [min - padding, max + padding];
  };

  return (
    <div className="flex items-end justify-center md:relative">
      <Honeypot volume={list?.[1]} />
      <div className="flex-shrink-0 lg:relative lg:pb-[12px] lg:w-[194px]">
        <div className="rounded-[18px] border border-black pl-[8px] bg-[#B99C69] shadow-shadow1 hidden lg:block">
          <div className="w-full h-full rounded-[18px] border border-black bg-[#FFE5B8] py-[11px] pl-[8px] pr-[12px]">
            {/*title*/}
            <div className="text-[20px] text-center font-CherryBomb leading-none mb-[7px]">
              {symbol}
            </div>
            {list.map((item, index) => (
              <div
                key={item.key}
                className="flex-shrink-0 leading-none mb-[10px] last:mb-0 flex items-start justify-between text-[14px] font-Montserrat pl-[16px]"
              >
                <div className="text-[#3D405A] font-[600] whitespace-nowrap text-[12px] leading-[100%]">{item.label}</div>
                <div>
                  <div className=" font-[600] text-[12px] leading-[100%] mb-[2px]">{item.value}</div>
                  <div
                    className={`text-[10px] text-right ${
                      item.type === "+" ? "text-[#06B000]" : "text-[#FF008A]"
                    }`}
                  >
                    {/* {item.type} */}
                    {/* {item.rate} */}
                  </div>
                </div>
              </div>
            ))}
            {
              !isMobile && (
                <div className="w-full flex-shrink-0 leading-none mb-[13px] last:mb-0 flex items-start text-[14px] font-Montserrat pl-[16px]">
                  <div className="text-[#3D405A] font-[600] whitespace-nowrap text-[12px] leading-[100%]">Last 7 days</div>
                  <div className="w-[86px] shrink-0">
                    <LineChart
                      width={86}
                      height={32}
                      data={priceData}
                      margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                    >
                      <YAxis
                        domain={getCustomDomain(priceData, priceKey || "price")}
                        hide
                      />
                      <Line
                        type="natural"
                        dataKey="price"
                        stroke={priceFullData?.length ? Big(priceFullData[priceFullData.length - 1]?.price || 0).gte(priceFullData[priceFullData.length - 2]?.price || 0) ? "#76A813" : "#FF1DA5" : "#76A813"}
                        strokeWidth={1}
                        dot={false}
                        activeDot={false}
                        isAnimationActive={false}
                        animationBegin={0}
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                      />
                      <Tooltip
                        position={{ y: -30 }}
                        content={({ active, payload, label }) => {
                          if (!active || !payload || !payload.length) return null;
                          return (
                            <div className="custom-tooltip bg-[#FFFDEB] border border-[#000] rounded-[4px] p-[5px] text-[10px] leading-1 whitespace-nowrap">
                              <p className="label">{`${payload[0]?.payload.date}`}</p>
                              <p className="value">
                                {`Price: ${numberFormatter(payload[0]?.value as any, 6, true, { isShort: true, prefix: "$" })}`}
                              </p>
                            </div>
                          );
                        }}
                      />
                    </LineChart>
                  </div>
                </div>
              )
            }
          </div>
        </div>
        <button
          onClick={onSwap}
          className="hidden lg:block absolute lg:bottom-[-12px] md:bottom-[-24px] md:left-[36px] lg:left-1/2 lg:translate-x-[-50%] md:z-[10] lg:z-[2] lg:hover:scale-[1.1] lg:ease-in-out lg:duration-300 border border-black lg:bg-[#FFDC50] md:bg-[#E9B965] rounded-[10px] md:px-[12px] lg:px-[24px] py-[7px] leading-none font-Montserrat font-[600] text-[#000] lg:text-[16px] md:text-sm"
        >
          Swap
        </button>
      </div>
    </div>
  );
};

export default HoneypotCard;

interface Props {
  color: string;
  name: string;
  icon: string;
  data?: any;
  onSwap?: () => void;
}
