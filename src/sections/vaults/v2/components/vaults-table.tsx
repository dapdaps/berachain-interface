import clsx from 'clsx';
import FlexTable from '@/components/flex-table';
import { numberFormatter } from '@/utils/number-formatter';
import Big from 'big.js';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import Card from '@/components/card';
import LazyImage from '@/components/layz-image';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import { ACTION_TYPE } from '@/sections/vaults/v2/config';

const VaultsTable = (props: any) => {
  const { className } = props;

  const {
    toggleActionVisible,
    toggleClaimVisible,
  } = useVaultsV2Context();

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
          claim: "2999999.123",
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
      protocol: "Berps",
      tvl: "30800",
      apy: "0.30",
      balance: "20.34",
    },
  ];

  const columns = [
    {
      title: "Vaults",
      dataIndex: "vaults",
      width: 280,
      render: (text: any, record: any, index: any) => {
        return (
          <div className="w-full flex items-center gap-[5px]">
            <div className="flex items-center shrink-0">
              {
                record.tokens.map((tk: any, idx: number) => (
                  <LazyImage
                    key={idx}
                    src={tk.icon}
                    alt=""
                    width={26}
                    height={26}
                    containerClassName="shrink-0 rounded-full overflow-hidden"
                    containerStyle={{
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
          <Popover
            triggerContainerClassName="inline-block"
            content={(
              <Card className="!rounded-[10px] !bg-white !p-[18px_14px] !text-[14px] font-[500]">
                <div className="w-full flex flex-col gap-[20px]">
                  <div className="w-full flex justify-between items-center gap-[10px]">
                    <div className="">Pool APY</div>
                    <div className="">
                      {numberFormatter(record.apy, 2, true)}%
                    </div>
                  </div>
                  {
                    record.rewards && record.rewards.length > 0 && (
                      record.rewards.map((reward: any, idx: number) => (
                        <div key={idx} className="w-full flex justify-between items-center gap-[5px]">
                          <div className="">{reward.name} APY</div>
                          <div className="">
                            {numberFormatter(reward.apy, 2, true)}%
                          </div>
                        </div>
                      ))
                    )
                  }
                </div>
              </Card>
            )}
            trigger={PopoverTrigger.Hover}
            placement={PopoverPlacement.Bottom}
            closeDelayDuration={0}
          >
            <button type="button" className="underline decoration-dashed underline-offset-4">
              {numberFormatter(totalApy, 2, true)}%
            </button>
          </Popover>
        );
      },
    },
    {
      title: "Rewards",
      dataIndex: "rewards",
      width: 160,
      render: (text: any, record: any, index: any) => {
        if (!record.rewards) return null;
        return (
          <div className="flex items-center gap-[2px] flex-wrap">
            <div className="flex items-center">
              {
                record.rewards.map((reward: any, idx: number) => (
                  <LazyImage
                    key={idx}
                    src={reward.icon}
                    alt=""
                    width={26}
                    height={26}
                    containerClassName="shrink-0 rounded-full overflow-hidden"
                    containerStyle={{
                      transform: idx > 0 ? "translateX(-6px)" : ""
                    }}
                  />
                ))
              }
            </div>
            {
              record.rewards.map((reward: any, idx: number) => {
                if (!reward.claim) return null;
                return (
                  <div key={idx} className="text-[#6CA200] font-[500] text-[16px] flex items-center gap-[4px]">
                    <div className="">
                      +{numberFormatter(reward.claim, 2, true, { prefix: "$", isShort: true })}
                    </div>
                    <Popover
                      triggerContainerClassName="inline-block"
                      content={(
                        <Card className="!rounded-[10px] !bg-white !p-[7px_12px] !text-[14px] font-[500]">
                          Claim rewards
                        </Card>
                      )}
                      trigger={PopoverTrigger.Hover}
                      placement={PopoverPlacement.Top}
                      closeDelayDuration={0}
                    >
                      <button
                        type="button"
                        className="shrink-0 w-[21px] h-[21px] rounded-full bg-[url('/images/vaults/v2/claim.svg')] bg-no-repeat bg-center bg-contain"
                        onClick={() => toggleClaimVisible()}
                      />
                    </Popover>
                  </div>
                );
              })
            }
          </div>
        )
      },
    },
    {
      title: "Yours",
      dataIndex: "yours",
      sort: true,
      render: (text: any, record: any, index: any) => {
        return numberFormatter(record.balance, 2, true, { prefix: "$", isShort: true });
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 75,
      render: (text: any, record: any, index: any) => {
        return (
          <div className="flex justify-end items-center gap-[10px]">
            <button
              type="button"
              className="w-[32px] h-[32px] bg-[url('/images/vaults/v2/deposit.svg')] bg-no-repeat bg-center bg-contain disabled:!cursor-not-allowed disabled:opacity-[0.3]"
              onClick={() => {
                toggleActionVisible({
                  type: ACTION_TYPE.DEPOSIT
                });
              }}
            />
            <button
              type="button"
              disabled
              className="w-[32px] h-[32px] bg-[url('/images/vaults/v2/withdraw.svg')] bg-no-repeat bg-center bg-contain disabled:!cursor-not-allowed disabled:opacity-[0.3]"
              onClick={() => {
                toggleActionVisible({
                  type: ACTION_TYPE.WITHDRAW,
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className={clsx("text-[20px] text-black leading-[90%] font-[600] font-Montserrat mt-[20px] w-full", className)}>
      <FlexTable
        columns={columns}
        list={list}
        headClass="px-[11px] py-[8px] text-[14px] font-[500] text-[#3D405A]"
        bodyClass="text-[16px] font-[500] !py-[13px] !pl-[11px] !pr-[14px]"
      />
    </div>
  );
};

export default VaultsTable;
