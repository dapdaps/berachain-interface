import { AnimatePresence, motion } from 'framer-motion';
import { memo } from 'react';
import { container, overlay } from '@/components/animation';
import Content from './content';

const Setting = ({ show, setShow }: any) => {
  return (
    <AnimatePresence mode='wait'>
      {show && (
        <>
          <motion.div
            className='fixed top-[80px] inset-x-0	inset-y-0	flex justify-center items-center'
            onClick={() => setShow(false)}
            {...overlay}
          />
          <motion.div
            className='absolute z-[100] left-[10px] top-[20px]'
            {...container}
          >
            <Content show={show} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default memo(Setting);
