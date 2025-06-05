import Card from "@/components/card";
import SwitchTabs from "@/components/switch-tabs";
import { usePriceStore } from "@/stores/usePriceStore";
import { useState } from "react";
import BerapawZap from "./zap";
import BerapawStake from "./stake";
import { bera } from "@/configs/tokens/bera";

const TABS = [
  {
    label: "Stake",
    value: "stake"
  },
  {
    label: "Zap",
    value: "zap"
  }
];

const BerapawStakeContent = (props: any) => {
  const { data } = props;

  const prices = usePriceStore((store: any) => store.beraTownPrice);
  const [stakeAmount, setStakeAmount] = useState<any>();
  const [inputCurrencyAmount, setInputCurrencyAmount] = useState<any>();
  const [outputCurrencyAmount, setOutputCurrencyAmount] = useState<any>();
  const [currentTab, setCurrentTab] = useState<any>(TABS[0].value);

  console.log("data: %o", data);

  return (
    <Card className="w-[500px] text-black font-Montserrat text-[14px] font-medium leading-normal">
      <div className="text-black font-CherryBomb text-[20px] leading-[90%]">
        Zap into {data?.metadata?.name}
      </div>
      <SwitchTabs
        className="mt-[20px]"
        tabs={TABS}
        current={currentTab}
        onChange={(value) => {
          setCurrentTab(value);
        }}
      />
      {
        currentTab === TABS[0].value && (
          <BerapawStake
            {...props}
            amount={stakeAmount}
            onAmountChange={(_amount: string) => {
              setStakeAmount(_amount);
            }}
            prices={prices}
          />
        )
      }
      {
        currentTab === TABS[1].value && (
          <BerapawZap
            {...props}
            prices={prices}
            inputCurrencyAmount={inputCurrencyAmount}
            setInputCurrencyAmount={setInputCurrencyAmount}
            outputCurrencyAmount={outputCurrencyAmount}
            setOutputCurrencyAmount={setOutputCurrencyAmount}
            inputCurrency={bera["bera"]}
          />
        )
      }
    </Card>
  );
};

export default BerapawStakeContent;
