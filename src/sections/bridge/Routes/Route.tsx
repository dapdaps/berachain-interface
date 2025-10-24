import { usePriceStore } from "@/stores/usePriceStore";
import CheckBox from "../CheckBox";
import { balanceFormated } from "@/utils/balance";
import Big from "big.js";
import { useMemo } from "react";
import useIsMobile from "@/hooks/use-isMobile";
import { numberFormatter } from "@/utils/number-formatter";

export default function Route({ name, fee, receiveAmount, fromChain, toToken, checked, onChange, icon, duration, feeType }: any) {
    const prices: any = usePriceStore(store => store.price);
    const isMobile = useIsMobile();

    const feeText = useMemo(() => {
        if (feeType === 1) {
            return `${balanceFormated(prices[fromChain.nativeCurrency.symbol.toUpperCase()] * (fee as any), 4)}`
        }

        return (!fee || Number(fee) === 0) ? '0.00' : `${balanceFormated(fee, 4)}`
    }, [fee, fromChain, prices])

    return (
        <div className="flex items-center justify-between py-[10px] gap-1">
            <div className="flex items-center gap-[10px] shrink-0">
                <img className="w-[30px] h-[30px] rounded-[10px]" src={icon} />
                <div className="text-[16px] font-[600]">{name}</div>
            </div>

            <div className="flex items-center justify-end gap-2 flex-1 w-0">
                <div className="text-right w-0 flex-1">
                    <div className="text-[16px] font-[600] w-full overflow-hidden text-ellipsis whitespace-nowrap">
                        {numberFormatter(Big(receiveAmount).div(10 ** toToken.decimals), isMobile ? 6 : toToken.decimals, true, { round: Big.roundDown })}
                    </div>
                    <div className="text-[12px] font-medium text-[#3D405A]">~{duration} min | Fee ${feeText}</div>
                </div>
                <CheckBox
                    className="shrink-0"
                    checked={checked}
                    onChange={() => {
                        onChange(true)
                    }}
                />
            </div>
        </div>
    );
}