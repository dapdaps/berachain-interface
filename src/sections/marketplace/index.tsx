'use client';

import HoneypotCard from '@/sections/marketplace/HoneypotCard';
import PageBack from '@/components/back';
import PageTitle from '@/components/title';
import Image from '@/components/layz-image';
import Tooltip from '@/components/tooltip';
import { useRouter } from 'next/navigation';
import dexs from '@/configs/swap';
import { useMemo } from 'react';

const splitArray = (list: Record<string, any>[]) =>  {
  const length = list.length;
  const listAfter = [];
  for (let i = 0; i < length; i+=3) {
    listAfter.push(list.slice(i, i + 3));
  }
  return listAfter;
}

const MoreButton = (props: { onClick: () => void; classname?: string; }) => {
  const {
    onClick = () => {},
    classname = ''
  } = props;

  return (
    <button
      onClick={onClick}
      className={`pt-[8px] rounded-[16px] border border-black font-CherryBomb text-[20px] font-[400]  bg-[#FFAFDF] shadow-shadow1 ${classname}`}
    >
      <div className="rounded-[16px] bg-[#FF80CC] px-[16px] pt-[7px] pb-[15px] leading-none">more</div>
    </button>
  );
}

const MarketplaceView = () => {
  const router = useRouter();

  const List = [
    {
      key: 'price',
      label: 'Price',
      value: '$0.0000001',
    },
    {
      key: 'volume',
      label: 'Volume',
      value: '$0.9717',
    },
  ]

  const onMore = () => {
    router.push('/marketplace/list');
  };

  const onFooterMore = () => {
    router.push('/marketplace/list');
  };

  console.log('dexs:', dexs)
  const tokens = useMemo(() => {
    const _tokens: any[] = []
    const hasTokens: any = {}
    Object.values(dexs).forEach((item) => {
      console.log('item:', item)
      item.tokens[80084].forEach((token: any) => {
        if (!hasTokens[token.symbol]) {
          _tokens.push(token)
          hasTokens[token.symbol] = true
        }
       
      })
    })

    return _tokens

  }, [dexs])

  return (
    <div className="relative">
      <PageBack className="absolute left-[36px] top-[31px]" />
      <PageTitle className="pt-[30px] mb-[75px]">Marketplace</PageTitle>
      <div
        className='relative w-[1200px] mx-auto rounded-[20px] mb-[100px] p-[12px] border-[2px] border-black bg-[#D5AD67] shadow-shadow1'>
        <div
          className='absolute z-[2] border-black leading-none rounded-[20px] border bg-[#FF80CC] text-[32px] rotate-[-5deg] px-[24px] pt-[18px] pb-[22px] shadow-shadow1 font-CherryBomb top-[-27px] left-[50%] translate-x-[-50%]'>
          Hot Sell Tokens
        </div>
        <div
          style={{ boxShadow: 'inset 10px 10px rgba(0,0,0,0.25)' }}
          className='rounded-[20px] border-[2px] border-black bg-[#695d5d] '
        >
          {
            splitArray(tokens).map((item, index) => (
              <div key={'pots' + index}
                   className='pt-[55px] last:mb-[-2px] first:pt-[42px] last:pt-[57px] px-[22px] relative flex flex-nowrap after:content-[""] after:block after:w-full after:h-[14px] after:rounded-[10px] after:absolute after:left-0 after:border-black after:border-[2px] after:bg-[#D5AD67] after:bottom-[-12px] after:shadow-shadow1 last:after:hidden'>
                {
                  item.length > 0 && item.map((it: any, idx) => (
                    <div className="basis-1/3" key={'pot' + idx}>
                      <HoneypotCard name={it.symbol} color={'red'} icon={it.icon} />
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>
        <div className='absolute w-[10px] right-[2px] bottom-0 h-[90%] bg-[#D5AD67]'></div> 
        <MoreButton
          classname='absolute bottom-[-17px] right-[-12px]'
          onClick={onMore}
        />
        
      </div>
      <div className='relative h-[197px] w-full bg-[#7990F4]'>
        <div className='absolute bottom-[80px] left-[50%] translate-x-[-50%] w-[1200px]'>
          <div
            className='absolute bottom-[-31px] left-[50%] translate-x-[-50%] z-0 rounded-[12px] border border-black w-[1172px] h-[126px] bg-[#F5BD61]' />
          <div className='relative z-10 w-[1196px]'>
            <div
              className='h-[86px] w-full rounded-t-[10px] bg-[#D5AD67] border border-black border-b-0 p-[12px]'>
              <div className="w-full h-[91px] relative top-[-50%] overflow-hidden">
                <div
                  className="w-full absolute bottom-0 h-[62px] bg-[#402E10] border border-black rounded-[10px] flex flex-nowrap px-[32px] gap-x-[32px]">
                  {
                    new Array(1).fill(0).map((item, index) => (
                      <Tooltip
                        children={(
                          <Image
                            variants={{
                              hover: {
                                // scale: 1.3,
                                transition: {
                                  when: 'beforeChildren',
                                  delay: 0
                                }
                              },
                              default: {
                                scale: 1
                              }
                            }}
                            whileHover="hover"
                            initial="default"
                            containerStyle={{
                              transformOrigin: 'bottom center'
                            }}
                            alt=""
                            src="/images/dapps/honey.png"
                            containerClassName=" rounded-[50%] w-[80px] h-[80px] shadow-shadow1 relative z-[10]"
                          />
                        )}
                       tooltip={(
                         <div>
                           <div className='flex items-end gap-x-[3px] mb-[16px]'>
                             <div className='text-[20px] font-CherryBomb leading-none'>HONEY</div>
                             <div className='text-[#3D405A] text-[14px] font-Montserrat'>blackcat</div>
                           </div>
                           {
                             List.map(it => (
                               <div key={it.key} className='flex flex-nowrap mb-[16px] last:mb-0 items-start justify-between gap-x-[20px] text-[#3D405A] text-[14px] font-Montserrat'>
                                 <div className='grow'>{it.label}</div>
                                 <div className='font-[600] flex-shrink-0'>{it.value}</div>
                               </div>
                             ) )
                           }
                         </div>
                       )}>
                      </Tooltip>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className="relative">
              <div
                className="absolute top-[9px] left-[50%] translate-x-[-50%] z-10 font-CherryBomb text-[32px] leading-[0.9] p-[21px] bg-[#B2E946] border border-black rounded-[20px] rotate-[5deg] shadow-shadow1 w-fit">Meme
                Tokens
              </div>
              <MoreButton
                classname="absolute top-[50%] translate-y-[-50%] right-[-12px]"
                onClick={onFooterMore}
              />
              <div
                className="z-0 shadow-shadow1 w-full h-[44px] bg-[#9E762F] rounded-b-[10px] border border-black mb-[7px]" />
              <div className="z-0 shadow-shadow1 w-full h-[44px] bg-[#9E762F] rounded-[10px] border border-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketplaceView;