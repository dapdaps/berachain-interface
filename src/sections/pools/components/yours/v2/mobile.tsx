import Empty from "@/components/empty";
import CircleLoading from "@/components/circle-loading";
import PoolTable from "../../pool-table";
import Button from "@/components/button";

export default function Mobile({ pools, loading, onAction }: any) {
  return (
    <div className="pb-[18px] font-semibold h-[calc(100%-90px)] overflow-y-auto">
      {pools.map((item: any, idx: number) => (
        <div
          key={idx}
          className="mb-[10px] bg-black/10 rounded-[10px] px-[18px] py-[10px]"
        >
          <div className="flex justify-between items-center">
            <PoolTable item={item} />
          </div>
          <div className="flex justify-between items-center mt-[20px]">
            <div className="text-[14px] text-[#3D405A]">Your Shares</div>
            <div className="text-[16px]">
              {item["shares"] ? `${item["shares"]}%` : "-"}
            </div>
          </div>
          <div className="flex gap-[8px] mt-[16px] justify-end">
            <Button
              type="primary"
              className="w-1/2 h-[40px]"
              onClick={() => {
                onAction("increase", item);
              }}
            >
              Increase
            </Button>
            <Button
              type="primary"
              className="w-1/2 h-[40px]"
              onClick={() => {
                onAction("remove", item);
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex justify-center mt-[100px]">
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
