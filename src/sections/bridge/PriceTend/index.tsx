"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Line, LineChart, Tooltip, YAxis } from 'recharts';
import Big from 'big.js';
import SwitchTabs from "@/components/switch-tabs";
import { usePriceStore } from "@/stores/usePriceStore";
import { numberFormatter } from "@/utils/number-formatter";
import usePriceTend from "./usePriceTend";
import CircleLoading from "@/components/circle-loading";

interface PriceTendProps {
  className?: string;
  token1: {
    address: string;
    name: string;
    symbol: string;
    icon: string;
  }
  token2: {
    address: string;
    name: string;
    symbol: string;
    icon: string;
  }
}

const PriceTend = ({ className = "", token1, token2 }: PriceTendProps) => {
  const [currentToken, setCurrentToken] = useState(token1?.symbol);
  const { priceTend: priceTend1, isLoading: isLoading1 } = usePriceTend({ address: token1?.address })
  const { priceTend: priceTend2, isLoading: isLoading2 } = usePriceTend({ address: token2?.address })
  const prices = usePriceStore((store) => store.price);
  const currentTokenRef = useRef(token1?.symbol);

  const tabs = [
    { value: token1?.symbol, label: token1?.symbol },
    { value: token2?.symbol, label: token2?.symbol }
  ];

  const priceTendData1 = useMemo(() => {
    if (priceTend1?.length) {
      return priceTend1.map(item => ({
        price: item.price,
        date: new Date(item.timestamp * 1000).toLocaleString(),
      }));
    }
    return [];
  }, [priceTend1]);

  console.log('priceTendData1', priceTendData1)

  const priceTendData2 = useMemo(() => {
    if (priceTend2?.length) {
      return priceTend2.map(item => ({
        price: item.price,
        date: new Date(item.timestamp * 1000).toLocaleString(),
      }));
    }
    return [];
  }, [priceTend2]);

  const currentPrice = useMemo(() => {
    if (currentToken === token1?.symbol) {
      return prices[token1?.symbol] || 0;
    } else {
      return prices[token2?.symbol] || 0;
    }
  }, [currentToken, prices, token1, token2]);

  const isLoading = useMemo(() => {
    if (currentToken === token1?.symbol) {
      return isLoading1;
    } else {
      return isLoading2;
    }
  }, [isLoading1, isLoading2, currentToken, token1, token2]);

  const changeRate = useMemo(() => {
    try {
      if (currentToken === token1?.symbol) {
        return Big(priceTend1[priceTend1.length - 1]?.price).div(priceTend1[priceTend1.length - 2]?.price).minus(1).mul(100).toNumber();
      } else {
        return Big(priceTend2[priceTend2.length - 1]?.price).div(priceTend2[priceTend1.length - 2]?.price).minus(1).mul(100).toNumber();
      }
    } catch (error) {
      console.log(error);
      return 0;
    }
  }, [currentToken, priceTend1, priceTend2, token1, token2]);

  console.log('changeRate', changeRate)

  const getCustomDomain = (data: any[], key: string) => {
    if (!data?.length) return [0, 0];
    const values = data.map(item => item[key]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    return [min - padding, max + padding];
  };

  const chartData = useMemo(() => {
    if (currentToken === token1?.symbol) {
      return priceTendData1;
    } else {
      return priceTendData2;
    }
  }, [currentToken, priceTendData1, priceTendData2, token1, token2]);

  useEffect(() => {
    if (currentTokenRef.current !== token1?.symbol && currentTokenRef.current !== token2?.symbol) {
      setCurrentToken(token1?.symbol);
    }
  }, [token1, token2]);

  useEffect(() => {
    currentTokenRef.current = currentToken;
  }, [currentToken]);


  return (
    <div className={`rounded-[18px] border border-black bg-[#FFFDEB] p-[16px] shadow-shadow1 mt-[20px] ${className}`}>
      <div className="flex items-center justify-between mb-[12px] overflow-hidden">
        <div className="flex items-center gap-[8px] ml-[-25px]">
          <SwitchTabs
            tabs={tabs}
            current={currentToken}
            onChange={(value) => setCurrentToken(value)}
            className="h-[32px] w-[200px] border-none !bg-[#FFFDEB] gap-[30px]"
            cursorClassName="bg-[#FFFDEB] rounded-none border-none "
            cursorStyle={{ borderBottom: '2px solid #000' }}
            tabClassName="!text-[16px] mx-[20px]"
          />
        </div>
        <div className="text-[12px] text-[#3D405A] font-Montserrat font-[600]">
          Last 7 days
        </div>
      </div>

      <div className="flex items-center gap-[8px] mb-[12px]">
        <div className="text-[16px] font-Montserrat text-black">
          ${numberFormatter(currentPrice, 10, true)}
        </div>
        <div className="text-[12px] text-[#3D405A] font-Montserrat font-[600] flex items-center gap-[4px]">
          {
            changeRate >= 0 ? (
              <span className="text-[#76A813]">
                <span className="text-[18px]">↑</span>{numberFormatter(Math.abs(changeRate), 2, true)}%
              </span>
            ) : (
              <span className="text-[#FF0000]">
                <span className="text-[18px]">↓</span>{numberFormatter(Math.abs(changeRate), 2, true)}%
              </span>
            )
          }
        </div>
      </div>

      <div className="w-full h-[120px]">
        {
          isLoading
            ? <div className="flex items-center justify-center h-full"><CircleLoading size={18} /></div>
            : (!chartData || chartData.length === 0)
              ? <div className="flex items-center justify-center h-full text-[14px] font-Montserrat text-[#3D405A]">The data is not yet supported.</div>
              : <LineChart
                width={500}
                height={120}
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <YAxis
                  domain={getCustomDomain(chartData, "price")}
                  hide
                />
                <Line
                  type="natural"
                  dataKey="price"
                  stroke="#76A813"
                  strokeWidth={1}
                  dot={false}
                  activeDot={{ r: 4, fill: "#76A813", stroke: "#000", strokeWidth: 1 }}
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
                <Tooltip
                  position={{ y: -30 }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
                    return (
                      <div className="bg-[#FFFDEB] border border-[#000] rounded-[4px] p-[8px] text-[12px] leading-1 whitespace-nowrap shadow-lg">
                        <p className="text-[#3D405A] font-[600] mb-[4px]">
                          {payload[0]?.payload.date}
                        </p>
                        <p className="text-black font-[600]">
                          Price: ${numberFormatter(payload[0]?.value as any, 10, true)}
                        </p>
                      </div>
                    );
                  }}
                />
              </LineChart>
        }


      </div>
    </div>
  );
};

export default PriceTend;
