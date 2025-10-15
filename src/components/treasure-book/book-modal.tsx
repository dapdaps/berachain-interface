import { AnimatePresence, motion } from "framer-motion";
import GetMore from "./get-more";
import TotalCollected from "./total-collected";
import YourRewords from "./your-rewords";
import { useEffect, useState } from "react";
import type { TreasureData } from "./use-treasure";
import clsx from "clsx";
import PartnersBoxes from "./partners/boxes";
import PartnersMore from "./partners/get-more";
import Big from "big.js";


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
  refreshQuestion: () => void;
  treasureBookTab: string;
  setTreasureBookTab: (tab?: string) => void;
  yourRewardsList: any;

  userPartnerBoxes: any;
  userPartnerBoxesLoading: boolean;
  userPartnerBoxesTotal: Big.Big;
  userPartnerBoxesTotalBalance: Big.Big;
  openPartnerBox: (params: { category: string; box?: number; }) => Promise<any>;
  openingPartnerBox: boolean;
  userPartnerBoxesRewardsList: any;
  getUserPartnerBoxes: () => Promise<any>;
}
export default function BookModal(props: BookModalProps) {
  const {
    treasure,
    question,
    onClose,
    openBox,
    completeViewQuest,
    questionLoading,
    userLoading,
    getQuestion,
    handleQuestionComplete,
    inviteLink,
    handleShare,
    refreshQuestion,
    treasureBookTab,
    setTreasureBookTab,
    yourRewardsList,

    userPartnerBoxes,
    userPartnerBoxesLoading,
    userPartnerBoxesTotal,
    userPartnerBoxesTotalBalance,
    openPartnerBox,
    openingPartnerBox,
    userPartnerBoxesRewardsList,
  } = props;

  const [scale, setScale] = useState(1);

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
        <div className="w-[1560px] h-[760px] pt-[35px] bg-[url('/images/treasure-book/bg.png')] bg-no-repeat bg-bottom bg-contain absolute left-1/2 -translate-x-1/2 bottom-[-30px] z-[1]">
          <div className="absolute z-[1] left-[300px] top-[-10px] flex items-end gap-[13px] font-CherryBomb text-[26px] leading-[120%] font-[400] text-[#FDD54C] text-center [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#000]">
            <button
              type="button"
              className={clsx(
                "w-[250px] h-[127px] hover:translate-y-[-50px] hover:bg-[#FDD54C] hover:text-[#FFF5A9] hover:text-[36px] hover:bg-[url('')] hover:border-[2px] transition-all duration-300 border border-black rounded-[6px] bg-[radial-gradient(35.37%_50%_at_50%_35.37%,_#C7B06C_0%,_#B1974C_100%)] bg-[#B1974C_100] flex items-start justify-center pt-[12px]",
                treasureBookTab === "beratown" ? "!bg-[#FDD54C] !text-[#FFF5A9] !text-[36px] !bg-[url('')] !border-[2px] !translate-y-[-50px]" : "",
              )}
              onClick={(e) => {
                e.stopPropagation();
                setTreasureBookTab("beratown");
              }}
            >
              Beratown treasure
            </button>
            <button
              type="button"
              className={clsx(
                "w-[250px] h-[127px] hover:translate-y-[-50px] hover:bg-[#FDD54C] hover:text-[#FFF5A9] hover:text-[36px] hover:bg-[url('')] hover:border-[2px] transition-all duration-300 border border-black rounded-[6px] bg-[radial-gradient(35.37%_50%_at_50%_35.37%,_#C7B06C_0%,_#B1974C_100%)] bg-[#B1974C_100] flex items-start justify-center pt-[12px]",
                treasureBookTab === "partners" ? "!bg-[#FDD54C] !text-[#FFF5A9] !text-[36px] !bg-[url('')] !border-[2px] !translate-y-[-50px]" : "",
              )}
              onClick={(e) => {
                e.stopPropagation();
                setTreasureBookTab("partners");
              }}
            >
              Partners treasure
            </button>
          </div>
          <div className="relative z-[2] w-full h-[656px] bg-[url('/images/treasure-book/paper.png')] bg-no-repeat bg-[position:200px_0px] bg-[length:1260px_656px]">
            <AnimatePresence mode="sync">
              {
                treasureBookTab === "beratown" && (
                  <motion.div
                    key="beratown"
                    className="w-full h-full pl-[220px] flex justify-between"
                    initial={{
                      opacity: 0,
                      x: -10,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                  >
                    <div className="flex-1 h-full mt-[20px]" onClick={(e) => e.stopPropagation()}>
                      <TotalCollected treasure={treasure} openBox={openBox} />
                      <YourRewords type={treasureBookTab} list={yourRewardsList} />
                    </div>
                    <div className="flex-1 h-full mr-[120px] mt-[40px]" onClick={(e) => e.stopPropagation()}>
                      <GetMore
                        question={question}
                        completeViewQuest={completeViewQuest}
                        questionLoading={questionLoading}
                        getQuestion={getQuestion}
                        handleQuestionComplete={handleQuestionComplete}
                        inviteLink={inviteLink}
                        handleShare={handleShare}
                        refreshQuestion={refreshQuestion}
                      />
                    </div>
                  </motion.div>
                )
              }
              {
                treasureBookTab === "partners" && (
                  <motion.div
                    key="partners"
                    className="w-full h-full pl-[220px] flex justify-between"
                    initial={{
                      opacity: 0,
                      x: 10,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                  >
                    <div className="flex-1 h-full mt-[20px]" onClick={(e) => e.stopPropagation()}>
                      <PartnersBoxes
                        userBoxes={userPartnerBoxes}
                        userBoxesLoading={userPartnerBoxesLoading}
                        userBoxesTotal={userPartnerBoxesTotal}
                        userBoxesTotalBalance={userPartnerBoxesTotalBalance}
                        openBox={openPartnerBox}
                        opeing={openingPartnerBox}
                      />
                    </div>
                    <div className="flex-1 h-full mr-[120px] mt-[40px]" onClick={(e) => e.stopPropagation()}>
                      <YourRewords type={treasureBookTab} list={userPartnerBoxesRewardsList} />
                      <PartnersMore />
                    </div>
                  </motion.div>
                )
              }
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}