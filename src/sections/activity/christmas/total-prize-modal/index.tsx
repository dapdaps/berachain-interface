import Modal from "@/components/modal";
import SnowIcon from "../present-icons/icon-snow";
import Nft from "./nft";
import config from "../present-icons/config";
import React, { useContext, useMemo, useState } from 'react';
import BasicButton from "../task-modal/button";
import NftPrizeWinnersModal from "../nft-prize-winners-modal";
import Skeleton from "react-loading-skeleton";
import useRewards from "../hooks/use-rewards";
import { ChristmasContext } from '@/sections/activity/christmas/context';

export default function TotalPrizeModal({ open, onClose }: any) {
  const { loading, rares, items } = useRewards();
  const {
    nftList: nftTotalList,
  } = useContext(ChristmasContext);

  const [showNfts, setShowNfts] = useState(false);
  const [nftList, nftAndRare] = useMemo(() => {
    if (!rares || rares.length === 0) return [[], []];
    const catched: any = {};
    const _rare: any = [];
    rares.forEach((nft: any) => {
      if (nft.category === "nft") {
        const curr = nftTotalList?.find((__it) => __it.id === nft.id);
        nft.owned = curr?.owned;
        if (!catched[nft.name]) {
          catched[nft.name] = [];
        }
        catched[nft.name].push(nft);
      }
      if (nft.category === "rare") {
        _rare.push({
          name: ["USDT", "USDC", "iBGT", "SUGAR"].includes(nft.name)
            ? nft.amount + " " + nft.name
            : nft.name,
          logo: nft.logo,
          nfts: {
            length: ["USDT", "USDC", "iBGT", "SUGAR"].includes(nft.name)
              ? nft.max_amount / nft.amount
              : nft.max_amount
          },
          whitelist: nft.whitelist
        });
      }
    });
    const _nftList = Object.entries(catched).map(([key, value]: any) => ({
      name: key,
      logo: value[0]?.classLogo,
      nfts: value
    }));
    return [_nftList, [..._nftList, ..._rare]];
  }, [rares, nftTotalList]);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        closeIconClassName="right-[-14px] top-[-8px]"
      >
        <div className="lg:w-[594px] md:h-[60dvh] md:overflow-x-hidden md:overflow-y-auto lg:rounded-[20px] md:rounded-t-[20px] lg:border border-black bg-[#FFFDEB] lg:shadow-shadow1 p-[20px]">
          <div className="flex justify-between items-center text-[16px] font-bold pb-[14px]">
            <div>$SNOWFLAKE</div>
            <div className="flex items-center gap-[4px]">
              <div>~100M+</div>
              <SnowIcon className="w-[28px] h-[28px]" />
            </div>
          </div>
          <div className="border-t border-[#949494]">
            <div className="flex justify-between items-center text-[16px] font-bold pt-[8px]">
              <div>Rare Prize</div>
              <BasicButton
                onClick={() => {
                  setShowNfts(true);
                }}
                className="w-[71px] !h-[28px]"
                disabled={loading}
              >
                Check
              </BasicButton>
            </div>
            <div className="flex flex-wrap pb-[20px] md:grid md:grid-cols-2 md:gap-x-[10px] md:gap-y-[15px]">
              {loading
                ? [...new Array(12)].map((_, idx) => (
                    <div
                      key={idx}
                      className="w-1/3 flex items-center gap-[22px] mt-[15px] md:flex-col"
                    >
                      <Skeleton width={40} height={40} borderRadius={10} />
                      <Skeleton width={60} height={21} borderRadius={10} />
                    </div>
                  ))
                : nftAndRare.map((nft: any) => (
                    <Nft key={nft.name} nft={nft} />
                  ))}
            </div>
          </div>
          {
            items.length > 0 && (
              <div className="border-t border-[#949494]">
              <div className="pt-[8px] text-[16px] font-bold">BeraCave Prize</div>
              <div className="flex flex-wrap items-center lg:justify-between pt-[14px] md:gap-[40px]">
                {items.map((token: any, i: number) => {
                  const { w, h } = config[token.category];
                  return (
                    <img
                      key={i}
                      className="shrink-0"
                      style={{
                        width: w / 2,
                        height: h / 2
                      }}
                      src={token.logo}
                    />
                  );
                })}
              </div>
            </div>
            )
          }
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
