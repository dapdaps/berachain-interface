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
    ...beraB.honey,
    price: '$0.0000001',
    volume: '$0.9717',
  },
  {
    ...beraB.mimg,
    price: '$0.0000001',
    volume: '$0.9717',
  }
];

const MoreButton = (props: { onClick: () => void; classname?: string }) => {
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
    <div className='relative'>
      <PageBack className='absolute left-[40px] top-[31px]' />
      <PageTitle className='pt-[30px] mb-[75px]'>Marketplace</PageTitle>
      <div className='relative w-[1200px] mx-auto rounded-[20px] mb-[100px] p-[12px] border-[2px] border-black bg-[#D5AD67] shadow-shadow1'>
        <div className='absolute z-[2] border-black leading-none rounded-[20px] border bg-[#FF80CC] text-[32px] rotate-[-5deg] px-[24px] pt-[18px] pb-[22px] shadow-shadow1 font-CherryBomb top-[-30px] left-[50%] translate-x-[-50%]'>
          Hot Sell Tokens
        </div>
        <div
          style={{ boxShadow: 'inset 10px 10px rgba(0,0,0,0.25)' }}
          className='rounded-[20px] border-[2px] border-black bg-[#695d5d] overflow-visible'
        >
          {tokens.map((item, index) => (
            <div
              key={'pots' + index}
              className='overflow-hidden pb-[10px] last:overflow-visible last:pb-[0] last:mb-[-2px]'
            >
              <div className='pt-[36px] px-[22px] flex flex-nowrap'>
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
              {index !== tokens.length - 1 && (
                <div className='w-full h-[16px] relative top-[-2px] rounded-[10px] border-black border-[2px] bg-[#D5AD67] shadow-shadow1'></div>
              )}
            </div>
          ))}
        </div>
        <div className='absolute w-[10px] right-[2px] bottom-0 h-[90%] bg-[#D5AD67]'></div>
        <MoreButton
          classname='absolute bottom-[-17px] right-[-12px]'
          onClick={onMore}
        />
      </div>
      <div className='relative h-[197px] w-full bg-[#7990F4]'>
        <div className='absolute bottom-[80px] left-[50%] translate-x-[-50%] w-[1200px]'>
          <div className='absolute bottom-[-31px] left-[50%] translate-x-[-50%] z-0 rounded-[12px] border border-black w-[1172px] = h-[126px] bg-[#F5BD61]' />
          <div className='relative z-10 w-[1196px]'>
            <div className='h-[86px] w-full rounded-t-[10px] bg-[#D5AD67] border border-black border-b-0 p-[12px]'>
              <div className='w-full h-[91px] relative top-[-50%] overflow-hidden'>
                <div className='w-full absolute bottom-0 h-[62px] bg-[#402E10] border border-black rounded-[10px] flex flex-nowrap px-[32px] gap-x-[32px]'>
                  {MemeTokens.map((item, index) => (
                    <Tooltip
                      key={'tooltip' + index}
                      isShake={true}
                      offset={30}
                      children={
                        <motion.div
                          onHoverStart={() => setHoveredIndex(index)}
                          onHoverEnd={() => setHoveredIndex(null)}
                        >
                          <motion.div
                            className='bg-[#ffffff] rounded-[50%] w-[80px] h-[80px] shadow-shadow1 p-0'
                            animate={(() => getAnimationName(index)) as any}
                            variants={{
                              hover: {
                                scale: 1.5,
                                padding: 4
                              },
                              default: {
                                scale: 1,
                                padding: 0
                              },
                              prev: {
                                x: -10
                              },
                              next: {
                                x: 10
                              }
                            }}
                          >
                            <img
                              alt=''
                              src={item.icon}
                              style={{
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                              onClick={() => onSwap(item)}
                            />
                          </motion.div>
                        </motion.div>
                      }
                      tooltip={
                        <div>
                          <div className="flex items-end gap-x-[3px] mb-[16px]">
                            <div className="text-[20px] font-CherryBomb leading-none">
                              {item.symbol}
                            </div>
                            <div className="text-[#3D405A] text-[14px] font-Montserrat">
                              blackcat
                            </div>
                          </div>
                          <div className="flex flex-nowrap mb-[16px] last:mb-0 items-start justify-between gap-x-[20px] text-[#3D405A] text-[14px] font-Montserrat">
                            <div className="grow">Price</div>
                            <div className="font-[600] flex-shrink-0">
                              {item.price}
                            </div>
                          </div>
                          <div className="flex flex-nowrap mb-[16px] last:mb-0 items-start justify-between gap-x-[20px] text-[#3D405A] text-[14px] font-Montserrat">
                            <div className="grow">Volume</div>
                            <div className="font-[600] flex-shrink-0">
                              {item.volume}
                            </div>
                          </div>
                        </div>
                      }
                    ></Tooltip>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute top-[9px] left-[50%] translate-x-[-50%] z-10 font-CherryBomb text-[32px] leading-[0.9] p-[21px] bg-[#B2E946] border border-black rounded-[20px] rotate-[5deg] shadow-shadow1 w-fit">
                Meme Tokens
              </div>
              <MoreButton
                classname='absolute top-[50%] translate-y-[-50%] right-[-12px]'
                onClick={onFooterMore}
              />
              <div className='z-0 shadow-shadow1 w-full h-[44px] bg-[#9E762F] rounded-b-[10px] border border-black mb-[7px]' />
              <div className='z-0 shadow-shadow1 w-full h-[44px] bg-[#9E762F] rounded-[10px] border border-black' />
            </div>
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
