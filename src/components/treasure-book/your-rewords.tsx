import { useMemo, useState } from "react";
import History from "./history";
import type { TreasureData } from "./use-treasure";
import clsx from "clsx";

export default function YourRewords({ treasure }: { treasure: TreasureData | null }) {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const gemNum = useMemo(() => {
        if (treasure?.rewards?.Gem && treasure?.rewards?.Gem > 0) {
            return treasure?.rewards?.Gem;
        }
        return 0;
    }, [treasure]);

    const spinNum = useMemo(() => {
        if (treasure?.rewards?.Spin && treasure?.rewards?.Spin > 0) {
            return treasure?.rewards?.Spin;
        }
        return 0;
    }, [treasure]);

    const cosmeticNum = useMemo(() => {
        try {
            if (treasure?.rewards?.Cosmetic) {
                return treasure?.rewards?.Cosmetic
            }
        } catch (error) {
            console.log('error:  ', error);
        }

        return 0;
    }, [treasure]);


    return <div className="px-[30px]" >
        <div className=" mt-[40px] flex justify-between items-center">
            <div style={{
                WebkitTextStroke: "2px #000000",
            }} className="text-[24px] text-[#FDD54C] font-CherryBomb">Your Rewards</div>
            <div onClick={() => setIsHistoryOpen(true)} className="text-[14px] text-black font-Montserrat font-bold underline cursor-pointer">History</div>
        </div>
        <div className="flex justify-between items-center mt-[20px] font-CherryBomb font-[16px] text-white" style={{
            WebkitTextStroke: "2px #000000",
        }}>
            <div className="w-[86px] h-[86px] relative flex-col flex justify-center items-center bg-[#FFFFFF33] border-dashed rounded-[20px] border-[3px] border-[#8B6A45]">
                <img src={`/images/treasure-book/gem.png`} className={clsx("w-[60px] opacity-10", gemNum > 0 ? "opacity-100" : "opacity-10")} alt="item" />
                <div className={clsx("opacity-10 mt-[-20px]", gemNum > 0 ? "opacity-100" : "opacity-10")}>POINTS</div>
                {
                    gemNum > 0 && (
                        <div style={{
                            WebkitTextStroke: "2px #000000",
                        }} className="absolute bottom-[-35px] left-[50%] translate-x-[-50%] font-CherryBomb text-[#FDD54C] text-[20px]">X{gemNum}</div>
                    )
                }
            </div>
            <div className="w-[86px] h-[86px] relative flex-col flex justify-center items-center bg-[#FFFFFF33] border-dashed rounded-[20px] border-[3px] border-[#8B6A45]">
                <img src={`/images/treasure-book/spin.png`} className={clsx("w-[80px] opacity-10", spinNum > 0 ? "opacity-100" : "opacity-10")} alt="item" />
                <div className={clsx("opacity-10 mt-[-20px]", spinNum > 0 ? "opacity-100" : "opacity-10")}>SPIN</div>
                {
                    spinNum > 0 && (
                        <div style={{
                            WebkitTextStroke: "2px #000000",
                        }} className="absolute bottom-[-35px] left-[50%] translate-x-[-50%] font-CherryBomb text-[#FDD54C] text-[20px]">X{spinNum}</div>
                    )
                }
            </div>
            <div className="w-[86px] h-[86px] relative flex-col flex justify-center items-center bg-[#FFFFFF33] border-dashed rounded-[20px] border-[3px] border-[#8B6A45]">
                <img src={`/images/treasure-book/cosmetics.png`} className={clsx("h-[60px] opacity-10", cosmeticNum > 0 ? "opacity-100" : "opacity-10")} alt="item" />
                <div className={clsx("opacity-10 mt-[-20px]", cosmeticNum > 0 ? "opacity-100" : "opacity-10")}>COSMETICS</div>
                {
                    cosmeticNum > 0 && (
                        <div style={{
                            WebkitTextStroke: "2px #000000",
                        }} className="absolute bottom-[-35px] left-[50%] translate-x-[-50%] font-CherryBomb text-[#FDD54C] text-[20px]">X{cosmeticNum}</div>
                    )
                }
            </div>
            <div className="w-[86px] h-[86px] flex-col flex justify-center items-center bg-[#FFFFFF33] border-dashed rounded-[20px] border-[3px] border-[#8B6A45]">
                <div className="opacity-10 text-[42px]">？</div>
            </div>
            <div className="w-[86px] h-[86px] flex-col flex justify-center items-center bg-[#FFFFFF33] border-dashed rounded-[20px] border-[3px] border-[#8B6A45]">
                <div className="opacity-10 text-[42px]">？</div>
            </div>
        </div>
        {isHistoryOpen && <History onClose={() => setIsHistoryOpen(false)} />}
    </div>;
}