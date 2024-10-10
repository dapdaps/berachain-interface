import React, { useEffect } from 'react';
import IconClose from '@public/images/modal/close.svg';
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

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] ${className}`}
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
        {children}
      </div>
    </div>
  );
};

export default Modal;
