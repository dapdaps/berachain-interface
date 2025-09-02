import { motion } from "framer-motion";
import GetMore from "./get-more";
import TotalCollected from "./total-collected";
import YourRewords from "./your-rewords";
import { useEffect, useState } from "react";
import type { TreasureData } from "./use-treasure";


export interface BookModalProps {
    treasure: TreasureData | null;
    question: any;
    onClose: () => void;
    openBox: (boxAmount: number) => Promise<any>;
    completeViewQuest: (quest: any) => Promise<any>;
    questionLoading: boolean;
    userLoading: boolean;
    getQuestion: () => Promise<void>;
    handleQuestionComplete: (quest: any) => Promise<any>;
    inviteLink: string;
    handleShare: () => void;
}
export default function BookModal(props: BookModalProps) {
    const { treasure, question, onClose, openBox, completeViewQuest, questionLoading, userLoading, getQuestion, handleQuestionComplete, inviteLink, handleShare } = props;

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
        <motion.div
            className="fixed z-[52] left-0 top-0 w-full h-full bg-black/50"
            onClick={onClose}
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            transition={{
                duration: 0.15,
            }}
        >
            <motion.div
                className="w-full h-full"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "50% 100%",
                    perspectiveOrigin: "50% 100%",
                    transformStyle: "preserve-3d",
                }}
                initial={{
                    transform: `scale(${scale}) perspective(1000px) rotateX(70deg) translateY(300px) translateZ(-300px)`,
                }}
                animate={{
                    transform: `scale(${scale}) perspective(1000px) rotateX(0deg) translateY(0px) translateZ(0px)`,
                }}
                exit={{
                    transform: `scale(${scale}) perspective(1000px) rotateX(70deg) translateY(300px) translateZ(-300px)`,
                }}
                transition={{
                    duration: 0.75,
                    ease: "easeInOut",
                }}
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

                <div className="w-[1560px] h-[810px] absolute left-1/2 -translate-x-1/2 bottom-[30px] pl-[220px] flex justify-between">
                    <div className="flex-1 h-full mt-[150px]" onClick={(e) => e.stopPropagation()}>
                        <TotalCollected treasure={treasure} openBox={openBox} />
                        <YourRewords treasure={treasure} />
                    </div>
                    <div className="flex-1 h-full mr-[120px] mt-[160px]" onClick={(e) => e.stopPropagation()}>
                        <GetMore
                            question={question}
                            completeViewQuest={completeViewQuest}
                            questionLoading={questionLoading}
                            getQuestion={getQuestion}
                            handleQuestionComplete={handleQuestionComplete}
                            inviteLink={inviteLink}
                            handleShare={handleShare}
                        />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}