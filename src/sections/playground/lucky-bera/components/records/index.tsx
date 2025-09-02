import SwitchTabs from "@/components/switch-tabs";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import LuckyBeraResults from "./results";
import LuckyBeraRechage from "./rechage";

const LuckyBeraRecords = (props: any) => {
  const { className } = props;

  const [activeTab, setActiveTab] = useState<any>(Tabs[0].value);

  return (
    <div className="w-full">
      <div className="text-[30px] font-CherryBomb font-[400] leading-normal text-center text-[#FDD54C] capitalize [text-shadow:0_2px_0_#000] [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#000]">
        Lucky Bera History
      </div>
      <div className="relative w-full flex justify-center items-center mt-[23px]">
        <SwitchTabs
          tabs={Tabs}
          current={activeTab}
          onChange={(value) => {
            setActiveTab(value);
          }}
          className="w-[285px] !h-[40px]"
        />
      </div>
      <div className="w-full mt-[10px]">
        <AnimatePresence>
          {
            activeTab === Tabs[0].value && (
              <LuckyBeraResults />
            )
          }
          {
            activeTab === Tabs[1].value && (
              <LuckyBeraRechage />
            )
          }
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LuckyBeraRecords;

const Tabs = [
  {
    value: "results",
    label: "Results",
  },
  {
    value: "rechage",
    label: "Rechage",
  },
];
