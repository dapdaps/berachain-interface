import clsx from "clsx";
import { REDDEM_SPINS_EXCHANGE_RATE_GEM_TO_SPINS } from "../../config";
import InputNumber from "@/components/input-number";
import { useEffect, useMemo } from "react";
import { useUserStore } from "@/stores/user";
import Big from "big.js";
import { numberFormatter } from "@/utils/number-formatter";
import Loading from "@/components/loading";
import useUser from "@/hooks/use-user";

const RedeemSpin = (props: any) => {
  const {
    className,
    open,
    onBuySpins,
    buyingSpins,
    buySpinsAmount,
    setBuySpinsAmount,
  } = props;

  const { getUserInfo } = useUser();
  const userInfo = useUserStore((store: any) => store.user);
  const userInfoLoading = useUserStore((store: any) => store.loading);

  const costGem = useMemo(() => {
    return Big(buySpinsAmount || 0).mul(REDDEM_SPINS_EXCHANGE_RATE_GEM_TO_SPINS);
  }, [buySpinsAmount]);

  const buttonValid = useMemo(() => {
    const result = { valid: false, text: "Buy", loading: false };
    if (buyingSpins || userInfoLoading) {
      result.loading = true;
    }
    if (!buySpinsAmount || Big(buySpinsAmount).lte(0)) {
      return result;
    }
    const cost = Big(buySpinsAmount || 0).mul(REDDEM_SPINS_EXCHANGE_RATE_GEM_TO_SPINS);
    if (Big(cost).gt(userInfo.gem || 0)) {
      result.text = "Insufficient balance";
      return result;
    }

    result.valid = true;

    return result;
  }, [userInfoLoading, buyingSpins, buySpinsAmount, userInfo]);

  useEffect(() => {
    getUserInfo();

    return () => {
      setBuySpinsAmount("");
    };
  }, []);

  return (
    <div className={clsx("w-full relative text-right text-black font-montserrat text-[16px] font-semibold leading-[90%]", className)}>
      <img
        src="/images/check-in/spin.png"
        alt=""
        className="w-[100px] h-[100px] shrink-0 object-center object-contain absolute left-1/2 -translate-x-1/2 top-[-104px]"
      />
      <div className="text-[#FDD54C] text-center [text-shadow:0_2px_0_#000] [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#000] font-CherryBomb text-[30px] font-normal leading-normal capitalize">
        Redeem Big Wheel Spin
      </div>
      <div className="flex justify-center">
        <div className="mt-[20px] pl-[13px] pr-[15px] gap-[10px] rounded-[23px] bg-black/10 h-[46px] flex-shrink-0 text-white text-center [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#4B371F] font-CherryBomb text-[18px] font-normal leading-[100%] tracking-[0.9px] flex items-center justify-center">
          <img
            src="/images/playground/lucky-bera/icon-reward/gem.svg"
            alt=""
            className="w-[30px] h-[25px] shrink-0 object-center object-contain"
          />
          <div>
            {REDDEM_SPINS_EXCHANGE_RATE_GEM_TO_SPINS} Points / Spin
          </div>
        </div>
      </div>
      <div className="w-full mt-[19px] relative">
        <InputNumber
          type="text"
          className="w-full pl-[170px] h-[58px] bg-white border border-black rounded-[12px] text-right text-[26px] font-Montserrat font-[600] text-black px-[16px]"
          value={buySpinsAmount}
          onNumberChange={(value) => setBuySpinsAmount(value)}
          integerOnly
          autoFocus
        />
        <div className="absolute flex items-center gap-[5px] left-[0px] top-1/2 -translate-y-1/2">
          <img
            src="/images/check-in/spin.png"
            alt=""
            className="w-[50px] h-[51px] object-center object-contain shrink-0"
          />
          <div>Spin Times</div>
        </div>
      </div>
      <div className="w-full mt-[7px] flex justify-between items-center text-[14px]">
        <div className="">
          Your PTS: {numberFormatter(userInfo.gem, 2, true, { isShort: false, isShortUppercase: true })}
        </div>
        <div className="flex justify-end items-center gap-[3px]">
          <img
            src="/images/playground/lucky-bera/icon-reward/gem.svg"
            alt=""
            className="w-[16px] h-[14px] shrink-0 object-center object-contain"
          />
          <div className="">-{numberFormatter(costGem, 2, true, { isShort: false, isShortUppercase: true })}</div>
        </div>
      </div>
      <div className="w-full mt-[23px] flex justify-center items-center">
        <button
          type="button"
          className="flex justify-center items-center gap-[4px] disabled:opacity-30 disabled:!cursor-not-allowed hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.25)] transition-all duration-150 rounded-[10px] border border-black bg-[#FFDC50] shadow-[6px_6px_0_0_rgba(0,0,0,0.25)] h-[50px] flex-shrink-0 text-black text-center font-Montserrat text-[16px] font-bold leading-[150%] w-full"
          disabled={!buttonValid.valid || buttonValid.loading}
          onClick={onBuySpins}
        >
          {
            buyingSpins && (
              <Loading size={16} />
            )
          }
          <div className="">
            {buttonValid.text}
          </div>
        </button>
      </div>
    </div>
  );
};

export default RedeemSpin;
