import Image from "next/image";
import Button from "@/components/button";
import Popover, { PopoverPlacement } from "@/components/popover";
import RoundLabel from "../components/round-label";
import TokensPanel from "./laptop/tokens-panel";
import clsx from "clsx";
import useIsMobile from "@/hooks/use-isMobile";
import MemeRank from "../modals/meme-rank";
import { useState } from "react";

export default function Round() {
  const isMobile = useIsMobile();
  const [showRank, setShowRank] = useState(false);
  return (
    <>
      <div
        className={clsx(
          "relative w-full rounded-[18px] mt-[50px] bg-[#FFE5B8] shadow-shadow1 border border-black p-[5px]",
          "md:mx-[14px] md:w-[calc(100%-28px)]"
        )}
      >
        <RoundLabel
          title="Round 2"
          subTitle="NoV.20-dec.3, 2024"
          className="!absolute top-[-34px] left-[13px] md:w-[calc(100%-26px)]"
        />
        <div
          className="hidden border-b border-black/20 w-full justify-center pb-[14px] pt-[44px] md:flex cursor-pointer"
          onClick={() => {
            setShowRank(true);
          }}
        >
          {[1, 2, 3, 4].map((item, i) => (
            <Image
              key={item}
              src="/assets/tokens/bera.svg"
              width={40}
              height={40}
              alt="Reward Token"
              className={i !== 0 ? "ml-[-15px]" : ""}
            />
          ))}
        </div>
        <div
          className={clsx(
            "border-b border-black/20 pt-[50px] pl-[20px] pb-[20px] flex items-center",
            "md:pb-0 md:pl-0 md:pt-[10px] md:flex-wrap md:border-0"
          )}
        >
          {!isMobile && (
            <Popover
              content={<TokensPanel />}
              placement={PopoverPlacement.TopLeft}
            >
              <div className="flex items-center w-1/4">
                {[1, 2, 3, 4].map((item, i) => (
                  <Image
                    key={item}
                    src="/assets/tokens/bera.svg"
                    width={40}
                    height={40}
                    alt="Reward Token"
                    className={i !== 0 ? "ml-[-15px]" : ""}
                  />
                ))}
              </div>
            </Popover>
          )}

          <div className="w-1/4 md:w-1/2 md:pl-[20px]">
            <div className="text-[#3D405A] font-medium md:text-[14px]">
              Total Dapped
            </div>
            <div className="font-semibold	mt-[2px]">1</div>
          </div>
          <div className="w-1/4 md:w-1/2 md:pl-[10px]">
            <div className="text-[#3D405A] font-medium md:text-[14px]">
              Total Rewards
            </div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[10px]">
              <span>1</span>
            </div>
          </div>
          <div className="w-1/4 md:hidden">
            <div className="text-[#3D405A] font-medium md:text-[14px]">
              Total Dappers
            </div>
            <div className="font-semibold	mt-[2px]">1</div>
          </div>
        </div>
        <div className="pt-[12px] pl-[20px] pb-[20px] flex items-center flex-wrap">
          <div className="w-1/4 md:w-1/2">
            <div className="text-[#3D405A] font-medium md:text-[14px]">
              You Voted for
            </div>
            <div className="font-semibold	mt-[2px]">1</div>
          </div>
          <div className="w-1/4 md:w-1/2">
            <div className="text-[#3D405A] font-medium md:text-[14px]">
              Incentive Added
            </div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              <Image
                src="/assets/tokens/bera.svg"
                width={16}
                height={16}
                alt="Incentive Token"
                className="rounded-full"
              />
              <span>1</span>
            </div>
          </div>
          <div className="w-1/4 md:w-1/2 md:pt-[12px]">
            <div className="text-[#3D405A] font-medium md:text-[14px]">
              You Dapped
            </div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              <span>1</span>
              <Image
                src="/assets/tokens/bera.svg"
                width={16}
                height={16}
                alt="Incentive Token"
                className="rounded-full"
              />
              <Button className="h-[28px] ml-[12px] md:hidden" type="primary">
                Unstake!
              </Button>
            </div>
          </div>
          <div className="w-1/4 md:w-1/2 md:pt-[12px]">
            <div className="text-[#3D405A] font-medium md:text-[14px]">
              Your Rewards
            </div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              <span>1</span>
              <Image
                src="/assets/tokens/bera.svg"
                width={16}
                height={16}
                alt="Incentive Token"
                className="rounded-full"
              />
              <Image
                src="/assets/tokens/bera.svg"
                width={16}
                height={16}
                alt="Incentive Token"
                className="rounded-full ml-[-8px]"
              />
              <Button
                disabled
                className="h-[28px] ml-[12px] md:hidden"
                type="primary"
              >
                Claimed
              </Button>
            </div>
          </div>
        </div>
        <div className="items-center gap-[14px] px-[14px] mb-[12px] hidden md:flex">
          <Button className="h-[40px] w-1/2" type="primary">
            Unstake!
          </Button>
          <Button disabled className="h-[40px] w-1/2" type="primary">
            Claimed
          </Button>
        </div>
      </div>
      <MemeRank
        open={showRank}
        onClose={() => {
          setShowRank(false);
        }}
      />
    </>
  );
}
