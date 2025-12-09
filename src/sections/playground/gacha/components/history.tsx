"use client";

import GridTable from "@/components/flex-table/grid-table";
import Pagination from "@/components/pager/pagination";
import useCustomAccount from "@/hooks/use-account";
import { get } from "@/utils/http";
import { useRequest } from "ahooks";
import dayjs from "dayjs";
import { cloneDeep } from "lodash";
import Link from "next/link";
import { useState } from "react";
import { berachain } from "viem/chains";
import Image from "next/image";
import useHistory from "../hooks/use-history";
import { TOKEN_MAP } from "../config";


const COST_MAP: any = {
  0: 1,
  1: 20,
  2: 50,
};



export default function History() {
  const { data: historyList, loading: historyListLoading, page, pageSize, totalPage, total, setPage, refresh } = useHistory();

  return (
    <div className="w-full text-white mt-[30px]">
      {/* Header */}
      <div className="text-[24px] mb-[20px] font-CherryBomb">
          Total Played {total}
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
          columns={[
            {
              dataIndex: "rewards",
              title: "Rewards",
              width: 120,
              render: (record: any, index: number) => {
                return (
                  <div className="flex items-center justify-center pl-[10px]">
                      <Image
                        src={TOKEN_MAP[record.token_address?.toLowerCase()]}
                        alt={record.reward_type}
                        width={32}
                        height={32}
                        className={record.reward_type === 1 ? "" : "rounded-full"}
                      />
                  </div>
                );
              },
            },
            {
              dataIndex: "amount",
              title: "Amount",
              width: 200,
              render: (record: any) => {
                return (
                  <div className="text-[16px] !text-white">
                    <span className="font-bold">{record.token_amount}</span> {record.reward_type === 0 ? "BERA" : "NFT"}
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
                return (
                  <Link
                    href={`${berachain.blockExplorers.default.url}/tx/${record.tx_hash}`}
                    target="_blank"
                    rel="noreferrer nofollow noopener"
                    className="!text-white underline text-[16px]"
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

