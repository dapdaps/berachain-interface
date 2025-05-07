import clsx from "clsx";
import { numberFormatter } from "@/utils/number-formatter";
import { motion } from "framer-motion";
import { useEffect } from "react";

const AssetButton = (props: any) => {
  const { item, className, onSelect, selected, disabled, isAutoSelect } = props;

  useEffect(() => {
    if (!isAutoSelect) return;
    onSelect(item, { isAutoSelect });
  }, [isAutoSelect]);

  return (
    <motion.button
      className={clsx(
        "px-[8px] py-[4px] h-[34px] font-Montserrat border border-[#5B4E3C] rounded-[8px] flex items-center gap-[7px] mt-[6px] disabled:opacity-30 disabled:!cursor-not-allowed",
        className
      )}
      animate={{
        backgroundColor: selected
          ? "#392C1D"
          : "transparent",
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
      <div className={clsx('text-[14px] leading-[100%]', selected ? 'text-[#F2E6D4]' : 'text-[#392C1D]')}>
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
