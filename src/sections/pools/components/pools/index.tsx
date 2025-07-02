import { useMemo, useState } from "react";
import SearchBox from "@/sections/marketplace/components/searchbox";
import SwitchTabs from "@/components/switch-tabs";
import AddLiquidityModal from "../../add-liquidity-modal";
import Laptop from "./laptop";
import Mobile from "./mobile";
import useIsMobile from "@/hooks/use-isMobile";
import clsx from "clsx";
import { useThrottleFn } from "ahooks";
import { numberFormatter } from "@/utils/number-formatter";
import Big from "big.js";

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
  const [kodiakPools, setKodiakPools] = useState<any>([]);
  const TabContent = useMemo(
    () => tabs?.find((tab: any) => tab.value === currentTab)?.content,
    [tabs, currentTab]
  );

  const { run: toggleWithBaults } = useThrottleFn(() => {
    setWithBaults(!withBaults);
  }, { wait: 1000 });

  const isKodiak = useMemo(() => dapp?.name === "Kodiak", [dapp]);

  const [kodiakTotalTvl, kodiakMyDeposits] = useMemo(() => {
    if (!kodiakPools || isKodiak) return [Big(0), Big(0)];
    const totalTvl = kodiakPools?.reduce((acc: number, pool: any) => Big(acc).plus(pool.poolTvl || 0), Big(0));
    const myDeposits = kodiakPools?.reduce((acc: number, pool: any) => Big(acc).plus(pool.balanceUSD || 0), Big(0));
    return [totalTvl, myDeposits];
  }, [kodiakPools, isKodiak]);

  return (
    <div className="pb-[0px] md:h-full md:overflow-y-auto">
      {
        !!TabContent && isKodiak && (
          <div className="h-[77px] md:h-[unset] flex justify-between items-start gap-[10px] w-full mb-[15px] p-[20px_30px_22px] md:p-[10px_10px] rounded-[10px] bg-[#FFDC50] text-[#000] font-montserrat text-[14px] font-[400] leading-[90%]">
            <div className="flex flex-col gap-[10px] md:gap-[8px]">
              <div className="text-[18px] md:text-[16px] font-semibold">
                Markets
              </div>
              <div className="text-[#3D405A] md:text-[12px]">
                Deposit in the top Kodiak Islands and V2 pools.
              </div>
            </div>
            <div className="flex justify-end items-start gap-[20px]">
              <div className="flex flex-col gap-[10px] md:gap-[8px]">
                <div className="text-[#3D405A] whitespace-nowrap">
                  TVL
                </div>
                <div className="text-[20px] md:text-[18px] font-semibold">
                  {numberFormatter(kodiakTotalTvl, 2, true, { isShort: true, isShortUppercase: true, isZeroPrecision: false, prefix: "$" })}
                </div>
              </div>
              <div className="flex flex-col gap-[10px] md:gap-[8px]">
                <div className="text-[#3D405A] whitespace-nowrap">
                  My Deposits
                </div>
                <div className="text-[20px] md:text-[18px] font-semibold">
                {numberFormatter(kodiakMyDeposits, 2, true, { isShort: true, isShortUppercase: true, isZeroPrecision: false, prefix: "$" })}
                </div>
              </div>
            </div>
          </div>
        )
      }
      {!isPlain && (
        <div className="flex justify-between items-center md:flex-col md:gap-[10px]">
          <div className="md:px-[12px] md:w-full flex items-center gap-[10px]">
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
            {
              (!isMobile && isKodiak) && (
                <BaultsBtn
                  withBaults={withBaults}
                  setPageLoading={setPageLoading}
                  toggleWithBaults={toggleWithBaults}
                  pageLoading={pageLoading}
                />
              )
            }
          </div>
          <div className="md:pb-[5px] md:w-[300px] md:mx-auto flex items-center justify-end gap-[10px]">
            {
              (isMobile && isKodiak) && (
                <BaultsBtn
                  withBaults={withBaults}
                  setPageLoading={setPageLoading}
                  toggleWithBaults={toggleWithBaults}
                  pageLoading={pageLoading}
                />
              )
            }
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
            loadPools: (_pools: any) => {
              if (isKodiak && _pools) {
                setKodiakPools(_pools || []);
              }
            }
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

const BaultsBtn = (props: any) => {
  const {
    withBaults,
    setPageLoading,
    toggleWithBaults,
    pageLoading,
  } = props;

  return (
    <button
      type="button"
      className={clsx(
        "relative disabled:!cursor-not-allowed disabled:opacity-50 cursor-pointer shrink-0 h-[32px] rounded-[6px] border border-[rgba(0,0,0,0.2)] text-[12px] flex items-center justify-center gap-[5px] px-[12px]",
        withBaults ? "border-[rgba(0,0,0,0.8)]" : "border-[rgba(0,0,0,0.2)]"
      )}
      onClick={() => {
        setPageLoading(true);
        toggleWithBaults();
      }}
      disabled={pageLoading}
    >
      <div className="uppercase absolute top-[-14px] md:top-[-10px] right-[-10px] px-[6px] rounded-[12px] font-[500] h-[24px] md:h-[20px] bg-[#FFDC50] flex items-center justify-center">
        new
      </div>
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
  );
}
