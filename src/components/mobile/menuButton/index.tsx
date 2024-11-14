import React from 'react';
import Link from 'next/link';
import IconArrow from '@public/images/mobile/arrow-down.svg';
import { usePathname } from 'next/navigation';

interface CustomButtonProps {
  href?: string;
  hasDropdown?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  toggle?: (isSkipTrack?: boolean) => void;
  className?: string;
  children: React.ReactNode;
  contentClassName?: string;
  dataBp?: string;
}

const MenuButton: React.FC<CustomButtonProps> = ({
  children,
  href,
  hasDropdown,
  isActive,
  onClick,
  toggle,
  className = '',
  contentClassName = '',
  dataBp,
}) => {
  const ButtonContent = () => (
    <div className="relative w-full h-[14.87vw]">
      <div 
        className="absolute top-1 -left-1 w-full h-[12.82vw] rounded border border-black bg-[#866224]"
      />
      <div 
        className={`absolute top-0 left-0 w-full h-[12.82vw] flex items-center justify-center gap-8 px-6 bg-[#E9B965] rounded border border-black  text-base ${contentClassName}`}
      >
        <span className="text-black font-bold leading-none font-CherryBomb">
          {children}
        </span>
        {hasDropdown && (
          <IconArrow 
            className={`w-[20px] h-[12px] transform transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`}
          />
        )}
      </div>
    </div>
  );

  const pathname = usePathname()

  if (href) {
    if (href === pathname) {
      return (<button 
        onClick={() => toggle?.(true)}
        className={`block w-full max-w-[51.28vw] ${className}`}
        data-bp={dataBp}
      >
        <ButtonContent />
      </button>)
    }

    return (
      <Link href={href} className="block w-full max-w-[51.28vw]" data-bp={dataBp}>
        <ButtonContent />
      </Link>
    );
  }

  return (
    <button 
      onClick={onClick} 
      className={`block w-full max-w-[51.28vw] ${className}`}
      data-bp={dataBp}
    >
      <ButtonContent />
    </button>
  );
};

export default MenuButton;