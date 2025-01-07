import CheckBox from '@/sections/cave/CheckBox';
import Big from 'big.js';
import { useTransferItemsStore } from '@/sections/cave/stores/useTransferItems';

const TransferItem = (props: any) => {
  const { item } = props;

  const {
    transferSelectedItems,
    setTransferSelectedItems,
  } = useTransferItemsStore();

  const selected = transferSelectedItems?.some?.((it) => it.id === item.id);

  const handleSelected = () => {
    const _selectedList = transferSelectedItems.slice();
    if (selected) {
      const idx = transferSelectedItems?.findIndex((it) => it.id === item.id);
      if (idx > -1) {
        _selectedList.splice(idx, 1);
      }
    } else {
      _selectedList.push(item);
    }
    setTransferSelectedItems(_selectedList);
  };

  return (
    <div className="rounded-[13px] border-[3px] border-[#C7FF6E] bg-black/50 backdrop-blur-sm p-[12px_8px_9px] flex flex-col items-center">
      <div className="text-[#F7F9EA] text-stroke-[1px] text-stroke-[#4B371F] font-CherryBomb text-[16px] font-normal leading-[120%]">
        {item.name}
      </div>
      <div
        className="h-[100px] w-full bg-center bg-no-repeat bg-contain mt-[6px]"
        style={{
          backgroundImage: `url(${item.img})`,
        }}
      />
      <div className="flex justify-center items-center gap-[5px] relative w-full">
        <div className="flex justify-center items-center gap-[2px] px-[5px] bg-[#C7FF6E] border-[2px] border-[#709D27] backdrop-blur-sm h-[30px] rounded-[15px] text-[#000] text-center font-[Montserrat] text-[12px] font-bold leading-[100%]">
          <img src="/images/cave/icon-flash.svg" alt="" className="w-[14px] h-[20px]" />
          <div className="">
            +{Big(item.bonus_percentage || 0).div(100).toFixed(2)}%
          </div>
        </div>
        <CheckBox
          checked={selected}
          onCheckChange={handleSelected}
          className="!ml-auto absolute right-0 bottom-0"
        />
      </div>
    </div>
  );
};

export default TransferItem;
