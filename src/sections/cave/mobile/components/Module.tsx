import Card from '@/components/card';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import useClickTracking from '@/hooks/use-click-tracking';
import { useTransferItemsStore } from '@/sections/cave/stores/useTransferItems';
import { formatLongText } from '@/utils/utils';
import clsx from 'clsx';
import React, { createContext, useContext, useRef } from 'react';
export type ModuleType = "hats" | "jackets" | "necklaces" | "cars" | "pets";
export type ActionType = "bridge" | "swap" | "delegate" | "lend";

export interface ModuleStyles {
  container: string;
  imageWrapper: string;
  image: string;
  popoverContent?: string;
  imagePopover: string
}

export interface ModuleItem {
  id: string;
  icon: string;
  popoverIcon?: string;
  title: string;
  desc: string;
  type: ActionType;
  hasPopover?: boolean;
  needTransactionNums?: number;
  link?: string;
  dapps: any[];
  [k: string]: any;
}

export interface ModuleConfig {
  type: ModuleType;
  styles: ModuleStyles;
  items: ModuleItem[];
  onItemClick?: (item: ModuleItem) => void;
}

const ModuleItem: React.FC<ModuleItem & { styles: ModuleStyles }> = (props) => {
  const {
    icon,
    popoverIcon,
    title,
    desc,
    type,
    needTransactionNums,
    hasPopover = true,
    styles,
    ...rest
  } = props;

  const { handleReport } = useClickTracking();
  const transferredRef = useRef<any>(null);
  const { onItemClick } = useModuleContext();
  const { setTransferItemsVisible, setTransferSelectedItems, setTransferItem } = useTransferItemsStore();
  const isTransfer = rest?.pc_item && !rest.transfer_to;


  function doReport(name: string) {
    switch (name) {
      case 'Baseball Cap':
        handleReport("1024-001")
        break;
      case 'Wool Hat':
        handleReport("1024-002")
        break;
      case 'Basic Helmet':
        handleReport("1024-003")
        break;
      case 'Flying Helmet':
        handleReport("1024-004")
        break;
      case 'Motor Helmet':
        handleReport("1024-005")
        break;
      case 'Alloy Necklace':
        handleReport("1024-006")
        break;
      case 'Silver Necklace':
        handleReport("1024-007")
        break;
      case 'Golden Necklace':
        handleReport("1024-008")
        break;
      case 'Diamond Necklace':
        handleReport("1024-009")
        break;
      case 'Bicycle':
        handleReport("1024-010")
        break;
      case 'Scooter':
        handleReport("1024-011")
        break;
      case 'Motobike':
        handleReport("1024-012")
        break;
      case 'Lambo':
        handleReport("1024-013")
        break;
      case 'Hoodie':
        handleReport("1024-014")
        break;
      case 'Baseball Jacket':
        handleReport("1024-015")
        break;
      case 'Vintage Jacket':
        handleReport("1024-016")
        break;
      case 'Windcheater':
        handleReport("1024-017")
        break;

      case 'Aeris':
        handleReport("1024-018")
        break;
      case 'Luma':
        handleReport("1024-019")
        break;
      case 'Noa':
        handleReport("1024-020")
        break;
      case 'Saffi':
        handleReport("1024-021")
        break;
      default:
        break;
    }

  }
  const PopoverContent = () => {
    const [before, after] = desc.split("$TRANSACTION_COUNT");
    return (
      <div className="border-[3px] p-[10px] border-[#C7FF6E] rounded-xl w-[166px] bg-black bg-opacity-50 flex flex-col justify-center items-center gap-2">
        <div className={`flex justify-center items-center ${styles.imagePopover}`}>
          <img className="w-full h-full" src={popoverIcon || icon} alt={title} />
        </div>
        <div className="text-[#F7F9EA] font-CherryBomb text-[18px] font-[400] leading-[18px] text-center text-stroke-2">
          {title}
        </div>
        <div className="w-[38.461vw] text-left text-[12px] font-[400] leading-[14.4px] text-white px-3">
          {desc}
        </div>
        <div
          style={{
            opacity: type === 'delegate' ? 0.5 : 1
          }}
          onClick={() => {
            if (type === 'delegate') {
              return
            }
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
          }}
          className="w-full h-8 border-[2px] bg-[#FFF5A9] rounded-[30px] border-[#4B371F] font-CherryBomb text-[18px] font-[400] text-center text-stroke-2 text-white"
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </div>
        {
          isTransfer && (
            <button
              type="button"
              className="w-full underline decoration-solid whitespace-nowrap text-[12px] text-center text-white font-[400]"
              onClick={() => {
                setTransferItemsVisible(true);
                setTransferSelectedItems([{ ...props, id: props.itemId }]);
                setTransferItem({ ...props, id: props.itemId });
              }}
            >
              Transfer to <strong className="font-[700]">Beraciaga</strong>
            </button>
          )
        }
      </div>
    );
  };

  const ImageContent = () => (
    <div className={clsx("flex-1 relative", styles.imageWrapper)}>
      <img className={styles.image} src={icon} alt={title} />
      <div className="absolute top-0 right-0">
        {
          !!rest?.transfer_to && (
            <Popover
              content={(
                <Card className="w-[192px] text-center text-black text-[14px] font-[400] !p-[10px_15px] !rounded-[20px]">
                  This item is already<br /> transfer to Beraciaga<br /> account: <strong className="font-[700]">{formatLongText(rest.transfer_to, 4, 4)}</strong>
                </Card>
              )}
              placement={PopoverPlacement.Center}
              trigger={PopoverTrigger.Hover}
            >
              <div ref={transferredRef} className="w-[24px] h-[24px] rounded-[24px] border border-[#FFF5A9] cursor-pointer backdrop-blur-[10px] bg-[url('/images/cave/icon-beraciaga.svg')] bg-no-repeat bg-center bg-cover" />
            </Popover>
          )
        }
      </div>
    </div>
  );

  if (!hasPopover) {
    return <ImageContent />;
  }

  return (
    <Popover
      placement={PopoverPlacement.Center}
      contentClassName={`backdrop-blur-[10px]`}
      content={<PopoverContent />}
      onClickBefore={(e) => {
        handleReport(title)
        return !transferredRef.current?.contains(e.target);
      }}
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
          <ModuleItem key={item.id} {...item} styles={item.styles ? item.styles : config.styles} />
        ))}
      </div>
    </ModuleContext.Provider>
  );
};

export default Module;
