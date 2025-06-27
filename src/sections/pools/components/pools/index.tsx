import { useMemo, useState } from "react";
import SearchBox from "@/sections/marketplace/components/searchbox";
import SwitchTabs from "@/components/switch-tabs";
import AddLiquidityModal from "../../add-liquidity-modal";
import Laptop from "./laptop";
import Mobile from "./mobile";
import useIsMobile from "@/hooks/use-isMobile";
import clsx from "clsx";
import { useThrottleFn } from "ahooks";

export default function Pools({
  pools = [],
  onChangeTab,
  currentTab,
  dex,
  tabs,
  loading,
  withBaults,
  setWithBaults,
  pageLoading,
  setPageLoading,
  dapp,
}: any) {
  const [searchVal, setSearchVal] = useState("");
  const [selectedReocrd, setSelectedRecord] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [isPlain, setIsPlain] = useState(false);
  const isMobile = useIsMobile();
  const TabContent = useMemo(
    () => tabs?.find((tab: any) => tab.value === currentTab)?.content,
    [tabs, currentTab]
  );

  const { run: toggleWithBaults } = useThrottleFn(() => {
    setWithBaults(!withBaults);
  }, { wait: 1000 });

  return (
    <div className="pb-[20px] md:h-full">
      {!isPlain && (
        <div className="flex justify-between items-center md:flex-col md:gap-[10px]">
          <div className="md:px-[12px] md:w-full">
            {currentTab && (
              <SwitchTabs
                tabs={tabs}
                current={currentTab}
                onChange={onChangeTab}
                style={{
                  width: tabs.length * 100,
                  height: 40,
                  padding: 4
                }}
                tabStyle={{
                  fontSize: 14
                }}
                className="md:bg-[#DFDCC4] md:border-none md:rounded-[12px] md:mx-auto"
                cursorClassName="md:rounded-[12px]"
              />
            )}
          </div>
          <div className="md:pb-[5px] md:w-[300px] md:mx-auto flex items-center justify-end gap-[10px]">
            <button
              type="button"
              className={clsx(
                "disabled:!cursor-not-allowed disabled:opacity-50 cursor-pointer shrink-0 h-[32px] rounded-[6px] border border-[rgba(0,0,0,0.2)] text-[12px] flex items-center justify-center gap-[5px] px-[12px]",
                withBaults ? "border-[rgba(0,0,0,0.8)]" : "border-[rgba(0,0,0,0.2)]"
              )}
              onClick={() => {
                setPageLoading(true);
                toggleWithBaults();
              }}
              disabled={pageLoading}
            >
              <div
                className={clsx(
                  "w-[20px] h-[20px] rounded-[4px] border border-[rgba(0,0,0,1)] shadow-[2px_2px_0px_0px_rgba(0,_0,_0,_0.25)_inset] flex items-center justify-center",
                  withBaults ? "bg-[#FFDC50]" : "bg-[#E9E3B5]"
                )}
              >
                {
                  withBaults && (
                    <img src="/images/icon-check.svg" alt="" className="w-[12px] h-[10px] object-contain object-center shrink-0 translate-x-[1px] translate-y-[1.5px]" />
                  )
                }
              </div>
              <div className="font-[500]">Baults</div>
            </button>
            <SearchBox
              value={searchVal}
              onChange={setSearchVal}
              containerClassName="flex-1 md:w-0"
              className="md:rounded-[6px] md:px-[5px] md:w-full"
              inputClassName="md:h-[30px] md:min-w-[unset] md:flex-1 md:w-0"
            />
          </div>
        </div>
      )}
      {!TabContent ? (
        isMobile ? (
          <Mobile
            {...{
              pools,
              page,
              setPage,
              searchVal,
              setSelectedRecord,
              type: currentTab,
              loading,
              dex
            }}
          />
        ) : (
          <Laptop
            {...{
              pools,
              page,
              setPage,
              searchVal,
              setSelectedRecord,
              type: currentTab,
              loading,
              dex
            }}
          />
        )
      ) : (
        <TabContent
          {...{
            page,
            setPage,
            searchVal,
            setIsPlain,
            withBaults,
            setWithBaults,
            pageLoading,
            setPageLoading,
            dapp,
          }}
        />
      )}

      {!!selectedReocrd && (
        <AddLiquidityModal
          open={!!selectedReocrd}
          onClose={() => {
            setSelectedRecord(null);
          }}
          data={selectedReocrd}
          dex={dex}
        />
      )}
    </div>
  );
}
