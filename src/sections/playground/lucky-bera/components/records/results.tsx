import GridTable from "@/components/flex-table/grid-table";
import useCustomAccount from "@/hooks/use-account";
import { get } from "@/utils/http";
import { useRequest } from "ahooks";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { SPIN_CATEGORIES, SpinCategory } from "../../config";
import { numberFormatter } from "@/utils/number-formatter";
import { useState } from "react";
import Pagination from "@/components/pager/pagination";
import { useLuckyBeraRecordsStore } from "./store";

dayjs.extend(utc);

const LuckyBeraResults = (props: any) => {
  const { className } = props;

  const { accountWithAk } = useCustomAccount();
  const {
    resultsPage: page,
    setResultsPage: setPage,
    resultsWinOnly: winOnly,
    setResultsWinOnly: setWinOnly,
  } = useLuckyBeraRecordsStore();

  const [pageSize] = useState(10);
  const [pageTotal, setPageTotal] = useState(1);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (record: any, idx: number) => {
        return dayjs.utc(record.created_at).format("YYYY/M/D HH:mm");
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
          return (
            <div className="opacity-30">0</div>
          );
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

  const { data, loading, runAsync: getData } = useRequest(async () => {
    if (!accountWithAk) {
      return [];
    }
    const res = await get("/api/go/game/777/draw/records", {
      page: page,
      page_size: pageSize,
      win_only: winOnly ? "1" : "",
    });
    if (res.code !== 200) {
      return [];
    }
    setPageTotal(res.data.total_page);
    return res.data.data;
  }, {
    refreshDeps: [accountWithAk, page, pageSize, winOnly],
  });

  return (
    <motion.div
      className="w-full relative"
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
      <button
        type="button"
        className="!hidden absolute right-[20px] top-[-40px] flex items-center gap-[8px] text-[#532] font-montserrat text-[14px] not-italic font-medium leading-[14px]"
        onClick={() => {
          const _winOnly = !winOnly;
          setPage(1);
          setWinOnly(_winOnly);
        }}
      >
        <div className="w-[20px] h-[20px] rounded-full overflow-hidden border border-[#373A53] bg-white p-[2px]">
          {
            winOnly && (
              <div className="w-full h-full rounded-full bg-[#FFDC50] border border-[#373A53]"></div>
            )
          }
        </div>
        <div className="">Win only</div>
      </button>
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

export default LuckyBeraResults;
