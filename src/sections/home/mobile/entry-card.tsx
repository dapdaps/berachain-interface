import { motion } from 'framer-motion';
import { EntryAnimation, EntryAnimationSignpost } from '@/sections/home/mobile/index';

const EntryCard = (props: any) => {
  const { children, className, childrenClassName, bgClassName } = props;

  return (
    <motion.div
      className={`absolute right-[18.974vw] bottom-[12vw] ${className}`}
      variants={EntryAnimationSignpost}
      transition={EntryAnimation}
    >
      <div className={`rotate-[6deg] w-full h-full relative z-[2] rounded-[4px] p-[5px_10px] border border-[#000] bg-[#E9B965] text-center leading-[1] text-black font-CherryBomb text-[20px] font-[400] ${childrenClassName}`}>
        {children}
      </div>
      <div className={`rotate-[6deg] bg-[#866224] border border-black rounded-[4px] w-full h-full absolute bottom-[-3px] right-[-3px] z-[1] ${bgClassName}`}></div>
    </motion.div>
  );
};

export default EntryCard;
