import React from 'react';
import IconClose from '@public/images/modal/close.svg';
interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  closeIcon?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  closeIcon,
  style,
  className,
}) => {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose && onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${className}`}
      style={style}
      onClick={handleBackdropClick}
    >
      <div className='rounded-lg relative'>
        {closeIcon || (
          <button
            onClick={onClose}
            className='absolute top-5 right-5 cursor-pointer z-100'
          >
            <IconClose />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
