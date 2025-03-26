import Card from "@/components/card";
import InputNumber from "@/components/input-number";
import Modal from "@/components/modal";
import SwitchTabs from "@/components/switch-tabs";
import { Dispatch, memo, SetStateAction, useState } from "react";
import RangeInput from "../range-input";
import Button from "../button";
import { Token } from "@/types";

export default memo(function StakeModal({
  token,
  currentTab,
  setCurrentTab,
  onClose
}: {
  token: Token
  currentTab: string
  setCurrentTab: Dispatch<SetStateAction<string>>
  onClose: VoidFunction
}) {
  // const [currentTab, setCurrentTab] = useState("stake")

  const [percent, setPercent] = useState(0);
  return (
    <Modal open={token} onClose={onClose} >
      <Card>
        <div className="w-[456px]">
          <SwitchTabs
            tabs={[
              { label: "Stake", value: "stake" },
              { label: "Unstake", value: "unstake" }
            ]}
            onChange={(val) => {
              setCurrentTab(val)
            }}
            current={currentTab}
            className="w-[456px]"
          />
          <div className="m-[24px_0_40px] flex items-start justify-between">
            <div className="flex flex-col gap-[9px]">
              <div className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">Staked Amount</div>
              <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%]">4.29K</div>
            </div>

            <div className="flex flex-col gap-[9px]">
              <div className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">APR</div>
              <div className="text-[#72A807] font-Montserrat text-[16px] font-semibold leading-[100%]">4.2%</div>
            </div>

            <div className="flex flex-col gap-[9px]">
              <div className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">Available to unstake</div>
              <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%]">0 WBTC</div>
            </div>
          </div>

          <div className="mb-[12px] flex items-center justify-between">
            <div className="text-black font-Montserrat text-[18px] font-semibold leading-[90%]">Stake for UniBTC</div>
            <div className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">1 BTC = 1 UniBTC</div>
          </div>
          <RangeInput onChange={(value: string) => {
          }} />
          <div className="my-[20px] flex items-center justify-between">
            <span className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">Min. Receive</span>
            <span className="text-black font-Montserrat text-[14px] font-medium leading-[100%]">~0.1023 UniBTC</span>
          </div>
          <Button>Stake</Button>
        </div>
      </Card>
    </Modal>
  )
})
