import { bera } from "@/configs/tokens/bera";
import SpinGood from "./good";
import InputNumber from "@/components/input-number";
import Big from "big.js";
import Loading from "@/components/loading";
import { useEffect, useMemo } from "react";
import { BUY_SPINS_EXCHANGE_RATE_BERA_TO_SPINS, GoodsList } from "../../config";
import { numberFormatter } from "@/utils/number-formatter";
import useTokenBalance from "@/hooks/use-token-balance";
import useToast from "@/hooks/use-toast";

const BuySpins = (props: any) => {
  const {
    onBuySpins,
    buyingSpins,
    buySpinsAmount,
    setBuySpinsAmount,
    open,
  } = props;

  const costToken = bera["bera"];
  const { tokenBalance, isLoading } = useTokenBalance(costToken.address, costToken.decimals, costToken.chainId);
  const toast = useToast();

  const costBera = useMemo(() => {
    return numberFormatter(Big(buySpinsAmount || 0).mul(BUY_SPINS_EXCHANGE_RATE_BERA_TO_SPINS), 2, true);
  }, [BUY_SPINS_EXCHANGE_RATE_BERA_TO_SPINS, buySpinsAmount]);

  const buttonValid = useMemo(() => {
    const result = { valid: false, text: "Buy", loading: false };
    if (buyingSpins || isLoading) {
      result.loading = true;
    }
    if (!buySpinsAmount || Big(buySpinsAmount).lte(0)) {
      return result;
    }
    const cost = Big(buySpinsAmount || 0).mul(BUY_SPINS_EXCHANGE_RATE_BERA_TO_SPINS);
    if (Big(cost).gt(tokenBalance || 0)) {
      result.text = "Insufficient balance";
      return result;
    }

    result.valid = true;

    return result;
  }, [buySpinsAmount, tokenBalance, buyingSpins, isLoading, BUY_SPINS_EXCHANGE_RATE_BERA_TO_SPINS]);

  const onBuyGood = async (data: any) => {
    const cost = Big(data.amount).div(Big(1).plus(data.add)).times(BUY_SPINS_EXCHANGE_RATE_BERA_TO_SPINS);
    if (cost.gt(tokenBalance)) {
      toast.fail({ title: "Insufficient balance" });
      return;
    }
    await onBuySpins({ amount: data.amount, discount: data.add });
  };

  useEffect(() => {
    return () => {
      setBuySpinsAmount("");
    };
  }, []);

  return (
    <div className="w-full relative px-[20px] text-[16px] font-Montserrat font-[600] leading-[90%]">
      <img
        src="/images/playground/lucky-bera/ticket-spin.png"
        alt=""
        className="w-[102px] h-[92px] object-center object-contain absolute left-1/2 -translate-x-1/2 top-[-50px]"
      />
      <div className="flex items-center justify-center gap-[7px] pt-[30px]">
        <div className="text-[30px] font-CherryBomb font-normal leading-normal capitalize text-center text-[#FDD54C] [text-shadow:0_2px_0_#000] [text-stroke:2px_#000] [-webkit-text-stroke:2px_#000]">
          Buy Lucky Bera Spin
        </div>
      </div>
      <div className="mt-[10px] flex justify-center items-center">
        <div className="h-[46px] px-[12px] gap-[8px] rounded-[23px] bg-black/10 text-white text-center font-CherryBomb text-[18px] font-normal leading-[100%] tracking-[0.9px] [text-stroke:2px_#4B371F] [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#4B371F] flex items-center justify-center">
          <img
            src={costToken.icon}
            alt=""
            className="w-[26px] h-[26px] rounded-full object-center object-contain"
          />
          <div className="">
            {BUY_SPINS_EXCHANGE_RATE_BERA_TO_SPINS} {costToken.symbol} / Spin
          </div>
        </div>
      </div>
      <div className="w-full mt-[20px] relative">
        <InputNumber
          type="text"
          className="w-full pl-[170px] h-[58px] bg-white border border-black rounded-[12px] text-right text-[26px] font-Montserrat font-[600] text-black px-[16px]"
          value={buySpinsAmount}
          onNumberChange={(value) => setBuySpinsAmount(value)}
          integerOnly
          disabled={buttonValid.loading}
        />
        <div className="absolute flex items-center gap-[5px] left-[0px] top-1/2 -translate-y-1/2">
          <img
            src="/images/playground/lucky-bera/ticket-spin.png"
            alt=""
            className="w-[64px] h-[56px] object-center object-contain shrink-0"
          />
          <div>Spin Times</div>
        </div>
      </div>
      <div className="mt-[7px] flex justify-between items-center">
        <div className="">
          {costToken.symbol.slice(0, 1).toUpperCase() + costToken.symbol.slice(1).toLowerCase()} Bal. {numberFormatter(tokenBalance, 2, true, { isShort: true, isShortUppercase: true })}
        </div>
        <div className="flex justify-end items-center gap-[5px]">
          <img
            src={costToken.icon}
            alt=""
            className="w-[26px] h-[26px] rounded-full object-center object-contain"
          />
          <div className="shrink-0">
            -{costBera || 0}
          </div>
        </div>
      </div>
      <div className="mt-[20px]">
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
      <div className="grid grid-cols-3 gap-[12px] mt-[30px] pb-[22px]">
        {
          GoodsList.map((item) => (
            <SpinGood
              key={item.id}
              costToken={costToken}
              data={item}
              loading={buyingSpins}
              onBuySpins={onBuyGood}
            />
          ))
        }
      </div>
    </div>
  );
};

export default BuySpins;
