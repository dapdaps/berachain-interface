'use client';

import HoneypotCard from '@/sections/marketplace/HoneypotCard';

const splitArray = (list: Record<string, any>[]) =>  {
  const length = list.length;
  const listAfter = [];
  for (let i = 0; i < length; i+=3) {
    listAfter.push(list.slice(i, i + 3));
  }
  return listAfter;
}

const MarketplaceView = () => {

  return (
      <div className='relative w-[1200px] mx-auto rounded-[20px] p-[10px] mt-[75px] border-[2px] border-black bg-[#D5AD67] shadow-shadow1'>
        <div className='absolute z-[2] border-black leading-none rounded-[20px] border bg-[#FF80CC] text-[32px] rotate-[-5.851deg] px-[24px] pt-[18px] pb-[22px] shadow-shadow1 font-CherryBomb top-[-27px] left-[50%] translate-x-[-50%]'>
          Hot Sell Tokens
        </div>
        <div
          style={{ boxShadow: 'inset 10px 10px rgba(0,0,0,0.25)' }}
          className='rounded-[20px] border-[2px] border-black bg-[#695d5d] overflow-hidden'
        >
          {
              splitArray(new Array(8).fill(0)).map((item, index) => (
                <div key={'pots' + index} className='pt-[55px] first:pt-[42px] px-[22px] relative flex flex-nowrap after:content-[""] after:block after:w-full after:h-[14px] after:rounded-[10px] after:absolute after:left-0 after:border-black after:border-[2px] after:bg-[#D5AD67] after:bottom-[-12px] after:shadow-shadow1 last:after:hidden'>
                  {
                    item.length > 0 && item.map((it, idx) => (
                      <div className="basis-1/3" key={'pot' + idx}>
                        <HoneypotCard name={'BERA'} color={'red'} icon={'/images/bear.svg'} />
                      </div>
                    ))
                  }
                </div>
                  ))
          }
        </div>
        <button className='absolute bottom-[-17px] right-[-12px] pt-[8px] rounded-[16px] border border-black font-CherryBomb text-[20px] font-[400]  bg-[#FFAFDF] shadow-shadow1'>
          <div className='rounded-[16px] bg-[#FF80CC] px-[16px] pt-[7px] pb-[15px] leading-none'>more</div>
        </button>
      </div>
  )
}

export default MarketplaceView;