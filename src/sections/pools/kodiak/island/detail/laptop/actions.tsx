import SwitchTabs from "@/components/switch-tabs";
import Deposit from "./deposit";
import Withdraw from "./withdraw";
import Stake from "./stake";
import Unstake from "./unstake";
import { useMemo, useState } from "react";

export default function Actions() {
  const [currentTab, setCurrentTab] = useState("");
  const tabs = useMemo(
    () => [
      { label: "Deposit", value: "deposit" },
      { label: "Withdraw", value: "withdraw" }
    ],
    []
  );
  return (
    <div className="rounded-[10px] bg-black/5 p-[20px] w-[440px]">
      <SwitchTabs tabs={tabs} current={currentTab} onChange={setCurrentTab} />
      {/* <Deposit /> */}
      {/* <Withdraw /> */}
      {/* <Stake /> */}
      <Unstake />
    </div>
  );
}
