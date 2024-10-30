import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import IconClose from '@public/images/modal/close.svg';
import useIsMobile from '@/hooks/use-isMobile';
import { AnimatePresence, motion } from 'framer-motion';

interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  closeIcon?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  closeIconClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  closeIcon,
  style,
  className,
  closeIconClassName
}) => {
  const isMobile = useIsMobile();
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose && onClose();
    }
  };
  return ReactDOM.createPortal(
    (
      <AnimatePresence mode='wait'>
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex lg:items-center lg:justify-center z-[100] ${className}`}
          style={style}
          onClick={handleBackdropClick}
        >
          <div className='rounded-lg relative'>
            {closeIcon || onClose ? (
              <button
                onClick={onClose}
                className={`absolute top-5 right-5 cursor-pointer z-[100] ${closeIconClassName}`}
              >
                <IconClose />
              </button>
            ) : null}
            {isMobile ? (
              <motion.div
                animate={{
                  y: [100, 0],
                  transition: {
                    duration: 0.3
                  }
                }}
                exit={{
                  y: [0, 100]
                }}
                className='w-screen h-[50vh] absolute bottom-0 left-0 rounded-t-[20px]'
              >
                {children}
              </motion.div>
            ) : (
              children
            )}
          </div>
        </div>
      </AnimatePresence>
    ) as any,
    document.body
  ) as unknown as React.ReactPortal;
};

export default Modal;
