import SwitchTabs from "@/components/switch-tabs";
import Deposit from "./deposit";
import Withdraw from "./withdraw";
import Stake from "./stake";
import Unstake from "./unstake";
import { useMemo, useState } from "react";
import Big from "big.js";

export default function Actions(props: any) {
  const { info } = props;
  const [currentTab, setCurrentTab] = useState("deposit");
  const tabs = useMemo(() => {
    const _tabs = [{ label: "Deposit", value: "deposit" }];
    if (Big(info.total || 0).gt(0))
      _tabs.push({ label: "Withdraw", value: "withdraw" });
    if (Big(info.balance || 0).gt(0))
      _tabs.push({ label: "Stake", value: "stake" });
    if (Big(info.locked?.amount || 0).gt(0))
      _tabs.push({ label: "Unstake", value: "unstake" });
    return _tabs;
  }, [info]);

  return (
    <div className="rounded-[10px] bg-black/5 p-[20px] w-[440px]">
      <SwitchTabs tabs={tabs} current={currentTab} onChange={setCurrentTab} />
      {currentTab === "deposit" && <Deposit {...props} />}
      {currentTab === "withdraw" && <Withdraw {...props} />}
      {currentTab === "stake" && <Stake {...props} />}
      {currentTab === "unstake" && <Unstake {...props} />}
    </div>
  );
}
