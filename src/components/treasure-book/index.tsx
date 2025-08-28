import { useState } from "react";
import BookModal from "./book-modal";
import { useLootboxSeasonStore } from "@/stores/use-lootbox-season";

export default function TreasureBook() {
    const {
        treasureBookOpen,
        setTreasureBookOpen,
    } = useLootboxSeasonStore();

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
            {treasureBookOpen && <BookModal onClose={() => setTreasureBookOpen(false)} />}
        </>
    );
}