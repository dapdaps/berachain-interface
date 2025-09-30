import InputNumber from "@/components/input-number";
import Checkbox from "../components/checkbox";
import { Moves } from "../config";
import LightingButton from "../../lucky-bera/components/lighting-button";
import { numberFormatter, numberRemoveEndZero } from "@/utils/number-formatter";
import Big from "big.js";
import clsx from "clsx";
import Popover, { PopoverPlacement, PopoverTrigger } from "@/components/popover";
import Card from "@/components/card";
import { motion } from "framer-motion";
import GridTable, { GridTableAlign } from "@/components/flex-table/grid-table";
import PlayerAvatar from "../components/player-avatar";
import dayjs from "dayjs";
import Button from "../components/button";
import Pagination from "@/components/pager/pagination";

const List = (props: any) => {
  const {
    magician,
    create,
    join,
  } = props;

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
      <div className="w-[837px] relative flex justify-between gap-[30px] p-[50px_15px_7px_29px] bg-[#BC9549] border border-[#000] shadow-[4px_4px_0_0_#4B371F] rounded-[10px]">
        <img
          src="/images/playground/magician/header.png"
          alt=""
          className="min-w-[872px] w-[872px] min-h-[189px] h-[189px] object-center object-contain shrink-0 absolute  left-1/2 -translate-x-1/2 -translate-y-[70%] top-0"
        />
        <div className="flex gap-[30px]">
          {
            Object.values(Moves).map((move) => (
              <button
                key={move.value}
                type="button"
                className={clsx(
                  "relative w-[74px] h-[100px] bg-top bg-no-repeat bg-contain shrink-0 transition-all duration-300",
                  create.betMove?.includes(move.value) ? "opacity-100" : "opacity-30",
                )}
                style={{
                  backgroundImage: `url("${move.imgWhite}")`,
                }}
                onClick={() => {
                  create.onSelectMove(move.value);
                }}
              >
                <Checkbox
                  className="absolute bottom-[2px] right-0"
                  checked={create.betMove?.includes(move.value)}
                  value={move.value}
                  onChange={() => {
                    create.onSelectMove(move.value);
                  }}
                />
              </button>
            ))
          }
        </div>
        <div className="">
          <div className="text-[20px] font-[600] text-white">
            Create Game
          </div>
          <div className="flex gap-[10px] mt-[10px]">
            <div className="w-[245px] h-[50px] relative flex items-center">
              <InputNumber
                className="flex-1 w-full h-full rounded-[10px] border border-black bg-white text-black text-[16px] font-[600] text-right pl-[120px] pr-[16px]"
                value={create.betAmount}
                onNumberChange={create.setBetAmount}
              />
              <div className="flex items-center gap-[5px] text-black text-[16px] absolute left-[10px] font-[600] leading-[100%]">
                <img
                  src={magician.betToken.icon}
                  alt=""
                  className="w-[30px] h-[30px] object-center object-contain shrink-0"
                />
                <div className="w-[90px]">
                  Bet Amount
                </div>
              </div>
            </div>

            <div className="flex gap-[6px] shrink-0">
              <button
                type="button"
                className="button disabled:opacity-30 w-[43px] flex justify-center items-center h-[50px] rounded-[12px] border border-[#E5C375] bg-[#FFF1C7] text-black text-[16px] font-[600]"
                onClick={() => {
                  create.setBetAmount((prev: any) => numberRemoveEndZero(Big(prev || 0).plus(0.1).toFixed(magician.betToken.decimals)));
                }}
              >
                +0.1
              </button>
              <button
                type="button"
                className="button disabled:opacity-30 w-[43px] flex justify-center items-center h-[50px] rounded-[12px] border border-[#E5C375] bg-[#FFF1C7] text-black text-[16px] font-[600]"
                onClick={() => {
                  create.setBetAmount((prev: any) => numberRemoveEndZero(Big(prev || 0).plus(1).toFixed(magician.betToken.decimals)));
                }}
              >
                +1
              </button>
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
      <div className="w-[837px] relative mt-[10px] p-[21px_20px] bg-[#BC9549] border border-[#000] shadow-[4px_4px_0_0_#4B371F] rounded-[10px]">
        <div className="text-white text-[20px] flex justify-between items-center">
          <div className="">
            All Games {magician.list.total}
          </div>
          <Button
            disabled={magician.loading}
            onClick={() => {
              magician.getList();
            }}
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
        <GridTable
          className="mt-[10px] !border-b-[0] !text-black"
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
                    />
                    <PlayerAvatar
                      avatar={record.players[1]?.avatar}
                      moves={record.players[1]?.moves}
                    />
                    <PlayerAvatar
                      avatar={record.players[2]?.avatar}
                      moves={record.players[2]?.moves}
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
      </div>
    </motion.div>
  );
};

export default List;
