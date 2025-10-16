import { motion } from "framer-motion";
import WaitingHat from "../components/waiting-hat";
import LightingButton from '@/components/button/lighting-button';
import Player from "../components/player";
import MoveSelector from "../components/move-selector";
import ResultHat from "../components/result-hat";
import Exploding from "../components/exploding";
import { useEffect } from "react";
import Lootbox from "./lootbox";

const Join = (props: any) => {
  const {
    magician,
    join,
  } = props;

  useEffect(() => {
    magician.playAudio({ type: "magician", action: "play" });
  }, []);

  return (
    <motion.div
      className="w-full h-[100dvh] pb-[6vw] flex flex-col justify-end items-center"
      initial={{
        x: 200,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
      }}
      exit={{
        x: 200,
        opacity: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
    >
      <div className="w-[1064px] h-[772px] relative flex flex-col items-center shrink-0 bg-[url('/images/playground/magician/carriage.png')] bg-center bg-no-repeat bg-contain">
        <button
          type="button"
          className="w-[144px] h-[40px] border-[1px] rounded-l-[12px] absolute left-[52px] top-[226px] opacity-0 hover:opacity-30 bg-white/50 transition-all duration-300"
          onClick={() => {
            magician.playAudio({ type: "click", action: "play" });
            magician.playAudio({ type: "magician", action: "pause" });
            join.onClose();
          }}
        />
        <button
          type="button"
          className="w-[144px] h-[40px] border-[1px] rounded-l-[12px] absolute left-[52px] top-[283px] opacity-0 hover:opacity-30 bg-white/50 transition-all duration-300"
          onClick={() => {
            magician.playAudio({ type: "click", action: "play" });
            magician.setRulesOpen(true);
          }}
        />
        {/* <button
          type="button"
          className="absolute top-[180px] right-[100px] w-[55px] h-[30px] border border-black rounded-[12px] bg-[linear-gradient(180deg,_#FFCE78_0%,_#9E762F_100%)] rotate-[-8.017deg] font-CherryBomb text-[16px] font-[400] leading-[90%]"
          onClick={() => {
            magician.playAudio({ type: "click", action: "play" });
            magician.setRulesOpen(true);
          }}
        >
          Rules
        </button> */}
        {
          !!join.result ? (
            <>
              <ResultHat
                className=""
                result={join.result}
                room={magician.room}
              />
              <Exploding
                trigger={true}
                maxParticles={100}
                flowersPerBurst={20}
                burstsAtOnce={2}
              />
            </>
          ) : (
            <div className="w-[144px] h-[136px] shrink-0 flex flex-col items-center justify-center absolute translate-x-[40px] bottom-[260px]">
              <WaitingHat />
              <div className="absolute translate-y-[10px]">
                <div className="text-center text-white font-[600]">
                  Waiting...
                </div>
                {
                  !join.resultPending && !join.result && (
                    <LightingButton
                      className="text-[20px] uppercase"
                      outerClassName="mt-[7px]"
                      onClick={() => {
                        join.setMoveSelectorOpen(true);
                        magician.playAudio({ type: "click", action: "play" });
                        // join.setResult({
                        //   address: "0x635FA4477c7f9681A4Ac88fA6147F441114E8655",
                        //   moves: 0,
                        // });
                      }}
                    >
                      Join
                    </LightingButton>
                  )
                }
              </div>
            </div>
          )
        }
        <div className="flex justify-center items-center gap-[40px] absolute bottom-[60px]">
          <Player
            betToken={magician.betToken}
            room={magician.room}
            player={magician.room.players[0]}
            isWon={!!join.result && magician.room.players[0] && join.result?.address?.toLowerCase() === magician.room.players[0].address.toLowerCase() && join.result?.moves === magician.room.players[0].moves}
            isLost={!!join.result && magician.room.players[0] && (join.result?.address?.toLowerCase() !== magician.room.players[0].address.toLowerCase() || join.result?.moves !== magician.room.players[0].moves)}
          />
          <Player
            betToken={magician.betToken}
            room={magician.room}
            player={magician.room.players[1]}
            isWon={!!join.result && magician.room.players[1] && join.result?.address?.toLowerCase() === magician.room.players[1].address.toLowerCase() && join.result?.moves === magician.room.players[1].moves}
            isLost={!!join.result && magician.room.players[1] && (join.result?.address?.toLowerCase() !== magician.room.players[1].address.toLowerCase() || join.result?.moves !== magician.room.players[1].moves)}
          />
          <Player
            betToken={magician.betToken}
            room={magician.room}
            player={magician.room.players[2]}
            isWon={!!join.result && magician.room.players[2] && join.result?.address?.toLowerCase() === magician.room.players[2].address.toLowerCase() && join.result?.moves === magician.room.players[2].moves}
            isLost={!!join.result && magician.room.players[2] && (join.result?.address?.toLowerCase() !== magician.room.players[2].address.toLowerCase() || join.result?.moves !== magician.room.players[2].moves)}
          />
        </div>
      </div>
      <MoveSelector
        open={join.moveSelectorOpen}
        onClose={() => {
          join.setMoveSelectorOpen(false);
        }}
        betToken={magician.betToken}
        room={magician.room}
        lastMoves={join.lastMoves}
        onSelectMove={join.onSelectMove}
        betMove={join.betMove}
        buttonValid={join.buttonValid}
        onJoin={join.onJoin}
      />
      <Lootbox
        join={join}
        magician={magician}
      />
    </motion.div>
  );
};

export default Join;
