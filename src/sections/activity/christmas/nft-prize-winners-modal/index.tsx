import Modal from "@/components/modal";
import Avatar from "./avatar";
import Nft from "./nft";

export default function NftPrizeWinnersModal({
  open,
  onClose,
  nfts = []
}: any) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIconClassName="right-[-14px] top-[-8px]"
    >
      <div className="w-[850px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-shadow1 pl-[30px] pb-[20px]">
        <div className="text-[20px] font-bold pt-[16px]">
          NFT Prize and Winners
        </div>
        <div className="overflow-y-auto max-h-[60dvh]">
          {nfts.map((item: any) => (
            <div className="mt-[30px]">
              <div className="flex items-center gap-[26px]">
                <Avatar logo={item.logo} amount={item.nfts.length} />
                <div className="text-[18px] font-bold">{item.name}</div>
              </div>
              <div className="flex flex-wrap gap-[10px] mt-[16px]">
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
