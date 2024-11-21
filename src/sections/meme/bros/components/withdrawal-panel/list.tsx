import { balanceShortFormated } from "@/utils/balance";
import { formatDistance } from "date-fns";
import useWithdraw from "../../hooks/use-withdraw";
import Button from "@/components/button";

const Item = ({ item, i, onSuccess }: any) => {
  const { loading, onWithdraw } = useWithdraw({
    token: item,
    idx: i,
    onSuccess
  });
  return (
    <div className="mt-[20px] flex items-start">
      <div className="text-[16px]">
        <span className="font-bold mr-[5px]">
          {balanceShortFormated(item.amount, 2)} {item.symbol}
        </span>
        <span>
          is available to be withdrawal{" "}
          {item.withdrawable
            ? "now!"
            : `in ${formatDistance(
                new Date(),
                new Date(item.unlockTimestamp)
              )}`}
        </span>
      </div>
      <Button
        onClick={onWithdraw}
        disabled={!item.withdrawable}
        loading={loading}
        type="primary"
        className="shrink-0 w-[105px] h-[36px] rounded-[10px] border border-black bg-[#FFDC50] font-semibold"
      >
        Withdraw
      </Button>
    </div>
  );
};
export default function List({ list, onSuccess }: any) {
  return (
    <div className="max-h-[60dvh] overflow-y-auto">
      {list.map((item: any, i: number) => (
        <Item key={i} item={item} i={i} onSuccess={onSuccess} />
      ))}
    </div>
  );
}
