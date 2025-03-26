import clsx from "clsx";
import FlexTable from "@/components/flex-table";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import {
  APY,
  DepositButton,
  Rewards,
  TVL,
  Vaults,
  WithdrawButton,
  Yours
} from "@/sections/vaults/v2/components/vaults-table/columns";
import { OrderKeys } from "@/sections/vaults/v2/config";

const VaultsTable = (props: any) => {
  const { className } = props;

  const {
    listData,
    listLoading,
    listOrderDirection,
    listOrderKey,
    toggleListOrder
  } = useVaultsV2Context();

  const columns: any[] = [
    {
      title: "Vaults",
      dataIndex: "vaults",
      width: 280,
      render: (text: any, record: any, index: any) => {
        return <Vaults record={record} index={index} />;
      }
    },
    {
      title: "TVL",
      dataIndex: "tvl",
      render: (text: any, record: any, index: any) => {
        return <TVL record={record} index={index} />;
      }
    },
    {
      title: "APY",
      dataIndex: "apy",
      render: (text: any, record: any, index: any) => {
        return <APY record={record} index={index} />;
      }
    },
    {
      title: "Rewards",
      dataIndex: "reward_tokens",
      width: 160,
      render: (text: any, record: any, index: any) => {
        if (!record.reward_tokens) return null;
        return <Rewards record={record} index={index} />;
      }
    },
    {
      title: "Yours",
      dataIndex: "yours",
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
  ].map((c) => ({
    ...c,
    sort: Object.keys(OrderKeys).some((o) => o === c.dataIndex)
  }));

  return (
    <div
      className={clsx(
        "text-[20px] text-black leading-[90%] font-[600] font-Montserrat w-full",
        className
      )}
    >
      <FlexTable
        columns={columns}
        list={listData}
        loading={listLoading}
        sortDataIndex={listOrderKey}
        sortDataDirection={listOrderDirection === "asc" ? -1 : 1}
        wrapperClass="h-full"
        headClass="px-[11px] py-[8px] text-[14px] font-[500] text-[#3D405A]"
        bodyClass="text-[16px] font-[500] !py-[13px] !pl-[11px] !pr-[14px]"
        bodyClassName="max-h-[calc(100%_-_34px)] overflow-y-auto"
        onChangeSortDataIndex={toggleListOrder}
      />
    </div>
  );
};

export default VaultsTable;
