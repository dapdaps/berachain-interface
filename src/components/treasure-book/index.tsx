import { useEffect, useMemo, useState } from "react";
import BookModal from "./book-modal";
import { useLootboxSeasonStore } from "@/stores/use-lootbox-season";
import { AnimatePresence } from "framer-motion";
import { useTreasure } from "./use-treasure";
import useUser from "@/hooks/use-user";
import CheckInModal from "../check-in/modal";
import { QUEST_CONFIG } from "./config";
import clsx from "clsx";
import useIsMobile from "@/hooks/use-isMobile";
import Popover, { PopoverPlacement, PopoverTrigger } from "../popover";
import { useSearchParams, useRouter } from "next/navigation";

const TREASURE_BOOK_SEARCH_PARAMS = "treasure-book";

export default function TreasureBook(props: any) {
    const { className } = props;

    const isMobile = useIsMobile();
    const {
        treasureBookOpen,
        setTreasureBookOpen,
    } = useLootboxSeasonStore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const treasureBookSearchParams = searchParams.get(TREASURE_BOOK_SEARCH_PARAMS);
    const { userInfo } = useUser();
    const [isHovered, setIsHovered] = useState(false);
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
        refreshQuestion,
    } = useTreasure({
        show: treasureBookOpen
    });

    useMemo(() => {
        const _defaultOpen = treasureBookSearchParams === '1';
        if (_defaultOpen) {
            setTreasureBookOpen(true);
        }
        return _defaultOpen;
    }, [treasureBookSearchParams]);

    return (
        <>
            <Popover
                content={(
                    <div className="pt-[30px] md:pt-[15px]">
                        <div
                            onClick={e => e.stopPropagation()}
                            className="w-[235px] relative gradient-border-box py-[10px] md:py-[10px] px-[20px] md:px-[5px] rounded-[16px] bg-[#FFF1C7] font-Montserrat text-[14px] font-[700]"
                        >
                            {
                                !userInfo?.address && (
                                    <div className="text-center">
                                        Finish your daily missions to collect beratown points
                                    </div>
                                )
                            }
                            {
                                userInfo?.address && qoutionProgress === 3 && <>
                                    <div className="text-center">
                                        Your next lootbox is being prepared. Come back then to claim it.
                                    </div>
                                </>
                            }
                            {
                                userInfo?.address && qoutionProgress < 3 && (
                                    isMobile ? (
                                        <div className="text-center">
                                            Complete your daily missions on PC to earn lootboxes
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-center">
                                                <div>Finish your daily missions to receive {unCompleteQuestion?.reward_box_amount > 0 ? unCompleteQuestion?.reward_box_amount + ' lootbox' : unCompleteQuestion?.reward_gem_amount + ' gem'} </div>
                                                <button onClick={() => handleQuestionComplete(unCompleteQuestion)} className="bg-[#FFDC50] text-[12px] mt-[5px] rounded-[10px] font-[700] leading-[1] text-black px-[20px] whitespace-nowrap truncate h-[30px] w-full border border-black">{QUEST_CONFIG[unCompleteQuestion?.id]}</button>
                                            </div>
                                        </>
                                    )
                                )
                            }
                        </div >
                    </div >
                )}
                placement={PopoverPlacement.Bottom}
                trigger={PopoverTrigger.Hover}
                triggerContainerClassName={clsx("fixed z-[51] right-[10px] top-[560px] cursor-pointer group", className)}
                onMouseEnter={() => {
                    if (isMobile) return;
                    setIsHovered(true);
                }}
                onMouseLeave={() => {
                    if (isMobile) return;
                    setIsHovered(false);
                }}
            >
                <div
                    onClick={() => {
                        if (!userInfo || !userInfo.address || isMobile) return;
                        setTreasureBookOpen(true)
                    }}
                    className=""
                    data-bp="1010-024"
                >
                    <img
                        id="lootboxSeasonTreasureBookEntry"
                        src={isHovered ? "/images/guiding-tour/lootbox-season/book3@2x.png" : "/images/treasure-book/book.png"}
                        className="w-[81px] h-[81px] md:w-[44px] md:h-[44px] object-center object-contain duration-200"
                        alt="treasure-book"
                    />
                    <div className="absolute flex justify-center items-center right-0 bottom-[-22px] w-[44px] h-[44px] md:scale-75 md:origin-bottom-right md:bottom-[-10px] rounded-full font-CherryBomb text-[16px] font-[400] leading-[1] backdrop-blur-md bg-white/20">
                        {
                            qoutionProgress < 3 && <>
                                <div className="relative z-10 w-[32px] h-[32px] bg-white rounded-full flex justify-center items-center">{3 - qoutionProgress}/3</div>
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
                </div>
            </Popover>
            <AnimatePresence>
                {treasureBookOpen && <BookModal
                    treasure={treasure}
                    question={question}
                    completeViewQuest={completeViewQuest}
                    onClose={() => {
                        setTreasureBookOpen(false);
                        const newSearchParams = new URLSearchParams(searchParams.toString());
                        newSearchParams.delete(TREASURE_BOOK_SEARCH_PARAMS);
                        const newUrl = newSearchParams.toString()
                            ? `${window.location.pathname}?${newSearchParams.toString()}`
                            : window.location.pathname;
                        router.replace(newUrl);
                    }}
                    openBox={openBox}
                    questionLoading={questionLoading}
                    userLoading={userLoading}
                    getQuestion={getQuestion}
                    handleQuestionComplete={handleQuestionComplete}
                    inviteLink={inviteLink}
                    handleShare={handleShare}
                    refreshQuestion={refreshQuestion}
                />}
            </AnimatePresence>
            <CheckInModal open={openCheckInModal} onClose={() => setOpenCheckInModal(false)} />
        </>
    );
}