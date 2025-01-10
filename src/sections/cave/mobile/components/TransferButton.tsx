import { useTransferItemsStore } from '@/sections/cave/stores/useTransferItems';
import { memo } from "react";
import ReactDOM from "react-dom";
export default memo(function TransferButton() {
  const { transferItems, setTransferSelectedItems, setTransferItemsVisible } = useTransferItemsStore();
  return ReactDOM.createPortal((
    <div
      onClick={() => {
        setTransferItemsVisible(true)
        setTimeout(() => {
          setTransferSelectedItems(transferItems)
        }, 300)
      }}
      className="pb-[5px] fixed z-[60] left-1/2 bottom-3 -translate-x-1/2 w-[129px] rounded-[10px] border border-[#709D27] bg-[#7DB425] backdrop-blur-[5px]">
      <div className="active:translate-y-[5px] relative cursor-pointer h-[40px] rounded-[10px] border border-[#709D27] bg-[#C7FF6E] backdrop-blur-[5px]">
        <div className="p-[5px_0_0_12px] w-[92px] text-[#F7F9EA] font-CherryBomb text-[14px] text-stroke-1-4b371f leading-[100%]">Transfer Boost Items</div>
        <div className="absolute top-[6px] right-[7px] w-[26px]">
          <img src="/images/cave/icon-bear.png" alt="icon-bear" />
        </div>
      </div>
    </div>
  ), document.body)
})
