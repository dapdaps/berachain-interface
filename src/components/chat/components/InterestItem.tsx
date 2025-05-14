import React, { ReactNode } from 'react';
import IconArrow from '@public/images/chat/xs-link.svg';


export type InterestItemType = 'vaults' | 'stake' | 'lending' | 'swap' | 'bridge';

export const TYPE_COLORS: Record<InterestItemType, string> = {
  vaults: '#FF888A',
  stake: '#EBF479',
  lending: '#EBF479',
  swap: '#FF888A', // 默认使用vault的颜色，可自定义
  bridge: '#FF888A', // 默认使用vault的颜色，可自定义
};

export interface InterestItem {
  type: InterestItemType;
  title: string;
  details: {
    tokens?: string[];
    apy?: string;
    description?: string;
  };
  link?: string;
  onClick?: () => void;
}

export const INTEREST_ITEMS: InterestItem[] = [
  {
    type: 'vaults',
    title: 'Vaults',
    details: {
      tokens: ['WBERA-iBGT'],
      apy: '1,064%',
      description: 'Join {{tokens}} vaults, earning APY up to {{apy}}'
    }
  },
  {
    type: 'vaults',
    title: 'Vaults',
    details: {
      tokens: ['WBERA-HENLO'],
      apy: '269.64%',
      description: 'Join {{tokens}} vaults, earning APY up to {{apy}}'
    }
  },
  {
    type: 'stake',
    title: 'Stake',
    details: {
      tokens: ['BGT'],
      description: 'Stake {{tokens}} to the top validator'
    }
  },
  {
    type: 'lending',
    title: 'Lending',
    details: {
      tokens: ['BERA'],
      apy: '29.76%',
      description: 'Lend {{tokens}} and earn APY {{apy}}'
    }
  }
];

const renderTemplate = (template: string, replacements: Record<string, string>): ReactNode[] => {
    if (!template) return [template];
    
    const parts = template.split(/\{\{([^}]+)\}\}/g);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const key = part.trim();
        return replacements[key] ? <strong key={index}>{replacements[key]}</strong> : `{{${key}}}`;
      }
      return part;
    });
  };

interface InterestItemProps {
  item: InterestItem;
}


const InterestItem: React.FC<InterestItemProps> = ({ item }) => {
    const { type, title, details } = item;
    
    const bgColor = TYPE_COLORS[type] || TYPE_COLORS.vaults;
    
    const getDescriptionContent = () => {
      const replacements: Record<string, string> = {};
      
      if (details.tokens) {
        replacements['tokens'] = details.tokens.join('-');
      }
      
      if (details.apy) {
        replacements['apy'] = details.apy;
      }
      
      return renderTemplate(details.description || '', replacements);
    };
    
    const handleClick = () => {
      if (item.onClick) {
        item.onClick();
      } else if (item.link) {
        window.location.href = item.link;
      }
    };
    
    return (
      <div 
        className="flex justify-between items-center cursor-pointer font-Montserrat p-[6px] h-[38px] border border-[#DAD9CD] rounded-lg"
        onClick={handleClick}
      >
        <div className="flex items-center gap-[14px]">
          <span className="p-2 border border-black leading-[12px] text-xs font-[600] rounded-[6px] font-Montserrat" 
                style={{ backgroundColor: bgColor }}>
            {title}
          </span>
          <span className="text-[13px] leading-[13px]">
            {getDescriptionContent()}
          </span>
        </div>
        <IconArrow />
      </div>
    );
  };
  
  export default InterestItem;