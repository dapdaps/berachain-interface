import SwitchTabs from "@/components/switch-tabs";
import Deposit from "./deposit";
import Withdraw from "./withdraw";
import Stake from "./stake";
import Unstake from "./unstake";
import { useMemo, useState } from "react";
import Big from "big.js";
import clsx from "clsx";

export default function Actions(props: any) {
  const { info, data } = props;
  const [currentTab, setCurrentTab] = useState("deposit");

  const tabs = useMemo(() => {
    const _tabs = [{ label: "Deposit", value: "deposit" }];
    if (Big(info.total || 0).gt(0))
      _tabs.push({ label: "Withdraw", value: "withdraw" });
    if (Big(info.balance || 0).gt(0) && data.farmAddress)
      _tabs.push({ label: "Stake", value: "stake" });
    if (Big(info.locked?.amount || 0).gt(0) && data.farmAddress)
      _tabs.push({ label: "Unstake", value: "unstake" });
    return _tabs;
  }, [info]);

  return (
    <div
      className={clsx(
        "rounded-[10px] bg-black/5 p-[20px] w-[440px]",
        "md:w-full md:mt-[12px] md:rounded-[20px] md:bg-[#FFFDEB] md:border md:border-black md:p-[10px]"
      )}
    >
      <SwitchTabs
        tabs={tabs}
        current={currentTab}
        onChange={setCurrentTab}
        className="md:!h-[50px] md:!p-[3px_4px] md:!bg-[#DFDCC4] md:!rounded-[12px]"
        cursorClassName="md:!rounded-[10px]"
        tabClassName="md:!text-[14px]"
      />
      {currentTab === "deposit" && <Deposit {...props} />}
      {currentTab === "withdraw" && <Withdraw {...props} />}
      {currentTab === "stake" && <Stake {...props} />}
      {currentTab === "unstake" && <Unstake {...props} />}
    </div>
  );
}
