import { motion } from 'framer-motion';
import Big from 'big.js';
import { useMemo, useRef, useState, useEffect } from 'react';

const AmountSelector = (props: any) => {
  const {
    token,
    setAmount,
    balance,
    currentAmount,
    children,
  } = props;

  const sliderRef = useRef(null);
  const [selected, setSelected] = useState<number | undefined>();
  const [dragValue, setDragValue] = useState<number>(0);
  const [dragPercent, setDragPercent] = useState<number>(0);
  const [dragStart, setDragStart] = useState<number>(0);

  const sliderWidth = useMemo(() => {
    if (!sliderRef.current) return 0;
    return parseFloat(getComputedStyle(sliderRef.current).width);
  }, [sliderRef.current]);

  const calculatePercentage = (amount: string | number, balanceValue: string | number) => {
    const currentAmountBig = Big(amount || 0);
    const balanceBig = Big(balanceValue || 0);
    
    return balanceBig.gt(0) 
      ? currentAmountBig.div(balanceBig).times(100).toNumber() 
      : 0;
  };

  const findMatchingPercentButton = (percentage: number) => {
    const matchedPercent = PERCENT_THRESHOLDS.find(preset => 
      Math.abs(preset.value * 100 - percentage) <= preset.tolerance * 100
    );
    
    return matchedPercent ? matchedPercent.value : undefined;
  };

  useEffect(() => {
    if (!balance.value || Big(balance.value).lte(0)) return;

    const percentageUsed = calculatePercentage(currentAmount, balance.value);
    const clampedPercentage = Math.max(0, Math.min(100, percentageUsed));
    
    const newDragValue = Big(sliderWidth).minus(22).times(clampedPercentage).div(100).toNumber();
    
    setDragValue(newDragValue);
    setDragPercent(clampedPercentage);
    
    const matchedPreset = findMatchingPercentButton(clampedPercentage);
    setSelected(matchedPreset);
  }, [currentAmount, balance.value, sliderWidth]);

  const setPercentAmount = (_percent: number) => {
    const _amount = Big(balance.value).times(Big(_percent).div(100)).toFixed(token.decimals);
    setAmount(_amount.replace(/[.]?0+$/, ''));
  };

  const handleSlider = (event: any, info: any) => {
    if (!balance.value || Big(balance.value).lte(0)) return;
    const newValue = Math.max(0, Math.min(sliderWidth - 22, dragStart + info.offset.x));
    setDragValue(newValue);
    const _percent = Big(newValue).div(sliderWidth - 22).times(100).toNumber();
    setDragPercent(Math.max(0, Math.min(100, _percent)));
    setPercentAmount(_percent);
  };

  const handleDragStart = (event: any, info: any) => {
    setSelected(void 0);
    setDragStart(dragValue);
  };

  const handleDragEnd = (event: any, info: any) => {
    if (!balance.value || Big(balance.value).lte(0)) return;
    const val = Math.max(0, Math.min(sliderWidth - 22, dragStart + info.offset.x));
    setDragValue(val);
    const _percent = Big(val).div(sliderWidth - 22).times(100).toNumber();
    setDragPercent(Math.max(0, Math.min(100, _percent)));
    setPercentAmount(_percent);
  };

  const handleSelected = (_selected: any) => {
    if (!balance.value || Big(balance.value).lte(0)) return;
    setSelected(_selected.value);
    const val = Big(sliderWidth).minus(22).times(_selected.value).toNumber();
    setDragValue(val);
    const _percent = Big(val).div(sliderWidth - 22).times(100).toNumber();
    setDragPercent(Math.max(0, Math.min(100, _percent)));
    setPercentAmount(_percent);
  };

  return (
    <>
      <div className="flex justify-end items-center mt-[5px]">
        {children}
      </div>
      <div className="mt-[14px] flex justify-between items-center gap-[8px]">
        {
          PERCENT_THRESHOLDS.map((percent) => (
            <motion.div
              className="flex-1 border border-[#373A53] rounded-[8px] h-[32px] leading-[30px] text-center text-black text-[14px] font-[400]"
              key={percent.value}
              variants={{
                active: {
                  background: '#FFDC50',
                },
              }}
              animate={selected === percent.value ? 'active' : ''}
              onClick={() => handleSelected(percent)}
            >
              {percent.label}
            </motion.div>
          ))
        }
      </div>
      <div className="flex justify-between items-center gap-[15px] mt-[23px]">
        <div ref={sliderRef} className="relative h-[8px] rounded-[12px] bg-[#DFDCC4] flex-1">
          <motion.div
            className="absolute left-0 top-[-8px] w-[22px] h-[22px] rounded-full bg-[#FFDC50] border border-black"
            drag="x"
            dragConstraints={sliderRef}
            dragMomentum={false}
            onDrag={handleSlider}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{
              x: dragValue,
            }}
          />
        </div>
        <div className="text-black text-[14px] font-[400] w-[35px] shrink-0">
          {Big(dragPercent).toFixed(0)}%
        </div>
      </div>
    </>
  );
};

export default AmountSelector;

const PERCENT_THRESHOLDS = [
  { value: 0.25, label: '25%', tolerance: 0.05 },
  { value: 0.5, label: '50%', tolerance: 0.05 },
  { value: 0.75, label: '75%',tolerance: 0.05  },
  { value: 1, label: 'Max', tolerance: 0.05 },
];
