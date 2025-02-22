import clsx from 'clsx';
import { useContext } from 'react';
import { HomeEarthContext } from '@/sections/home-earth/context';
import { AnimatePresence, motion } from 'framer-motion';

const BerachainFixes = (props: any) => {
  const { className } = props;

  const { isRainyDay } = useContext(HomeEarthContext);

  return (
    <AnimatePresence mode="wait">
      {
        isRainyDay && (
          <motion.div
            className={clsx('absolute left-[20px] top-[20px] w-[88px] h-[88px] rounded-[20px] shrink-0 aspect-square z-[6]', className)}
            variants={{
              visible: { opacity: 1, x: 0, scale: 1 },
              invisible: { opacity: 0, x: '-100%', scale: 0.8 },
            }}
            animate="visible"
            initial="invisible"
            exit="invisible"
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
          >
            <img
              src="/images/home-earth/berachain-fixes.png"
              alt=""
              className="w-full h-full"
            />
          </motion.div>
        )
      }
    </AnimatePresence>
  );
};

export default BerachainFixes;
