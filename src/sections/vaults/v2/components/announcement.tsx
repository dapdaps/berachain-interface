import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import { FILTER_KEYS } from '@/sections/vaults/v2/config';

const Announcement = (props: any) => {
  const { className } = props;

  const {
    toggleListFilterSelected,
    listPoolProjects,
    listFilterSelected,
  } = useVaultsV2Context();

  const onClick = () => {
    const target = document.getElementById('VaultsRewardTopCard_1');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    const Infrared = listPoolProjects.find((it: any) => it.label === 'Infrared');
    if (Infrared) {
      const selectedList = listFilterSelected[FILTER_KEYS.PROTOCOLS] || [];
      const selected = selectedList?.some((it: any) => it.label === Infrared.label);
      if (!selected) {
        toggleListFilterSelected(FILTER_KEYS.PROTOCOLS, Infrared);
      }
    }
  };

  return (
    <motion.div
      className={clsx("cursor-pointer p-[0] absolute z-[51] whitespace-nowrap top-[17px] left-1/2 -translate-x-1/2 justify-center w-[396px] h-9 shrink-0 rounded-[10px] border border-black bg-[#FFF5A9] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.25)] text-black font-montserrat text-sm font-medium leading-none flex items-center gap-[11px]", className)}
      initial={{
        y: -100,
        x: "-50%",
        opacity: 0,
      }}
      animate={{
        y: 0,
        x: "-50%",
        opacity: 1,
      }}
      transition={{
        delay: 0.5,
      }}
      onClick={onClick}
    >
      <img src="/images/vaults/v2/icon-notice.svg" alt="" className="shrink-0 w-[20px] h-[16px] object-center object-contain" />
      <div className="flex items-center">
        <div className="">Earn&nbsp;</div>
        <div className="font-[700]">Infrared points&nbsp;</div>
        <img src="/images/dapps/infrared/infrared.svg" alt="" className="shrink-0 w-[18px] h-[18px] border border-white rounded-full object-center object-contain" />
        <div className="">&nbsp;by using Infrared vaults!</div>
      </div>
    </motion.div>
  );
};

export default Announcement;
