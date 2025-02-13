import List from "@/sections/marketplace/components/list";
import Big from "big.js";
import useUserList from "../hooks/use-user-list";
import { balanceFormated } from "@/utils/balance";

export default function Laptop({ onClick }: any) {
  const { loading, list } = useUserList();

  return (
    <div>
      <div className="text-[20px] font-bold mt-[20px] mb-[10px]">
        Your Islands
      </div>
      <List
        meta={[
          {
            title: "Deposits",
            key: "deposits",
            sort: false,
            width: "22%",
            render: (item: any, index: number) => {
              return (
                <div className="flex items-center gap-[10px]">
                  <img
                    src={item.pool.token0.icon}
                    width={30}
                    height={30}
                    className="rounded-full"
                    alt={item.pool.token0.symbol}
                  />
                  <img
                    src={item.pool.token1.icon}
                    width={30}
                    height={30}
                    className="rounded-full ml-[-20px]"
                    alt={item.pool.token1.symbol}
                  />
                  <div>
                    <div className="text-[16px] font-medium">
                      $
                      {balanceFormated(
                        Big(item.user.total).mul(item.pool.price).toString(),
                        3
                      )}
                    </div>
                    <div className="flex items-center text-[10px]">
                      {balanceFormated(item.user.total, 6)} {item.pool.symbol}
                    </div>
                  </div>
                </div>
              );
            }
          },
          {
            title: "Amount",
            key: "amount",
            sort: false,
            width: "22%",
            render: (item: any, index: number) => {
              return (
                <div className="flex flex-col">
                  <div className="flex items-center gap-[8px] text-[14px] font-medium">
                    <img
                      src={item.pool.token0.icon}
                      width={20}
                      height={20}
                      className="rounded-full"
                      alt={item.pool.token0.symbol}
                    />
                    <div>
                      {balanceFormated(item.user.amount0, 3)}{" "}
                      {item.pool.token0.symbol}
                    </div>
                  </div>
                  <div className="flex items-center gap-[8px] text-[14px] font-medium">
                    <img
                      src={item.pool.token1.icon}
                      width={20}
                      height={20}
                      className="rounded-full"
                      alt={item.pool.token1.symbol}
                    />
                    <div>
                      {balanceFormated(item.user.amount1, 3)}{" "}
                      {item.pool.token1.symbol}
                    </div>
                  </div>
                </div>
              );
            }
          },
          {
            title: "Available",
            key: "available",
            sort: false,
            width: "14%",
            render: (item: any, index: number) => {
              return (
                <div>
                  <div className="text-[16px] font-medium">
                    $
                    {balanceFormated(
                      Big(item.user.total).mul(item.pool.price).toString(),
                      3
                    )}
                  </div>
                  <div className="flex items-center text-[10px]">
                    {balanceFormated(item.user.balance, 6)} {item.pool.symbol}
                  </div>
                </div>
              );
            }
          },
          {
            title: "Locked",
            key: "locked",
            sort: false,
            width: "14%",
            render: (item: any, index: number) => {
              return (
                <div>
                  <div className="text-[16px] font-medium">
                    $
                    {balanceFormated(
                      Big(item.user.locked).mul(item.pool.price).toString(),
                      3
                    )}
                  </div>
                  <div className="flex items-center text-[10px]">
                    {balanceFormated(item.user.locked, 6)} {item.pool.symbol}
                  </div>
                </div>
              );
            }
          },
          {
            title: "Earned",
            key: "earned",
            sort: false,
            width: "16%",
            render: (item: any, index: number) => {
              return (
                <div>
                  {/* <div className="text-[16px] font-medium">{`< $0.001`}</div> */}
                  <div className="flex items-center gap-[3px]">
                    <img
                      src={item.rewardToken.icon}
                      width={16}
                      height={16}
                      className="rounded-full"
                      alt={item.rewardToken.symbol}
                    />
                    <div className="text-[12px]">
                      {balanceFormated(item.user.earned, 6)}{" "}
                      {item.rewardToken.symbol}
                    </div>
                  </div>
                </div>
              );
            }
          },
          {
            title: "Action",
            key: "action",
            sort: false,
            width: "12%",
            render: (item: any, index: number) => {
              return (
                <button
                  onClick={() => {
                    onClick(item);
                  }}
                  className="w-[96px] h-[32px] bg-[#FFDC50] border border-black rounded-[10px]"
                >
                  Manage
                </button>
              );
            }
          }
        ]}
        list={list}
        bodyClassName="h-[480px] overflow-y-auto"
        loading={loading}
        withoutHeader={false}
      />
    </div>
  );
}
