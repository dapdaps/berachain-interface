import Modal from "@/components/modal";
import OpenBox from "./open-box";
import Button from "./button";
import Present from "./present";
import { useRouter } from "next-nprogress-bar";
import { formatThousandsSeparator } from "@/utils/balance";
import React, { useContext } from 'react';
import { ChristmasContext } from '@/sections/activity/christmas/context';
import Rare from '@/sections/activity/christmas/nft-prize-winners-modal/rare';
import Nft from '@/sections/activity/christmas/nft-prize-winners-modal/nft';
import Skeleton from 'react-loading-skeleton';

export default function UserPresentsModal({ open, data, onClose, loading }: any) {
  const router = useRouter();
  const {
    setShowSwapModal,
    isMobile,
  } = useContext(ChristmasContext);

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIconClassName="right-[-14px] top-[-8px]"
      isShowCloseIcon={!isMobile}
    >
      <div className="w-[880px] rounded-[20px] md:w-full md:h-[80dvh] md:overflow-y-auto border border-black bg-[#FFFDEB] shadow-shadow1 pb-[20px]">
        <div className="mt-[12px] text-center">
          <OpenBox className="mx-[auto]" />
        </div>
        <div className="text-[20px] font-bold py-[12px] text-center">
          You already opened {data.used_box - data.total_yap} presents
        </div>
        <div className="px-[38px] max-h-[70dvh] md:max-h-[unset] overflow-y-auto pb-[20px]">
          <div className="border-t border-t-[#A5A5A5]/30 pt-[14px] pb-[20px]">
            <div className="text-[16px] font-bold">
              You got <span className="text-[26px]">{(data?.nfts?.length || 0) + (data?.rares?.length || 0)}</span>{" "}rare prize
            </div>
            <div className="flex gap-[12px] flex-wrap mt-[12px] md:grid md:grid-cols-2 md:gap-[16px]">
              {
                loading ? (
                  <>
                    <Skeleton width={isMobile ? '100%' : 150} height={154} borderRadius={10} />
                    <Skeleton width={isMobile ? '100%' : 150} height={154} borderRadius={10} />
                  </>
                ) : [...(data.nfts || []), ...(data.rares || [])].map((it: any, idx: number) => {
                  if (idx < data.nfts?.length) {
                    return (
                      <Nft key={it.token_id} nft={it} />
                    );
                  }
                  return (
                    <Rare key={idx} rare={it} />
                  );
                })
              }
            </div>
          </div>
          <div className="border-t border-t-[#A5A5A5]/30 pt-[14px] pb-[20px]">
            <div className="flex justify-between items-center md:flex-col">
              <div className="text-[16px] font-bold">
                You got <span className="text-[26px]">{data.items?.length}</span>{" "}
                BeraCave outfits
              </div>
              {
                !isMobile && (
                  <Button
                    onClick={() => {
                      router.push("/cave");
                    }}
                  >
                    Go to BeraCave
                  </Button>
                )
              }
            </div>
            <div className="flex gap-[16px] flex-nowrap mt-[12px] overflow-y-auto md:grid md:grid-cols-2">
              {
                loading ? (
                  <>
                    <Skeleton width={isMobile ? '100%' : 150} height={154} borderRadius={10} />
                    <Skeleton width={isMobile ? '100%' : 150} height={154} borderRadius={10} />
                  </>
                ) : data.items?.map?.((item: any) => (
                  <Present key={item.id} gift={item.category} />
                ))
              }
            </div>
            {
              isMobile && (
                <div className="flex justify-center mt-[15px]">
                  <Button
                    onClick={() => {
                      router.push("/cave");
                    }}
                  >
                    Go to BeraCave
                  </Button>
                </div>
              )
            }
          </div>
          <div className="border-t border-t-[#A5A5A5]/30 pt-[14px] flex justify-between items-center md:flex-col">
            <div className="text-[16px] font-bold">
              You got{" "}
              <span className="text-[26px]">
                {formatThousandsSeparator(data.total_token || 0)}
              </span>{" "}
              $SNOWFLAKE
            </div>
            <div className="md:flex md:justify-center md:mt-[15px]">
              <Button
                onClick={() => {
                  setShowSwapModal?.(true);
                }}
              >
                <div className="pl-[24px]">Trade Now</div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
