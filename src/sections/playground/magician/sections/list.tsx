import Checkbox from "../components/checkbox";
import { Moves, Status, StatusMap } from "../config";
import LightingButton from '@/components/button/lighting-button';
import { numberFormatter, numberRemoveEndZero } from "@/utils/number-formatter";
import Big from "big.js";
import clsx from "clsx";
import Popover, { PopoverPlacement, PopoverTrigger } from "@/components/popover";
import Card from "@/components/card";
import { AnimatePresence, motion } from "framer-motion";
import GridTable, { GridTableAlign } from "@/components/flex-table/grid-table";
import PlayerAvatar from "../components/player-avatar";
import dayjs from "dayjs";
import Button from "../components/button";
import Pagination from "@/components/pager/pagination";
import SwitchTabs from "@/components/switch-tabs";
import { useMemo, useState } from "react";
import TimeAgo from "../components/time-ago";
import InputNumber from "@/components/input-number";
import Leaderboard from "./leaderboard";
import useWeekRound from "../hooks/use-week-round";

const List = (props: any) => {
  const {
    magician,
    create,
    join,
    claim,
  } = props;

  const betAmounts = useMemo(() => {
    if (!magician.gameConfig?.minBetAmount) {
      return ["1", "5", "10"];
    }
    return [
      numberRemoveEndZero(Big(magician.gameConfig.minBetAmount).toFixed(magician.betToken.decimals)),
      numberRemoveEndZero(Big(magician.gameConfig.minBetAmount).mul(5).toFixed(magician.betToken.decimals)),
      numberRemoveEndZero(Big(magician.gameConfig.minBetAmount).mul(10).toFixed(magician.betToken.decimals)),
    ]
  }, [magician.gameConfig, magician.betToken]);

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { round, startDate, endDate, countdown } = useWeekRound()

  return (
    <motion.div
      className="w-full flex flex-col items-center pt-[100px]"
      initial={{
        x: -200,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
      }}
      exit={{
        x: -200,
        opacity: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
    >
      <div className="w-[837px] relative flex justify-between gap-[30px] p-[50px_14px_14px_20px] bg-[#BC9549] border border-[#000] shadow-[4px_4px_0_0_#4B371F] rounded-[10px]">
        <div className="min-w-[872px] w-[872px] min-h-[189px] h-[189px] bg-[url('/images/playground/magician/header.png')] bg-no-repeat bg-center bg-contain object-center object-contain shrink-0 absolute left-1/2 -translate-x-1/2 -translate-y-[70%] top-0">
          <button
            type="button"
            className="absolute top-[80px] right-[240px] w-[55px] h-[30px] border border-black rounded-[12px] bg-[linear-gradient(180deg,_#FFCE78_0%,_#9E762F_100%)] rotate-[-8.017deg] font-CherryBomb text-[16px] font-[400] leading-[90%]"
            onClick={() => {
              magician.playAudio({ type: "click", action: "play" });
              magician.setRulesOpen(true);
            }}
          >
            Rules
          </button>
        </div>
        <div className="w-full">
          <div className="text-[20px] font-[600] text-white">
            Create Game
          </div>
          <div className="flex justify-between gap-[10px] mt-[10px] relative">
            <div className="flex items-center gap-[10px]">
              <div className="flex items-center gap-[4px] text-white text-[20px] font-[600] leading-[100%] shrink-0">
                <img
                  src={magician.betToken.icon}
                  alt=""
                  className="w-[30px] h-[30px] object-center object-contain shrink-0"
                />
                <div className="">
                  Bet
                </div>
              </div>
              <InputNumber
                className="w-[134px] h-[50px] px-[13px] border border-black rounded-[8px] bg-white font-[600]"
                value={create.betAmount}
                onNumberChange={create.setBetAmount}
                decimals={1}
              />
              <div className="flex items-center gap-[5px]">
                {
                  ["1", "2.5", "10"].map((_amount, _index) => (
                    <Popover
                      content={_index > 0 ? (
                        <Card className="!rounded-[12px] w-[356px] !p-[14px_13px] bg-[#FFFDEB] text-[14px] leading-[110%] font-[600] flex justify-center items-center gap-[12px]">
                          <img
                            src="/images/playground/magician/icon-lootbox.png"
                            alt=""
                            className="w-[23px] h-[20px] object-center object-contain shrink-0"
                          />
                          <div className="">
                            If you wager more than 2.5 Bera games and failed, you will get a Lootbox.
                          </div>
                        </Card>
                      ) : null}
                      trigger={PopoverTrigger.Hover}
                      placement={PopoverPlacement.Top}
                      closeDelayDuration={0}
                      offset={10}
                    >
                      <button
                        key={_amount}
                        type="button"
                        className={clsx(
                          "w-[38px] h-[38px] hover:bg-[#FFDC50] border border-[#471C1C] rounded-[8px] font-[600] text-black text-[16px] flex justify-center items-center transition-all duration-300",
                          create.betAmount === _amount ? "bg-[#FFDC50]" : "bg-white",
                          _index > 0 && "bg-[url('/images/playground/magician/icon-lootbox-opacity.png')] bg-no-repeat bg-center bg-[length:23px_20px]",
                        )}
                        onClick={() => {
                          create.setBetAmount(_amount);
                          magician.playAudio({ type: "click", action: "play" });
                        }}
                      >
                        {_amount}
                      </button>
                    </Popover>
                  ))
                }
              </div>
            </div>

            <div className="flex gap-[20px] absolute left-1/2 -translate-x-[0%] top-[-10px]">
              {
                Object.values(Moves).map((move) => (
                  <motion.button
                    key={move.value}
                    type="button"
                    className={clsx(
                      "relative w-[74px] h-[70px] bg-top bg-no-repeat bg-contain shrink-0",
                      // create.betMove?.includes(move.value) ? "opacity-100" : "opacity-50",
                    )}
                    style={{
                      backgroundImage: `url("${move.imgWhite}")`,
                    }}
                    onClick={() => {
                      create.onSelectMove(move.value);
                    }}
                    variants={{
                      rotate: {
                        rotate: [1, 0, -1],
                      },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 10,
                    }}
                    whileHover="rotate"
                  >
                    <Checkbox
                      className="absolute bottom-[2px] right-0"
                      checked={create.betMove?.includes(move.value)}
                      value={move.value}
                      onChange={() => {
                        create.onSelectMove(move.value);
                      }}
                    />
                  </motion.button>
                ))
              }
            </div>

            <div className="flex gap-[6px] shrink-0">
              <Popover
                content={!!create.buttonValid.text ? (
                  <Card className="!rounded-[4px] !p-[5px_10px]">
                    {create.buttonValid.text}
                  </Card>
                ) : null}
                trigger={PopoverTrigger.Hover}
                placement={PopoverPlacement.Top}
                closeDelayDuration={0}
                offset={20}
              >
                <LightingButton
                  outerClassName="!h-[50px] uppercase !text-[20px]"
                  disabled={create.buttonValid.disabled || create.buttonValid.loading}
                  onClick={() => {
                    create.onCreate();
                  }}
                >
                  Create
                </LightingButton>
              </Popover>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[837px] relative mt-[10px] p-[13px_20px] bg-[#BC9549] border border-[#000] shadow-[4px_4px_0_0_#4B371F] rounded-[10px]">
        <div className="flex justify-center items-center relative">
          <Button
            onClick={() => {
              magician.playAudio({ type: "click", action: "play" });
              setShowLeaderboard(true);
            }}
            className="absolute left-0 group"
          >
            <div className="">
              Leaderboard
              <div className="pointer-events-none absolute bottom-[120%] left-0 gap-[10px] w-[380px] bg-[#FFFDEB] text-[12px] flex items-center p-[10px] rounded-[12px] border border-[#4B371F] group-hover:opacity-100 opacity-0 transition-all duration-300">
                <div>
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.7382 17.6807L15.9663 17.7345C15.9663 17.7345 17.4943 19.094 17.893 20.6852C18.3289 22.4233 16.7377 26.7376 11.6563 27.5564C9.91245 27.8376 11.3427 24.4509 11.1257 22.5904L15.7382 17.6807Z" fill="#C8C8E6" />
                    <path d="M11.4628 28.0506C11.0293 28.0506 10.7698 27.8556 10.6286 27.6921C10.1316 27.1164 10.2921 26.0508 10.4781 24.8169C10.5953 24.0391 10.7165 23.2348 10.6478 22.6452C10.6398 22.5762 10.6469 22.5062 10.6687 22.4403C10.6905 22.3743 10.7265 22.3138 10.7742 22.2631L15.3867 17.3534C15.4444 17.292 15.5173 17.2468 15.5982 17.2225C15.679 17.1982 15.7648 17.1956 15.847 17.215L16.0751 17.2688C16.1527 17.2871 16.2245 17.3244 16.2839 17.3773C16.3508 17.4369 17.9269 18.8545 18.3566 20.5688C18.6302 21.6601 18.2334 23.2334 17.3454 24.5767C16.1305 26.4146 14.1366 27.6403 11.7311 28.028C11.6382 28.0429 11.5478 28.0506 11.4628 28.0506ZM11.6196 22.7618C11.6568 23.4304 11.5399 24.2062 11.4264 24.9592C11.3144 25.702 11.1453 26.8248 11.3554 27.0683C11.3609 27.0747 11.378 27.0944 11.4628 27.0944C11.4968 27.0944 11.5355 27.091 11.578 27.0842C14.3175 26.6427 15.791 25.1908 16.5447 24.0506C17.3897 22.7722 17.5939 21.4698 17.4261 20.8008C17.1474 19.6881 16.2351 18.6762 15.8356 18.2741L11.6196 22.7618Z" fill="#4B371F" />
                    <path opacity="0.81" d="M2.97524 21.5695C1.38367 23.1209 -0.0501473 27.4863 0.671256 28.2202C1.73826 29.3055 5.47066 27.6235 7.06211 26.0718C8.65344 24.5205 9.20342 22.2902 8.0265 21.0937C6.21735 19.2529 4.68428 19.9036 2.97524 21.5695Z" fill="#FFC800" />
                    <path opacity="0.81" d="M1.72255 29.0432C1.11658 29.0432 0.647634 28.8787 0.328888 28.5543C0.102326 28.3238 -0.00520114 27.9644 0.000193185 27.4558C0.0176948 25.8276 1.26403 22.5684 2.63994 21.2272C3.86206 20.0361 4.85162 19.5049 5.84849 19.5049C6.7153 19.5049 7.5398 19.915 8.36885 20.7585C8.88023 21.2785 9.14599 21.9788 9.1376 22.7838C9.12478 24.0066 8.4741 25.3634 7.39727 26.4131C6.12157 27.6571 3.47714 29.0432 1.72255 29.0432ZM5.84861 20.461C5.12194 20.461 4.33916 20.9082 3.3104 21.9109C2.65361 22.5511 1.93724 23.8363 1.44072 25.2652C0.87959 26.8797 0.916272 27.7445 1.01912 27.8912C1.17784 28.052 1.48987 28.087 1.72267 28.087C3.17926 28.087 5.60887 26.8197 6.72705 25.7294C7.62587 24.8533 8.16854 23.7484 8.17885 22.7737C8.18472 22.2203 8.01834 21.7675 7.68425 21.4279C7.04472 20.7773 6.44427 20.461 5.84861 20.461Z" fill="#4B371F" />
                    <path d="M10.9299 12.8123L11.128 12.5588C11.128 12.5588 9.44848 8.55889 5.6378 11.5951C4.28406 12.6735 -0.592783 17.535 2.73205 17.4316C6.05664 17.3285 6.91218 17.6051 6.91218 17.6051L10.9299 12.8123Z" fill="#C8C8E6" />
                    <path d="M6.91109 18.0838C6.86386 18.0838 6.81627 18.0768 6.76964 18.0625C6.74494 18.0556 6.11248 17.8871 4.12197 17.8871C3.6969 17.8871 3.23383 17.8948 2.74594 17.91C1.67966 17.9442 1.30673 17.5032 1.17727 17.1349C0.528147 15.2878 5.28871 11.2609 5.3375 11.2221C6.37237 10.3976 7.37164 9.97949 8.30738 9.97949C10.5376 9.97949 11.5282 12.277 11.5693 12.3748C11.6022 12.4531 11.6136 12.5387 11.6023 12.6228C11.591 12.707 11.5574 12.7866 11.505 12.8535L11.3069 13.1069C11.3036 13.1112 11.3002 13.1154 11.2967 13.1194L7.27898 17.9122C7.23398 17.9659 7.17771 18.0091 7.11414 18.0388C7.05058 18.0684 6.98126 18.0838 6.91109 18.0838ZM4.12197 16.9309C5.55123 16.9309 6.33521 17.0147 6.72732 17.0792L10.562 12.5042C10.2849 12.0123 9.53801 10.9356 8.30726 10.9356C7.59449 10.9356 6.79661 11.2833 5.93591 11.9691C3.69678 13.7528 1.89831 16.2956 2.08208 16.8187C2.10521 16.8846 2.28622 16.9556 2.6287 16.9556C2.65711 16.9556 2.686 16.9552 2.71597 16.9542C3.21381 16.9389 3.68683 16.9309 4.12197 16.9309Z" fill="#4B371F" />
                    <path d="M25.7271 16.3063C30.7667 11.1797 29.8495 4.8427 28.2697 2.57557C27.0506 0.826004 25.1796 0.609415 25.1796 0.609415C7.86569 -1.2647 6.91101 17.6049 6.91101 17.6049C6.91101 17.6049 10.5584 18.4071 11.1242 22.5897C11.1242 22.5897 21.2543 20.8555 25.7271 16.3063Z" fill="#906EFF" />
                    <path opacity="0.31" d="M11.2468 15.7653C11.2468 15.7653 18.3194 0.52153 25.8992 1.18229C25.8992 1.18229 13.1373 -3.09295 8.46216 12.0599L11.2468 15.7653Z" fill="white" />
                    <path opacity="0.81" d="M4.36102 22.3568C3.54576 23.1512 2.81105 25.3877 3.18062 25.7635C3.72713 26.3197 5.63936 25.4582 6.45463 24.6632C7.27001 23.8685 7.55159 22.726 6.94887 22.1127C6.022 21.1697 5.23658 21.5031 4.36102 22.3568Z" fill="white" />
                    <path d="M14.6995 8.18553C14.6994 8.99396 14.859 9.79448 15.1693 10.5414C15.4795 11.2883 15.9342 11.9669 16.5075 12.5386C17.0808 13.1103 17.7613 13.5637 18.5104 13.8731C19.2594 14.1825 20.0622 14.3418 20.873 14.3418C21.6837 14.3418 22.4865 14.1825 23.2356 13.8731C23.9846 13.5637 24.6652 13.1103 25.2385 12.5386C25.8117 11.9669 26.2665 11.2883 26.5767 10.5414C26.8869 9.79448 27.0466 8.99396 27.0465 8.18553C27.0466 7.3771 26.8869 6.57658 26.5767 5.82967C26.2665 5.08277 25.8117 4.4041 25.2385 3.83244C24.6652 3.26078 23.9846 2.80731 23.2356 2.49792C22.4865 2.18854 21.6837 2.0293 20.873 2.0293C20.0622 2.0293 19.2594 2.18854 18.5104 2.49792C17.7613 2.80731 17.0808 3.26078 16.5075 3.83244C15.9342 4.4041 15.4795 5.08277 15.1693 5.82967C14.859 6.57658 14.6994 7.3771 14.6995 8.18553Z" fill="#906EFF" />
                    <path d="M16.098 9.09842C16.098 10.5423 16.6732 11.927 17.6972 12.948C18.7211 13.969 20.1098 14.5426 21.5578 14.5426C23.0058 14.5426 24.3946 13.969 25.4185 12.948C26.4424 11.927 27.0176 10.5423 27.0176 9.09842C27.0176 7.65455 26.4424 6.26982 25.4185 5.24884C24.3946 4.22787 23.0058 3.6543 21.5578 3.6543C20.1098 3.6543 18.7211 4.22787 17.6972 5.24884C16.6732 6.26982 16.098 7.65455 16.098 9.09842Z" fill="#673DFF" />
                    <path d="M11.5046 21.0844C12.2604 21.925 11.5046 21.0845 11.7246 22.7101C11.7246 22.7101 21.6991 20.1378 26.1718 15.5888C30.5428 11.1426 29.9957 5.85545 28.4931 3.57422C28.7886 11.704 20.4781 17.1912 11.5046 21.0844Z" fill="#673DFF" />
                    <path d="M16.5312 8.06061C16.5313 9.24063 16.9921 10.3723 17.8124 11.2067C18.6326 12.0411 19.7452 12.5099 20.9052 12.5099C22.0653 12.5099 23.1778 12.0411 23.9981 11.2067C24.8184 10.3723 25.2792 9.24063 25.2792 8.06061C25.2792 7.47632 25.1661 6.89775 24.9462 6.35794C24.7264 5.81813 24.4042 5.32764 23.9981 4.91449C23.1778 4.08009 22.0653 3.61133 20.9052 3.61133C19.7452 3.61133 18.6326 4.08009 17.8124 4.91449C16.9921 5.74889 16.5313 6.88058 16.5312 8.06061Z" fill="#BED3EB" />
                    <path d="M20.9052 12.9876C18.229 12.9876 16.0519 10.7771 16.0519 8.06021C16.0519 5.34329 18.229 3.13281 20.9052 3.13281C23.5814 3.13281 25.7587 5.34329 25.7587 8.06021C25.7587 10.7771 23.5814 12.9876 20.9052 12.9876ZM20.9052 4.08905C18.7579 4.08905 17.0109 5.87053 17.0109 8.06021C17.0109 10.2499 18.7579 12.0314 20.9052 12.0314C23.0527 12.0314 24.7997 10.2499 24.7997 8.06021C24.7997 5.87053 23.0527 4.08905 20.9052 4.08905Z" fill="#4B371F" />
                    <path d="M18.6552 20.4661C16.6842 11.8776 8.55844 10.3984 8.55844 10.3984L8.5582 10.3986C7.04275 14.1721 6.87097 17.5661 6.87097 17.5661C6.87097 17.5661 10.5368 18.3722 11.1055 22.5761C11.1056 22.5762 14.7591 21.9504 18.6552 20.4661Z" fill="#C8C8E6" />
                    <path d="M11.1055 23.0554C10.9894 23.0554 10.8773 23.0134 10.7899 22.9373C10.7025 22.8611 10.6458 22.7559 10.6303 22.6412C10.1153 18.8347 6.90268 18.0648 6.76614 18.0338C6.65591 18.0089 6.558 17.9461 6.48957 17.8564C6.42114 17.7667 6.38656 17.6558 6.39189 17.5433C6.39909 17.4013 6.58525 14.0259 8.11293 10.222C8.13702 10.162 8.1731 10.1074 8.21902 10.0616C8.27412 10.0072 8.34153 9.96681 8.41556 9.94378C8.4896 9.92075 8.56809 9.91579 8.64445 9.92931C8.73124 9.94509 10.7948 10.3328 13.1247 11.8093C15.2789 13.1742 18.068 15.7659 19.1225 20.3607C19.1483 20.4731 19.1325 20.5909 19.0781 20.6926C19.0236 20.7943 18.9342 20.8729 18.8262 20.914C14.9307 22.3981 11.2373 23.0554 11.1055 23.0554ZM7.3793 17.2251C8.36262 17.5767 10.8417 18.7709 11.4972 22.0163C12.5525 21.8063 15.2324 21.219 18.0889 20.1685C17.2523 16.941 15.4214 14.4082 12.6423 12.6364C11.0329 11.6105 9.53368 11.1378 8.85387 10.9597C7.79082 13.7566 7.46716 16.3023 7.3793 17.2251Z" fill="#4B371F" />
                    <path opacity="0.83" d="M23.5111 8.79553C23.3839 8.79553 23.262 8.74515 23.172 8.65549C23.0821 8.56582 23.0316 8.44421 23.0316 8.3174C23.0316 7.90132 22.9076 7.50101 22.6731 7.15975C22.6034 7.0551 22.5779 6.92733 22.6019 6.80405C22.626 6.68077 22.6977 6.57187 22.8016 6.50087C22.9055 6.42988 23.0332 6.40248 23.1572 6.42461C23.2812 6.44673 23.3915 6.5166 23.4642 6.61912C23.8083 7.11894 23.9919 7.71119 23.9907 8.3174C23.9906 8.44421 23.9401 8.5658 23.8502 8.65546C23.7602 8.74511 23.6383 8.79549 23.5111 8.79553ZM18.1997 8.43705C18.0725 8.43705 17.9506 8.38668 17.8607 8.29702C17.7707 8.20735 17.7202 8.08574 17.7202 7.95893C17.7202 6.30093 19.0729 4.95215 20.7354 4.95215C21.2082 4.95215 21.6611 5.05829 22.0812 5.26759C22.194 5.32486 22.2794 5.42424 22.319 5.54407C22.3586 5.66391 22.349 5.79448 22.2925 5.90733C22.2359 6.02018 22.1369 6.10617 22.0171 6.14656C21.8972 6.18695 21.7662 6.17846 21.6526 6.12295C21.3679 5.98085 21.0538 5.90736 20.7355 5.90839C19.6018 5.90839 18.6793 6.8283 18.6793 7.95893C18.6793 8.08574 18.6287 8.20733 18.5388 8.29699C18.4488 8.38664 18.3269 8.43702 18.1997 8.43705Z" fill="white" />
                    <path opacity="0.63" d="M8.68597 10.834L8.68585 10.8342C7.32444 14.4652 7.17004 17.7308 7.17004 17.7308C7.17004 17.7308 7.741 17.2558 8.83522 18.4917C9.22373 17.2087 10.8784 14.2468 12.485 12.5306C10.4683 11.1823 8.68597 10.834 8.68597 10.834Z" fill="white" />
                    <path opacity="0.31" d="M9.99023 19.9316C12.3624 19.1822 14.1285 17.1699 15.9352 15.3633C15.9352 15.363 18.1374 18.2874 18.3806 20.3712C18.3806 20.3712 15.0535 21.7913 11.1895 22.4556C11.1895 22.4557 11.104 20.6833 9.99023 19.9316Z" fill="#4B371F" />
                    <path d="M11.1243 23.0674C11.0083 23.0674 10.8962 23.0254 10.8088 22.9492C10.7215 22.8731 10.6647 22.768 10.6491 22.6534C10.137 18.8679 6.94212 18.102 6.8063 18.0712C6.69608 18.0463 6.59816 17.9835 6.52973 17.8938C6.4613 17.8041 6.42672 17.6932 6.43205 17.5806C6.44116 17.4018 6.67792 13.1514 8.79477 8.83162C10.7693 4.80261 14.8069 0 22.8305 0C23.604 0 24.4117 0.0449434 25.2313 0.133754C25.32 0.144034 27.3362 0.397558 28.6636 2.30239C29.4385 3.41462 30.1857 5.60239 29.9587 8.40669C29.7864 10.5334 28.9719 13.6881 26.0696 16.6405C24.16 18.5828 21.0738 20.254 16.8967 21.6083C13.8077 22.6098 11.3102 23.0427 11.2054 23.0606C11.1786 23.0652 11.1515 23.0675 11.1243 23.0674ZM7.41934 17.2624C8.39895 17.6133 10.8632 18.8018 11.5159 22.0285C12.3861 21.8554 14.3595 21.426 16.6131 20.6946C20.5786 19.4077 23.6118 17.7743 25.3846 15.9712C30.1965 11.0763 29.3816 5.00868 27.8759 2.84793C26.803 1.30826 25.139 1.08581 25.1224 1.08378C24.3423 0.999393 23.5695 0.956242 22.8304 0.956242C19.5009 0.956242 16.6227 1.82547 14.2757 3.53989C12.3944 4.91413 10.8402 6.8357 9.65643 9.25129C7.9734 12.6861 7.52483 16.1514 7.41934 17.2624Z" fill="#4B371F" />
                    <path opacity="0.15" d="M11.1448 23.182C11.1448 23.182 10.7516 27.2446 13.5049 25.5353C16.2582 23.8259 17.7539 22.0246 17.7539 20.8135C17.7539 20.8135 17.7325 27.1179 11.0839 27.4641C11.0841 27.4641 10.2566 24.0676 11.1448 23.182Z" fill="#4B371F" />
                  </svg>
                </div>
                <div className="text-left">This round ends in <span className="underline">{ countdown.days }d { countdown.hours }:{ countdown.minutes }:{ countdown.seconds }</span>. The top 10 players will share a 50 $BERA reward.</div>
              </div>
            </div>
          </Button>
          {/* <Button
            onClick={() => {
              magician.playAudio({ type: "click", action: "play" });
              magician.setRulesOpen(true);
            }}
            className="absolute left-0"
          >
            <div className="">
              Rules
            </div>
          </Button> */}
          <SwitchTabs
            tabs={[
              {
                label: `All Games ${magician.list.total ? numberFormatter(magician.list.total, 0, true, { isShort: true }) : ""}`,
                value: "all",
                disabled: magician.loading || magician.userListLoading,
              },
              {
                label: `Yours ${magician.userList.total ? numberFormatter(magician.userList.total, 0, true, { isShort: true }) : ""}`,
                value: "yours",
                disabled: magician.loading || magician.userListLoading,
              },
            ]}
            onChange={(val) => {
              magician.setListTab(val);
              magician.playAudio({ type: "click", action: "play" });
              if (val === "yours") {
                magician.onUserListPageChange(1);
                return;
              }
              magician.onPageChange(1);
            }}
            current={magician.listTab}
            className="shrink-0 w-[300px]"
          />
          <Button
            onClick={() => {
              magician.setHistoryOpen(true);
              magician.playAudio({ type: "click", action: "play" });
            }}
            className="absolute right-[120px]"
          >
            <div className="">
              History
            </div>
          </Button>
          <Button
            disabled={magician.loading || magician.userListLoading}
            onClick={() => {
              magician.playAudio({ type: "click", action: "play" });
              if (magician.listTab === "yours") {
                magician.getUserList();
                return;
              }
              magician.getList();
            }}
            className="absolute right-0"
          >
            <motion.img
              src="/images/playground/magician/icon-reload.svg"
              alt=""
              className="w-[16px] h-[16px] object-center object-contain shrink-0"
              animate={magician.loading ? {
                rotate: [0, 360],
              } : {
                rotate: [null, 0],
              }}
              transition={magician.loading ? {
                ease: "linear",
                repeat: Infinity,
                duration: 1,
              } : {
                ease: "linear",
                duration: 0,
              }}
            />
            <div className="">
              Refresh
            </div>
          </Button>
        </div>

        <AnimatePresence>
          {
            magician.listTab === "all" && (
              <motion.div
                key="all"
                className="w-full mt-[10px]"
                initial={{
                  opacity: 0,
                  x: -200,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
              >
                <GridTable
                  className="!border-b-[0] !text-black"
                  headerRowClassName="!px-0 !gap-x-[0px] text-[#FFF1C7] !border-b-[0]"
                  bodyRowClassName="odd:bg-[#FFF1C7] !px-0 !gap-x-[0px] bg-[#FFF1C7] rounded-[12px] !border !border-[#E5C375] mb-[3px]"
                  bodyClassName="!px-0"
                  colClassName="!py-[10px] !px-[13px]"
                  columns={[
                    {
                      dataIndex: "room_id",
                      title: () => (
                        <div className="pl-[0px]">
                          Game No.
                        </div>
                      ),
                      width: 100,
                      sort: false,
                      render: (record: any) => {
                        return (
                          <div className="pl-[0px]">
                            {record.room_id}
                          </div>
                        );
                      },
                    },
                    {
                      dataIndex: "player",
                      title: "Player",
                      width: 270,
                      sort: false,
                      render: (record: any) => {
                        return (
                          <div className="flex items-center gap-[10px]">
                            <PlayerAvatar
                              avatar={record.players[0]?.avatar}
                              moves={record.players[0]?.moves}
                              isMoveAvatar={false}
                            />
                            <PlayerAvatar
                              avatar={record.players[1]?.avatar}
                              moves={record.players[1]?.moves}
                              isMoveAvatar={false}
                            />
                            <PlayerAvatar
                              avatar={record.players[2]?.avatar}
                              moves={record.players[2]?.moves}
                              isMoveAvatar={false}
                            />
                          </div>
                        );
                      },
                    },
                    {
                      dataIndex: "bet_amount",
                      title: "Bet Price",
                      width: 130,
                      sort: true,
                      render: (record: any) => {
                        return (
                          <div className="flex items-center gap-[6px]">
                            <img
                              src={magician.betToken.icon}
                              alt=""
                              className="w-[30px] h-[30px] object-center object-contain shrink-0"
                            />
                            <div className="">
                              {numberFormatter(record.bet_amount, 3, true, { isShort: true, isZeroPrecision: false })}
                            </div>
                          </div>
                        );
                      },
                    },
                    {
                      dataIndex: "create_time",
                      title: "Create Time",
                      width: 180,
                      sort: true,
                      render: (record: any) => {
                        return dayjs(record.create_time * 1000).utc().format("MM/DD/YYYY HH:mm");
                      },
                    },
                    {
                      dataIndex: "join",
                      title: "",
                      width: 120,
                      align: GridTableAlign.Right,
                      render: (record: any) => {
                        return (
                          <>
                            <Button
                              loading={record.loading}
                              disabled={record.loading}
                              className="!pr-[10px] group"
                              onClick={() => {
                                join.onOpen(record);
                              }}
                            >
                              <div className="">
                                Join
                              </div>
                              <img
                                src="/images/playground/magician/icon-triangle-right.png"
                                alt=""
                                className="w-[12px] h-[16px] object-center object-contain shrink-0 opacity-0 translate-x-[10px] group-hover:opacity-100  group-hover:translate-x-0 transition-all duration-300"
                              />
                            </Button>
                          </>
                        );
                      },
                    },
                  ]}
                  data={magician.list.data}
                  loading={magician.loading}
                  sortIconColor={["black", "white"]}
                  sortDirection={magician.list.order as any}
                  sortDataIndex={magician.list.sort}
                  onSort={(dataIndex: any, nextDirection: any) => {
                    magician.onSort(dataIndex, nextDirection);
                  }}
                />
                <div className="flex justify-end items-center pt-[10px]">
                  <Pagination
                    page={magician.list.page}
                    totalPage={magician.list.pageTotal}
                    pageSize={magician.list.pageSize}
                    onPageChange={(_page: number) => {
                      magician.onPageChange(_page);
                    }}
                  />
                </div>
              </motion.div>
            )
          }
          {
            magician.listTab === "yours" && (
              <motion.div
                key="yours"
                className="w-full mt-[10px]"
                initial={{
                  opacity: 0,
                  x: 200,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
              >
                <GridTable
                  className="!border-b-[0] !text-black"
                  headerRowClassName="!px-0 !gap-x-[0px] text-[#FFF1C7] !border-b-[0]"
                  bodyRowClassName="odd:bg-[#FFF1C7] !px-0 !gap-x-[0px] bg-[#FFF1C7] rounded-[12px] !border !border-[#E5C375] mb-[3px] hover:bg-[radial-gradient(rgba(255,220,80,0.5),rgba(255,255,255,0))]"
                  bodyRowStyle={(record: any) => {
                    if (record.status === Status.Won && record.winner_address) {
                      return {
                        backgroundColor: "#f2dfae",
                      };
                    }
                    return {};
                  }}
                  bodyClassName="!px-0"
                  colClassName="!py-[10px] !px-[13px]"
                  bodyColClassName="cursor-pointer"
                  columns={[
                    {
                      dataIndex: "room_id",
                      title: () => (
                        <div className="pl-[0px]">
                          Game No.
                        </div>
                      ),
                      width: 100,
                      sort: false,
                      render: (record: any) => {
                        return (
                          <div className="pl-[0px]">
                            {record.room_id}
                          </div>
                        );
                      },
                    },
                    {
                      dataIndex: "player",
                      title: "Player",
                      width: 160,
                      sort: false,
                      render: (record: any) => {
                        return (
                          <div className="flex items-center gap-[10px]">
                            <PlayerAvatar
                              avatar={record.players[0]?.avatar}
                              moves={record.players[0]?.moves}
                              className="!w-[34px] !h-[34px] !rounded-[8px] translate-y-[8px]"
                            />
                            <PlayerAvatar
                              avatar={record.players[1]?.avatar}
                              moves={record.players[1]?.moves}
                              className="!w-[34px] !h-[34px] !rounded-[8px] translate-y-[8px]"
                            />
                            <PlayerAvatar
                              avatar={record.players[2]?.avatar}
                              moves={record.players[2]?.moves}
                              className="!w-[34px] !h-[34px] !rounded-[8px] translate-y-[8px]"
                            />
                          </div>
                        );
                      },
                    },
                    {
                      dataIndex: "role",
                      title: "Your Role",
                      width: 100,
                      render: (record: any) => {
                        return record.players?.[0]?.address.toLowerCase() === magician.account?.toLowerCase() ? "Creator" : "Player";
                      },
                    },
                    {
                      dataIndex: "create_time",
                      title: "Time",
                      width: 120,
                      sort: true,
                      render: (record: any) => {
                        return (
                          <TimeAgo record={record} />
                        );
                      },
                    },
                    {
                      dataIndex: "bet_amount",
                      title: "Bet Price",
                      width: 130,
                      sort: true,
                      render: (record: any) => {
                        return (
                          <div className="flex items-center gap-[6px]">
                            <img
                              src={magician.betToken.icon}
                              alt=""
                              className="w-[30px] h-[30px] object-center object-contain shrink-0"
                            />
                            <div className="">
                              {numberFormatter(record.bet_amount, 3, true, { isShort: true, isZeroPrecision: false })}
                            </div>
                          </div>
                        );
                      },
                    },
                    {
                      dataIndex: "status",
                      title: "Status",
                      width: 180,
                      align: GridTableAlign.Left,
                      render: (record: any) => {
                        return record.status === Status.Won && record.winner_address ? (
                          <div className="flex items-center gap-[5px]">
                            <PlayerAvatar
                              avatar={record.players?.find((player: any) => player.moves === record.winner_moves)?.avatar}
                              moves={record.players?.find((player: any) => player.moves === record.winner_moves)?.moves}
                              className="!w-[34px] !h-[34px] !rounded-[8px] translate-y-[8px]"
                            />
                            <div className="">
                              <div className="">
                                Winner
                              </div>
                              <div className="max-w-[70px] px-[2px] mt-[2px] overflow-hidden h-[20px] border border-black bg-[#FFDC50] rounded-[20px] flex justify-center items-center text-[10px] font-[700]">
                                {numberFormatter(Big(record.bet_amount || 0).times(3), 2, true, { isShort: true })} {magician.betToken?.symbol}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="flex items-center gap-[5px]"
                            style={{
                              color: StatusMap[record.status as Status].color,
                            }}
                          >
                            <div className="shrink-0">{StatusMap[record.status as Status].name}</div>
                            {
                              record.canClaim && (
                                <button
                                  type="button"
                                  className="w-[70px] h-[36px] shrink-0 rounded-[6px] border border-black bg-white text-[14px] text-black font-[600] flex justify-center items-center gap-[5px]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    claim.onClaimOpen(true, record);
                                  }}
                                >
                                  <div>Close</div>
                                </button>
                              )
                            }
                          </div>
                        );
                      },
                    },
                  ]}
                  data={magician.userList.data}
                  loading={magician.userListLoading}
                  sortIconColor={["black", "white"]}
                  sortDirection={magician.userList.order as any}
                  sortDataIndex={magician.userList.sort}
                  onSort={(dataIndex: any, nextDirection: any) => {
                    magician.onUserListSort(dataIndex, nextDirection);
                  }}
                  onRow={(record: any) => {
                    if (join.viewing) {
                      return;
                    }
                    join.onView(record);
                  }}
                />
                <div className="flex justify-end items-center pt-[10px]">
                  <Pagination
                    page={magician.userList.page}
                    totalPage={magician.userList.pageTotal}
                    pageSize={magician.userList.pageSize}
                    onPageChange={(_page: number) => {
                      magician.onUserListPageChange(_page);
                    }}
                  />
                </div>
              </motion.div>
            )
          }

          {
            showLeaderboard && (
              <Leaderboard onClose={() => setShowLeaderboard(false)} round={round} startDate={startDate} endDate={endDate} />
            )
          }
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default List;
