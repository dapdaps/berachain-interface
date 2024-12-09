import Basic from "./basic";
import Button from "@/components/button";
import Image from "next/image";
import Loading from "@/components/loading";
import Empty from "@/components/empty";
import AddIncentives from "./add-incentives";
import Pager from "@/components/pager";
import useIncentives from "../hooks/use-incentives";
import { useEffect, useState } from "react";
import { formatThousandsSeparator } from "@/utils/balance";
import { format } from "date-fns";
import { ellipsAccount } from "@/utils/account";
import useData from "../hooks/use-data";

export default function Incentives({ open, data, rewardTokens, onClose }: any) {
  const { loading, list, totalPage, page, onChangePage } = useIncentives(
    data.stake_address
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const { currentRound } = useData();

  useEffect(() => {
    if (open) onChangePage(1);
  }, [open]);

  return (
    <>
      <Basic open={open} onClose={onClose} className="w-[916px]">
        <div className="flex text-[20px] font-bold justify-between pr-[40px] md:pr-0">
          <div>Incentives</div>
          {currentRound.status === "ongoing" && (
            <Button
              type="primary"
              className="h-[36px]"
              onClick={() => {
                setShowAddModal(true);
              }}
            >
              Add Incentives
            </Button>
          )}
        </div>
        <div className="mb-[16px] pt-[28px] flex items-center font-medium text-[#3D405A] text-[14px] border-b border-black/20 pb-[10px]">
          <div className="w-[324px] md:w-[180px]">Providers</div>
          <div className="w-[360px] md:grow">Incentive Breakdown</div>
          <div className="md:w-[66px] md:shrink-0">Time</div>
        </div>
        <div className="text-[#3D405A] font-semibold text-[14px] max-h-[50dvh] overflow-y-auto">
          {loading && (
            <div className="flex justify-center items-center h-[300px]">
              <Loading size={40} />
            </div>
          )}
          {!loading && !list?.length && (
            <div className="h-[300px] flex justify-center items-center">
              <Empty desc="No incentives" />
            </div>
          )}
          {list?.map((item: any) => (
            <div key={item} className=" flex items-center  pb-[26px]">
              <div className="w-[324px] flex items-center gap-[5px] md:w-[180px]">
                <div className="md:w-[92px] md:overflow-hidden md:h-[20px] md:text-ellipsis	md:whitespace-nowrap">
                  {ellipsAccount(item.sender, 12)}
                </div>
              </div>
              <div className="w-[360px] flex items-center gap-[5px] md:grow">
                <Image
                  src={`https://assets.db3.app/token/${item.token_in.symbol.toLowerCase()}.png`}
                  width={26}
                  height={26}
                  alt={item.token_in.symbol}
                  className="rounded-full"
                />
                <div>
                  <div>
                    {formatThousandsSeparator(item.token_in.amount, 2)}{" "}
                    {item.token_in.symbol}
                  </div>
                  <div className="text-[12px] font-medium">
                    ${formatThousandsSeparator(item.token_in.usd, 2)}
                  </div>
                </div>
              </div>
              <div className="md:w-[66px] md:shrink-0">
                {format(item.tx_time * 1000, "yyyy-MM-dd HH:mm:ss")}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-[12px] flex justify-end items-center pr-[12px]">
          <Pager
            maxPage={totalPage}
            onPageChange={(p: number) => {
              if (p !== page) onChangePage(p);
            }}
          />
        </div>
      </Basic>
      <AddIncentives
        open={showAddModal}
        rewardTokens={rewardTokens}
        data={data}
        onSuccess={() => {
          setShowAddModal(false);
          onChangePage(1);
        }}
        onClose={() => {
          setShowAddModal(false);
        }}
      />
    </>
  );
}
