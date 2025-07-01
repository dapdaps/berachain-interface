import { balanceFormated } from "@/utils/balance";
import Big from "big.js";
import Button from "@/components/button";
import ModalLoading from "../loading";
import useDeposit from "../../../hooks/use-deposit";
import BaultsInfo from "@/sections/pools/kodiak/baults/info";

export default function SupplyPanel({
  dapp,
  data,
  amount0,
  amount1,
  received,
  type,
  onSuccess
}: any) {
  const { loading, onDeposit } = useDeposit({
    data,
    amount0,
    amount1,
    received,
    type,
    onSuccess,
    dapp
  });

  return loading ? (
    <ModalLoading
      title="Waiting for confirmation"
      subTitle={`Supplying ${balanceFormated(amount0, 4)} ${
        data.token0.symbol
      } and ${balanceFormated(amount1, 4)} ${data.token1.symbol}`}
    />
  ) : (
    <>
      <BaultsInfo data={data} lpAmount={received} />
      <div className="mt-[20px] rounded-[12px] border border-[#373A53] p-[12px]">
        <div className="flex items-center justify-between">
          <div className="text-[14px] font-medium	text-[#3D405A]">
            {data.token0.symbol} deposited
          </div>
          <div className="flex items-center gap-[9px]">
            <img
              src={data.token0.icon}
              alt={data.token0.name}
              width={26}
              height={26}
              className="rounded-full"
            />
            <div className="font-semibold text-[16px]">
              {balanceFormated(amount0, 4)}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-[6px]">
          <div className="text-[14px] font-medium	text-[#3D405A]">
            {data.token1.symbol} deposited
          </div>
          <div className="flex items-center gap-[9px]">
            <img
              src={data.token1.icon}
              alt={data.token1.name}
              width={26}
              height={26}
              className="rounded-full"
            />
            <div className="font-semibold text-[16px]">
              {balanceFormated(amount1, 4)}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-[6px]">
          <div className="text-[14px] font-medium	text-[#3D405A]">Rates</div>
          <div className="text-[14px] font-medium	text-[#3D405A]">
            1 {data.token0.symbol} ={" "}
            {balanceFormated(Big(amount1).div(amount0).toString(), 4)}{" "}
            {data.token1.symbol}
          </div>
        </div>
        <div className="flex items-center justify-between mt-[6px]">
          <div className="text-[14px] font-medium	text-[#3D405A]">
            Est. received
          </div>
          <div className="font-semibold text-[16px]">
            {balanceFormated(received, 6)} {data.tokenLp.symbol}{" "}
          </div>
        </div>
      </div>
      <Button
        type="primary"
        className="w-full h-[46px] mt-[16px]"
        onClick={onDeposit}
        loading={loading}
      >
        Confirm Supply
      </Button>
    </>
  );
}
