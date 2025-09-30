import useCustomAccount from "@/hooks/use-account";
import { get } from "@/utils/http";
import { useRequest } from "ahooks";
import Big from "big.js";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Moves, Status, StatusMap } from "../config";
import PlayerAvatar from "../components/player-avatar";
import { numberFormatter } from "@/utils/number-formatter";

const Notify = (props: any) => {
  const { open } = props;

  if (!document || !open) {
    return null;
  }

  return ReactDOM.createPortal((
    <NotifyContent  {...props} />
  ), document.body);
};

export default Notify;

const NotifyContent = (props: any) => {
  const { setPlayersAvatar, betToken } = props;

  const { accountWithAk, account } = useCustomAccount();

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const onResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const { data: userLatest, loading: userLatestLoading, runAsync: getUserLatest } = useRequest(async () => {
    if (!accountWithAk) {
      return;
    }
    try {
      const res = await get("/api/go/game/rps/user/latest");
      if (res.code !== 200) {
        return;
      }
      const _list = res.data || [];
      _list.forEach((item: any) => {
        setPlayersAvatar(item.players);
      });
      return _list;
    } catch (error) {
      console.log("get user latest failed: %o", error);
    }
    return;
  }, {
    refreshDeps: [accountWithAk],
  });

  console.log("userLatest: %o", userLatest);

  return (
    <motion.div
      className="w-[342px] h-[350px] pl-[36px] pr-[50px] pt-[78px] fixed z-[14] right-0 bottom-[13px] bg-[url('/images/playground/magician/bg-notify.png')] bg-right bg-no-repeat bg-contain"
      style={windowWidth < 1560 ? {
        // x: 250,
        x: 0,
      } : {
        x: 0
      }}
      whileHover={{
        x: 0
      }}
    >
      {/* bg-[linear-gradient(180deg,#FFDF77_0%,#F6AD0F_100%)] [background-clip:text] [-webkit-text-fill-color:transparent] */}
      <div className="font-CherryBomb text-[#FFDF77] text-center text-[30px] font-[400] leading-[100%] [-webkit-text-stroke-width:3px] [-webkit-text-stroke-color:#4B371F] [text-shadow:-1px_3px_0_#4B371F]">
        {Big(userLatest?.length || 0).gt(5) ? "5+" : userLatest?.length} Joining
      </div>
      <div className="flex flex-col items-stretch gap-[15px] mt-[20px] max-h-[200px] overflow-y-auto">
        {
          userLatest?.map((it: any, idx: number) => (
            <div
              className="w-full rounded-[12px] p-[10px_5px_10px_8px] border border-[#E5C375] bg-[#FFF1C7] flex justify-between items-center gap-[5px] flex-nowrap text-[14px] font-[600] text-black"
              key={idx}
            >
              <div
                className="w-[50px] shrink-0 whitespace-nowrap overflow-hidden text-ellipsis"
                title={it.room_id}
              >
                {it.room_id}
              </div>
              <div className="flex-1 flex items-center gap-[5px]">
                {
                  it.status === Status.Won && it.winner_address ? (
                    it.players?.filter((player: any) => player.moves !== it.winner_moves)?.map((player: any, playerIdx: number) => (
                      <PlayerAvatar
                        key={`${idx}-${playerIdx}`}
                        avatar={player.avatar}
                        moves={player.moves}
                        className="!w-[34px] !h-[34px] !rounded-[8px] translate-y-[8px]"
                      />
                    ))
                  ) : (
                    <>
                      <PlayerAvatar
                        key={`${idx}-${0}`}
                        avatar={it.players?.[0]?.avatar}
                        moves={it.players?.[0]?.moves}
                        className="!w-[34px] !h-[34px] !rounded-[8px] translate-y-[8px]"
                      />
                      <PlayerAvatar
                        key={`${idx}-${1}`}
                        avatar={it.players?.[1]?.avatar}
                        moves={it.players?.[1]?.moves}
                        className="!w-[34px] !h-[34px] !rounded-[8px] translate-y-[8px]"
                      />
                      <PlayerAvatar
                        key={`${idx}-${2}`}
                        avatar={it.players?.[2]?.avatar}
                        moves={it.players?.[2]?.moves}
                        className="!w-[34px] !h-[34px] !rounded-[8px] translate-y-[8px]"
                      />
                    </>
                  )
                }
              </div>
              <div className="shrink-0">
                {
                  it.status === Status.Won && it.winner_address ? (
                    <div className="flex justify-end items-center gap-[2px]">
                      <div className="">
                        <div className="">
                          Winner
                        </div>
                        <div className="max-w-[70px] px-[2px] overflow-hidden h-[18px] mt-[2px] rounded-[6px] whitespace-nowrap text-[10px] font-[700] bg-[#FFDC50] border border-black flex justify-center items-center">
                          {numberFormatter(Big(it.bet_amount || 0).times(3), 2, true, { isShort: true })} {betToken?.symbol}
                        </div>
                      </div>
                      <PlayerAvatar
                        avatar={it.players?.find?.((player: any) => player.moves === it.winner_moves)?.avatar}
                        moves={it.players?.find?.((player: any) => player.moves === it.winner_moves)?.moves}
                        className="!w-[34px] !h-[34px] !rounded-[8px] translate-y-[8px]"
                      />
                    </div>
                  ) : (
                    <div
                      className=""
                      style={{
                        color: StatusMap[it.status as Status].color,
                      }}
                    >
                      {StatusMap[it.status as Status].name}
                    </div>
                  )
                }
              </div>
            </div>
          ))
        }
      </div>
    </motion.div>
  );
};
