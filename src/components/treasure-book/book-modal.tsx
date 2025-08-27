import GetMore from "./get-more";
import TotalCollected from "./total-collected";
import YourRewords from "./your-rewords";
import { useEffect, useState } from "react";

export default function BookModal({ onClose }: { onClose: () => void }) {
    const [scale, setScale] = useState(1)

    useEffect(() => {
        const handleResize = () => {
            const newScale = window.innerWidth / 1560 / 1.2;
            setScale(Math.max(newScale, 1));
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div
            className="fixed z-[52] left-0 top-0 w-full h-full bg-black/50"
            style={{
                transform: `scale(${scale})`,
                transformOrigin: "50% 100%",
            }}
            onClick={onClose}
        >
                <div className="w-[1560px] h-[810px] absolute bottom-[-30px] left-1/2 -translate-x-1/2">
                    <img src="/images/treasure-book/bg.png" className="w-full h-full" alt="treasure-book" />
                </div>

                <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-1/2 -translate-x-1/2 pl-[60px] font-CherryBomb text-[#FDD54C] text-[36px] bottom-[710px] -rotate-[2.34deg]"
                    style={{
                        WebkitTextStroke: "2px #000000",
                    }}
                >
                    Beratown treasure Book
                </div>

                <div  className="w-[1560px] h-[810px] absolute left-1/2 -translate-x-1/2 bottom-[30px] pl-[220px] flex justify-between">
                    <div className="flex-1 h-full" onClick={(e) => e.stopPropagation()}>
                        <TotalCollected />
                        <YourRewords />
                    </div>
                    <div className="flex-1 h-full pr-[120px]" onClick={(e) => e.stopPropagation()}>
                        <GetMore />
                    </div>
                </div>
        </div>
    );
}