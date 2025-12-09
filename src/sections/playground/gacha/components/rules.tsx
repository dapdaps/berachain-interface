'use client';

import Modal from "@/components/modal";
import LightButton from "@/components/check-in/button";
import Image from "next/image";
import { playClickSound } from "../sound";

interface RulesProps {
    visible?: boolean;
    onClose?: () => void;
}

export default function Rules({ visible = false, onClose }: RulesProps) {
    return (
        <Modal
            open={visible}
            onClose={() => {
                playClickSound();
                onClose?.();
            }}
            innerClassName="w-[680px] max-h-[90vh] overflow-y-auto"
            className="p-4"
        >
            <div className="bg-[#FFF1C7] rounded-[30px] border-[3px] border-[#4B371F] p-8 relative shadow-lg">


                <div className="text-center mb-6">
                    <h2 className="text-center">
                        <img src="/images/gacha/gacha-title.png" alt="title" className="w-[195px] mx-auto" />
                    </h2>
                    <p className="text-[18px] text-black mt-2 font-CherryBomb">
                        Spin the lucky wheel and let your BERA soar!
                    </p>
                </div>

                <div className="mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center">
                            <span className="text-[24px]">🎱</span>
                        </div>
                        <h3 className="text-[18px] text-black font-bold">Lucky Balls</h3>
                    </div>

                    <p className="text-[18px] text-black">
                        Pick a ball and let the god of luck bless you!
                    </p>

                    <div className="space-y-3">
                        <div className="">
                            <div className="flex items-center gap-2 min-w-[100px]">
                                <span className="text-black px-[10px]">•</span>
                                <span className="font-bold">1 BERA</span>
                            </div>
                            <p className="pl-[30px]">
                                Small stake, big fun! Daily spins for quick BERA rewards!
                            </p>
                        </div>

                        <div className="">
                            <div className="flex items-center gap-2 min-w-[100px]">
                                <span className="text-black px-[10px]">•</span>
                                <span className="font-bold">20 BERA</span>
                            </div>
                            <p className="pl-[30px]">
                                Medium stake, bigger thrills! Keep the wins rolling in!
                            </p>
                        </div>

                        <div className="">
                            <div className="flex items-center gap-2 min-w-[100px]">
                                <span className="text-black px-[10px]">•</span>
                                <span className="font-bold">50 BERA</span>
                            </div>
                            <p className="pl-[30px]">
                                High stake, ultimate excitement! Rare NFTs are waiting to be yours!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-[18px] text-black">
                    <h3 className="font-bold">🎁 Rewards</h3>

                    <p className="mb-1">
                        Each tier has its own prize pool packed with awesome rewards:
                    </p>

                    <div className="space-y-3">
                        <div className="">
                            <div className="flex items-center gap-2 min-w-[100px]">
                                <span className="text-black px-[10px]">•</span>
                                <span className="font-bold">BERA</span>
                                <p className="">
                                    🐻 (small / medium / large amounts)
                                </p>
                            </div>
                        </div>

                        <div className="">
                            <div className="flex items-center gap-2 min-w-[100px]">
                                <span className="text-black px-[10px]">•</span>
                                <span className="font-bold">NFTs  🎨 :</span>
                            </div>
                            <p className="pl-[30px]">
                                <span className="text-black px-[10px]">•</span> Mibera
                            </p>
                            <p className="pl-[30px]">
                                <span className="text-black px-[10px]">•</span> Bullas
                            </p>
                            <p className="pl-[30px]">
                                <span className="text-black px-[10px]">•</span> Steadyteady
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center text-[18px] text-black">
                    <span>All prizes can be viewed in your History 📝</span>
                </div>

                <p className="text-[18px] text-black font-[500]">
                    One spin could change it all! Hop in and grab rare NFTs and big BERA rewards now!
                </p>

                <button
                    onClick={() => {
                        playClickSound();
                        onClose?.();
                    }}
                    className="w-[60%] mx-auto block mt-8 bg-[#FFDC50] rounded-[10px] border border-black  font-bold px-8 py-3 text-[14px]  text-black hover:bg-[#ffe066] transition-colors"
                >
                    Play now
                </button>
            </div>
        </Modal>
    );
}

