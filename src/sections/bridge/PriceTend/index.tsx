"use client";

import { useState, useMemo } from "react";
import { Line, LineChart, Tooltip, YAxis } from 'recharts';
import Big from 'big.js';
import SwitchTabs from "@/components/switch-tabs";
import { usePriceStore } from "@/stores/usePriceStore";
import { numberFormatter } from "@/utils/number-formatter";

interface PriceTendProps {
  className?: string;
  priceData?: any[];
  priceFullData?: any[];
}

const PriceTend = ({ className = "", priceData = [], priceFullData = [] }: PriceTendProps) => {
  const [currentToken, setCurrentToken] = useState("BERA");
  const prices = usePriceStore((store) => store.price);

  // 模拟价格数据，实际项目中应该从 props 或 API 获取
  const mockPriceData = useMemo(() => {
    const basePrice = currentToken === "BERA" ? 1.97 : 0.85;
    return Array.from({ length: 7 }, (_, i) => ({
      price: basePrice + (Math.random() - 0.5) * 0.2,
      date: `Jul ${3 + i} 3:00 PM`,
      timestamp: Date.now() - (6 - i) * 24 * 60 * 60 * 1000
    }));
  }, [currentToken]);

  const mockPriceFullData = useMemo(() => {
    const basePrice = currentToken === "BERA" ? 1.97 : 0.85;
    return Array.from({ length: 24 }, (_, i) => ({
      price: basePrice + (Math.random() - 0.5) * 0.3,
      date: `Jul 10 ${i}:00`,
      timestamp: Date.now() - (23 - i) * 60 * 60 * 1000
    }));
  }, [currentToken]);

  const currentPrice = prices[currentToken] || (currentToken === "BERA" ? "1.97" : "0.85");
  const priceChange = useMemo(() => {
    const data = priceFullData.length ? priceFullData : mockPriceFullData;
    if (data.length < 2) return 0;
    const current = parseFloat(data[data.length - 1]?.price || currentPrice);
    const previous = parseFloat(data[data.length - 2]?.price || currentPrice);
    return ((current - previous) / previous) * 100;
  }, [priceFullData, mockPriceFullData, currentPrice]);

  const tabs = [
    { value: "BERA", label: "BERA" },
    { value: "HONEY", label: "HONEY" }
  ];

  const getCustomDomain = (data: any[], key: string) => {
    if (!data?.length) return [0, 0];
    const values = data.map(item => item[key]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    return [min - padding, max + padding];
  };

  const chartData = priceData.length ? priceData : mockPriceData;
  const chartFullData = priceFullData.length ? priceFullData : mockPriceFullData;

  return (
    <div className={`rounded-[18px] border border-black bg-[#FFFDEB] p-[16px] shadow-shadow1 mt-[20px] ${className}`}>
      {/* Header with token tabs */}
      <div className="flex items-center justify-between mb-[12px]">
        <div className="flex items-center gap-[8px]">
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

      {/* Price and change */}
      <div className="flex items-center justify-between mb-[12px]">
        <div className="text-[24px] font-bold font-Montserrat text-black">
          ${numberFormatter(currentPrice, 2, true)}
        </div>
        <div className={`text-[14px] font-Montserrat font-[600] flex items-center gap-[4px] ${
          priceChange >= 0 ? "text-[#06B000]" : "text-[#FF008A]"
        }`}>
          <span>{priceChange >= 0 ? "↑" : "↓"}</span>
          <span>{Math.abs(priceChange).toFixed(2)}%</span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[120px]">
        <LineChart
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
            stroke={chartFullData?.length ? 
              Big(chartFullData[chartFullData.length - 1]?.price || 0)
                .gte(chartFullData[chartFullData.length - 2]?.price || 0) 
                ? "#76A813" 
                : "#FF1DA5" 
              : "#76A813"
            }
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#000", stroke: "#000", strokeWidth: 2 }}
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
                    Price: ${numberFormatter(payload[0]?.value as any, 4, true)}
                  </p>
                </div>
              );
            }}
          />
        </LineChart>
      </div>
    </div>
  );
};

export default PriceTend;
