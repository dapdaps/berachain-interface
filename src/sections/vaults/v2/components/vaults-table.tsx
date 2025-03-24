import clsx from 'clsx';
import FlexTable from '@/components/flex-table';
import { numberFormatter } from '@/utils/number-formatter';
import Big from 'big.js';

const VaultsTable = (props: any) => {
  const { className } = props;

  const list = [
    {
      tokens: [
        {
          icon: "/assets/tokens/honey.svg",
          symbol: "HONEY",
          decimals: 18,
        },
        {
          icon: "/assets/tokens/usdc.png",
          symbol: "USDC.e",
          decimals: 6,
        },
      ],
      protocol: "Hub",
      tvl: "308320000",
      apy: "0.16",
      rewards: [
        {
          address: "0x46eFC86F0D7455F135CC9df501673739d513E982",
          decimals: 18,
          symbol: "iBGT",
          name: "Infrared BGT",
          icon: "/assets/tokens/ibgt.png",
          apy: "11.42",
        },
        {
          address: "0xbaadcc2962417c01af99fb2b7c75706b9bd6babe",
          symbol: "LBGT",
          name: "Liquid BGT",
          decimals: 18,
          icon: "/assets/tokens/lbgt.png",
          apy: "14.55",
        },
      ],
      balance: "20.34",
    },
  ];

  const columns = [
    {
      title: "Vaults",
      dataIndex: "vaults",
      width: 300,
      render: (text: any, record: any, index: any) => {
        return (
          <div className="w-full flex items-center gap-[5px]">
            <div className="flex items-center shrink-0">
              {
                record.tokens.map((tk: any, idx: number) => (
                  <img
                    key={idx}
                    src={tk.icon}
                    alt=""
                    className="shrink-0 w-[26px] h-[26px] rounded-full"
                    style={{
                      transform: idx > 0 ? "translateX(-6px)" : ""
                    }}
                  />
                ))
              }
            </div>
            <div className="flex flex-col gap-[1px]">
              <div className="text-[16px]">
                {record.tokens.map((tk: any) => tk.symbol).join("-")}
              </div>
              <div className="text-[12px]">
                {record.protocol}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "TVL",
      dataIndex: "tvl",
      sort: true,
      render: (text: any, record: any, index: any) => {
        return numberFormatter(record.tvl, 2, true, { prefix: "$", isShort: true, isShortUppercase: true })
      },
    },
    {
      title: "APY",
      dataIndex: "apy",
      sort: true,
      render: (text: any, record: any, index: any) => {
        let totalApy = Big(record.apy || 0);
        if (record.rewards) {
          record.rewards.forEach((reward: any) => {
            totalApy = totalApy.plus(Big(reward.apy || 0));
          });
        }
        return (
          <div className="underline decoration-dashed underline-offset-4 cursor-pointer">
            {
              numberFormatter(totalApy, 2, true) + "%"
            }
          </div>
        );
      },
    },
    {
      title: "Rewards",
      dataIndex: "rewards",
      render: (text: any, record: any, index: any) => {},
    },
    {
      title: "Yours",
      dataIndex: "yours",
      sort: true,
      render: (text: any, record: any, index: any) => {},
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any, index: any) => {},
    },
  ];

  return (
    <div className={clsx("text-[20px] text-black leading-[90%] font-[600] font-Montserrat mt-[20px] w-full", className)}>
      <FlexTable
        columns={columns}
        list={list}
        headClass="px-[11px] py-[8px] text-[14px] font-[500] text-[#3D405A]"
        bodyClass="text-[16px] font-[500]"
      />
    </div>
  );
};

export default VaultsTable;
