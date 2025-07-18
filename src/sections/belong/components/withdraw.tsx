import Card from "@/components/card";
import clsx from "clsx";
import { useBelongContext } from "../context";
import TokenAmount from "@/sections/swap/TokenAmount";
import { useState } from "react";

const Withdraw = (props: any) => {
  const { className } = props;

  const {
    currentMarket,
    prices,
    currentMarketData,
  } = useBelongContext();

  const [inputAmount, setInputAmount] = useState<any>();
  const [inputCurrencyUpdater, setInputCurrencyUpdater] = useState(1);

  return (
    <>
      <Card className={clsx("w-full !p-[20px] !rounded-[20px] text-[#000] text-[12px] font-Montserrat font-[500]", className)}>
        {/*#region Widthdraw collateral*/}
        <div className="w-full">
          <div className="w-ful flex justify-between items-center gap-[10px] text-[12px] text-[#A1A0A1]">
            <div className="">Burn {currentMarket?.beraborrowToken?.symbol}</div>
          </div>
          <TokenAmount
            className="!p-[14px_12px_10px] mt-[10px] w-full"
            currencyClassName="md:w-[120px] border bg-[#FFFDEB]"
            type="in"
            outputCurrencyReadonly
            currency={currentMarket?.beraborrowToken}
            amount={inputAmount}
            prices={{
              ...prices,
              [currentMarket.symbol]: currentMarketData?.collPrice,
            }}
            isPrice={true}
            account
            onAmountChange={(_amount: string) => {
              setInputAmount(_amount);
            }}
            updater={inputCurrencyUpdater}
            balanceLabel="Deposited"
            onUpdateCurrencyBalance={(_balance: string) => { }}
            balancePercentClassName={({ selected }: any) => {
              if (selected) {
                return "!border-[#000] text-[#000]";
              }
              return "!border-[#D9D9D9] !text-[#808290]";
            }}
            isRange={false}
            balanceContainerClassName="!text-[#A1A0A1]"
          />
        </div>
        {/*#endregion*/}
      </Card>
    </>
  );
};

export default Withdraw;
