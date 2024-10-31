import { motion } from 'framer-motion';
import { useMemo } from 'react';

function SwitchTabs<Value = any>(props: Props<Value>) {
  const {
    tabs,
    current,
    cursorClassName,
    cursorStyle,
    tabClassName,
    tabStyle,
    renderTabStyle = () => ({}),
    className,
    style,
    onChange
  } = props;

  const currentIndex = useMemo(() => {
    const idx = tabs.findIndex((it) => it.value === current);
    if (idx < 0) return 0;
    return idx;
  }, [tabs, current]);

  const handleChange = (tab: any, idx: number) => {
    if (tab.value === current) return;
    onChange && onChange(tab.value, idx);
  };

  return (
    <div
      className={`relative h-[56px] md:h-[36px] rounded-[12px] md:rounded-[20px] border border-[#373A53] bg-white p-[5px_4px] md:p-[3px] ${className}`}
      style={style}
    >
      <div className='w-full h-full relative z-[0]'>
        <motion.div
          className={`rounded-[10px] md:rounded-[16px] h-full bg-[#FFDC50] absolute flex-1 border border-black ${cursorClassName}`}
          style={{
            width: `${100 / tabs.length}%`,
            left: 0,
            ...cursorStyle
          }}
          animate={{
            x: `${100 * currentIndex}%`
          }}
        />
      </div>
      <div className='w-full h-full z-[1] flex items-stretch justify-between absolute top-0 left-0'>
        {tabs.map((tab, idx) => (
          <div
            key={idx}
            className={`h-full text-[18px] md:text-[15px] text-black font-[600] flex justify-center items-center flex-1 cursor-pointer ${tabClassName}`}
            style={{
              width: `${100 / tabs.length}%`,
              opacity: tab.disabled ? 0.3 : 1,
              cursor: tab.disabled ? 'not-allowed' : 'pointer',
              ...tabStyle,
              ...renderTabStyle(tab, idx),
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (tab.disabled) return;
              handleChange(tab, idx);
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SwitchTabs;

interface Props<Value> {
  tabs: { value: Value; label: any; disabled?: boolean }[];
  current?: Value;
  className?: string;
  style?: React.CSSProperties;
  cursorClassName?: string;
  cursorStyle?: React.CSSProperties;
  tabClassName?: string;
  tabStyle?: React.CSSProperties;

  onChange?(current: Value, index: number): void;
  renderTabStyle?(tab: { value: Value; label: any; disabled?: boolean }, idx: number): React.CSSProperties;
}
