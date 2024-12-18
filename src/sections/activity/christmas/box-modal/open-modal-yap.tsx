import Modal from "@/components/modal";
import Bg from "./bg";
import Button from "@/components/button";
import IconBack from "@public/images/icon-back.svg";
import { useState, useMemo } from "react";

export default function BoxModal({ open: show, onClose, texts = [], isMobile }: any) {
  const [currentI, setCurrentI] = useState(0);

  const text = useMemo(() => {
    if (texts.length === 0) return "";
    return texts[currentI] || "";
  }, [texts, currentI]);

  return (
    <Modal
      open={show}
      onClose={onClose}
      isForceNormal={isMobile}
      className={isMobile ? "flex justify-center items-center" : ""}
      closeIconClassName="right-[-14px] top-[-8px] md:right-[0]"
      innerClassName="md:w-full"
    >
      <Bg className="lg:w-[482px] relative md:mx-auto">
        <div className={`relative w-[405px] h-[494px] md:w-[333px] md:h-[407px] mt-[-100px] md:mt-[-70px] ml-[37px] md:ml-[unset] bg-cover bg-no-repeat ${isMobile ? 'bg-[url(/images/activity/christmas/yap-letter-mobile.png)]' : 'bg-[url(/images/activity/christmas/yap-letter.png)]'}`}>
          <div title={text} className="absolute bottom-[182px] md:bottom-[122px] left-[62px] leading-[1.75] w-[274px] text-[15px] font-Fuzzy rotate-2 line-clamp-4 break-all h-[104px]">
            {text}
          </div>
        </div>
        <div className="text-[22px] font-CherryBomb text-center mt-[-10px]">
          A note from the Bera Clause
        </div>
        <div className="text-[15px] mx-[auto] w-[277px]">
          Yap more to be a good bear, next time shall luck smile upon you!
        </div>
        <div className="flex justify-center mt-[12px]">
          <Button
            type="primary"
            className="w-[232px] h-[50px]"
            onClick={() => {
              console.log(
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  text || ""
                )}`
              );
              window.open(
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  text || ""
                )}`,
                "_blank"
              );
              onClose?.();
            }}
          >
            Yap on X
          </Button>
        </div>

        {texts?.length > 1 && (
          <>
            {currentI > 0 && (
              <button
                disabled={currentI === 0}
                onClick={() => {
                  setCurrentI(currentI - 1);
                }}
                className="absolute top-[248px] left-[10px] hover:scale-110 duration-500"
              >
                <IconBack />
              </button>
            )}

            {currentI !== texts?.length - 1 && (
              <button
                disabled={currentI === texts?.length - 1}
                onClick={() => {
                  setCurrentI(currentI + 1);
                }}
                className="absolute top-[248px] right-[10px] rotate-180 hover:scale-110 duration-500"
              >
                <IconBack />
              </button>
            )}
          </>
        )}
      </Bg>
    </Modal>
  );
}
