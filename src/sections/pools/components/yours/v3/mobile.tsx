import Big from "big.js";
import Empty from "@/components/empty";
import CircleLoading from "@/components/circle-loading";
import PoolTable from "../../pool-table";
import Status from "./status";
import Button from "@/components/button";
import UnclaimedFees from "./unclaimed-fees";

export default function Mobile({
  pools,
  loading,
  ticksInfo,
  dex,
  onAction
}: any) {
  return (
    <div className="pb-[18px] px-[12px] font-semibold h-[calc(100%-90px)] overflow-y-auto">
      {pools.map((item: any, idx: number) => (
        <div
          key={idx}
          className="mb-[10px] bg-black/10 rounded-[10px] px-[18px] py-[10px]"
        >
          <div className="flex justify-between items-center">
            <PoolTable item={item} />
          </div>
          <div className="flex justify-between items-start mt-[6px]">
            <div className="flex items-center gap-[3px]">
              <div className="text-[14px] text-[#3D405A]">Range</div>
              <Status ticksInfo={ticksInfo} item={item} />
            </div>
            <div className="text-[12px] font-medium text-right">
              <div>
                {item.lowerPrice} {item.token1.symbol} per {item.token0.symbol}
              </div>
              <div className="w-[1px] h-[11px] bg-black mt-[5px] mb-[6px] mx-[auto]" />
              <div>
                {item.upperPrice} {item.token1.symbol} per {item.token0.symbol}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-[20px]">
            <div className="text-[14px] text-[#3D405A]">Unclaimed Fees</div>
            <div className="text-[16px]">
              <UnclaimedFees pool={item} dex={dex} />
            </div>
          </div>
          <div className="flex gap-[8px] mt-[16px] justify-end">
            <Button
              type="primary"
              className="w-1/3 h-[40px]"
              onClick={() => {
                onAction("increase", item);
              }}
            >
              Increase
            </Button>
            {Big(item.liquidity || 0).gt(0) && (
              <Button
                type="primary"
                className="w-1/3 h-[40px]"
                onClick={() => {
                  onAction("remove", item);
                }}
              >
                Remove
              </Button>
            )}
            <Button
              type="primary"
              className="w-1/3 h-[40px]"
              onClick={() => {
                onAction("claim", item);
              }}
            >
              Claim
            </Button>
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex justify-center">
          <CircleLoading />
        </div>
      )}
      {!loading && !pools.length && (
        <div className="w-full flex justify-center items-center mt-[100px]">
          <Empty desc="No Pools" />
        </div>
      )}
    </div>
  );
}
