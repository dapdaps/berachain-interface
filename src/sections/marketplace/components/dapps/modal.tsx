import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import IconClose from '@public/images/modal/close.svg';
import Capsule from '@/sections/marketplace/components/dapps/capsule';

const DappModal = (props: Props) => {
  const { children, visible, title, type, onClose } = props;

  const [visibleInner, setVisibleInner] = useState<boolean | undefined>(false);

  const modalRef = useRef<any>(null);

  const handleClose = () => {
    setVisibleInner(false);
    const timer = setTimeout(() => {
      clearTimeout(timer);
      onClose();
    }, 100);
  };

  useEffect(() => {
    setVisibleInner(visible);
  }, [visible]);

  return ReactDOM.createPortal((
    <AnimatePresence mode="wait">
      {
        visible && (
          <motion.div
            className="fixed z-[50] w-full h-full left-0 top-0 bg-[rgba(0,_0,_0,_.5)] backdrop-blur-md"
            onClick={(e) => {
              if (modalRef.current.contains(e.target)) {
                return;
              }
              handleClose();
            }}
            variants={{
              visible: {
                opacity: 1,
              },
              hidden: {
                opacity: 0,
              },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {
              visibleInner && (
                (
                  <motion.div
                    ref={modalRef}
                    className="absolute px-[20px] pt-[24px] pb-[20px] w-[520px] rounded-[20px] bg-[#FFFDEB] border border-[#000] shadow-shadow1 z-[51] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
                    variants={{
                      visible: {
                        opacity: 1,
                      },
                      hidden: {
                        opacity: 0,
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <div className="absolute right-[-13px] top-[-13px]" onClick={handleClose}>
                      <IconClose />
                    </div>
                    {
                      title && (
                        <div className="flex items-center gap-[9px] text-black text-[20px] font-[700] leading-[90%]">
                          <span>{title}</span>
                          {
                            type && <Capsule>{type}</Capsule>
                          }
                        </div>
                      )
                    }
                    {children}
                  </motion.div>
                )
              )
            }
          </motion.div>
        )
      }
    </AnimatePresence>
  ), document.body)
};

export default DappModal;

interface Props {
  visible?: boolean;
  children: any;
  title?: any;
  type?: any;

  onClose(): void;
}
