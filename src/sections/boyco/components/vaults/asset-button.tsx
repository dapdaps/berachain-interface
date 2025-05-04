import clsx from 'clsx';
import { numberFormatter } from '@/utils/number-formatter';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const AssetButton = (props: any) => {
  const { item, className, onSelect, selected, disabled, isAutoSelect } = props;

  useEffect(() => {
    if (!isAutoSelect) return;
    onSelect(item);
  }, [isAutoSelect]);

  return (
    <motion.button
      className={clsx("px-[8px] py-[4px] h-[34px] border border-[#5B4E3C] rounded-[8px] flex items-center gap-[7px] mt-[10px] disabled:opacity-30 disabled:!cursor-not-allowed", className)}
      animate={{
        backgroundColor: selected ? 'rgba(253,213,76,0.5)' : 'rgba(253,213,76,0)',
        borderColor: selected ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)',
      }}
      onClick={() => onSelect?.(item)}
      disabled={disabled}
    >
      <div className="flex">
        {item.tokens.map((token: any, index: number) => (
          <img
            src={token.icon}
            className={clsx(
              "w-[26px] h-[26px] rounded-full",
              index !== 0 && "ml-[-14px]"
            )}
          />
        ))}
      </div>
      <div className="text-[#392C1D] text-[14px] leading-[100%]">
              <span className="font-bold">
                {numberFormatter(item.amount, 2, true, {
                  isShort: true
                })}
              </span>{" "}
        {item.name}
      </div>
    </motion.button>
  );
};

export default AssetButton;
