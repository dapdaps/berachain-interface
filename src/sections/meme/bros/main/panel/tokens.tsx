import LazyImage from "@/components/layz-image";
import { TOKENS } from "../laptop/config";
import { useMemo } from "react";
import Button from "@/components/button";
import RankMark from "../../rank-mark";
import Popover, { PopoverPlacement } from "@/components/popover";
import RewardsPanel from "./rewards-panel";
import RoundLabel from "../../components/round-label";
import clsx from "clsx";

const Token = ({ token, i }: any) => {
  return (
    <div
      className={clsx(
        "mt-[18px] rounded-[18px] bg-[#FFE5B8] border border-black shadow-shadow1 p-[16px]"
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-[15px]">
          <div className="relative">
            <LazyImage
              src={token.icon}
              width={42}
              height={42}
              containerClassName="rounded-full border-[3px] border-black"
            />

            {i < 3 && (
              <RankMark rank={i + 1} className="left-[4px] top-[8px]" />
            )}
          </div>
          <div>
            <div className="text-[20px] font-CherryBomb">{token.symbol}</div>
            <div className="text-[14px] underline font-medium">Get</div>
          </div>
        </div>
        <div className="rounded-[16px] flex items-center gap-[3px] p-[8px]">
          <span>APY</span>
          <span className="text-[14px] font-bold">45.24%</span>
        </div>
      </div>
      <div className="mt-[20px] flex text-[14px] md:flex-col">
        <div className="grow flex flex-wrap">
          <div className="w-1/3 md:w-1/2">
            <div className="text-[#3D405A] font-medium">Total Dapped</div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              <span>1</span>
              <LazyImage
                src={token.icon}
                width={16}
                height={16}
                containerClassName="rounded-full"
              />
            </div>
          </div>
          <div className="w-1/3 md:w-1/2">
            <div className="text-[#3D405A] font-medium">Total Rewards</div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              <span>1</span>
              <Popover
                content={<RewardsPanel />}
                placement={PopoverPlacement.TopLeft}
              >
                <div className="flex items-center gap-[3px] cursor-pointer">
                  <LazyImage
                    src={token.icon}
                    width={16}
                    height={16}
                    containerClassName="rounded-full"
                  />
                  <LazyImage
                    src={token.icon}
                    width={16}
                    height={16}
                    containerClassName="rounded-full ml-[-8px]"
                  />
                </div>
              </Popover>

              <button className="font-medium underline ml-[12px]">Claim</button>
            </div>
          </div>
          <div className="w-1/3 md:w-1/2 md:mt-[6px]">
            <div className="text-[#3D405A] font-medium">Dappers</div>
            <div className="font-semibold	mt-[2px]">1</div>
          </div>
          <div className="w-1/3 mt-[6px] md:w-1/2">
            <div className="text-[#3D405A] font-medium">You Dapped</div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              <span>1</span>
              <LazyImage
                src={token.icon}
                width={16}
                height={16}
                containerClassName="rounded-full"
              />
            </div>
          </div>
          <div className="w-1/3 mt-[6px] md:w-1/2">
            <div className="text-[#3D405A] font-medium">Your Rewards</div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              <span>1</span>
              <LazyImage
                src={token.icon}
                width={16}
                height={16}
                containerClassName="rounded-full"
              />
              <LazyImage
                src={token.icon}
                width={16}
                height={16}
                containerClassName="rounded-full ml-[-8px]"
              />
              <button className="font-medium underline ml-[12px]">Claim</button>
            </div>
          </div>
          <div className="w-1/3 mt-[6px] md:w-1/2">
            <div className="text-[#3D405A] font-medium">In Wallet</div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              <span>1</span>
              <LazyImage
                src={token.icon}
                width={16}
                height={16}
                containerClassName="rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[15px] md:flex-row md:mt-[12px]">
          <Button className="h-[40px] w-[172px]" type="primary">
            Dap me up!
          </Button>
          <Button className="h-[40px] w-[172px] !bg-transparent">
            Unstake
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function Tokens() {
  const tokens = useMemo(() => Object.values(TOKENS), [TOKENS]);
  return (
    <div className="w-[1232px] mx-[auto] md:px-[14px] md:w-full">
      <div className="flex justify-between items-center md:absolute md:top-[-25px] md:justify-start md:gap-[8px]">
        <RoundLabel title="Round 1" subTitle="NoV.20-dec.3, 2024" />
        <div className="flex items-center gap-[16px] md:hidden">
          <button className="w-[137px] h-[48px] border border-black bg-[#FFDC50] rounded-[10px] font-semibold">
            History
          </button>
          <button className="w-[137px] h-[48px] border border-black bg-[#FFDC50] rounded-[10px] font-semibold leading-[16px]">
            Vote for the next round
          </button>
        </div>
        <div className="rounded-[10px] w-[64px] h-[72px] border border-black bg-[#FFFDEB] p-[3px] hidden md:block">
          <Button
            type="primary"
            className="w-[58px] h-[32px] !text-[12px] !px-0"
          >
            Hotest
          </Button>
          <Button className="border-0 w-[58px] h-[32px] !text-[12px] !px-0">
            Fastest
          </Button>
        </div>
      </div>
      {Object.values(tokens).map((token, i) => (
        <Token key={token.address} token={token} i={i} />
      ))}
    </div>
  );
}
