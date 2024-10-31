import useTipsStore from '@/stores/useTipsStore';
import React from 'react';
import ReactDOM from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

const TipsModal = () => {
  const store: any = useTipsStore();

  const onClose = () => {
    store.setOpen(false);
  };

  return ReactDOM.createPortal(
    <AnimatePresence mode='wait'>
      {store.open ? (
        <motion.div
          className='fixed z-[200] top-[8px] left-[50%] translate-x-[-50%] flex justify-start items-center gap-[9px] w-[445px] border border-black bg-[#FFFDEB] shadow-shadow1 rounded-[20px] px-[15px] py-[12px]'
          style={{
            x: '-50%'
          }}
          variants={{
            closed: {
              opacity: 0,
              y: -16
            },
            open: {
              opacity: 1,
              y: 0
            }
          }}
          initial='closed'
          animate='open'
          exit='closed'
        >
          <img src='/images/icon-tips.svg' alt='' width={26} height={26} />
          <span className='text-black text-[16px] font-CherryBomb cursor-default'>
            You are currently accessing the testnet
          </span>
          <img
            src='/images/modal/close.svg'
            alt=''
            width={26}
            height={26}
            className='ml-auto cursor-pointer'
            onClick={onClose}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
};

export default TipsModal;
