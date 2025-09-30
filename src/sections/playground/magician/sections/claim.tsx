import Card from "@/components/card";
import Modal from "@/components/modal";
import { numberFormatter, numberRemoveEndZero } from "@/utils/number-formatter";
import Big from "big.js";
import dayjs from "dayjs";
import { useMemo } from "react";
import { ClaimRefundFee } from "../config";
import Loading from "@/components/loading";

const ClaimModal = (props: any) => {
  const { open, onClose } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Card className="w-[370px] !rounded-[20px]">
        <Claim {...props} />
      </Card>
    </Modal>
  );
};

export default ClaimModal;

const Claim = (props: any) => {
  const { onClaim, claiming, room, account } = props;

  const [yourBet, refund] = useMemo(() => {
    if (!room) {
      return [];
    }
    const yourBetTimes = room?.players?.filter((player: any) => player.address.toLowerCase() === account.toLowerCase())?.length || 1;
    const _yourBet = Big(room?.bet_amount || 0).times(yourBetTimes);
    const _refund = Big(_yourBet).times(1 - ClaimRefundFee);
    return [
      _yourBet,
      _refund
    ];
  }, [room]);

  return (
    <div className="w-full text-[#532] font-[600] leading-[100%]">
      <div className="text-black text-[20px] font-[20px] leading-[90%]">
        Close Game {room?.room_id}
      </div>
      <div className="mt-[30px] flex flex-col items-stretch gap-[20px]">
        <Item label="Create time">
          {dayjs(room?.create_time * 1000).utc().format("YYYY/M/D HH:mm")}
        </Item>
        <Item label="Player">
          {room?.players?.length || 0}
        </Item>
        <Item label="You Bet">
          {numberFormatter(yourBet, 2, true, { isShort: true, isZeroPrecision: false })}
        </Item>
        <Item label="Est. Refunds">
          {numberFormatter(refund, 2, true, { isShort: true, isZeroPrecision: false })}
        </Item>
      </div>
      <div className="mt-[30px]">
        <button
          type="button"
          disabled={claiming}
          className="w-full h-[46px] disabled:opacity-30 disabled:!cursor-not-allowed rounded-[10px] text-black border border-black bg-[#FFDC50] text-[14px] font-[600] flex justify-center items-center gap-[10px]"
          onClick={() => {
            onClaim();
          }}
        >
          {
            claiming && (
              <Loading size={14} />
            )
          }
          <div>Close</div>
        </button>
      </div>
      <div className="mt-[10px] text-[14px] text-[#FF4372] font-[500] flex justify-between items-center gap-[5px]">
        <img
          src="/images/playground/magician/icon-alert.png"
          alt=""
          className="w-[20px] h-[20px] object-center object-contain shrink-0"
        />
        <div className="">
          {numberRemoveEndZero(Big(ClaimRefundFee).times(100).toFixed(2))}% platform fee will be charged if you cancelled this game
        </div>
      </div>
    </div>
  );
};

const Item = (props: any) => {
  const { label, children } = props;

  return (
    <div className="flex justify-between items-center gap-[8px]">
      <div className="shrink-0">
        {label}
      </div>
      <div className="flex-1 h-[1px] border-t border-[#000] border-dashed"></div>
      <div className="shrink-0">
        {children}
      </div>
    </div>
  );
};
