import React, { createContext, useContext } from "react";
import Popover, { PopoverPlacement } from "@/components/popover";

export type ModuleType = "hat" | "jacket" | "jewelry" | "key";
export type ActionType = "bridge" | "swap" | "stake";

export interface ModuleStyles {
  container: string;
  imageWrapper: string;
  image: string;
  popoverContent?: string;
}

export interface ModuleItem {
  id: string;
  icon: string;
  popoverIcon?: string;
  title: string;
  desc: string;
  type: ActionType;
  hasPopover?: boolean;
  needTransactionNums: number;
}

export interface ModuleConfig {
  type: ModuleType;
  styles: ModuleStyles;
  items: ModuleItem[];
  onItemClick?: (item: ModuleItem) => void;
}

const ModuleItem: React.FC<ModuleItem & { styles: ModuleStyles }> = ({
  icon,
  popoverIcon,
  title,
  desc,
  type,
  needTransactionNums,
  hasPopover = true,
  styles,
  ...rest
}) => {
  const { onItemClick } = useModuleContext();

  const PopoverContent = () => {
    const [before, after] = desc.split("$TRANSACTION_COUNT");
    return (
      <div className="border-[3px] p-[10px] border-[#C7FF6E] rounded-xl w-[166px] h-[217px] bg-black bg-opacity-50 flex flex-col justify-center items-center gap-2">
        <div className="w-[19.62vw] h-[17.648vw] flex justify-center items-center">
          <img className="w-fit h-fit" src={popoverIcon || icon} alt={title} />
        </div>
        <div className="text-[#F7F9EA] font-CherryBomb text-[18px] font-[400] leading-[18px] text-center text-stroke-2">
          {title}
        </div>
        <div className="w-[38.461vw] text-left text-[12px] font-[400] leading-[14.4px] text-white">
          {before}
          <span className="font-[700]">{needTransactionNums}</span>
          {after}
        </div>
        <div
          onClick={() =>
            onItemClick?.({
              icon,
              popoverIcon,
              title,
              desc,
              type,
              needTransactionNums,
              hasPopover,
              ...rest,
            })
          }
          className="w-full h-8 border-[2px] bg-[#FFF5A9] rounded-[30px] border-[#4B371F] font-CherryBomb text-[18px] font-[400] text-center text-stroke-2 text-white"
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </div>
      </div>
    );
  };

  const ImageContent = () => (
    <div className="flex-1">
      <img className={styles.image} src={icon} alt={title} />
    </div>
  );

  if (!hasPopover) {
    return <ImageContent />;
  }

  return (
    <Popover
      placement={PopoverPlacement.Top}
      contentClassName="backdrop-blur-[10px]"
      contentStyle={{
        top: "29.74vw",
      }}
      content={<PopoverContent />}
    >
      <ImageContent />
    </Popover>
  );
};

const ModuleContext = createContext<{
  onItemClick?: (item: ModuleItem) => void;
}>({});

const useModuleContext = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error("Error: ModuleContext is undefined");
  }
  return context;
};

const Module: React.FC<{ config: ModuleConfig }> = ({ config }) => {
  return (
    <ModuleContext.Provider value={{ onItemClick: config.onItemClick }}>
      <div className={config.styles.container}>
        {config.items.map((item) => (
          <ModuleItem key={item.id} {...item} styles={config.styles} />
        ))}
      </div>
    </ModuleContext.Provider>
  );
};

export default Module;
