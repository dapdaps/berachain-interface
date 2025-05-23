"use client"
import PageBack from "@/components/back";
import BearBackground from "@/components/bear-background";
import Tabs from "@/components/tabs";
import BgtPageView from "@/sections/bgt";
import IbgtPageView from "@/sections/bgt/ibgt";
import { useHall } from "@/stores/hall";
import { memo, useMemo } from "react";
import Validators from "../bgt/validators";
export default memo(function Laptop() {
  const store = useHall()
  const currentTab = useMemo(() => ["bgt", "ibgt", "validators"].includes(store.currentTab) ? store.currentTab : "validators")
  return (
    <BearBackground type="hall">
      <div className="py-[22px] flex flex-col items-center h-full overflow-scroll">
        <PageBack className="absolute left-[36px] md:left-[15px] z-[12]" />

        <div className="flex flex-col items-center gap-[35px]">
          <div className="flex items-center gap-[18px]">
            <div className="w-[88px]">
              <img src="/images/hall/icon-hall.svg" alt="icon-hall" />
            </div>
            <div className="text-black font-CherryBomb text-[60px] leading-[90%]">BGT TOWN HALL</div>
          </div>
          <div className="flex-1">
            <Tabs
              isCard
              page="hall"
              maxTabs={1}
              currentTab={currentTab}
              onChange={(key) => {
                store.set({
                  currentTab: key
                })
              }}
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
                  children: <BgtPageView />
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
                  children: <IbgtPageView />
                },
                {
                  key: "validators",
                  label: (
                    // <div className="relative">
                    //   Validators
                    // </div>
                    <div className="flex items-center gap-[10px]">
                      <div className="w-[30px]">
                        <img src="/images/validators.svg" alt="validators" />
                      </div>
                      <div className="text-black font-Montserrat text-[18px] font-bold leading-[90%]">Validators</div>
                    </div>
                  ),
                  children: <Validators />
                }
              ]}
            />
          </div>

        </div>
      </div>
    </BearBackground>
  )
})