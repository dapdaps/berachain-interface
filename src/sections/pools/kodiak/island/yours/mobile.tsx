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
        <PoolTable item={{ ...record, fee: "" }} />
        <div className="text-right">
          <div className="text-[16px] font-bold">
            ${balanceFormated(Big(record.balanceUSD).toString(), 3)}
          </div>
          <div className="text-[12px] font-medium">
            {balanceFormated(
              Big(record.balanceUSD).div(record.tokenLp.price).toString(),
              6
            )}{" "}
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          onClick(record);
        }}
        className="w-full mt-[16px] h-[40px] font-semibold bg-[#FFDC50] border border-black rounded-[10px]"
      >
        Manage
      </button>
    </div>
  );
};

export default function IslandMobile({ onClick }: any) {
  const { loading, list } = useUserList();
  return (
    <div className="px-[12px] pb-[18px] pt-[16px] flex flex-col gap-[12px] h-[calc(100%-80px)] overflow-y-auto">
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
