import List from "@/sections/marketplace/components/list";
import Big from "big.js";
import useUserList from "../hooks/use-user-list";
import { balanceFormated } from "@/utils/balance";

export default function Laptop({ onClick }: any) {
  const { loading, list } = useUserList();

  return (
    <div>
      <div className="text-[20px] font-bold mt-[20px] mb-[10px]">
        Your Top Pools
      </div>
      <List
        meta={[
          {
            title: "Deposits",
            key: "deposits",
            sort: false,
            width: "45%",
            render: (item: any, index: number) => {
              return (
                <div className="flex items-center gap-[10px]">
                  <div className="flex items-center gap-[10px]">
                    <img
                      src={item.token0.icon}
                      width={30}
                      height={30}
                      className="rounded-full"
                      alt={item.token0.symbol}
                    />
                    <img
                      src={item.token1.icon}
                      width={30}
                      height={30}
                      className="rounded-full ml-[-20px]"
                      alt={item.token1.symbol}
                    />
                  </div>
                  <div className="text-[16px] font-medium">
                    {item.tokenLp.symbol}
                  </div>
                </div>
              );
            }
          },
          {
            title: "Holdings",
            key: "balanceUSD",
            sort: true,
            width: "40%",
            render: (item: any, index: number) => {
              return (
                <div>
                  <div className="text-[16px] font-medium">
                    ${balanceFormated(Big(item.balanceUSD).toString(), 3)}
                  </div>
                  <div className="flex items-center text-[10px]">
                    {balanceFormated(
                      Big(item.balanceUSD).div(item.tokenLp.price).toString(),
                      6
                    )}{" "}
                    {item.tokenLp.symbol}
                  </div>
                </div>
              );
            }
          },
          {
            title: "Action",
            key: "action",
            sort: false,
            width: "15%",
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
