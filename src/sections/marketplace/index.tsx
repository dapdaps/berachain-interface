'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import HoneypotCard from '@/sections/marketplace/components/honeypot-card/index';
import PageBack from '@/components/back';
import PageTitle from '@/components/title';
import Tooltip from '@/components/tooltip';
import dexs from '@/configs/swap';
import SwapModal from '@/sections/swap/SwapModal';
import { useMemo } from 'react';
import { beraB } from '@/configs/tokens/bera-bArtio';
import useIsMobile from '@/hooks/use-isMobile';
import MemeTokensGrid from './components/memeTokensGrid.tsx';

const splitArray = (list: Record<string, any>[]) => {
  const length = list.length;
  if (!length) {
    return [];
  }
  const listAfter = [];
  for (let i = 0; i < length; i += 3) {
    listAfter.push(list.slice(i, i + 3));
  }
  return listAfter;
};

const MemeTokens = [
  {
    ...beraB.spepe,
    price: '$0.0000001',
    volume: '$0.9717'
  },
  {
    ...beraB.yeet,
    price: '$0.0000001',
    volume: '$0.9717'
  },
  {
    ...beraB.bebe,
    price: '$0.0000001',
    volume: '$0.9717'
  },
  {
    ...beraB.sproto,
    price: '$0.0000001',
    volume: '$0.9717'
  },
  {
    ...beraB.smonkey,
    price: '$0.0000001',
    volume: '$0.9717'
  }
];

export const MoreButton = (props: {
  onClick: () => void;
  classname?: string;
}) => {
  const { onClick = () => {}, classname = '' } = props;

  return (
    <button
      onClick={onClick}
      className={`pt-[8px] rounded-[16px] border border-black font-CherryBomb text-[20px] font-[400]  bg-[#FFAFDF] shadow-shadow1 ${classname}`}
    >
      <div className='rounded-[16px] bg-[#FF80CC] px-[16px] pt-[7px] pb-[15px] leading-none'>
        more
      </div>
    </button>
  );
};

const MarketplaceView = () => {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const isMobile = useIsMobile();
  const List = [
    {
      key: 'price',
      label: 'Price',
      value: '$0.0000001'
    },
    {
      key: 'volume',
      label: 'Volume',
      value: '$0.9717'
    }
  ];

  const onMore = () => {
    router.push('/marketplace/tokens');
  };

  const onFooterMore = () => {
    router.push('/marketplace/tokens');
  };

  const [protocols, tokens] = useMemo(() => {
    const _tokens: any[] = [];
    const hasTokens: any = {};
    const _protocols: string[] = [];
    Object.values(dexs).forEach((item) => {
      _protocols.push(item.name);
      item.tokens[80084].forEach((token: any) => {
        if (!hasTokens[token.symbol]) {
          _tokens.push(token);
          hasTokens[token.symbol] = true;
        }
      });
    });
    console.log(_tokens);
    return [_protocols, splitArray(_tokens)];
  }, [dexs]);

  const getAnimationName = (idx: number) => {
    if (hoveredIndex === null) {
      return 'default';
    }
    if (hoveredIndex === idx) {
      return 'hover';
    }
    if (hoveredIndex > 0 && hoveredIndex - 1 === idx) {
      return 'prev';
    }
    if (hoveredIndex < 11 && hoveredIndex + 1 === idx) {
      return 'next';
    }

    return 'default';
  };

  const onSwap = (item: any) => {
    setSelectedRecord(item);
  };

  return (
    <div className='relative md:h-full  md:overflow-y-auto overflow-x-hidden'>
      <PageBack className='absolute left-[40px] top-[31px] hidden lg:flex md:hidden' />
      <PageTitle className='pt-[30px] mb-[75px] hidden lg:block'>
        Marketplace
      </PageTitle>

      <img
        src='/images/mobile/market-header.png'
        className='w-full h-[30.769vw] absolute top-[0px] z-[1] hidden md:block'
        alt=''
      />

      <div className='relative mt-[100px] overflow-hidden lg:w-[1200px] md:w-full mx-auto rounded-[20px] mb-[100px] p-[12px] md:pt-[56px] border-[2px] border-black bg-[#D5AD67] shadow-shadow1'>
        <div className='absolute z-[2] border-black leading-none rounded-[20px] border bg-[#FF80CC] lg:text-[32px] md:text-[18px] rotate-[-5deg] md:px-[12px] lg:px-[24px] lg:pt-[18px] lg:pb-[22px] md:py-[10px] shadow-shadow1 font-CherryBomb lg:top-[-30px] lg:left-[50%] lg:translate-x-[-50%] md:left-0 md:top-[30px]'>
          Hot Sell Tokens
        </div>
        <div
          style={{ boxShadow: 'inset 10px 10px rgba(0,0,0,0.25)' }}
          className='rounded-[20px] border-[2px] border-black bg-[#695d5d] md:pb-[40px]'
        >
          {tokens.map((item, index) => (
            <div
              key={'pots' + index}
              className='overflow-hidden pb-[10px] last:overflow-visible last:pb-[0] last:mb-[-2px]'
            >
              <div className='pt-[36px] px-[22px] md:pl-0 flex flex-nowrap'>
                {item.length > 0 &&
                  item.map((it: any, idx) => (
                    <div className='basis-1/3' key={'pot' + idx}>
                      <HoneypotCard
                        name={it.symbol}
                        color={it.color}
                        icon={it.icon}
                        onSwap={() => onSwap(it)}
                      />
                    </div>
                  ))}
              </div>
              {(isMobile || (index !== tokens.length - 1 && !isMobile)) && (
                <div className='w-full h-[16px] relative top-[-2px] rounded-[10px] border-black border-[2px] lg:bg-[#D5AD67] md:bg-[#9E762F] shadow-shadow1'></div>
              )}
            </div>
          ))}
        </div>
        <div className='absolute w-[10px] right-[2px] bottom-0 h-[90%] bg-[#D5AD67]'></div>
        <MoreButton
          classname='absolute bottom-[-17px] right-[-12px] hidden lg:block'
          onClick={onMore}
        />
      </div>
      <div className='relative h-[197px] w-full bg-[#7990F4]'>
        <div className='absolute bottom-[80px] left-[50%] translate-x-[-50%] lg:w-[1200px] md:w-full md:px-3'>
          <div className='absolute bottom-[-31px] left-[50%] translate-x-[-50%] z-0 rounded-[12px] border border-black w-[1172px] h-[126px] bg-[#F5BD61]' />
          <div className='relative z-10 lg:w-[1196px]'>
            <MemeTokensGrid
              MemeTokens={MemeTokens}
              onSwap={onSwap}
              onFooterMore={onFooterMore}
            />
          </div>
        </div>
      </div>
      {selectedRecord && (
        <SwapModal
          defaultOutputCurrency={selectedRecord}
          outputCurrencyReadonly={true}
          show={!!selectedRecord}
          protocols={protocols}
          onClose={() => {
            setSelectedRecord(null);
          }}
        />
      )}
    </div>
  );
};

export default MarketplaceView;
