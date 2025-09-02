import { useEffect, useState } from "react";
import BookModal from "./book-modal";
import { useLootboxSeasonStore } from "@/stores/use-lootbox-season";
import { AnimatePresence } from "framer-motion";
import { useTreasure } from "./use-treasure";
import useUser from "@/hooks/use-user";
import CheckInModal from "../check-in/modal";
import { QUEST_CONFIG } from "./config";

export default function TreasureBook() {
    const {
        treasureBookOpen,
        setTreasureBookOpen,
    } = useLootboxSeasonStore();
    const { userInfo } = useUser();

    const {
        treasure,
        openBox,
        question,
        completeViewQuest,
        questionLoading,
        userLoading,
        getQuestion,
        qoutionProgress,
        utcRemain,
        unCompleteQuestion,
        handleQuestionComplete,
        inviteLink,
        handleShare,
        openCheckInModal,
        setOpenCheckInModal,
    } = useTreasure({
        show: treasureBookOpen
    });

    return (
        <>
            <div
                onClick={() => {
                    if (!userInfo || !userInfo.address) return;
                    setTreasureBookOpen(true)
                }}
                className="fixed z-[51] right-[10px] top-[560px] cursor-pointer group"
            >
                <img
                    id="lootboxSeasonTreasureBookEntry"
                    src="/images/treasure-book/book.png"
                    className="w-[81px] h-[81px] transition-transform duration-200 hover:scale-110"
                    alt="treasure-book"
                />
                <div className="absolute flex justify-center items-center right-0 bottom-[-22px] w-[44px] h-[44px] rounded-full font-CherryBomb text-[16px] font-[400] leading-[1] backdrop-blur-md bg-white/20">
                    {
                        qoutionProgress < 3 && <>
                            <div className="relative z-10 w-[32px] h-[32px] bg-white rounded-full flex justify-center items-center">{qoutionProgress}/3</div>
                            <div className="absolute right-0 bottom-0">
                                {
                                    qoutionProgress > 0 && (
                                        <svg
                                            width="44"
                                            height="44"
                                            viewBox="0 0 44 44"
                                            xmlns="http://www.w3.org/2000/svg"
                                            style={{ background: "transparent" }}
                                        >
                                            <circle
                                                cx="22"
                                                cy="22"
                                                r="20"
                                                fill="transparent"
                                                stroke="#FFCF23"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeDasharray={qoutionProgress === 1 ? "41.888 83.776" : '83.776 41.888'}
                                                transform="rotate(-90 22 22)"
                                            />
                                        </svg>
                                    )
                                }
                            </div>
                        </>
                    }

                    {
                        qoutionProgress === 3 && <>
                            <div className="text-[12px] font-[400] leading-[1] text-white">
                                {utcRemain.hours}:{utcRemain.minutes}
                            </div>
                        </>
                    }
                </div>

                <div className="absolute right-0 bottom-[-132px] pt-[30px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                    <div
                        onClick={e => e.stopPropagation()}
                        className="w-[235px] py-[10px] px-[20px] rounded-[16px] bg-[#FFF1C7] font-Montserrat text-[14px] font-[700] "
                    >
                        {
                            qoutionProgress === 3 && <>
                                <div className="text-center">
                                    Your next lootbox is being prepared.
                                    Come back then to claim it.
                                </div>
                            </>
                        }
                        {
                            qoutionProgress < 3 && <>
                                <div className="text-center">
                                    <div>Finish the daily missions to get {unCompleteQuestion?.reward_box_amount > 0 ? unCompleteQuestion?.reward_box_amount + ' lootbox' : unCompleteQuestion?.reward_gem_amount + ' gem'} </div>
                                    <button onClick={() => handleQuestionComplete(unCompleteQuestion)} className="bg-[#FFDC50] text-[12px] mt-[5px] rounded-[10px] font-[700] leading-[1] text-black px-[20px] h-[30px] w-full border border-black">{QUEST_CONFIG[unCompleteQuestion?.id]}</button>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {treasureBookOpen && <BookModal
                    treasure={treasure}
                    question={question}
                    completeViewQuest={completeViewQuest}
                    onClose={() => setTreasureBookOpen(false)}
                    openBox={openBox}
                    questionLoading={questionLoading}
                    userLoading={userLoading}
                    getQuestion={getQuestion}
                    handleQuestionComplete={handleQuestionComplete}
                    inviteLink={inviteLink}
                    handleShare={handleShare}
                />}
            </AnimatePresence>
            <CheckInModal open={openCheckInModal} onClose={() => setOpenCheckInModal(false)} />
        </>
    );
}