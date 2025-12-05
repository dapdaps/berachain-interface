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

interface HistoryRecord {
  id: number;
  reward_type: string;
  reward_amount: number;
  cost: number;
  time: number;
  tx_hash: string;
  reward_icon: string;
  is_nft?: boolean;
}

const DefaultHistoryList: {
  data: HistoryRecord[];
  page: number;
  pageSize: number;
  pageTotal: number;
  total: number;
} = {
  data: [],
  page: 1,
  pageSize: 10,
  pageTotal: 0,
  total: 0,
};

const mockData = [
  {
    id: 1,
    reward_type: "BERA",
    reward_amount: 2.354,
    cost: 1,
    time: 1700387160,
    tx_hash: "0x1234567890abcdef",
    reward_icon: "/assets/tokens/bera.svg",
  },
  {
    id: 2,
    reward_type: "BERA",
    reward_amount: 0.742,
    cost: 1,
    time: 1700387160,
    tx_hash: "0x1234567890abcdef",
    reward_icon: "/assets/tokens/bera.svg",
  },
  {
    id: 3,
    reward_type: "BERA",
    reward_amount: 1.235,
    cost: 1,
    time: 1700387160,
    tx_hash: "0x1234567890abcdef",
    reward_icon: "/assets/tokens/bera.svg",
  },
  {
    id: 4,
    reward_type: "BERA",
    reward_amount: 12.672,
    cost: 20,
    time: 1700387160,
    tx_hash: "0x1234567890abcdef",
    reward_icon: "/assets/tokens/bera.svg",
  },
  {
    id: 5,
    reward_type: "BERA",
    reward_amount: 19.047,
    cost: 20,
    time: 1700387160,
    tx_hash: "0x1234567890abcdef",
    reward_icon: "/assets/tokens/bera.svg",
  },
  {
    id: 6,
    reward_type: "Mibera",
    reward_amount: 1,
    cost: 20,
    time: 1700387160,
    tx_hash: "0x1234567890abcdef",
    reward_icon: "/images/treasure-book/reward/nft-mibera.png",
    is_nft: true,
  },
  {
    id: 7,
    reward_type: "BERA",
    reward_amount: 2.354,
    cost: 20,
    time: 1700387160,
    tx_hash: "0x1234567890abcdef",
    reward_icon: "/assets/tokens/bera.svg",
  },
];

export default function History() {
  const { accountWithAk } = useCustomAccount();

  const [historyList, setHistoryList] = useState(cloneDeep(DefaultHistoryList));

  const { runAsync: getHistoryList, loading: historyListLoading } = useRequest(
    async (params?: any) => {
      if (!accountWithAk) {
        setHistoryList(cloneDeep(DefaultHistoryList));
        return;
      }

      const _page = params?.page || historyList.page;

      // try {
      //   const res = await get("/api/go/game/gacha/records", {
      //     page: _page,
      //     page_size: historyList.pageSize,
      //   });
      //   if (res.code !== 200) {
      //     return;
      //   }
      //   setHistoryList((prev) => {
      //     const _historyList = { ...prev };
      //     _historyList.data = res.data.data || [];
      //     if (_page === 1) {
      //       _historyList.pageTotal = res.data.total_page;
      //       _historyList.total = res.data.total;
      //     }
      //     return _historyList;
      //   });
      // } catch (error) {
      //   console.log("get gacha records failed: %o", error);
      // }

      setHistoryList({
        data: mockData,
        page: _page,
        pageSize: 10,
        pageTotal: 6,
        total: 7,
      });
    },
    {
      refreshDeps: [accountWithAk],
    }
  );

  const onHistoryListPageChange = (page: number) => {
    setHistoryList((prev) => {
      const _historyList = { ...prev };
      _historyList.page = page;
      return _historyList;
    });
    getHistoryList({ page });
  };

  return (
    <div className="w-full text-white mt-[30px]">
      {/* Header */}
      <div className="text-[24px] mb-[20px] font-CherryBomb">
          Total Played {historyList.total}
      </div>

      {/* Table */}
      <div className="">
        <GridTable
          className=""
          headerRowClassName="!px-[10px]"
          bodyRowClassName="bg-[#82544588] hover:bg-[#6A4D3D] transition-colors !rounded-[15px] !mb-[10px]"
          bodyClassName="!px-0 font-normal max-h-[600px] overflow-y-auto"
          colClassName=""
          headerClassName="text-white text-[16px] mb-[10px]"
          columns={[
            {
              dataIndex: "rewards",
              title: "Rewards",
              width: 120,
              render: (record: any, index: number) => {
                return (
                  <div className="flex items-center justify-center pl-[10px]">
                      <Image
                        src={record.reward_icon}
                        alt={record.reward_type}
                        width={32}
                        height={32}
                        className={record.is_nft ? "" : "rounded-full"}
                      />
                  </div>
                );
              },
            },
            {
              dataIndex: "amount",
              title: "Amount",
              render: (record: any) => {
                return (
                  <div className="text-[16px] !text-white">
                    <span className="font-bold">{record.reward_amount}</span> {record.reward_type}
                  </div>
                );
              },
            },
            {
              dataIndex: "cost",
              title: "Cost",
              render: (record: any) => {
                return (
                  <div className="text-[16px] !text-white">
                    {record.cost} BERA
                  </div>
                );
              },
            },
            {
              dataIndex: "time",
              title: "Time",
              render: (record: any) => {
                return (
                  <div className="text-[16px] !text-white">
                    {dayjs(record.time * 1000).format("YYYY/MM/DD HH:mm")}
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
          data={historyList.data}
          loading={historyListLoading}
        />

        {/* Pagination */}
        <div className="flex justify-end items-center">
          <Pagination
            page={historyList.page}
            totalPage={historyList.pageTotal}
            pageSize={historyList.pageSize}
            onPageChange={(_page: number) => {
              onHistoryListPageChange(_page);
            }}
            className="!text-white"
          />
        </div>
      </div>
    </div>
  );
}

