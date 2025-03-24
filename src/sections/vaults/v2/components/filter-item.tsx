import { motion } from "framer-motion";
import LazyImage from '@/components/layz-image';

const FilterItem = (props: any) => {
  const { selected } = props;

  return (
    <motion.button
      type="button"
      className="h-[36px] border pl-[7px] pr-[9px] rounded-[10px] shrink-0 flex justify-center items-center gap-[5px] text-[15px] text-black leading-[90%] font-[500] font-Montserrat"
      animate={{
        backgroundColor: selected ? 'rgba(253,213,76,0.5)' : 'rgba(253,213,76,0)',
        borderColor: selected ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)',
      }}
    >
      <LazyImage src="/images/icon-coin.svg" width={26} height={26} className="shrink-0" />
      <div className="">
        BERA
      </div>
    </motion.button>
  );
};

export default FilterItem;
