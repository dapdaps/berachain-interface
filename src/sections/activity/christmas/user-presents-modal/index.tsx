import Modal from "@/components/modal";
import OpenBox from "./open-box";
import Button from "./button";
import Present from "./present";
import { useRouter } from "next-nprogress-bar";
import { formatThousandsSeparator } from "@/utils/balance";
import { useContext } from 'react';
import { ChristmasContext } from '@/sections/activity/christmas/context';
import Rare from '@/sections/activity/christmas/nft-prize-winners-modal/rare';
import Nft from '@/sections/activity/christmas/nft-prize-winners-modal/nft';

export default function UserPresentsModal({ open, data, onClose }: any) {
  const router = useRouter();
  const {
    setShowSwapModal,
  } = useContext(ChristmasContext);

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIconClassName="right-[-14px] top-[-8px]"
    >
      <div className="w-[880px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-shadow1 pb-[20px]">
        <div className="mt-[12px] text-center">
          <OpenBox className="mx-[auto]" />
        </div>
        <div className="text-[20px] font-bold py-[12px] text-center">
          You already opened {data.used_box - data.total_yap} presents
        </div>
        <div className="px-[38px] max-h-[70dvh] overflow-y-auto pb-[20px]">
          <div className="border-t border-t-[#A5A5A5]/30 pt-[14px] pb-[20px]">
            <div className="text-[16px] font-bold">
              You got <span className="text-[26px]">{(data?.nfts?.length || 0) + (data?.rares?.length || 0)}</span>{" "}rare prize
            </div>
            <div className="flex gap-[12px] flex-wrap mt-[12px]">
              {
                [...(data.nfts || []), ...(data.rares || [])].map((it: any, idx: number) => {
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
            <div className="flex justify-between items-center">
              <div className="text-[16px] font-bold">
                You got <span className="text-[26px]">{data.items?.length}</span>{" "}
                BeraCave outfits
              </div>
              <Button
                onClick={() => {
                  router.push("/cave");
                }}
              >
                Go to BeraCave
              </Button>
            </div>
            <div className="flex gap-[16px] flex-nowrap mt-[12px] overflow-y-auto">
              {data.items?.map?.((item: any) => (
                <Present key={item.id} gift={item.category} />
              ))}
            </div>
          </div>
          <div className="border-t border-t-[#A5A5A5]/30 pt-[14px] flex justify-between items-center">
            <div className="text-[16px] font-bold">
              You got{" "}
              <span className="text-[26px]">
                {formatThousandsSeparator(data.total_token || 0)}
              </span>{" "}
              $Snowflake
            </div>
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
    </Modal>
  );
}
