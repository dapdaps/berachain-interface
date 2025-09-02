import GridTable from "@/components/flex-table/grid-table";
import useCustomAccount from "@/hooks/use-account";
import { get } from "@/utils/http";
import { useRequest } from "ahooks";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { SPIN_CATEGORIES, SpinCategory } from "../../config";
import { numberFormatter } from "@/utils/number-formatter";
import { useState } from "react";
import Pagination from "@/components/pager/pagination";

const LuckyBeraResults = (props: any) => {
  const { className } = props;

  const { accountWithAk } = useCustomAccount();

  const [page, setPage] = useState(1);
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
      title: "Consumption",
      dataIndex: "consumption",
      width: 200,
      render: (record: any, idx: number) => {
        return `x${record.spin}`;
      },
    },
    {
      title: "Result",
      dataIndex: "result",
      width: 100,
      render: (record: any, idx: number) => {
        const currentReward = SPIN_CATEGORIES[record.category as SpinCategory];
        if (!currentReward) {
          return "0";
        }
        return (
          <div className="flex items-center gap-[5px]">
            <img
              src={currentReward.icon}
              alt=""
              className="w-[25px] h-[25px] shrink-0 object-center object-contain"
            />
            <div className="">
              x{numberFormatter(record.amount, 0, true)}
            </div>
          </div>
        );
      },
    },
  ];

  const { data, loading } = useRequest(async () => {
    if (!accountWithAk) {
      return [];
    }
    const res = await get("/api/go/game/777/draw/records", {
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
        x: -50,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -50,
      }}
    >
      <GridTable
        columns={columns}
        data={data}
        loading={loading}
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

export default LuckyBeraResults;
