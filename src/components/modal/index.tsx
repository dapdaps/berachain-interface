import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import IconClose from "@public/images/modal/close.svg";
import useIsMobile from "@/hooks/use-isMobile";
import { AnimatePresence, motion } from "framer-motion";
import clsx from 'clsx';

interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  closeIcon?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  closeIconClassName?: string;
  isForceNormal?: boolean;
  innerStyle?: React.CSSProperties;
  innerClassName?: string;
  isMaskClose?: boolean;
  isShowCloseIcon?: boolean;
  isStyleHide?: boolean;
}

const Modal: React.FC<ModalProps> = (props) => {
  const {
    children,
    ...restProps
  } = props;

  if (!props.open && !props.isStyleHide) return null;

  return ReactDOM.createPortal(
    (
      <ModalContent {...restProps}>
        {children}
      </ModalContent>
    ) as any,
    document.body
  ) as unknown as React.ReactPortal;
};

export default Modal;

export const ModalContent = (props: ModalProps) => {
  const {
    open,
    onClose,
    children,
    closeIcon,
    style,
    className,
    closeIconClassName,
    isForceNormal,
    innerStyle,
    innerClassName,
    isMaskClose = true,
    isShowCloseIcon = true,
    isStyleHide
  } = props;

  const isMobile = useIsMobile();

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMaskClose) return;
    if (e.target === e.currentTarget || isMobile) {
      onClose && onClose();
    }
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={clsx(
        "fixed inset-0 bg-black bg-opacity-50 lg:items-center lg:justify-center z-[100]",
        className,
        isStyleHide ? (open ? "flex" : "hidden") : "flex"
      )}
      style={style}
      onClick={handleBackdropClick}
    >
      <div
        className={`rounded-lg relative ${innerClassName}`}
        style={innerStyle}
      >
        {isShowCloseIcon && (closeIcon || onClose) ? (
          <button
            onClick={onClose}
            className={`absolute top-5 right-5 cursor-pointer z-[100] ${closeIconClassName}`}
          >
            {
              closeIcon ? closeIcon : <IconClose />
            }
          </button>
        ) : null}
        <AnimatePresence mode="wait">
          {isMobile && !isForceNormal ? (
            <motion.div
              key="mobile-modal"
              initial={{
                opacity: 0,
                y: 100,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 100,
              }}
              transition={{
                duration: 0.15,
                ease: "easeInOut",
              }}
              className="w-screen absolute bottom-0 left-0 rounded-t-[20px]"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {children}
            </motion.div>
          ) : (
            <motion.div
              key="pc-modal"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.15,
                ease: "easeInOut",
              }}
              className=""
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
