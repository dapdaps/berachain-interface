import { useCallback, useState } from "react";
import LightButton from "../check-in/button";
import Reward from "@/components/check-in/reward";

import type { TreasureData } from "./use-treasure";
import { RewardType } from "../check-in/config";

export default function TotalCollected({ treasure, openBox }: { treasure: TreasureData | null, openBox: (boxAmount: number) => Promise<any> }) {
    const [openReward, setOpenReward] = useState(false);
    const [openRewardData, setOpenRewardData] = useState<any>(null);


    const total = treasure?.total || 0;
    const balanceShow = Math.min(treasure?.balance || 0, 3);
    const leftShow = 3 - balanceShow;

    const openBoxFn = useCallback(async (boxAmount: number) => {
        const res = await openBox(boxAmount);
        if (res?.code === 200) {
            setOpenReward(true);
            const rewards = []
            if (res.data.reward_spin_amount > 0) {
                rewards.push({
                    type: RewardType.Spin,
                    amount: res.data.reward_spin_amount,
                });
            }
            if (res.data.reward_gem_amount > 0) {
                rewards.push({
                    type: RewardType.Gem,
                    amount: res.data.reward_gem_amount,
                });
            }
            setOpenRewardData(rewards);
        }
    }, [openBox]);


    return <div onClick={(e) => e.stopPropagation()} className="font-CherryBomb relative text-[#FDD54C]" style={{
        WebkitTextStroke: "2px #000000",
    }}>
        <div className="w-[200px] text-center pl-[30px] mt-[15px]">
            <div className="text-[60px] leading-[60px]">{total}</div>
            <div className="text-[24px]">Total Collected</div>
        </div>
        
        <div className="flex justify-between items-center px-[30px] mt-[50px]">
            {
                Array.from({ length: balanceShow }).map((_, index) => (
                    <div key={index} className="relative w-[160px] h-[160px] flex justify-center items-center bg-[url('/images/treasure-book/box-bg.png')] bg-no-repeat bg-center bg-contain hover:bg-[url('/images/treasure-book/box-hover-bg.png')] cursor-pointer group">
                        <img src="/images/treasure-book/box.png" className="w-[100px]" alt="item" />
                        <div className="absolute bottom-[-20px] left-[50%] translate-x-[-50%] scale-[0.9] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <LightButton onClick={() => openBoxFn(1)}>open</LightButton>
                        </div>
                    </div>
                ))
            }
            
            {
                leftShow > 0 && Array.from({ length: 3 - (treasure?.balance || 0) }).map((_, index) => (
                    <div key={index + 5} className="w-[160px] h-[160px] flex justify-center items-center bg-[#FFFFFF33] border-dashed rounded-[20px] border-[3px] border-[#8B6A45]">
                        <img src={`/images/treasure-book/box.png`} className="w-[100px] opacity-10" alt="item" />
                    </div>
                ))
            }
        </div>

        <div className="flex flex-col items-center gap-[10px] justify-center pb-[40px] absolute right-[30px] top-[-40px] w-[180px] h-[204px] bg-[url('/images/treasure-book/flag.png')] bg-no-repeat bg-center bg-contain">
            <div className="text-[60px] leading-[50px]">{ treasure?.balance || 0 }</div>
            <div className="text-[20px] leading-[20px]">To be opened</div>
            {
                (treasure?.balance && treasure?.balance > 0) ? (
                    <div className="scale-[0.7]">
                        <LightButton onClick={() => openBoxFn(treasure?.balance || 0)}>open all</LightButton>
                    </div>
                ) : null
            }
        </div>

        <Reward open={openReward} onClose={() => setOpenReward(false)} data={openRewardData} />
    </div>;
}
