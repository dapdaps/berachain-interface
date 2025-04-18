import { motion } from "framer-motion";
import FilterItem from "@/sections/vaults/v2/components/filter/item";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import clsx from "clsx";
import useIsMobile from "@/hooks/use-isMobile";
import { FILTER_KEYS, FILTERS } from "@/sections/vaults/v2/config";
import Big from "big.js";
import Loading from "@/components/loading";
import Empty from "@/components/empty";
import Skeleton from "react-loading-skeleton";
import { useEffect, useRef, useState } from "react";

const Filter = (props: any) => {
  const { className } = props;

  const {
    listAvailableAssets,
    toggleListAvailableAssets,
    clearListFilterSelected,
    listLoading,
    listFilterAssetsBalance,
    listFilterAssetsBalanceLoading,
    listFilterSelectedLength,
    toggleListFilterVisible,
    listRewardTokens,
    listPoolProjects,
    listCreatorProjects,
    listFilterAssetsViewMore,
    toggleListFilterAssetsViewMore
  } = useVaultsV2Context();
  const isMobile = useIsMobile();

  const [viewMoreVisible, setViewMoreVisible] = useState(false);

  const filterAssetsList = FILTERS.ASSETS.sort(
    (a, b) => a.sort - b.sort
  ).filter((it) => {
    if (!listAvailableAssets) return true;
    return listFilterAssetsBalance.some(
      (_it: any) =>
        _it.address === it.token?.address && Big(_it.balance || 0).gt(0)
    );
  });

  const assetsFilterRef = useRef<any>();

  useEffect(() => {
    const checkHeight = () => {
      if (assetsFilterRef.current) {
        const height = assetsFilterRef.current.clientHeight;
        if (height < 136) {
          setViewMoreVisible(false);
        } else {
          setViewMoreVisible(true);
        }
      }
    };

    checkHeight();

    const resizeObserver = new ResizeObserver(checkHeight);
    if (assetsFilterRef.current) {
      resizeObserver.observe(assetsFilterRef.current);
    }

    return () => {
      if (assetsFilterRef.current) {
        resizeObserver.unobserve(assetsFilterRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={clsx("h-0 flex-1 overflow-y-auto max-h-[662px]", className)}
    >
      <div className="flex justify-between items-center gap-[10px] pl-[10px] pr-[24px] pt-[14px] md:pt-0">
        <div className="flex items-center gap-[7px]">
          <div className="text-[16px] md:text-[20px] font-[700]">Filter</div>
          {isMobile && (
            <div className="flex justify-center items-center rounded-full w-[19px] h-[19px] shrink-0 bg-[#FDD54C] border border-[#000] text-[#000] text-center font-[Montserrat] text-[12px] font-[600] leading-[90%]">
              {listFilterSelectedLength}
            </div>
          )}
        </div>
        <button
          type="button"
          disabled={listLoading}
          className={clsx(
            "shrink-0 h-[13px] flex justify-center items-center disabled:cursor-not-allowed disabled:opacity-30",
            isMobile ? "gap-[10px] w-[unset]" : "w-[13px]"
          )}
          onClick={() => {
            clearListFilterSelected();
            if (isMobile) {
              toggleListFilterVisible();
            }
          }}
        >
          <svg
            width="14"
            height="15"
            viewBox="0 0 14 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 7.84211C1 11.243 3.68629 14 7 14C10.3137 14 13 11.243 13 7.84211C13 4.44119 10.3137 1.68421 7 1.68421C4.77915 1.68421 2.84012 2.92256 1.80269 4.76316M1.80269 4.76316V1M1.80269 4.76316H5"
              stroke={isMobile ? "#FF888A" : "#999"}
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
          {isMobile && (
            <div className="text-[15px] font-[500] leading-[90%] text-[#FF888A] font-[Montserrat]">
              Clean
            </div>
          )}
        </button>
      </div>
      <div className="text-[15px] font-[600] pt-[26px] px-[12px]">
        Deposit Asset
      </div>
      <div className="flex justify-between items-center gap-[10px] pl-[10px] pr-[10px] pt-[20px]">
        <div className="text-[15px] font-[500]">Your available assets only</div>
        <motion.button
          type="button"
          disabled={listLoading || listFilterAssetsBalanceLoading}
          className="w-[45px] h-[26px] shrink-0 rounded-[13px] p-[3px] disabled:cursor-not-allowed disabled:opacity-30"
          animate={{
            backgroundColor: listAvailableAssets ? "#FFDC50" : "#E8E5C7"
          }}
          onClick={() => {
            toggleListAvailableAssets();
          }}
          data-bp="1022-001-008"
        >
          <motion.div
            className="w-[20px] h-[20px] rounded-full border border-[#BBBBBB] bg-[#FFFDEB] flex justify-center items-center"
            animate={{ x: listAvailableAssets ? 19 : 0 }}
          >
            {listFilterAssetsBalanceLoading && <Loading size={12} />}
          </motion.div>
        </motion.button>
      </div>
      <div
        ref={assetsFilterRef}
        className={clsx(
          "pt-[12px] pl-[10px] pr-[10px] flex items-center gap-x-[6px] gap-y-[8px] flex-wrap overflow-hidden",
          listFilterAssetsViewMore ? "max-h-[unset]" : "max-h-[136px]"
        )}
      >
        {listLoading ? (
          <>
            <Skeleton width={80} height={36} borderRadius={10} />
            <Skeleton width={80} height={36} borderRadius={10} />
            <Skeleton width={80} height={36} borderRadius={10} />
          </>
        ) : filterAssetsList.length > 0 ? (
          filterAssetsList
            .filter((it) => (listAvailableAssets ? true : it.label !== "NECT"))
            .map((it, idx) => (
              <FilterItem key={idx} type={FILTER_KEYS.ASSETS} data={it} />
            ))
        ) : (
          <div className="w-full flex justify-center">
            <Empty desc="No assets available" />
          </div>
        )}
      </div>
      {viewMoreVisible && (
        <div className="pt-[14px] pl-[15px] pr-[15px]">
          <button
            disabled={listLoading}
            type="button"
            className="text-[#999] text-[12px] disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() => toggleListFilterAssetsViewMore()}
          >
            View {listFilterAssetsViewMore ? "Less" : "More"}
          </button>
        </div>
      )}
      <FilterGroup title="Reward Asset" loading={listLoading}>
        {FILTERS.REWARDS.sort((a, b) => a.sort - b.sort)
          .filter((it) =>
            listRewardTokens.some(
              (_it: any) =>
                _it.symbol?.toLowerCase?.() === it.label.toLowerCase()
            )
          )
          .map((it, idx) => (
            <FilterItem key={idx} type={FILTER_KEYS.REWARDS} data={it} />
          ))}
      </FilterGroup>
      <FilterGroup title="Defi Protocol" loading={listLoading}>
        {
          listPoolProjects.map((it: any, idx: number) => (
            <FilterItem key={idx} type={FILTER_KEYS.PROTOCOLS} data={it} />
          ))
        }
      </FilterGroup>
    </div>
  );
};

export default Filter;

const FilterGroup = (props: any) => {
  const { className, title, children, loading } = props;

  return (
    <>
      <div className="pt-[24px] pl-[10px] pr-[10px] font-[600]">{title}</div>
      <div
        className={clsx(
          "pt-[14px] pl-[10px] pr-[10px] flex items-center gap-x-[6px] gap-y-[8px] flex-wrap",
          className
        )}
      >
        {loading ? (
          <>
            <Skeleton width={80} height={36} borderRadius={10} />
            <Skeleton width={80} height={36} borderRadius={10} />
            <Skeleton width={80} height={36} borderRadius={10} />
          </>
        ) : (
          children
        )}
      </div>
    </>
  );
};
