import { Clouds } from '@/components/bear-background/clouds';
import BeraTown from '@/components/bear-background/components/bera-town';
import Flowers from '@/components/bear-background/components/flowers';
import Bear from '@/components/bear-background/components/bear';
import Ground from '@/components/bear-background/components/ground';
import { useChristmas } from '@/hooks/use-christmas';
import BeraBgHomeChristmas from '@/components/bear-background/home/christmas';
import { AnimatePresence, motion } from 'framer-motion';

const BeraBgHome = () => {
  const { isChristmas } = useChristmas();

  return (
    <AnimatePresence mode="wait">
      {isChristmas ? (
        <motion.div
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <BeraBgHomeChristmas />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Clouds />
          <BeraTown />
          <Flowers />
          <Bear className='absolute w-[360px] left-1/2 bottom-[32px] translate-x-[-168px] z-10' />
          <Ground />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BeraBgHome;
