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
import { useMemo } from "react";
import TimeAgo from "../components/time-ago";
import InputNumber from "@/components/input-number";

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
        <img
          src="/images/playground/magician/header.png"
          alt=""
          className="min-w-[872px] w-[872px] min-h-[189px] h-[189px] object-center object-contain shrink-0 absolute  left-1/2 -translate-x-1/2 -translate-y-[70%] top-0"
        />
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
              magician.setRulesOpen(true);
            }}
            className="absolute left-0"
          >
            <div className="">
              Rules
            </div>
          </Button>
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
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default List;
