"use client"
import { memo, useState } from "react";
import PageBack from "@/components/back"
import Tabs from "@/components/tabs";
import BgtMainView from "@/sections/bgt/main";
import IbgtMainView from "@/sections/bgt/ibgt/main";
import BearBackground from "@/components/bear-background";
export default memo(function HallView() {
  const [currentTab, setCurrentTab] = useState<string>("bgt");


  return (
    <BearBackground type="hall">
      <div className="pt-[22px] flex flex-col items-center">
        <PageBack className="absolute left-[36px] md:left-[15px] z-[12]" />

        <div className="flex flex-col items-center gap-[35px]">
          <div className="flex items-center gap-[18px]">
            <div className="w-[88px]">
              <img src="/images/icon-hall.svg" alt="icon-hall" />
            </div>
            <div className="text-black font-CherryBomb text-[60px] leading-[90%]">BGT TOWN HALL</div>
          </div>

          <Tabs
            isCard
            page="hall"
            maxTabs={1}
            currentTab={currentTab}
            onChange={(key) => setCurrentTab(key as string)}
            tabs={[
              {
                key: "bgt",
                label: (
                  <div className="flex items-center gap-[10px]">
                    <div className="w-[30px]">
                      <img src="/images/dapps/infrared/bgt.svg" alt="bgt" />
                    </div>
                    <div className="text-black font-Montserrat text-[18px] font-bold leading-[90%]">BGT</div>
                  </div>
                ),
                children: <BgtMainView />
              },
              {
                key: "ibgt",
                label: (
                  <div className="flex items-center gap-[10px]">
                    <div className="w-[30px]">
                      <img src="/images/dapps/infrared/ibgt.svg" alt="ibgt" />
                    </div>
                    <div className="text-black font-Montserrat text-[18px] font-bold leading-[90%]">iBGT</div>
                  </div>
                ),
                children: <IbgtMainView />
              },
              {
                key: "Validators",
                label: (
                  <div className="relative">
                    Validators
                    <div className="absolute -right-[20px] top-0 flex items-center justify-center w-[42px] h-[13px] rounded-[8px] border-black border bg-[#FFF5A9]">
                      <span className="text-black text-[16px] font-blod scale-50">Thoon...</span>
                    </div>
                  </div>
                ),
                disabled: true,
              }
            ]}
          />
        </div>
      </div>
    </BearBackground>
  )
})