import { balanceFormated } from "@/utils/balance";
import Button from "@/components/button";
import ModalLoading from "../loading";
import useWithdraw from "../../../hooks/use-withdraw";

export default function WithdrawPanel({
  data,
  amounts,
  onSuccess,
  onError
}: any) {
  const { amount0, amount1, amount } = amounts;
  console.log('=====amount', amount)
  const { loading, onWithdraw } = useWithdraw({
    data,
    amount,
    onSuccess,
    onError
  });
  return loading ? (
    <ModalLoading
      title="Waiting for confirmation"
      subTitle={`Withdrawing ${balanceFormated(amount0, 4)} ${
        data.token0.symbol
      } and ${balanceFormated(amount1, 4)} ${data.token1.symbol}`}
    />
  ) : (
    <>
      <div className="mt-[20px] rounded-[12px] border border-[#373A53] p-[12px]">
        <div className="flex items-center justify-between mt-[6px]">
          <div className="flex items-center gap-[9px]">
            <img
              src={data.token0.icon}
              alt={data.token0.name}
              width={26}
              height={26}
              className="rounded-full"
            />
            <div className="font-semibold text-[16px]">
              {data.token0.symbol}
            </div>
          </div>
          <div className="font-semibold text-[16px]">
            {balanceFormated(amount0, 6)}
          </div>
        </div>
        <div className="flex items-center justify-between mt-[6px]">
          <div className="flex items-center gap-[9px]">
            <img
              src={data.token1.icon}
              alt={data.token1.name}
              width={26}
              height={26}
              className="rounded-full"
            />
            <div className="font-semibold text-[16px]">
              {data.token1.symbol}
            </div>
          </div>
          <div className="font-semibold text-[16px]">
            {balanceFormated(amount1, 6)}
          </div>
        </div>
      </div>
      <Button
        type="primary"
        className="w-full h-[46px] mt-[16px]"
        onClick={onWithdraw}
        loading={loading}
      >
        Withdraw
      </Button>
    </>
  );
}
