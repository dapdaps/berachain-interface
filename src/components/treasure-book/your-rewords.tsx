import { useState } from "react";
import History from "./history";

export default function YourRewords() {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    return <div className="px-[30px]">
        <div className=" mt-[40px] flex justify-between items-center">
            <div style={{
                WebkitTextStroke: "2px #000000",
            }} className="text-[24px] text-[#FDD54C] font-CherryBomb">Your Rewards</div>
            <div onClick={() => setIsHistoryOpen(true)} className="text-[14px] text-black font-Montserrat font-bold underline cursor-pointer">History</div>
        </div>
        <div className="flex justify-between items-center mt-[20px] font-CherryBomb font-[16px] text-white" style={{
                WebkitTextStroke: "2px #000000",
            }}>
            <div className="w-[86px] h-[86px] flex-col flex justify-center items-center bg-[#FFFFFF33] border-dashed rounded-[20px] border-[3px] border-[#8B6A45]">
                <img src={`/images/treasure-book/gem.png`} className="w-[60px] opacity-10" alt="item" />
                <div className="opacity-10 mt-[-20px]">GEM</div>
            </div>
            <div className="w-[86px] h-[86px] flex-col flex justify-center items-center bg-[#FFFFFF33] border-dashed rounded-[20px] border-[3px] border-[#8B6A45]">
                <img src={`/images/treasure-book/777.png`} className="w-[80px] opacity-10" alt="item" />
                <div className="opacity-10 mt-[-20px]">777</div>
            </div>
            <div className="w-[86px] h-[86px] flex-col flex justify-center items-center bg-[#FFFFFF33] border-dashed rounded-[20px] border-[3px] border-[#8B6A45]">
                <div className="opacity-10 text-[42px]">？</div>
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