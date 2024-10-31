import React from 'react';
import Link from 'next/link';
import IconArrow from '@public/images/mobile/arrow-down.svg';

interface CustomButtonProps {
  href?: string;
  hasDropdown?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const MenuButton: React.FC<CustomButtonProps> = ({
  children,
  href,
  hasDropdown,
  isActive,
  onClick,
  className = ''
}) => {
  const ButtonContent = () => (
    <div className="relative w-full h-[14.87vw]">
      <div 
        className="absolute top-1 -left-1 w-full h-[12.82vw] rounded border border-black bg-[#866224]"
      />
      <div 
        className={`absolute top-0 left-0 w-full h-[12.82vw] flex items-center justify-center gap-8 px-6 bg-[#E9B965] rounded border border-black ${className}`}
      >
        <span className="text-black font-bold text-base leading-none">
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

  if (href) {
    return (
      <Link href={href} className="block w-full max-w-[51.28vw]">
        <ButtonContent />
      </Link>
    );
  }

  return (
    <button 
      onClick={onClick} 
      className={`block w-full max-w-[51.28vw] ${className}`}
    >
      <ButtonContent />
    </button>
  );
};

export default MenuButton;