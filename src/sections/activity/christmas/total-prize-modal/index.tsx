import Modal from "@/components/modal";
import SnowIcon from "../present-icons/icon-snow";
import Nft from "./nft";
import config from "../present-icons/config";

export default function TotalPrizeModal({ open, onClose }: any) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIconClassName="right-[-14px] top-[-8px]"
    >
      <div className="w-[594px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-shadow1 p-[20px]">
        <div className="flex justify-between items-center text-[16px] font-bold pb-[14px]">
          <div>$Snowflake</div>
          <div className="flex items-center gap-[4px]">
            <div>~1M</div>
            <SnowIcon className="w-[28px] h-[28px]" />
          </div>
        </div>
        <div className="border-t border-[#949494]">
          <div className="pt-[8px] text-[16px] font-bold">NFT Prize</div>
          <div className="flex flex-wrap pb-[20px]">
            <Nft />
            <Nft />
            <Nft />
            <Nft />
            <Nft />
          </div>
        </div>
        <div className="border-t border-[#949494]">
          <div className="pt-[8px] text-[16px] font-bold">BeraCave Prize</div>
          <div className="flex flex-wrap items-center gap-[36px] pt-[14px]">
            {Object.values(config)
              .filter((token: any) => token.shadowIcon)
              .map((token: any, i: number) => (
                <token.shadowIcon />
              ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
