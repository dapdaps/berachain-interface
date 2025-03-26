import { motion } from "framer-motion";
import LazyImage from '@/components/layz-image';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import { FILTER_KEYS } from '@/sections/vaults/v2/config';
import useIsMobile from '@/hooks/use-isMobile';

const FilterItem = (props: any) => {
  const { type, data } = props;

  const {
    listFilterSelected,
    toggleListFilterSelected,
    listLoading,
    toggleListFilterVisible,
  } = useVaultsV2Context();
  const isMobile = useIsMobile();

  const selectedList = listFilterSelected[type as FILTER_KEYS] || [];
  const selected = selectedList?.some((it: any) => it.label === data.label);

  return (
    <motion.button
      type="button"
      disabled={listLoading}
      className="h-[36px] border pl-[6px] pr-[8px] rounded-[10px] disabled:cursor-not-allowed disabled:opacity-30 shrink-0 flex justify-center items-center gap-[5px] text-[15px] text-black leading-[90%] font-[500] font-Montserrat"
      animate={{
        backgroundColor: selected ? 'rgba(253,213,76,0.5)' : 'rgba(253,213,76,0)',
        borderColor: selected ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)',
      }}
      onClick={() => {
        toggleListFilterSelected(type, data);
        if (isMobile) {
          toggleListFilterVisible();
        }
      }}
    >
      <LazyImage src={data?.icon} width={26} height={26} className="shrink-0" fallbackSrc="/assets/tokens/default_icon.png" />
      <div className="">
        {data?.label}
      </div>
    </motion.button>
  );
};

export default FilterItem;
