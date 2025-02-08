import Card from "@/sections/ramen/detail/components/card";
import Input from "./input";
import AuctionButton from "../auction-button";
import { numberFormatter } from "@/utils/number-formatter";
import Big from "big.js";
import { useState } from "react";
import useFixedBuy from "../../hooks/use-fixed-buy";

export default function RegisterPanel({
  gachaInfo,
  ticketPrice,
  detail,
  onSuccess
}: any) {
  const [amount, setAmount] = useState(1);
  const { buying, onBuy } = useFixedBuy({
    detail,
    amount,
    onSuccess() {
      onSuccess?.();
    }
  });
  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span>Register for Launch</span>
          <span className="text-[12px] text-[#8D8D8D]">
            Balance:{" "}
            <span className="text-black">
              {numberFormatter(gachaInfo?.balance || 0, 0, true)} Gocha
            </span>
          </span>
        </div>
      }
    >
      <div className="text-[14px] text-[#3D405A] pt-[10px] font-medium">
        To increase your chances of winning allocation in this launch, you may
        choose to spend more Gacha to submit multiple entries. Note that Gacha
        spent will not be returned regardless of the outcome.
      </div>
      <div className="mt-[30px] border-black/10 border rounded-[10px] bg-[#FFFDEB] p-[30px_15px]">
        <Input
          value={amount}
          onChange={setAmount}
          maxTicket={gachaInfo?.maxTicket}
        />
        <div
          onClick={() => {
            setAmount(gachaInfo?.maxTicket || 1);
          }}
          className="cursor-pointer text-[14px] text-black font-medium text-center mt-[14px]"
        >
          Max
        </div>
        <div className="text-[14px] mt-[24px] text-center">
          Gacha Requirement: {Big(ticketPrice).div(1e18).toFixed(0)} Gacha/Entry
        </div>
        <div className="text-[14px] font-medium text-center">
          Each wallet may only win up to 10 allocation tickets
        </div>
        <div className="mt-[48px]">
          <AuctionButton
            text="Gacha"
            errorTips={amount > gachaInfo?.maxTicket ? "No Enough Gacha" : ""}
            loading={buying}
            onClick={onBuy}
          />
        </div>
      </div>
    </Card>
  );
}
