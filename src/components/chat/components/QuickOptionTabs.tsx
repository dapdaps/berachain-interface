import React from 'react';

type OptionItemProps = {
  id: string;
  icon: React.ReactNode;
  text: string;
  isSelected: boolean;
  onClick: (id: string) => void;
};

// 单个选项按钮组件
export const OptionItem: React.FC<OptionItemProps> = ({ 
  id, 
  icon, 
  text, 
  isSelected, 
  onClick 
}) => {
  return (
    <div
      className={`flex items-center justify-center gap-2 flex-1 cursor-pointer px-[8px] h-8 rounded-lg border border-[#DAD9CD] transition-colors ${
        isSelected 
        ? 'text-[#471C1C] bg-[#DAD9CD]/30' 
        : 'text-[#999]'
      }`}
      onClick={() => onClick(id)}
    >
      {icon}
      <span className="font-Montserrat font-[500] leading-[13px] text-[13px]">{text}</span>
    </div>
  );
};

type OptionData = {
  id: string;
  icon: React.ReactNode;
  text: string;
};

type OptionTabsProps = {
  options: OptionData[];
  selectedOption: string;
  onOptionClick: (option: string) => void;
  className?: string;
};

const QuickOptionTabs: React.FC<OptionTabsProps> = ({ 
  options, 
  selectedOption, 
  onOptionClick,
  className = ''
}) => {
  return (
    <div className={`flex w-full gap-1.5 ${className}`}>
      {options.map((option) => (
        <OptionItem
          key={option.id}
          id={option.id}
          icon={option.icon}
          text={option.text}
          isSelected={selectedOption === option.id}
          onClick={onOptionClick}
        />
      ))}
    </div>
  );
};

export default QuickOptionTabs;