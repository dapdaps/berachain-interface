import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useMemo, useRef } from "react";
import clsx from "clsx";
import { numberFormatter } from "@/utils/number-formatter";
import Empty from "@/components/empty";
import Loading from "@/components/loading";

const COLORS = [
  "#392C1D", // 100% opacity
  "#392C1DE6", // 90% opacity (0.9)
  "#392C1DCC", // 80% opacity (0.8)
  "#392C1DB3", // 70% opacity (0.7)
  "#392C1D99", // 60% opacity (0.6)
  "#392C1D80", // 50% opacity (0.5)
  "#392C1D66", // 40% opacity (0.4)
  "#392C1D4D", // 30% opacity (0.3)
  "#392C1D33" // 20% opacity (0.2)
];

export default function Chart({ assets, loading }: any) {
  const labelsPositions = useRef<{ [key: string]: number }>({});
  const data = useMemo(() => {
    if (!assets?.length) return [];
    return assets.map((asset: any, i: number) => ({
      name: asset.tokens.map((item: any) => item.symbol).join("-"),
      value: Number(asset.amountUsd),
      amount: asset.amount,
      color: COLORS[i]
    }));
  }, [assets]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#E6D2BA] p-2 border border-[#392C1D] rounded-md">
          <p className="text-[#392C1D] font-bold">{payload[0].payload.name}</p>
          <p className="text-[#392C1D]">{payload[0].payload.amount}</p>
          <p className="text-[#392C1D]">
            ${payload[0].payload.value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pt-[30px] relative lg:h-[calc(100%-50px)] md:h-[400px]">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loading size={20} />
        </div>
      ) : (
        <>
          {!data?.length && (
            <div className="flex justify-center items-center h-full">
              <Empty desc="No assets" />
            </div>
          )}
          {!!data?.length && (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                    activeIndex={0}
                    shapeRendering="geometricPrecision"
                    isAnimationActive={true}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      outerRadius,
                      index,
                      percent
                    }) => {
                      const RADIUS = 150; // Outer radius + some padding
                      const x =
                        cx + Math.cos((-midAngle * Math.PI) / 180) * RADIUS;
                      const y =
                        cy + Math.sin((-midAngle * Math.PI) / 180) * RADIUS;
                      const isRight = x > cx;

                      // Calculate position adjustments for label placement
                      const labelHeight = 40;
                      const labelWidth = labelsPositions.current[index] || 100;

                      // Adjust x position based on whether label is on right or left side
                      const adjustedX = isRight ? x : x - labelWidth;
                      // Center the label vertically
                      const adjustedY = y - labelHeight / 2;

                      return (
                        <foreignObject
                          x={adjustedX}
                          y={adjustedY}
                          height={labelHeight}
                          width={labelWidth}
                        >
                          <Label
                            key={index}
                            index={index}
                            data={assets}
                            isReverse={isRight}
                          />
                        </foreignObject>
                      );
                    }}
                    labelLine={(props) => {
                      const { cx, cy, midAngle, outerRadius, index } = props;
                      const RADIUS = 150; // Outer radius + some padding
                      const x1 =
                        cx +
                        Math.cos((-midAngle * Math.PI) / 180) * outerRadius;
                      const y1 =
                        cy +
                        Math.sin((-midAngle * Math.PI) / 180) * outerRadius;
                      const x2 =
                        cx +
                        Math.cos((-midAngle * Math.PI) / 180) *
                          (outerRadius + 20);
                      const y2 =
                        cy +
                        Math.sin((-midAngle * Math.PI) / 180) *
                          (outerRadius + 20);
                      const x3 =
                        cx + Math.cos((-midAngle * Math.PI) / 180) * RADIUS;
                      const y3 =
                        cy + Math.sin((-midAngle * Math.PI) / 180) * RADIUS;

                      return (
                        <path
                          d={`M${x1},${y1}L${x2},${y2}L${x3},${y3}`}
                          stroke="#392C1D"
                          fill="none"
                        />
                      );
                    }}
                  >
                    {data.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  {/* <Tooltip content={<CustomTooltip />} /> */}
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute left-[-99999px] top-[-99999px] opacity-0">
                {assets?.map((item: any, index: number) => (
                  <Label
                    key={index}
                    index={index}
                    data={assets}
                    onLoad={(width: any) => {
                      labelsPositions.current[index] = width;
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

const Label = ({ index, data, onLoad, isReverse }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    onLoad?.(ref.current?.offsetWidth);
  }, []);
  return (
    <div
      className="flex items-center gap-[2px] relative mt-[1px]"
      ref={ref}
      style={{
        flexDirection: isReverse ? "row-reverse" : "row",
        justifyContent: "flex-end"
      }}
    >
      <div className="flex">
        {data[index].tokens.map((item: any, index: number) => (
          <img
            key={index}
            src={item.icon}
            className={clsx(
              "w-[26px] h-[26px] rounded-full",
              index !== 0 && "ml-[-14px]"
            )}
          />
        ))}
      </div>
      <div className="text-[#392C1D] text-[12px]">
        <div className="text-[12px] whitespace-nowrap">
          <span className="font-bold">
            {numberFormatter(data[index].amount, 2, true, {
              isShort: true
            })}
          </span>{" "}
        </div>
        <div className="h-[1px] bg-[#392C1D] relative"></div>
        <div className="font-bold">
          $
          {numberFormatter(data[index].amountUsd, 2, true, {
            isShort: true
          })}
        </div>
      </div>
    </div>
  );
};
