import clsx from "clsx";
import FlexTable from "@/components/flex-table";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import {
  APY,
  DepositButton, Pool,
  Rewards,
  TVL,
  Vaults,
  WithdrawButton,
  Yours
} from '@/sections/vaults/v2/components/vaults-table/columns';
import { ORDER_DIRECTION, OrderKeys } from '@/sections/vaults/v2/config';
import Pagination from "@/sections/vaults/v2/components/pagination";
import { useMemo } from 'react';

const VaultsTable = (props: any) => {
  const { className } = props;

  const {
    listDataGroupByPool,
    listLoading,
    listOrderKeys,
    toggleListOrder
  } = useVaultsV2Context();

  const VaultsWidth = useMemo(() => {
    const maxIconLength = listDataGroupByPool
      .reduce((max: any, item: any) => Math.max(max, item.protocolIcon.length), 0);

    if (maxIconLength <= 2) return 60;
    if (maxIconLength === 3) return 75;
    if (maxIconLength === 4) return 90;
    return 100;
  }, [listDataGroupByPool]);

  const columns: any[] = [
    {
      title: "Vaults",
      dataIndex: "vaults",
      width: VaultsWidth,
      render: (text: any, record: any, index: any) => {
        return <Vaults record={record} index={index} />;
      }
    },
    {
      title: "Pool",
      dataIndex: "pool",
      width: 215,
      render: (text: any, record: any, index: any) => {
        return <Pool record={record} index={index} />;
      }
    },
    {
      title: "TVL",
      dataIndex: "tvl",
      width: 100,
      render: (text: any, record: any, index: any) => {
        return <TVL record={record} index={index} />;
      }
    },
    {
      title: "APR",
      dataIndex: "totalApy",
      width: 160,
      render: (text: any, record: any, index: any) => {
        return <APY record={record} index={index} />;
      }
    },
    {
      title: "Rewards",
      dataIndex: "reward_tokens",
      width: 110,
      render: (text: any, record: any, index: any) => {
        if (!record.reward_tokens) return null;
        return <Rewards record={record} index={index} />;
      }
    },
    {
      title: "Yours",
      dataIndex: "balance",
      width: 90,
      render: (text: any, record: any, index: any) => {
        return <Yours record={record} index={index} />;
      }
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 75,
      render: (text: any, record: any, index: any) => {
        return (
          <div className="flex justify-end items-center gap-[10px]">
            <DepositButton record={record} index={index} />
            <WithdrawButton record={record} index={index} />
          </div>
        );
      }
    }
  ].map((c) => {
    return {
      ...c,
      renderTitle: (column: any, columnIdx: any) => {
        const isCustomSort = Object.keys(OrderKeys).some((o) => o === column.dataIndex);
        if (isCustomSort) {
          const currentOrder = listOrderKeys.find((k) => k.value === column.dataIndex);
          return (
            <div className="flex items-center gap-[5px]">
              {column.title}
              <button
                type="button"
                className={clsx(
                  "bg-[url('/images/vaults/v2/triangle.svg')] bg-no-repeat bg-center bg-contain w-[14px] h-[14px] transition-all duration-300",
                  currentOrder?.direction === ORDER_DIRECTION.ASC ? "rotate-180" : "",
                  currentOrder?.value === listOrderKeys[0]?.value ? "opacity-100" : "opacity-50",
                )}
                onClick={() => {
                  toggleListOrder(column.dataIndex);
                }}
              />
            </div>
          );
        }
        return column.title;
      }
    };
  });

  return (
    <div
      className={clsx(
        "text-[20px] text-black leading-[90%] font-[600] font-Montserrat w-full",
        className
      )}
    >
      <FlexTable
        columns={columns}
        list={listDataGroupByPool}
        loading={listLoading}
        wrapperClass="h-full"
        headClass="px-[11px] py-[8px] text-[14px] font-[500] text-[#3D405A]"
        bodyClass="text-[16px] font-[500] !py-[13px] !pl-[11px] !pr-[14px]"
        bodyClassName=""
        pagination={<Pagination />}
      />
    </div>
  );
};

export default VaultsTable;
