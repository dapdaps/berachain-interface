import Image from "next/image";
import PoolTable from "../../../components/pool-table";
import { balanceFormated } from "@/utils/balance";
import Empty from "@/components/empty";
import CircleLoading from "@/components/circle-loading";
import Big from "big.js";
import useUserList from "../hooks/use-user-list";

const Item = ({ record, onClick }: any) => {
  return (
    <div className="rounded-[10px] bg-black/10 p-[14px]">
      <div className="flex justify-between">
        <PoolTable item={{ ...record.pool, fee: "" }} />
        <div className="text-right">
          <div className="text-[16px] font-bold">
            $
            {balanceFormated(
              Big(record.user.total).mul(record.pool.price).toString(),
              1
            )}
          </div>
          <div className="text-[12px] font-medium">
            {balanceFormated(record.user.total, 2)}
          </div>
        </div>
      </div>
      <div className="mt-[8px] flex items-center">
        <div className="w-1/2 flex items-center gap-[8px]">
          <Image
            src={record.pool.token0.icon}
            width={20}
            height={20}
            className="rounded-full"
            alt={record.pool.token0.symbol}
          />
          <div className="text-[14px] font-medium">
            {record.pool.token0.symbol}:{" "}
            {balanceFormated(record.user.amount0, 3)}
          </div>
        </div>
        <div className="w-1/2 flex items-center gap-[8px]">
          <Image
            src={record.pool.token1.icon}
            width={20}
            height={20}
            className="rounded-full"
            alt={record.pool.token1.symbol}
          />
          <div className="text-[14px] font-medium">
            {record.pool.token1.symbol}:{" "}
            {balanceFormated(record.user.amount1, 3)}
          </div>
        </div>
      </div>
      <div className="mt-[8px] flex">
        <div className="w-1/3">
          <div className="text-[#3D405A] text-[14px] font-medium">
            Available
          </div>
          <div className="text-[16px] font-medium">
            $
            {balanceFormated(
              Big(record.user.total).mul(record.pool.price).toString(),
              2
            )}
          </div>
          <div className="text-[#3D405A] text-[12px] font-medium">
            {balanceFormated(record.user.balance, 3)} {record.pool.symbol}
          </div>
        </div>
        <div className="w-1/3">
          <div className="text-[#3D405A] text-[14px] font-medium">Locked</div>
          <div className="text-[16px] font-medium">
            $
            {balanceFormated(
              Big(record.user.locked).mul(record.pool.price).toString(),
              2
            )}
          </div>
          <div className="text-[#3D405A] text-[12px] font-medium">
            {balanceFormated(record.user.locked, 3)} {record.pool.symbol}
          </div>
        </div>
        <div className="w-1/3">
          <div className="text-[#3D405A] text-[14px] font-medium">Earned</div>
          <div className="text-[16px] font-medium">
            $
            {balanceFormated(
              Big(record.user.earned).mul(record.pool.price).toString(),
              2
            )}
          </div>
          <div className="text-[#3D405A] text-[12px] font-medium">
            {balanceFormated(record.user.earned, 2)} {record.rewardToken.symbol}
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          onClick(record);
        }}
        className="w-full mt-[16px] h-[40px] font-semibold bg-[#FFDC50] border border-black rounded-[10px]"
      >
        Mange
      </button>
    </div>
  );
};

export default function IslandMobile({ onClick }: any) {
  const { loading, list } = useUserList();
  return (
    <div className="px-[12px] pb-[20px] pt-[16px] flex flex-col gap-[12px] h-[calc(100%-80px)] overflow-y-auto">
      {list.length === 0 && !loading && (
        <div className="mt-[50px] w-full flex justify-center items-center">
          <Empty desc="No Pools." />
        </div>
      )}
      {loading && (
        <div className="flex items-center h-[200px] justify-center">
          <CircleLoading />
        </div>
      )}
      {list.map((item: any, idx: number) => (
        <Item key={idx} record={item} onClick={onClick} />
      ))}
    </div>
  );
}
