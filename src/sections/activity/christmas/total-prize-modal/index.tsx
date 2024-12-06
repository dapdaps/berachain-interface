import Modal from "@/components/modal";
import SnowIcon from "../present-icons/icon-snow";
import Nft from "./nft";
import config from "../present-icons/config";
import { useMemo, useState } from "react";
import BasicButton from "../task-modal/button";
import NftPrizeWinnersModal from "../nft-prize-winners-modal";

export default function TotalPrizeModal({ open, nfts, onClose }: any) {
  const [showNfts, setShowNfts] = useState(false);
  const nftList = useMemo(() => {
    if (!nfts || nfts.length === 0) return [];
    const catched: any = {};
    nfts.forEach((nft: any) => {
      if (!catched[nft.name]) {
        catched[nft.name] = [];
      }
      catched[nft.name].push(nft);
    });
    return Object.entries(catched).map(([key, value]: any) => ({
      name: key,
      nfts: value
    }));
  }, [nfts]);
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        closeIconClassName="right-[-14px] top-[-8px]"
      >
        <div className="w-[594px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-shadow1 p-[20px]">
          <div className="flex justify-between items-center text-[16px] font-bold pb-[14px]">
            <div>$Snowflake</div>
            <div className="flex items-center gap-[4px]">
              <div>~1.25M</div>
              <SnowIcon className="w-[28px] h-[28px]" />
            </div>
          </div>
          <div className="border-t border-[#949494]">
            <div className="flex justify-between items-center text-[16px] font-bold pt-[8px]">
              <div>NFT Prize</div>
              <BasicButton
                onClick={() => {
                  setShowNfts(true);
                }}
                className="w-[71px] !h-[28px]"
              >
                Check
              </BasicButton>
            </div>
            <div className="flex flex-wrap pb-[20px]">
              {nftList.map((nft: any) => (
                <Nft key={nft.name} nft={nft} />
              ))}
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
      <NftPrizeWinnersModal
        open={showNfts}
        onClose={() => {
          setShowNfts(false);
        }}
        nfts={nftList}
      />
    </>
  );
}
