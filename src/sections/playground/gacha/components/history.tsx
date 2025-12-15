"use client";

import GridTable from "@/components/flex-table/grid-table";
import Pagination from "@/components/pager/pagination";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { berachain } from "viem/chains";
import Image from "next/image";
import useHistory from "../hooks/use-history";
import { playClickSound } from "../sound";
import { getNftImgUrl } from "../config";


const COST_MAP: any = {
  0: 1,
  1: 20,
  2: 50,
};

export default function History({ refresh, tokenMap, tokenNameMap }: { refresh: number, tokenMap: Record<string, string>, tokenNameMap: Record<string, string> }) {
  const { data: historyList, loading: historyListLoading, page, pageSize, totalPage, total, setPage, refresh: refreshHistory } = useHistory();
  const pageRef = useRef(1);

  useEffect(() => {
    if (pageRef.current !== 1) {
      setPage(1);
    } else {
      refreshHistory();
    }
  }, [refresh]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  return (
    <div className="w-full text-white mt-[30px]">
      {/* Header */}
      <div className="text-[24px] mb-[20px] font-CherryBomb">
      GAMES PLAYED: {total}
      </div>

      {/* Table */}
      <div className="">
        <GridTable
          className=""
          headerRowClassName="!px-[10px]"
          bodyRowClassName="bg-[#82544588] hover:bg-[#6A4D3D] transition-colors !rounded-[15px] !mb-[10px]"
          bodyRowStyle={(record: any) => {
            if (record.reward_type === 0) {
              return {}
            }
            return {
              border: "2px solid #FFCF23",
              background: "linear-gradient(90deg, rgba(130, 84, 69, 0.5) 0%, rgba(28, 18, 15, 0.5) 100%)",
            };
          }}
          bodyClassName="!px-0 font-normal"
          colClassName=""
          rowClassName=""
          headerClassName="text-white text-[16px] mb-[10px]"
          emptyClassName="opacity-70"
          emptyTextClassName="!text-white"
          loadingClassName="!text-white"
          columns={[
            {
              dataIndex: "rewards",
              title: "Rewards",
              width: 120,
              render: (record: any, index: number) => {
                if (!record.token_address) {
                  return <div className="text-[16px] !text-white">-</div>
                }
                return (
                  <div className="flex items-center justify-center pl-[10px]">
                    <img
                      src={record.token_id ? getNftImgUrl(record.token_address?.toLowerCase(), record.token_id) : tokenMap[record.token_address?.toLowerCase()]}
                      alt={record.reward_type}
                      className={'w-[32px] h-[32px] object-cover ' + (record.reward_type === 1 ? "rounded-[8px] border-2 border-[#FFCF23]" : "rounded-full")}
                    />
                  </div>
                );
              },
            },
            {
              dataIndex: "amount",
              title: "Amount",
              width: 300,
              render: (record: any) => {
                if (!record.token_address) {
                  return <div className="text-[16px] !text-white">-</div>
                }
                return (
                  <div className="text-[16px] !text-white">
                    <span className="font-bold">{record.token_amount || '-'}</span> {tokenNameMap[record.token_address?.toLowerCase()]} {record.reward_type === 1 ? `#${record.token_id}` : ''}
                  </div>
                );
              },
            },
            {
              dataIndex: "cost",
              title: "Cost",
              width: 200,
              render: (record: any) => {
                return (
                  <div className="text-[16px] !text-white">
                    {record.bet_amount} BERA
                  </div>
                );
              },
            },
            {
              dataIndex: "tx_time",
              title: "Time",
              render: (record: any) => {
                return (
                  <div className="text-[16px] !text-white">
                    {dayjs(record.tx_time * 1000).format("YYYY/MM/DD HH:mm")}
                  </div>
                );
              },
            },
            {
              dataIndex: "action",
              title: "Action",
              width: 100,
              render: (record: any) => {
                if (!record.end_tx_hash) {
                  return <div className="text-[16px] !text-white">-</div>
                }

                return (
                  <Link
                    href={`${berachain.blockExplorers.default.url}/tx/${record.end_tx_hash}`}
                    target="_blank"
                    rel="noreferrer nofollow noopener"
                    className="!text-white underline text-[16px]"
                    onClick={() => {
                      playClickSound();
                    }}
                  >
                    View
                  </Link>
                );
              },
            },
          ]}
          data={historyList}
          loading={historyListLoading}
        />

        {/* Pagination */}
        <div className="flex justify-end items-center">
          <Pagination
            page={page}
            totalPage={totalPage}
            pageSize={pageSize}
            onPageChange={(_page: number) => {
              setPage(_page);
            }}
            className="!text-white"
          />
        </div>
      </div>
    </div>
  );
}

