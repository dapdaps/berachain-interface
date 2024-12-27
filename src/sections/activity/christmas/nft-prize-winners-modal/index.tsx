import Modal from "@/components/modal";
import Avatar from "./avatar";
import Nft from "./nft";

export default function NftPrizeWinnersModal({
  open,
  onClose,
  nfts = [],
  isMobile
}: any) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIconClassName="right-[-14px] top-[-8px]"
      isShowCloseIcon={!isMobile}
    >
      <div className="w-[850px] md:w-full rounded-[20px] md:rounded-b-[0] border border-black bg-[#FFFDEB] shadow-shadow1 pl-[30px] md:px-[15px] pb-[20px]">
        <div className="text-[20px] font-bold pt-[16px]">
          NFT Prize and Winners
        </div>
        <div className="overflow-y-auto max-h-[60dvh]">
          {nfts.map((item: any) => (
            <div className="mt-[30px]">
              <div className="flex items-center gap-[26px]">
                <Avatar logo={item.logo} amount={item.nfts.length} />
                <div className="text-[18px] font-bold">
                  {item.name === 'WeBera Finance' ? 'Jungle Party' : item.name}
                </div>
              </div>
              <div className="flex flex-wrap gap-[10px] mt-[16px] md:grid md:grid-cols-2">
                {item.nfts.map((nft: any) => (
                  <Nft nft={nft} key={nft.token_id} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
