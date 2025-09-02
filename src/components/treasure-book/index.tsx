import { useState } from "react";
import BookModal from "./book-modal";
import { useLootboxSeasonStore } from "@/stores/use-lootbox-season";
import { AnimatePresence } from "framer-motion";
import { useTreasure } from "./use-treasure";

export default function TreasureBook() {
    const {
        treasureBookOpen,
        setTreasureBookOpen,
    } = useLootboxSeasonStore();

    const { treasure, openBox, question, completeViewQuest, questionLoading, userLoading, getQuestion } = useTreasure();

    return (
        <>
            <div
                onClick={() => setTreasureBookOpen(true)}
                className="fixed z-[51] right-[10px] top-[560px] cursor-pointer transition-transform duration-200 hover:scale-110"
            >
                <img
                    id="lootboxSeasonTreasureBookEntry"
                    src="/images/treasure-book/book.png"
                    className="w-[81px] h-[81px]"
                    alt="treasure-book"
                />
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
                />}
            </AnimatePresence>
        </>
    );
}