import { numberFormatter } from "@/utils/number-formatter";
import { formatLongText } from "@/utils/utils";
import clsx from "clsx";
import { EMove, Moves } from "../config";
import Big from "big.js";

const Player = (props: any) => {
  const { className, betToken, room, player, isWon, isLost, multipleAddresses } = props;

  return (
    <div className={clsx("w-[151px] h-[160px] flex flex-col items-center relative bg-[#FFF1C7] border border-[#E5C375] rounded-[12px] shadow-[0_4px_0_0_#603C20] p-[23px_10px_10px]", className)}>
      <div
        className="relative flex justify-center items-center bg-no-repeat bg-center bg-contain w-[56px] h-[56px] shrink-0"
        style={{
          backgroundImage: player?.avatar ? `url("${player?.avatar}")` : "url('/images/playground/magician/avatar-empty.png')",
        }}
      >
        {
          typeof player?.moves === "number" && (
            <img
              src={Moves[player.moves as EMove].avatar}
              alt=""
              className="w-[52px] h-[47px] absolute top-[-40px] object-center object-contain shrink-0"
            />
          )
        }
      </div>
      <div className="font-[600] text-black whitespace-nowrap mt-[2px] w-full overflow-hidden text-ellipsis text-center">
        {player?.address ? formatLongText(player?.address, 5, 4) : "Waiting..."}
      </div>
      <div className="flex justify-center items-center gap-[5px] mt-[2px]">
        <img
          src={betToken.icon}
          alt=""
          className="w-[30px] h-[30px] object-center object-contain shrink-0"
        />
        <div className="font-[600] text-black">
          {
            isLost ? "0" : (
              isWon && multipleAddresses[0].moves !== player.moves
                ? "0"
                : numberFormatter(
                  isWon
                    ? Big(room?.bet_amount || 0).times(3)
                    : room?.bet_amount,
                  3,
                  true,
                  {
                    isShort: true,
                    isZeroPrecision: false
                  }
                )
            )
          }
        </div>
      </div>
      {
        isWon && multipleAddresses[0].moves === player.moves && (
          <div className="w-[108px] h-[32px] absolute bottom-[-17px] shrink-0 rounded-[10px] border border-black bg-[#FF729C] text-[14px] text-black font-bold flex justify-center items-center">
            x3 Winner
          </div>
        )
      }
    </div>
  );
};

export default Player;
