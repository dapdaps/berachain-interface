"use client"
import PageBack from "@/components/back";
import Tabs from "@/components/tabs";
import PageTitle from "@/components/title";
import IBGTMobileView from "@/sections/bgt/ibgt/mobile";
import BGTMobileView from "@/sections/bgt/mobile";
import ValidatorsMobileView from "@/sections/bgt/validators/mobile";
import { useHall } from "@/stores/hall";
import { memo, useMemo } from "react";
export default memo(function Mobile() {
  const store = useHall()
  const currentTab = useMemo(() => ["bgt", "ibgt", "validators"].includes(store.currentTab) ? store.currentTab : "validators")
  
  return (
    <div className="flex flex-col">
      <PageBack className="absolute left-[12px] top-[17px]" />
      <PageTitle className="pt-[30px] mb-[25px]">BGT Hall Town</PageTitle>

      <div className="h-[calc(100vh_-_80px)] pb-[60px]">
        <Tabs
          page="hall"
          maxTabs={1}
          currentTab={currentTab}
          bodyClassName="overflow-auto"
          onChange={(key) => {
            store.set({
              currentTab: key
            })
          }}
          tabs={[
            {
              key: "bgt",
              label: (
                <div className="w-full flex flex-col items-center justify-center gap-[6px]">
                  <div className="w-[24px]">
                    <img src="/images/dapps/infrared/bgt.svg" alt="bgt" />
                  </div>
                  <div className="text-black font-Montserrat text-[14px] font-bold leading-[90%]">BGT</div>
                </div>
              ),
              children: <BGTMobileView />
            },
            // {
            //   key: "ibgt",
            //   label: (
            //     <div className="w-full flex flex-col items-center justify-center gap-[6px]">
            //       <div className="w-[24px]">
            //         <img src="/images/dapps/infrared/ibgt.svg" alt="ibgt" />
            //       </div>
            //       <div className="text-black font-Montserrat text-[14px] font-bold leading-[90%]">iBGT</div>
            //     </div>
            //   ),
            //   children: <IBGTMobileView />
            // },
            {
              key: "validators",
              label: (
                <div className="w-full flex flex-col items-center justify-center gap-[6px]">
                  <div className="w-[24px]">
                    <img src="/images/validators.svg" alt="validators" />
                  </div>
                  <div className="text-black font-Montserrat text-[14px] font-bold leading-[90%]">Validators</div>
                </div>
              ),
              children: <ValidatorsMobileView />
            }
          ]}
        />
      </div>
    </div>
  )
})