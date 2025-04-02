import { usePriceStore } from "@/stores/usePriceStore";
import CheckBox from "../CheckBox";
import { balanceFormated } from "@/utils/balance";
import Big from "big.js";
import { useMemo } from "react";

export default function Route({ name, fee, receiveAmount, fromChain, toToken, checked, onChange, icon, duration, feeType }: any) {
    const prices: any = usePriceStore(store => store.price);

    const feeText = useMemo(() => {
        if (feeType === 1) {
            return `${ balanceFormated(prices[fromChain.nativeCurrency.symbol.toUpperCase()] * (fee as any), 4)  }`
        }
        
        return `${balanceFormated(fee, 4)}`
    }, [fee, fromChain, prices])    

    return <div className="flex items-center justify-between py-[10px]">
        <div className="flex items-center gap-[10px]">
            <img className="w-[30px] h-[30px] rounded-[10px]" src={icon}/>
            <div className="text-[16px] font-[600]">{ name }</div>
        </div>

        <div className="flex items-center gap-2">
            <div className="text-right">
                <div className="text-[16px] font-[600]">{ Big(receiveAmount).div(10 ** toToken.decimals).toString()  }</div>
                <div className="text-[12px] font-medium text-[#3D405A]">~{duration} min | Fee ${feeText}</div>
            </div>
            <CheckBox checked={checked} onChange={() => {
                onChange(true)
            }}/>
        </div>
    </div>
}