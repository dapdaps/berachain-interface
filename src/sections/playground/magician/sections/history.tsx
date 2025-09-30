import Card from "@/components/card";
import GridTable from "@/components/flex-table/grid-table";
import Modal from "@/components/modal";
import Pagination from "@/components/pager/pagination";
import useCustomAccount from "@/hooks/use-account";
import { get } from "@/utils/http";
import { numberFormatter } from "@/utils/number-formatter";
import { useRequest } from "ahooks";
import dayjs from "dayjs";
import { cloneDeep } from "lodash";
import Link from "next/link";
import { useState } from "react";
import { berachain } from "viem/chains";
import { HistoryAction, HistoryActionMap } from "../config";
import clsx from "clsx";

const HistoryModal = (props: any) => {
  const { open, onClose } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Card className="w-[700px] ">
        <History {...props} />
      </Card>
    </Modal>
  );
};

export default HistoryModal;

const DefaultHistoryList = {
  data: [],
  page: 1,
  pageSize: 10,
  pageTotal: 0,
  total: 0,
};

const History = (props: any) => {
  const { } = props;

  const { accountWithAk } = useCustomAccount();

  const [historyList, setHistoryList] = useState(cloneDeep(DefaultHistoryList));

  const { runAsync: getHistoryList, loading: historyListLoading } = useRequest(async (params?: any) => {
    if (!accountWithAk) {
      setHistoryList(cloneDeep(DefaultHistoryList));
      return;
    }

    const _page = params?.page || historyList.page;

    try {
      const res = await get("/api/go/game/rps/records", {
        page: _page,
        page_size: historyList.pageSize,
      });
      if (res.code !== 200) {
        return;
      }
      setHistoryList((prev) => {
        const _userList = { ...prev };
        _userList.data = res.data.data || [];
        if (_page === 1) {
          _userList.pageTotal = res.data.total_page;
          _userList.total = res.data.total;
        }
        return _userList;
      });
    } catch (error) {
      console.log("get user records failed: %o", error);
    }
  }, {
    refreshDeps: [accountWithAk],
  });

  const onHistoryListPageChange = (page: number) => {
    setHistoryList((prev) => {
      const _historyList = { ...prev };
      _historyList.page = page;
      return _historyList;
    });
    getHistoryList({ page });
  };

  return (
    <div className="w-full text-black font-[600] leading-[100%]">
      <div className="text-[20px] font-[700]">History</div>
      <div className="mt-[20px]">
        <GridTable
          className=""
          headerRowClassName="!px-[5px]"
          bodyRowClassName="odd:bg-[#FFFDEB]"
          bodyClassName="!px-0 max-h-[75dvh] overflow-y-auto"
          colClassName=""
          columns={[
            {
              dataIndex: "Action",
              title: "Action",
              width: 200,
              render: (record: any) => {
                return HistoryActionMap[record.game_category as HistoryAction].name;
              },
            },
            {
              dataIndex: "bet_amount",
              title: "BERA",
              // width: 130,
              sort: true,
              render: (record: any) => {
                const category = HistoryActionMap[record.game_category as HistoryAction];
                return (
                  <div className={clsx("flex items-center gap-[6px]", category.isIncome ? "text-[#7EA82B]" : "")}>
                    {
                      numberFormatter(
                        record.amount,
                        3,
                        true,
                        {
                          isShort: true,
                          isZeroPrecision: false,
                          prefix: category.isIncome ? "+" : "",
                        })}
                  </div>
                );
              },
            },
            {
              dataIndex: "create_time",
              title: "Time",
              width: 180,
              sort: true,
              render: (record: any) => {
                return (
                  <div className="flex items-center gap-[10px]">
                    <div className="">
                      {dayjs(record.create_time * 1000).utc().format("YYYY/M/D HH:mm")}
                    </div>
                    <Link
                      href={`${berachain.blockExplorers.default.url}/tx/${record.tx_hash}`}
                      target="_blank"
                      rel="noreferrer nofollow noopener"
                      className="block w-[16px] h-[16px] shrink-0 bg-[url('/images/playground/magician/icon-share.png')] bg-center bg-no-repeat bg-[length:10px_10px]"
                    />
                  </div>
                );
              },
            },
          ]}
          data={historyList.data}
          loading={historyListLoading}
        />
        <div className="flex justify-end items-center pt-[10px]">
          <Pagination
            page={historyList.page}
            totalPage={historyList.pageTotal}
            pageSize={historyList.pageSize}
            onPageChange={(_page: number) => {
              onHistoryListPageChange(_page);
            }}
          />
        </div>
      </div>
    </div>
  );
};

