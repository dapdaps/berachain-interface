import Modal from "@/components/modal";

const PlaygroundRulesModal = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIconClassName="!right-[10px] !top-[10px]"
    >
      <div className="w-[540px] relative bg-[#FFF1C7] rounded-[16px] border-[2px] border-[#E5C375] shadow-[6px_6px_0_0_rgba(0,0,0,0.25)] p-[20px_20px]">
        <div className="text-[#FDD54C] text-center [text-shadow:0_4px_0_#000] font-CherryBomb text-[30px] font-[400] leading-normal capitalize [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#000]">
          Lucky Bera - Game Rules
        </div>
        <div className="mt-[20px]">
          <ul className="list-none">
            <li className="mb-[10px] relative pl-[20px]">
              <div className="absolute left-0 top-[8px] w-[6px] h-[6px] bg-[#FFDC50] rounded-full"></div>
              <p className="">
                <strong>Spin Cost:</strong> Each spin costs <strong>0.1 BERA</strong>
              </p>
            </li>
            <li className="mb-[10px] relative pl-[20px]">
              <div className="absolute left-0 top-[8px] w-[6px] h-[6px] bg-[#FFDC50] rounded-full"></div>
              <p className="">
                <strong>Bundle Discount:</strong> Buy spin bundles to save more
              </p>
            </li>
            <li className="mb-[10px] relative pl-[20px]">
              <div className="absolute left-0 top-[8px] w-[6px] h-[6px] bg-[#FFDC50] rounded-full"></div>
              <p className="">
                <strong>How to Win:</strong>
              </p>
              <ul className="pl-[20px] list-disc">
                <li className="mb-[0px]">
                  <p className="flex items-center gap-[4px]">
                    3 of a kind = Big Win
                  </p>
                </li>
                <li className="mb-[0px]">
                  <p className="flex items-center gap-[4px]">
                    2 of a kind = Mini Win
                  </p>
                </li>
              </ul>
            </li>
            <li className="mb-[10px] relative pl-[20px]">
              <div className="absolute left-0 top-[8px] w-[6px] h-[6px] bg-[#FFDC50] rounded-full"></div>
              <p className="">
                <strong>Symbols & Rewards</strong>
              </p>
              <ul className="pl-[20px] list-disc">
                <li className="mb-[10px]">
                  <p className="flex items-center gap-[4px]">
                    <img
                      src="/images/playground/lucky-bera/icon-reward/gem.svg"
                      alt=""
                      className="w-[24px] h-[20px] shrink-0 object-center object-contain"
                    />
                    <div className="">
                      <strong>Points</strong> — 3×: <strong>+50 Points</strong> | 2×: <strong>+10 Points</strong>
                    </div>
                  </p>
                </li>
                <li className="mb-[10px]">
                  <p className="flex items-center gap-[4px]">
                    <img
                      src="/images/playground/lucky-bera/icon-reward/spin.svg"
                      alt=""
                      className="w-[24px] h-[20px] shrink-0 object-center object-contain"
                    />
                    <div className="">
                      <strong>Spins</strong> — 3×: <strong>+5 Points</strong> | 2×: <strong>+2 Points</strong>
                    </div>
                  </p>
                </li>
                <li className="mb-[10px]">
                  <p className="flex items-center gap-[4px]">
                    <img
                      src="/images/playground/lucky-bera/icon-reward/box.svg"
                      alt=""
                      className="w-[24px] h-[20px] shrink-0 object-center object-contain"
                    />
                    <div className="">
                      <strong>Lootbox</strong> — 3×: <strong>+3 Lootboxes</strong> | 2×: <strong>+1 Lootbox</strong>
                    </div>
                  </p>
                </li>
                <li className="mb-[10px]">
                  <p className="flex items-center gap-[4px]">
                    <img
                      src="/images/playground/lucky-bera/icon-reward/rocket.svg"
                      alt=""
                      className="w-[24px] h-[20px] shrink-0 object-center object-contain"
                    />
                    <div className="">
                      <strong>Rocket</strong> — 3×: <strong>+500 Mileage</strong> | 2×: <strong>+200 Mileage</strong>
                    </div>
                  </p>
                </li>
                <li className="mb-[10px]">
                  <p className="flex items-center gap-[4px]">
                    <img
                      src="/images/playground/lucky-bera/icon-reward/apple.svg"
                      alt=""
                      className="w-[24px] h-[20px] shrink-0 object-center object-contain"
                    />
                    <div className="">
                      <strong>Rotten Apple</strong> — Yikes, it’s spoiled. Try again!
                    </div>
                  </p>
                </li>
              </ul>
            </li>
            <li className="mb-[10px] relative pl-[20px]">
              <div className="absolute left-0 top-[8px] w-[6px] h-[6px] bg-[#FFDC50] rounded-full"></div>
              <p className="">
                <strong>Extra Notes</strong>
              </p>
              <ul className="pl-[20px] list-disc">
                <li className="mb-[0px]">
                  <p className="flex items-center gap-[4px]">
                    Points can be used on the Big Wheel to win more Spins
                  </p>
                </li>
                <li className="mb-[0px]">
                  <p className="flex items-center gap-[4px]">
                    Rewards are sent automatically after each spin
                  </p>
                </li>
                <li className="mb-[0px]">
                  <p className="flex items-center gap-[4px]">
                    Multiplier modes are not available yet (coming soon)
                  </p>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default PlaygroundRulesModal;
