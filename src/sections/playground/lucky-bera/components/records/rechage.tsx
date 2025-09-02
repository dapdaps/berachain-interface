import GridTable from "@/components/flex-table/grid-table";
import Pagination from "@/components/pager/pagination";
import useCustomAccount from "@/hooks/use-account";
import { get } from "@/utils/http";
import { numberFormatter } from "@/utils/number-formatter";
import { useRequest } from "ahooks";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLuckyBeraRecordsStore } from "./store";

const LuckyBeraRechage = (props: any) => {
  const { className } = props;

  const { accountWithAk } = useCustomAccount();
  const {
    rechargePage: page,
    setRechargePage: setPage,
  } = useLuckyBeraRecordsStore();

  const [pageSize, setPageSize] = useState(10);
  const [pageTotal, setPageTotal] = useState(1);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (record: any, idx: number) => {
        return dayjs(record.created_at).format("YYYY/M/D HH:mm");
      },
    },
    {
      title: "Rechaged",
      dataIndex: "rchaged",
      width: 200,
      render: (record: any, idx: number) => {
        return `${record.amount} Bera`;
      },
    },
    {
      title: "Result",
      dataIndex: "result",
      width: 100,
      render: (record: any, idx: number) => {
        return (
          <div className="flex items-center gap-[10px]">
            <img
              src="/images/playground/lucky-bera/icon-checked.svg"
              alt=""
              className="w-[19px] h-[14px] shrink-0"
            />
            <a
              className="block w-[15px] h-[15px] bg-[url('/images/playground/lucky-bera/icon-share.svg')] bg-no-repeat bg-center bg-contain"
              rel="noreferrer noopener nofollow"
              target="_blank"
              href={`https://berascan.com/tx/${record.tx_hash}`}
            />
          </div>
        );
      },
    },
  ];

  const { data, loading } = useRequest(async () => {
    if (!accountWithAk) {
      return [];
    }
    const res = await get("/api/go/game/777/purchase/records", {
      page: page,
      page_size: pageSize,
    });
    if (res.code !== 200) {
      return [];
    }
    setPageTotal(res.data.total_page);
    return res.data.data;
  }, {
    refreshDeps: [accountWithAk, page, pageSize],
  });

  return (
    <motion.div
      className="w-full"
      initial={{
        opacity: 0,
        x: 50,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: 50,
      }}
    >
      <GridTable
        columns={columns}
        data={data}
        loading={loading}
        bodyClassName="min-h-[438px]"
      />
      <Pagination
        className="justify-end pr-[25px] mt-[18px]"
        page={page}
        totalPage={pageTotal}
        pageSize={pageSize}
        onPageChange={(_page: number) => {
          setPage(_page);
        }}
      />
    </motion.div>
  );
};

export default LuckyBeraRechage;
