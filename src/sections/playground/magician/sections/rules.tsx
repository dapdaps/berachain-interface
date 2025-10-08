import Modal from "@/components/modal";

const MagicianRulesModal = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIconClassName="!right-[10px] !top-[10px] md:hidden"
    >
      <div className="w-[540px] md:h-[80dvh] md:overflow-y-auto md:w-full relative bg-[#FFF1C7] rounded-[16px] md:rounded-b-[0] border-[2px] border-[#E5C375] shadow-[6px_6px_0_0_rgba(0,0,0,0.25)] p-[20px_20px] md:p-[10px_5px]">
        <div className="text-[#FDD54C] text-center [text-shadow:0_4px_0_#000] font-CherryBomb text-[30px] font-[400] leading-normal capitalize [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#000]">
          ✨ Magician — Game Rules
        </div>
        <div className="mt-[20px]">
          <ul className="list-none">
            <li className="mb-[10px] relative pl-[20px]">
              <div className="absolute left-0 top-[8px] w-[6px] h-[6px] bg-[#FFDC50] rounded-full"></div>
              <p className="">
                Step into the world of <strong>Magician 🎩✨</strong>
              </p>
              <ul className="pl-[20px] list-disc">
                <li className="mb-[0px]">
                  <p className="">
                    <strong>🧙 Up to 3 players per round.</strong>
                  </p>
                </li>
                <li className="mb-[0px]">
                  <p className="">
                    🎩 Choose <strong>one or more magic hats</strong> — Rabbit, Bear, or Panda.
                  </p>
                </li>
                <li className="mb-[0px]">
                  <p className="">
                    🔒 Once all players are in, the round locks.
                  </p>
                </li>
                <li className="mb-[0px]">
                  <p className="">
                    🎲 The <strong>smart contract will fairly and randomly reveal</strong> one animal.
                  </p>
                </li>
                <li className="mb-[0px]">
                  <p className="">
                    🏆 Only players who picked the revealed animal <strong>win the entire pot</strong>. No splits, no ties — one clear winner!
                  </p>
                </li>
                <li className="mb-[0px]">
                  <p className="">
                    💰 A <strong>6.9% platform fee</strong> is charged from the prize pool.
                  </p>
                </li>
              </ul>
            </li>
            <li className="mb-[10px] relative pl-[20px]">
              <div className="absolute left-0 top-[8px] w-[6px] h-[6px] bg-[#FFDC50] rounded-full"></div>
              <p className="">
                🔄 Special Case
              </p>
              <ul className="pl-[20px] list-disc">
                <li className="mb-[0px]">
                  <p className="">
                    ⏳ If the game does not fill within <strong>24 hours</strong>, any joined player can trigger a <strong>cancel</strong>.
                  </p>
                </li>
                <li className="mb-[0px]">
                  <p className="">
                    💸 All bets are fully refunded, with <strong>no platformfees deducted</strong>.
                  </p>
                </li>
              </ul>
            </li>
            <li className="mb-[10px] relative pl-[20px]">
              <div className="absolute left-0 top-[8px] w-[6px] h-[6px] bg-[#FFDC50] rounded-full"></div>
              <p className="">
                ⚡️ Easy to join, fair to play, and packed with suspense — will your hat reveal the winner?🎩✨
              </p>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default MagicianRulesModal;
