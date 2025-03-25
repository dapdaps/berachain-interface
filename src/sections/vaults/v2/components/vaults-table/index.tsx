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
} from '@/sections/vaults/v2/components/vaults-table/columns';

const VaultsTable = (props: any) => {
  const { className } = props;

  const { listData, listLoading } = useVaultsV2Context();

  const columns = [
    {
      title: "Vaults",
      dataIndex: "vaults",
      width: 280,
      render: (text: any, record: any, index: any) => {
        return (
          <Vaults record={record} index={index} />
        );
      }
    },
    {
      title: "TVL",
      dataIndex: "tvl",
      sort: true,
      render: (text: any, record: any, index: any) => {
        return (
          <TVL record={record} index={index} />
        );
      }
    },
    {
      title: "APY",
      dataIndex: "apy",
      sort: true,
      render: (text: any, record: any, index: any) => {
        return (
          <APY record={record} index={index} />
        );
      }
    },
    {
      title: "Rewards",
      dataIndex: "rewards",
      width: 160,
      render: (text: any, record: any, index: any) => {
        if (!record.rewards) return null;
        return (
          <Rewards record={record} index={index} />
        );
      }
    },
    {
      title: "Yours",
      dataIndex: "yours",
      sort: true,
      render: (text: any, record: any, index: any) => {
        return (
          <Yours record={record} index={index} />
        );
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
            <WithdrawButton record={record} index={index} disabled />
          </div>
        );
      }
    }
  ];

  return (
    <div
      className={clsx(
        "text-[20px] text-black leading-[90%] font-[600] font-Montserrat mt-[20px] w-full",
        className
      )}
    >
      <FlexTable
        columns={columns}
        list={listData}
        loading={listLoading}
        headClass="px-[11px] py-[8px] text-[14px] font-[500] text-[#3D405A]"
        bodyClass="text-[16px] font-[500] !py-[13px] !pl-[11px] !pr-[14px]"
      />
    </div>
  );
};

export default VaultsTable;
