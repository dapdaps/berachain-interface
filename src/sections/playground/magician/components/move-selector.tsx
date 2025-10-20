import Card from "@/components/card";
import Modal from "@/components/modal";
import { Moves } from "../config";
import { numberFormatter } from "@/utils/number-formatter";
import LightingButton from '@/components/button/lighting-button';
import clsx from "clsx";
import { motion } from "framer-motion";
import Loading from "@/components/loading";
import PlayerAvatar from "./player-avatar";

const MoveSelector = (props: any) => {
  const { open, onClose } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
      isMaskClose={false}
    >
      <Card className="w-[510px] !rounded-[10px] !bg-[#FFF1C7]">
        <MoveSelectorContent {...props} />
      </Card>
    </Modal>
  );
};

export default MoveSelector;

const MoveSelectorContent = (props: any) => {
  const { betToken, room, lastMoves, onSelectMove, betMove, buttonValid, onJoin } = props;

  return (
    <div className="w-full text-black font-[600]">
      <div className="text-[18px] text-center">
        Guess who’s inside?
      </div>
      <div className="flex justify-center items-center gap-[40px] mt-[20px]">
        {
          Object.values(Moves).map((move) => {
            const isLastMove = lastMoves?.some((it: any) => it.value === move.value);
            const isSelected = betMove.includes(move.value);
            const selectedPalyer = room?.players?.find((it: any) => it.moves === move.value);

            return (
              <div
                key={move.value}
                className="flex flex-col items-center"
              >
                <motion.div
                  className="w-[107px] h-[152px] shrink-0 flex justify-center items-center"
                  animate={isSelected ? { y: [0, -5, 5, 0] } : { y: 0 }}
                  transition={isSelected ? { repeat: Infinity, duration: 5, ease: "linear" } : { ease: "linear", duration: 0 }}
                >
                  <div className="w-full h-full shrink-0">
                    <img
                      src={move.imgHands}
                      alt=""
                      className={clsx(
                        "w-full h-[73px] object-center object-contain shrink-0 relative z-[2] translate-x-[-4px]",
                        isLastMove ? "opacity-100" : "opacity-30",
                      )}
                    />
                    <img
                      src="/images/playground/magician/hat-up.png"
                      alt=""
                      className={clsx(
                        "w-full h-[77px] object-top object-contain shrink-0 translate-y-[-10px]",
                        isLastMove ? "opacity-100" : "opacity-30",
                      )}
                    />
                  </div>
                  {
                    selectedPalyer && (
                      <PlayerAvatar
                        className="translate-y-[30px] !absolute !w-[38px] !h-[38px] !rounded-[10px]"
                        avatar={selectedPalyer.avatar}
                      />
                    )
                  }
                </motion.div>
                <div className={clsx("flex justify-center items-center gap-[5px] mt-[5px]", isLastMove ? "opacity-100" : "opacity-30")}>
                  <img
                    src={betToken.icon}
                    alt=""
                    className="w-[22px] h-[22px] object-center object-contain shrink-0"
                  />
                  <div className="font-[600] text-black">
                    {numberFormatter(room?.bet_amount, 3, true, { isShort: true, isZeroPrecision: false })}
                  </div>
                </div>
                <LightingButton
                  className="text-[20px] uppercase"
                  outerClassName={clsx("mt-[10px]", isLastMove ? "opacity-100" : "opacity-30")}
                  disabled={!isLastMove || buttonValid.loading}
                  onClick={() => {
                    onSelectMove(move.value);
                  }}
                >
                  {
                    isLastMove
                      ? (
                        isSelected
                          ? "Unpick"
                          : "Pick"
                      )
                      : "Picked"
                  }
                </LightingButton>
              </div>
            );
          })
        }
      </div>
      <div className="flex justify-center items-center px-[100px] mt-[20px]">
        <LightingButton
          className="text-[20px] uppercase flex justify-center items-center gap-[5px]"
          outerClassName="!h-[50px] w-full"
          disabled={buttonValid.disabled || buttonValid.loading}
          onClick={() => {
            // select last monster automatically
            if (lastMoves?.length === 1 && !betMove.length) {
              onSelectMove(lastMoves[0].value);
              return;
            }
            onJoin();
          }}
        >
          {
            buttonValid.loading && (
              <Loading size={16} />
            )
          }
          <div className="">
            {buttonValid.text}
          </div>
        </LightingButton>
      </div>
    </div>
  );
};
