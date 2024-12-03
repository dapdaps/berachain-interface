import Modal from "@/components/modal";
import OpenBox from "./open-box";
import Nft from "../nft-prize-winners-modal/nft";
import Button from "./button";
import Present from "./present";

export default function UserPresentsModal() {
  return (
    <Modal
      open={true}
      onClose={() => {}}
      closeIconClassName="right-[-14px] top-[-8px]"
    >
      <div className="w-[850px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-shadow1 pb-[20px]">
        <div className="mt-[12px] text-center">
          <OpenBox className="mx-[auto]" />
        </div>
        <div className="text-[20px] font-bold py-[12px] text-center">
          You already opened 17 presents
        </div>
        <div className="px-[38px]">
          <div className="border-t border-t-[#A5A5A5]/30 pt-[14px] pb-[20px]">
            <div className="text-[16px] font-bold">
              You got <span className="text-[26px]">3</span> NFTs
            </div>
            <div className="flex gap-[16px] flex-wrap mt-[12px]">
              <Nft />
              <Nft />
            </div>
          </div>
          <div className="border-t border-t-[#A5A5A5]/30 pt-[14px] pb-[20px]">
            <div className="flex justify-between items-center">
              <div className="text-[16px] font-bold">
                You got <span className="text-[26px]">3</span> BeraCave outfits
              </div>
              <Button>Go to BeraCave</Button>
            </div>
            <div className="flex gap-[16px] flex-nowrap mt-[12px] overflow-y-auto">
              <Present gift="elf-hat" />
              <Present gift="santa-hat" />
              <Present gift="elf-jacket" />
              <Present gift="santa-coat" />
              <Present gift="scarf" />
              <Present gift="snowboard" />
              <Present gift="sleigh" />
            </div>
          </div>
          <div className="border-t border-t-[#A5A5A5]/30 pt-[14px] flex justify-between items-center">
            <div className="text-[16px] font-bold">
              You got <span className="text-[26px]">3</span> $Snowflake
            </div>
            <Button>
              <div className="pl-[24px]">Trade Now</div>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
