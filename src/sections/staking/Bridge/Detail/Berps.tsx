import LazyImage from '@/components/layz-image';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import FlexTable from '@/components/flex-table';
import React, { useState } from 'react';
import { numberFormatter } from '@/utils/number-formatter';

const DetailBerps = (props: any) => {
  const { data } = props;

  console.log(data);
  const { depositToken, withdrawToken } = data;

  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      width: "30%",
      render: (text: string, record: any) => {
        return (
          <div className="flex items-center gap-[8px]">
            <LazyImage src={record?.icon} alt={record?.symbol} width={20} height={20} />
            <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">
              {numberFormatter(record?.amount, 2, true)}
            </div>
          </div>
        );
      },
    },
    {
      title: "Unlock Epoch",
      dataIndex: "unlockEpoch",
      width: "30%",
      render: (text: string, record: any) => {
        return numberFormatter(record.unlockEpoch, 0, true);
      },
    },
    {
      title: "",
      dataIndex: "action",
      width: "30%",
      render: (text: string, record: any) => {
        return (
          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              className="border text-[12px] font-normal border-black rounded-[36px] h-[36px] bg-[#FFDC50] px-[8px] disabled:opacity-30 disabled:cursor-not-allowed"
              disabled
            >
              Withdraw
            </button>
            <button
              type="button"
              className="border text-[12px] font-normal border-black rounded-[36px] h-[36px] bg-[#FFF] px-[8px] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        );
      },
    },
  ];
  const list = [
    {
      amount: 0.01,
      symbol: 'bHONEY',
      icon: '/images/icon-coin.svg',
      unlockEpoch: 314,
    },
  ];

  return (
    <div className="flex-1 pr-[24px] pl-[13px] py-[24px] rounded-[10px] bg-black/[0.06]">
      <div className="grid grid-cols-2 gap-[15px]">
        <Item
          label={`Total ${depositToken?.symbol} Value`}
          value={(
            <>
              <LazyImage src={depositToken?.icon} width={20} height={20} />
              <span>1.50</span>
            </>
          )}
        />
        <Item
          label="Est. Earnings"
          value={(
            <>
              <LazyImage src={depositToken?.icon} width={20} height={20} />
              <span>0.46</span>
            </>
          )}
          tooltip={`Estimated earnings = ${withdrawToken?.symbol} balance (including cooldown amount) market value + total ${depositToken?.symbol} withdrawn - total ${depositToken?.symbol} deposited`}
        />
        <Item
          label={`${withdrawToken?.symbol} Balance`}
          value={(
            <>
              <LazyImage src={withdrawToken?.icon} width={20} height={20} />
              <span>1.53</span>
            </>
          )}
          tooltip={`Total ${withdrawToken?.symbol} including the amount in cooldown`}
        />
        <Item
          label="Cooldown"
          value={(
            <>
              <LazyImage src={withdrawToken?.icon} width={20} height={20} />
              <span>0.01</span>
            </>
          )}
          tooltip={`This amount of ${withdrawToken?.symbol} is non-transferable until the withdrawal is processed. You won't be able to transfer it during this time.`}
        />
      </div>
      <div className="mt-[20px]">
        <div className="font-Montserrat text-[20px] font-semibold leading-[90%]">
          Withdrawal Queue
        </div>
        <FlexTable
          loading={loading}
          columns={columns}
          list={list}
        />
      </div>
    </div>
  );
};

export default DetailBerps;

const Item = (props: any) => {
  const { label, value, tooltip } = props;

  return (
    <div className="rounded-[10px] bg-[#FFDC50] py-[15px] px-[20px]">
      <Popover
        content={tooltip ? (
          <div className="rounded-[20px] border border-black bg-[#FFFDEB] shadow-shadow1 p-[5px_10px] max-w-[300px]">{tooltip}</div>
        ) : void 0}
        trigger={PopoverTrigger.Hover}
        placement={PopoverPlacement.TopLeft}
      >
        <div className={`text-[#3D405A] font-Montserrat text-[14px] font-medium ${tooltip ? 'underline decoration-dashed cursor-pointer' : ''}`}>
          {label}
        </div>
      </Popover>
      <div className="flex items-center gap-[10px] mt-[5px] text-black font-Montserrat text-[20px] font-semibold leading-[90%] whitespace-nowrap">
        {value}
      </div>
    </div>
  );
};
