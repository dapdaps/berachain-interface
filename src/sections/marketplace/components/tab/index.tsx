'use client';
import { useState } from 'react';
import Token from '../token';
import Liquidity from '../liquidity';
import Invest from '../lnvest';

const tabs = [
  {
    title: 'Token',
    content: Token
  },
  {
    title: 'Liquidity',
    content: Liquidity
  },
  {
    title: 'Invest',
    content: Invest
  }
];

function getStyle(tabs: any[], index: number) {
  if (index === 0) {
    return { borderRadius: '0 20px 20px 20px' };
  }

  if (tabs.length - 1 === index) {
    return { borderRadius: '20px 0 20px 20px' };
  }

  return {};
}

export default function Tab() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div className='flex h-[80px]'>
        {tabs.map((tab: any, index) => {
          return (
            <div
              key={tab.title}
              onClick={() => {
                setActiveIndex(index);
              }}
              className={
                (activeIndex === index
                  ? 'bg-[#FFFDEB] h-[61px] mt-[-10px] border-t-[#000] border-b-[#FFFDEB] border-x-[#000] shadow-[10px_9px_0px_0px_#00000040] z-10 pb-[0px] pt-[10px] rounded-t-[20px]'
                  : 'bg-[#E9E3B5] h-[80px] rounded-[20px] border-[#000]') +
                ' flex justify-center items-center  border  flex-1  cursor-pointer pb-[30px] relative'
              }
            >
              <span className='whitespace-nowrap font-bold text-[18px]'>
                {tab.title}
              </span>
              {index !== 0 && activeIndex === index && (
                <div className='absolute w-[20px] h-[20px] bg-[#FFFDEB] bottom-[-1px] left-[-20px] overflow-hidden'>
                  <div className='absolute w-[80px] h-[80px] rounded-[20px] border border-r-[#000] border-b-[#000] right-0 bottom-0 bg-[#E9E3B5]'></div>
                </div>
              )}

              {index !== tabs.length - 1 && activeIndex === index && (
                <div className='absolute w-[20px] h-[20px] bg-[#FFFDEB] bottom-[-1px] right-[-20px] overflow-hidden'>
                  <div className='absolute w-[80px] h-[80px] rounded-[20px] border border-l-[#000] border-b-[#000] left-0 bottom-0 bg-[#E9E3B5] overflow-hidden'>
                    <div className='w-[10px] h-[20px] bg-[#00000040] absolute left-0 bottom-0'></div>
                  </div>
                </div>
              )}

              <div
                className={
                  (index !== tabs.length - 1 ? 'right-[-11px]' : 'right-0') +
                  ' absolute h-[10px] left-0 bottom-[-10px] bg-[#FFFDEB]'
                }
              ></div>
            </div>
          );
        })}
      </div>

      {tabs.map((tab: any, index) => {
        return (
          activeIndex === index && (
            <div
              style={getStyle(tabs, index)}
              key={tab.title}
              className={
                'px-[30px] py-[20px] border border-[#000] rounded-[20px] relative mt-[-30px] bg-[#FFFDEB] shadow-[10px_10px_0px_0px_#00000040]'
              }
            >
              <tab.content />
            </div>
          )
        );
      })}
    </div>
  );
}
