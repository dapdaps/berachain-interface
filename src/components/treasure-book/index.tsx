import { useState } from "react";
import BookModal from "./book-modal";

export default function TreasureBook() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div onClick={() => setIsOpen(true)} className="fixed z-[51] right-[10px] top-[560px] cursor-pointer">
                <img src="/images/treasure-book/book.png" className="w-[81px] h-[81px]" alt="treasure-book" />
            </div>
            {isOpen && <BookModal />}
        </>
    );
}