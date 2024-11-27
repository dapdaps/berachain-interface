"use client";

import { numberFormatter } from "@/utils/number-formatter";
import Popover, { PopoverPlacement } from "@/components/popover";
import Pager from "@/components/pager";
import FlexTable from "@/components/flex-table";
import useIsMobile from "@/hooks/use-isMobile";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import VoteConfirm from "@/sections/meme/bros/modals/vote/confirm";
import Loading from "@/components/loading";
import clsx from "clsx";
import useVoteTokens from "../../hooks/use-vote-tokens";
import useData from "../../hooks/use-data";
import useTokenBalance from "@/hooks/use-token-balance";
import { useMemo } from "react";
import { BGT_ADDRESS } from "@/configs";
import Big from "big.js";

const VoteTable = forwardRef<any, any>((props, ref) => {
  const { onRow, voteAddress, voting, onVote } = props;
  const { currentRound } = useData();
  const { loading, tokens, totalPage, page, onChangePage } = useVoteTokens(
    currentRound?.round
  );
  const isMobile = useIsMobile();
  const { tokenBalance } = useTokenBalance(BGT_ADDRESS, 18);

  const votable = useMemo(
    () => Big(tokenBalance || 0).gte(0.1),
    [tokenBalance]
  );

  const columns: any = [
    {
      title: "#",
      dataIndex: "sn",
      align: "center",
      width: "15%",
      render: (text: any, record: any) => record.sn
    },
    {
      title: "Meme Token",
      dataIndex: "name",
      width: "55%",
      render: (text: any, record: any) => {
        return (
          <div
            className={clsx(
              "text-[#3D405A] text-[14px] font-[600] flex items-center gap-[5px]",
              "md:relative"
            )}
          >
            <img
              src={record.token.logo}
              alt={record.token.symbol}
              className="rounded-full w-[26px] h-[26px]"
            />
            <div>{record.token.symbol}</div>
            {record.is_list === 1 && (
              <div
                className={clsx(
                  "w-[65px] h-[26px] rounded-[44px] text-center bg-[#7CB424] whitespace-nowrap text-[14px] text-white font-[600] leading-[26px] italic",
                  "md:absolute md:left-0 md:top-[-10px] md:h-[16px] md:text-[12px] md:leading-[16px]"
                )}
              >
                listed
              </div>
            )}
          </div>
        );
      }
    },
    {
      title: "Supporters",
      dataIndex: "supporters",
      width: "30%",
      render: (text: any, record: any) => {
        return (
          <div className="relative text-[#3D405A] text-[14px] font-[600] flex items-center gap-[12px]">
            <div className="w-[90px]">
              {numberFormatter(record.total_vote, 0, true, {
                isShort: isMobile
              })}
            </div>
            {!isMobile && voteAddress === null && votable && (
              <Popover
                contentClassName="z-[200]"
                placement={PopoverPlacement.Right}
                content={
                  !record.voted ? (
                    <VoteConfirm
                      loading={voting}
                      onConfirm={() => {
                        onVote(record.token_address);
                      }}
                    />
                  ) : null
                }
              >
                <button
                  type="button"
                  className="h-[28px] pr-[10px] leading-[26px] whitespace-nowrap px-[10px] border border-black disabled:cursor-[default!important] rounded-[10px] bg-[#FFDC50] flex justify-center items-center gap-[5px] text-center text-black text-[14px] font-[600]"
                  style={
                    record.voted
                      ? {
                          background: "#7CB424",
                          borderColor: "#7CB424",
                          color: "#FFF",
                          borderRadius: 14
                        }
                      : {}
                  }
                  disabled={record.voted}
                >
                  {record.voted ? (
                    <>
                      <svg
                        width="12"
                        height="9"
                        viewBox="0 0 12 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 3.5L4.5 7L10.5 1"
                          stroke="white"
                          strokeWidth="2"
                        />
                      </svg>
                      <div>You Voted</div>
                    </>
                  ) : voting ? (
                    <Loading size={14} />
                  ) : (
                    "Vote"
                  )}
                </button>
              </Popover>
            )}
            {voteAddress === record.token_address && (
              <div
                className={clsx(
                  "absolute flex justify-center items-center gap-[5px] h-[17px] rounded-[9px] px-[5px] bg-[#7CB424] whitespace-nowrap top-0 right-0",
                  "md:left-0 md:top-[-14px] md:gap-[2px] md:text-[12px]"
                )}
              >
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M1 3.08333L3.94737 6L9 1"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>
                <span className="text-[12px] text-white font-[600] leading-[90%]">
                  You Voted
                </span>
              </div>
            )}
          </div>
        );
      }
    }
  ];

  const refs = {
    nextPage: () => {
      onChangePage(page + 1);
    }
  };
  useImperativeHandle(ref, () => refs);

  useEffect(() => {
    if (currentRound?.round) onChangePage(1);
  }, [currentRound]);

  return (
    <>
      <FlexTable
        columns={columns}
        list={tokens}
        headClass="py-[12px] px-[10px] border-b border-b-[rgba(0,0,0,0.2)] md:border-b-[0]"
        headColClass="text-[#3D405A] font-[500]"
        bodyClass="border-b border-b-[rgba(0,0,0,0.2)] md:border-b-[0] max-h-[calc(100dvh_-_350px)] md:max-h-[unset] overflow-y-auto"
        rowClass="odd:bg-[unset] md:odd:bg-[rgba(0,0,0,0.06)] md:rounded-[10px!important] py-[12px] px-[10px!imprtant] hover:bg-[rgba(0,0,0,0.06)]"
        colClass="text-[#3D405A] text-[14px] font-[600]"
        loading={loading}
        onRow={voteAddress || !votable ? () => {} : onRow}
      />
      <div className="pt-[12px] flex justify-end items-center pr-[12px]">
        <Pager
          maxPage={totalPage}
          onPageChange={(p: number) => {
            if (p !== page) onChangePage(p);
          }}
        />
      </div>
    </>
  );
});

export default VoteTable;
