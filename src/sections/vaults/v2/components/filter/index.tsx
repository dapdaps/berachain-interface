import { motion } from 'framer-motion';
import FilterItem from '@/sections/vaults/v2/components/filter/item';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import clsx from 'clsx';
import useIsMobile from '@/hooks/use-isMobile';
import { FILTER_KEYS, FILTERS, SUPPORTED_PROTOCOLS } from '@/sections/vaults/v2/config';

const Filter = (props: any) => {
  const { className } = props;

  const {
    availableAssets,
    toggleAvailableAssets,
    clearListFilterSelected,
    listLoading,
  } = useVaultsV2Context();
  const isMobile = useIsMobile();

  return (
    <div className={clsx("h-0 flex-1 overflow-y-auto", className)}>
      <div className="flex justify-between items-center gap-[10px] pl-[15px] pr-[24px] pt-[14px] md:pt-0">
        <div className="flex items-center gap-[7px]">
          <div className="text-[16px] md:text-[20px] font-[700]">
            Filter
          </div>
          {
            isMobile && (
              <div
                className="flex justify-center items-center rounded-full w-[19px] h-[19px] shrink-0 bg-[#FDD54C] border border-[#000] text-[#000] text-center font-[Montserrat] text-[12px] font-[600] leading-[90%]"
              >
                3
              </div>
            )
          }
        </div>
        <button
          type="button"
          disabled={listLoading}
          className={clsx(
            "shrink-0 h-[13px] flex justify-center items-center disabled:cursor-not-allowed disabled:opacity-30",
            isMobile ? "gap-[10px] w-[unset]" : "w-[13px]"
          )}
          onClick={clearListFilterSelected}
        >
          <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 7.84211C1 11.243 3.68629 14 7 14C10.3137 14 13 11.243 13 7.84211C13 4.44119 10.3137 1.68421 7 1.68421C4.77915 1.68421 2.84012 2.92256 1.80269 4.76316M1.80269 4.76316V1M1.80269 4.76316H5"
              stroke={isMobile ? "#FF888A" : "#999"}
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
          {
            isMobile && (
              <div className="text-[15px] font-[500] leading-[90%] text-[#FF888A] font-[Montserrat]">
                Clean
              </div>
            )
          }
        </button>
      </div>
      <div className="text-[15px] font-[600] pt-[26px] px-[15px]">
        Deposit Asset
      </div>
      <div className="flex justify-between items-center gap-[10px] pl-[15px] pr-[15px] pt-[20px]">
        <div className="text-[15px] font-[500]">
          Your available assets only
        </div>
        <motion.button
          type="button"
          disabled={listLoading}
          className="w-[45px] h-[26px] shrink-0 rounded-[13px] p-[3px] disabled:cursor-not-allowed disabled:opacity-30"
          animate={{ backgroundColor: availableAssets ? '#FFDC50' : '#E8E5C7' }}
          onClick={() => toggleAvailableAssets()}
        >
          <motion.div
            className="w-[20px] h-[20px] rounded-full border border-[#BBBBBB] bg-[#FFFDEB]"
            animate={{ x: availableAssets ? 19 : 0 }}
          />
        </motion.button>
      </div>
      <div className="pt-[12px] pl-[15px] pr-[15px] flex items-center gap-[8px] flex-wrap">
        {
          FILTERS.ASSETS.map((it, idx) => (
            <FilterItem
              key={idx}
              type={FILTER_KEYS.ASSETS}
              data={it}
            />
          ))
        }
      </div>
      {/*<div className="pt-[14px] pl-[15px] pr-[15px]">
        <button
          disabled={listLoading}
          type="button"
          className="text-[#999] text-[12px] disabled:cursor-not-allowed disabled:opacity-30"
        >
          View More
        </button>
      </div>*/}
      <div className="pt-[24px] pl-[15px] pr-[15px] font-[600]">
        Reward Asset
      </div>
      <div className="pt-[14px] pl-[15px] pr-[15px] flex items-center gap-[8px] flex-wrap">
        {
          FILTERS.REWARDS.map((it, idx) => (
            <FilterItem
              key={idx}
              type={FILTER_KEYS.REWARDS}
              data={it}
            />
          ))
        }
      </div>
      <div className="pt-[28px] pl-[15px] pr-[15px] font-[600]">
        Protocol
      </div>
      <div className="pt-[14px] pl-[15px] pr-[15px] flex items-center gap-[8px] flex-wrap">
        {
          FILTERS.PROTOCOLS.filter((it) => SUPPORTED_PROTOCOLS.includes(it.label)).map((it, idx) => (
            <FilterItem
              key={idx}
              type={FILTER_KEYS.PROTOCOLS}
              data={it}
            />
          ))
        }
      </div>
    </div>
  );
};

export default Filter;
