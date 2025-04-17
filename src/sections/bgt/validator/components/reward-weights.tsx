import clsx from 'clsx';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { useMemo, useState } from 'react';
import Big from 'big.js';
import { numberFormatter } from '@/utils/number-formatter';
import { getProtocolIcon } from '@/utils/utils';

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 6}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={2}
        style={{
          transition: 'all 1s ease-in-out'
        }}
      />
    </g>
  );
};

const RewardWeights = (props: any) => {
  const { className, vaults, pageData } = props;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const list = useMemo(() => {
    const _totalBGT = vaults.reduce((acc: any, curr: any) => Big(acc).plus(Big(pageData?.dynamicData?.rewardRate ?? 0).times(Big(curr?.percentageNumerator ?? 0).div(10000))), Big(0));
    return vaults.map((item: any) => ({
      value: Big(pageData?.dynamicData?.rewardRate ?? 0).times(Big(item?.percentageNumerator ?? 0).div(10000)).div(_totalBGT).times(100).toNumber(),
      name: item.receivingVault?.metadata?.name,
      icon: item.receivingVault?.metadata?.logoURI,
      cornerIcon: getProtocolIcon(item.receivingVault?.metadata?.protocolName),
      protocol: item.receivingVault?.metadata?.protocolName,
    }));
  }, [vaults]);

  const randomColors = useMemo(() => {
    return list.map((_: any, index: number) => generateRandomColor(index, list.length));
  }, [list.length]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className={clsx("w-[289px] bg-[rgba(0,0,0,0.06)] rounded-[10px] shrink-0 p-[16px]", className)}>
      <div className="text-[#3D405A] text-center font-Montserrat text-[14px] font-medium mb-4">
        Reward Weights
      </div>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={list}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={2}
              cornerRadius={2}
              dataKey="value"
              stroke="none"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              activeIndex={activeIndex as number}
              activeShape={renderActiveShape}
            >
              {list.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={randomColors[index]}
                  style={{
                    transition: 'all 1s ease-in-out'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RewardWeights;

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="w-[220px] h-[101px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-[4px_4px_0px_0px_rgba(0,_0,_0,_0.25)] p-[17px_19px_17px_14px]">
      <div className="text-black font-Montserrat text-base font-semibold leading-[90%] border-b border-[rgba(0,0,0,0.15)] pb-[13px]">
        {numberFormatter(data.value, 2, true)}%
      </div>
      <div className="w-full flex items-center gap-[13px] mt-[8px]">
        <div
          className="shrink-0 relative bg-no-repeat bg-center bg-contain w-[32px] h-[32px] rounded-full"
          style={{
            backgroundImage: `url(${data.icon})`
          }}
        >
          <img src={data.cornerIcon} alt="" className="absolute right-[-6px] bottom-[-2px] w-[16px] h-[16px] object-center object-contain rounded-[4px]" />
        </div>
        <div className="flex-1 w-0 text-black font-Montserrat text-xs font-semibold leading-[110%]">
          <div className="w-full whitespace-nowrap overflow-hidden overflow-ellipsis">
            {data.name}
          </div>
          <div className="w-full whitespace-nowrap overflow-hidden overflow-ellipsis">
            {data.protocol}
          </div>
        </div>
      </div>
    </div>
  );
};

const generateRandomColor = (index: number, total: number) => {
  const hue = (index * 137.508) % 360; // 137.508 是黄金角度
  return `hsl(${hue}, 65%, 65%)`;
};

