import LazyImage from "@/components/layz-image";
import { TOKENS } from "../config";
import { useMemo } from "react";
import Button from "@/components/button";

const Item = ({ token }: any) => {
  return (
    <div className="w-[397px] rounded-[18px] bg-[#FFE5B8] border border-black shadow-boxShadow p-[16px]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-[15px]">
          <LazyImage
            src={token.icon}
            width={42}
            height={42}
            containerClassName="rounded-full border-4 border-black"
          />
          <div>
            <div className="text-[20px] font-CherryBomb">{token.symbol}</div>
            <div className="text-[14px] underline font-medium">Get</div>
          </div>
        </div>
        <div className="border border-black rounded-[16px] flex items-center gap-[3px] p-[8px]">
          <span>👊</span>
          <span className="text-[14px] font-bold">45.24%</span>
        </div>
      </div>
      <div className="mt-[20px] text-[14px]">
        <div className="flex">
          <div className="w-1/3">
            <div className="text-[#3D405A] font-medium">Total Dapped</div>
            <div className="font-semibold	mt-[2px]">1</div>
          </div>
          <div className="w-1/3">
            <div className="text-[#3D405A] font-medium">APY</div>
            <div className="font-semibold	mt-[2px]">1</div>
          </div>
          <div className="w-1/3">
            <div className="text-[#3D405A] font-medium">Dappers</div>
            <div className="font-semibold	mt-[2px]">1</div>
          </div>
        </div>
        <div className="flex mt-[6px]">
          <div className="w-1/3">
            <div className="text-[#3D405A] font-medium">You Dapped</div>
            <div className="font-semibold	mt-[2px]">1</div>
          </div>
          <div className="w-1/3">
            <div className="text-[#3D405A] font-medium">Your Rewards</div>
            <div className="font-semibold	mt-[2px]">1</div>
          </div>
          <div className="w-1/3">
            <div className="text-[#3D405A] font-medium">In Wallet</div>
            <div className="font-semibold	mt-[2px]">1</div>
          </div>
        </div>
      </div>
      <div className="flex gap-[10px] mt-[18px]">
        <Button className="h-[40px] w-[116px] !bg-transparent">Unstake</Button>
        <Button className="h-[40px] w-[293px]" type="primary">
          Dap me up!
        </Button>
      </div>
    </div>
  );
};

export default function Tokens() {
  const tokens = useMemo(() => Object.values(TOKENS), [TOKENS]);
  return (
    <div className="w-[1232px] flex flex-wrap mx-[auto] gap-[20px]">
      {Object.values(tokens).map((token, i) => (
        <Item key={token.address} token={token} i={i} />
      ))}
    </div>
  );
}
