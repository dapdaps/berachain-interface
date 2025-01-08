import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import IconClose from "@public/images/modal/close.svg";
import useIsMobile from "@/hooks/use-isMobile";
import { AnimatePresence, motion } from "framer-motion";

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
}

const Modal: React.FC<ModalProps> = (props) => {
  const {
    children,
    ...restProps
  } = props;

  if (!props.open) return null;

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
    isShowCloseIcon = true
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
    <AnimatePresence mode="wait">
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex lg:items-center lg:justify-center z-[100] ${className}`}
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
          {isMobile && !isForceNormal ? (
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
              className="w-screen absolute bottom-0 left-0 rounded-t-[20px]"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {children}
            </motion.div>
          ) : (
            <motion.div
              initial={{
                y: 30
              }}
              animate={{
                y: 0
              }}
              exit={{
                y: 30
              }}
            >
              {closeIcon || onClose ? (
                <button
                  onClick={onClose}
                  className={`absolute top-5 right-5 cursor-pointer z-[100] ${closeIconClassName}`}
                >
                  <IconClose />
                </button>
              ) : null}
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};
