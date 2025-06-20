import React from 'react';
import Skeleton from 'react-loading-skeleton';
import LazyImage from '@/components/layz-image';

type OptionItemProps = {
  index: number;
  icon: string;
  content: string;
  isSelected: boolean;
  onClick: (params: Partial<OptionData>) => void;
};

export const OptionItem: React.FC<OptionItemProps> = ({
  index,
  icon,
  content,
  isSelected, 
  onClick 
}) => {
  return (
    <div
      className="flex items-center justify-center gap-2 flex-1 cursor-pointer px-[8px] h-8 rounded-lg border border-[#DAD9CD] transition-colors text-[#999] hover:text-[#471C1C] hover:bg-[#DAD9CD]/30"
      onClick={() => onClick({ index, content })}
    >
      <img
        src={icon}
        width={18}
        height={18}
        className="shrink-0 object-center object-contain w-[18px] h-[18px]"
        // fallbackSrc="/assets/tokens/default_icon.png"
      />
      <span className="font-Montserrat font-[500] leading-[13px] text-[13px] whitespace-nowrap">{content}</span>
    </div>
  );
};

type OptionData = {
  index: number;
  icon: string;
  content: string;
};

type OptionTabsProps = {
  options: OptionData[];
  loading?: boolean;
  selectedOption: number;
  onOptionClick:  (params: Partial<OptionData>) => void;
  className?: string;
};

const QuickOptionTabs: React.FC<OptionTabsProps> = ({ 
  options,
  loading,
  selectedOption,
  onOptionClick,
  className = ''
}) => {
  return (
    <div className={`flex w-full gap-1.5 ${className}`}>
      {
        loading ? (
          <>
            <Skeleton width="100%" height={32} borderRadius={8} />
            <Skeleton width="100%" height={32} borderRadius={8} />
            <Skeleton width="100%" height={32} borderRadius={8} />
          </>
        ) : options.map((option) => (
          <OptionItem
            key={option.index}
            index={option.index}
            icon={option.icon}
            content={option.content}
            isSelected={selectedOption === option.index}
            onClick={onOptionClick}
          />
        ))
      }
    </div>
  );
};

export default QuickOptionTabs;