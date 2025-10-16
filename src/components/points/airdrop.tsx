import { useState, useEffect, useMemo, useCallback } from "react";
import Modal from "@/components/modal";
import useAccount from "@/hooks/use-account";
import { useRouter } from "next/navigation";
import Big from "big.js";
import CircleLoading from "../circle-loading";

interface AirdropProps {
    open: boolean;
    onClose: () => void;
    timeLeft: number;
    claimableTokens: string;
    totalClaimable: string;
    formattedTimeLeft: {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        total: number;
    };
    claim: () => void;
    claiming: boolean;
}

export default function Airdrop({ open, onClose, timeLeft, claimableTokens, totalClaimable, formattedTimeLeft, claim, claiming }: AirdropProps) {
    const { account } = useAccount();
    const [isChecked, setIsChecked] = useState(false)
    const router = useRouter();

    const canClaim = useMemo(() => {
        return Number(claimableTokens) > 0 && Number(totalClaimable) > 0;
    }, [claimableTokens, totalClaimable]);

    const handleCheckEligibility = () => {
        setIsChecked(true);
    };

    const handlePlayNow = () => {
        router.push('/carnival/guess-who');
    };

    const handleClaim = () => {
        if (canClaim) {
            claim();
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            className="z-[60]"
            closeIconClassName="right-[-14px] top-[-8px]"
        >
            <div className="bg-[#FFFDEB] border border-black w-[600px] rounded-[30px] relative">
                <div className="w-[280px] mx-auto mt-[-90px]">
                    <img src="/images/airdrop/airdrop-title.png" alt="bg" className="w-full h-full object-cover" />
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-black mb-4">
                        Beratown Lootbox Airdrop!
                    </h2>
                </div>

                <div className="bg-[#f0eedd] rounded-[15px] p-4 mx-6 mb-6 ">
                    <div className="text-center">
                        <div className="text-sm font-bold text-black mb-2">Claimable Duration</div>
                        <div className="text-[26px] font-bold text-black font-CherryBomb">
                            {formattedTimeLeft.days} d {formattedTimeLeft.hours.toString().padStart(2, '0')}:{formattedTimeLeft.minutes.toString().padStart(2, '0')}:{formattedTimeLeft.seconds.toString().padStart(2, '0')}
                        </div>
                    </div>
                </div>

                <div className="bg-[#f0eedd] rounded-[15px] p-4 mx-6 mb-6 ">
                    <div className="relative">
                        <input
                            type="text"
                            value={account}
                            readOnly
                            className="w-full p-3 border border-black rounded-[10px] bg-white text-sm font-mono"
                            placeholder="Enter your address"
                        />
                    </div>
                    <button
                        onClick={handleCheckEligibility}
                        className="w-full mt-3 bg-[#FFDC50] hover:bg-[#FFDC50]/80 border border-black rounded-[10px] py-4 font-bold text-black transition-colors shadow-[6px_6px_0_0_#00000040]"
                    >
                        Check Eligibility
                    </button>
                </div>

                {
                    isChecked && <>
                        {
                            claimableTokens && Number(claimableTokens) > 0 ? (
                                <>
                                    <div className="text-center mb-6">
                                        <img src="/images/airdrop/bera-icon.png" alt="token" className="w-[70px] object-cover mx-auto mb-2" />

                                        
                                        <div className="relative flex items-center justify-center gap-2">
                                            <div
                                                className="text-[32px] font-[800] text-[#FFDC50] mb-1 font-CherryBomb"
                                                style={{
                                                    WebkitTextStroke: '2px rgb(0, 0, 0)',
                                                }}
                                            >
                                                {new Big(claimableTokens).div(10 ** 18).toFixed(2)}
                                            </div>
                                            <div className="text-lg font-bold text-black font-CherryBomb">
                                                $BERA
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 px-6 mb-6">
                                        <button
                                            onClick={handlePlayNow}
                                            className="flex-1 bg-[#FFDC50] hover:bg-[#FFDC50]/80 border border-black rounded-[15px] py-3 font-bold text-black transition-colors shadow-[6px_6px_0_0_#00000040]"
                                        >
                                            Play now
                                        </button>
                                        <button
                                            disabled={!canClaim}
                                            onClick={handleClaim}
                                            className="flex-1 flex items-center justify-center gap-1 bg-[#FFDC50] hover:bg-[#FFDC50]/80 border border-black rounded-[15px] py-3 font-bold text-black transition-colors shadow-[6px_6px_0_0_#00000040]"
                                        >
                                            {
                                                claiming && (
                                                    <CircleLoading size={14} className="mr-3" />
                                                )
                                            }
                                            Claim
                                        </button>
                                    </div>

                                    <div className="text-center pb-6 px-6">
                                        <div className="flex items-center justify-center gap-1 mb-2 w-[50%]">
                                            <span className="text-yellow-500 text-lg">👆</span>
                                            <span className="text-yellow-500 text-lg">👆</span>
                                            <span className="text-yellow-500 text-lg">👆</span>
                                        </div>
                                        <div className="text-sm text-black">
                                            BERA is yours! Dare to enter Guess Who? and win even more
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="text-center px-6 pb-8">
                                        <img src="/images/airdrop/no-bera-icon.png" alt="token" className="w-[70px] object-cover mx-auto" />
                                        <div className="font-bold text-[22px] leading-tight mb-1 mt-2">We are sorry</div>
                                        <div className="text-[16px] mt-0 mb-2">No BERA this time... but your luck might turn in Guess Who?</div>
                                        <div className="flex items-center justify-center gap-1 mb-3">
                                            <span className="text-yellow-500 text-xl">👇</span>
                                            <span className="text-yellow-500 text-xl">👇</span>
                                            <span className="text-yellow-500 text-xl">👇</span>
                                        </div>
                                        <button
                                            onClick={handlePlayNow}
                                            className="w-[240px] mx-auto bg-[#FFDC50] hover:bg-[#FFDC50]/80 border border-black rounded-[10px] py-3 font-bold text-black transition-colors shadow-[4px_4px_0_0_#00000040] text-[18px]"
                                            style={{ display: "block" }}
                                        >
                                            Play now
                                        </button>
                                    </div>
                                </>
                            )
                        }

                    </>
                }

            </div>
        </Modal>
    );
}