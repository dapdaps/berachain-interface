import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useMemo, useRef } from "react";
import clsx from "clsx";
import { numberFormatter } from "@/utils/number-formatter";
import Empty from "@/components/empty";
import Loading from "@/components/loading";

export default function Chart({ assets }: any) {
  const labelsPositions = useRef<{ [key: string]: number }>({});
  const data = useMemo(() => {
    if (!assets?.length) return [];
    return assets.map((asset: any, i: number) => ({
      name: asset.tokens.map((item: any) => item.symbol).join("-"),
      value: Number(asset.amountUsd),
      amount: asset.amount,
      color: `#392C1D`
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
    <div className="pt-[30px] relative">
      {!data?.length ? (
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
          {data?.length && (
            <>
              <ResponsiveContainer width={550} height={400}>
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
                    isAnimationActive={false}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      outerRadius,
                      index,
                      percent
                    }) => {
                      return (
                        <foreignObject
                          x={
                            cx < 200
                              ? cx - labelsPositions.current[index]
                              : cx + labelsPositions.current[index] + 60
                          }
                          y={cy}
                          height={40}
                          width={labelsPositions.current[index]}
                        >
                          <Label
                            key={index}
                            index={index}
                            data={assets}
                            isReverse={cx >= 200}
                          />
                        </foreignObject>
                      );
                    }}
                    labelLine={false}
                  >
                    {data.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
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
      className="flex items-center gap-[2px] relative"
      ref={ref}
      style={{
        flexDirection: isReverse ? "row-reverse" : "row"
      }}
    >
      <div className="flex">
        {data[index].tokens.map((item: any, index: number) => (
          <img
            key={index}
            src={item.logo}
            className={clsx(
              "w-[26px] h-[26px] rounded-full",
              index !== 0 && "ml-[-10px]"
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
          {data[index].name}
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
