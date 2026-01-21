import { usePriceStore } from "@/stores/usePriceStore";
import CheckBox from "../CheckBox";
import { balanceFormated } from "@/utils/balance";
import Big from "big.js";
import { useMemo } from "react";
import useIsMobile from "@/hooks/use-isMobile";
import { numberFormatter } from "@/utils/number-formatter";
import { FeeType } from "../lib/type";
import { useSettingsStore } from "@/stores/settings";

const COLOR: Record<number, string> = {
    0: "text-[#33b65f]", // 0-1%
    1: "text-[#FFD700]", // 1-5%
    2: "text-[#ff9445]", // 5-15%
    3: "text-[#ff547d]"  // >15%
};

export default function Route({ name, fee, receiveAmount, fromChain, toToken, checked, onChange, icon, duration, feeType, route, path, priceImpact, priceImpactType, minimumReceived, fromToken, isExpanded, onExpandToggle }: any) {
    const prices: any = usePriceStore(store => store.price);
    const isMobile = useIsMobile();
    const slippage = useSettingsStore((store: any) => store.slippage);


    const feeText = useMemo(() => {
        if (feeType === FeeType.origin) {
            return `${balanceFormated(prices[fromChain.nativeCurrency.symbol.toUpperCase()] * (fee as any), 4)}`
        }

        if (feeType === FeeType.target) {
            return `${balanceFormated((prices[(toToken as any).priceKey] || prices[toToken.symbol.toUpperCase()] || prices[toToken.address.toLowerCase()]) * (fee as any), 4)}`
        }

        return (!fee || Number(fee) === 0) ? '0.00' : `${balanceFormated(fee, 4)}`
    }, [fee, fromChain, prices])

    const minimumReceivedValue = useMemo(() => {
        const _slippage = slippage || 0.5;
        if (minimumReceived !== undefined) {
            return minimumReceived;
        }

        return Big(receiveAmount).mul(1 - _slippage / 100).toString();
    }, [minimumReceived, receiveAmount, slippage]);


    const routePath = useMemo(() => {
        if (path && Array.isArray(path)) {
            return path.join(' > ');
        }
        if (fromToken && toToken) {
            return `${fromToken.symbol} > ${toToken.symbol}`;
        }
        return '';
    }, [path, fromToken, toToken]);

    return (
        <div className="relative [&:not(:last-child)]:border-b [&:not(:last-child)]:border-[#373A53]">
            <div className="flex items-center justify-between py-[10px] gap-1">
                <div className="flex items-center gap-[10px] shrink-0 relative">
                    <img className="w-[30px] h-[30px] rounded-[10px]" src={icon} />

                    <div
                        className="flex items-center gap-[6px] cursor-pointer"
                        onClick={onExpandToggle}
                    >
                        <div className="text-[16px] font-[600]">{name}</div>
                        {
                            !!priceImpact && priceImpactType !== null && <svg
                                width="12"
                                height="7"
                                viewBox="0 0 12 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            >
                                <path
                                    d="M1 1L6 6L11 1"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        }
                    </div>
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

            {isExpanded && priceImpact !== null && (
                <div className="py-[10px] space-y-[8px]">
                    <div className="flex items-center justify-between text-[14px]">
                        <div className="text-[#3D405A]">Price impact</div>
                        <div className={`font-[600] ${COLOR[priceImpactType || 0]}`}>
                            {numberFormatter(Math.abs(priceImpact), 2, true, { round: Big.roundDown, prefix: Number(priceImpact) > 0 ? '' : '-' })}%
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-[14px]">
                        <div className="text-[#3D405A]">Max slippage</div>
                        <div className="font-[600] text-black">
                            {slippage || 0.5}%
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-[14px]">
                        <div className="text-[#3D405A]">Minimum received</div>
                        <div className="font-[600] text-black">
                            {numberFormatter(Big(minimumReceivedValue).div(10 ** toToken.decimals), isMobile ? 6 : toToken.decimals, true, { round: Big.roundDown })}
                        </div>
                    </div>
                    {routePath && (
                        <div className="flex items-center justify-between text-[14px]">
                            <div className="text-[#3D405A]">Route</div>
                            <div className="font-[600] text-black">{routePath}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}