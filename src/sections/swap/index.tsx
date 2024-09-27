import Card from "@/components/card"
import TokenAmout from "./TokenAmount"
import Fees from "./Fees"
import SubmitBtn from "./SubmitBtn"

export default function Swap() {
    return <div className="w-[520px] m-auto relative z-10 pt-[50px]">
        <Card>
            <TokenAmout />
            <div className="h-[8px] flex justify-center items-center">
                <svg className=" cursor-pointer" width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="38" height="38" rx="10" fill="#BC9549" stroke="#FFFDEB" stroke-width="4" />
                    <path d="M21.4999 16V26.5M21.4999 26.5L16 21M21.4999 26.5L27 21" stroke="black" stroke-width="2" stroke-linecap="round" />
                </svg>
            </div>
            <TokenAmout />
            <div className="flex items-center justify-between pt-[10px] text-[14px] font-medium">
                <div className="flex items-center gap-[5px]">
                    <div>1 ETH ≈ 3.54K USDC</div>
                    <svg className=" cursor-pointer" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.01514 6.11148C0.887128 4.95763 1.55283 3.03456 3.70343 3.03456C5.85402 3.03456 10.9999 3.03456 10.9999 3.03456M10.9999 3.03456L9.01977 1M10.9999 3.03456L9.01977 5" stroke="black" />
                        <path d="M10.9849 5.88071C11.1129 7.03456 10.4472 8.95763 8.29657 8.95763C6.14598 8.95763 1.00006 8.95763 1.00006 8.95763M1.00006 8.95763L3.01978 11M1.00006 8.95763L3.01978 7" stroke="black" />
                    </svg>

                </div>
                <div className="flex items-center gap-2">
                    <div>~$0.6523</div>
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L6 5L11 1" stroke="black" stroke-width="2" stroke-linecap="round" />
                    </svg>
                </div>
            </div>

            <Fees />

            <SubmitBtn />
        </Card>
    </div>
}