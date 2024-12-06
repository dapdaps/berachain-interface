import Modal from "@/components/modal";
import Bg from "./bg";
import Button from "@/components/button";
import IconBack from "@public/images/icon-back.svg";
import { useState, useMemo } from "react";

export default function BoxModal({ open: show, onClose, texts = [] }: any) {
  const [currentI, setCurrentI] = useState(0);

  const text = useMemo(() => {
    if (texts.length === 0) return "";
    return texts[currentI] || "";
  }, [texts, currentI]);

  return (
    <Modal
      open={show}
      onClose={onClose}
      closeIconClassName="right-[-14px] top-[-8px]"
    >
      <Bg className="w-[482px] relative">
        <div className="relative w-[405px] h-[494px] mt-[-100px] ml-[37px] bg-cover bg-no-repeat bg-[url(/images/activity/christmas/yap-letter.png)]">
          <div className="absolute bottom-[192px] left-[62px] leading-[1.75] w-[274px] h-[94px] text-[15px] font-Fuzzy rotate-2">
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
