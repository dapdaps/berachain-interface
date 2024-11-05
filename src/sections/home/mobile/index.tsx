import ConnectWallet from '@/components/connect-wallet';
import BGTCoin, { CoinType } from '@/layouts/main/BGTCoin';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import BGTMobileView from '@/sections/bgt/mobile';
import { useBgt } from '@/sections/home/hooks/useBgt';
import IBGTMobileView from '@/sections/bgt/ibgt/mobile';
import { useProgressRouter } from '@/hooks/use-progress-router';
import clsx from 'clsx'

const Home = () => {
  const router = useProgressRouter()
  const bgt = useBgt();
  const [viewportHeight, setViewportHeight] = useState('100vh');
  const [visibleHeight, setVisibleHeight] = useState(844);

  const handleBGTClick = (type: CoinType) => {
    bgt.handleBgt(true, type);
  };


  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(`${window.innerHeight}px`);
      setVisibleHeight(window.visualViewport?.height || window.innerHeight);
    };
    
    updateViewportHeight(); 
    window.addEventListener('resize', updateViewportHeight); 
    
    return () => {
      window.removeEventListener('resize', updateViewportHeight);
    };
  }, []);


  return (
    <div className="relative w-full min-h-screen bg-[#F5F5F5]">
        <div className="w-full flex items-center justify-between px-3 fixed top-4 left-0 right-0 z-[10]">
            <div className='flex h-[10.77vw] rounded-[5.12vw] bg-white bg-opacity-60 backdrop-blur-[10px]'>
                <ConnectWallet />
            </div>
            <div className="text-white flex items-center gap-x-[17px]">
                <BGTCoin
                  type={CoinType.BGT}
                  count={0}
                  bp="1001-004"
                  onClick={handleBGTClick}
                />
                <BGTCoin
                  type={CoinType.iBGT}
                  count={0}
                  bp="1001-005"
                  onClick={handleBGTClick}
                />
            </div>
        </div>
      <div 
        className="relative w-full h-screen overflow-hidden"
        style={{
          maxHeight: 'calc( 844/390 * 100vh)',
          backgroundImage: "url('/images/mobile/beratown-home.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >       
        <div className={clsx('w-full h-full', visibleHeight < 844 ? '0':'mt-[12.82vw]')}>
          <div className='relative w-[46.6666vw] h-[25.128vw] top-[19.487vw] left-[10.256vw]'>
            <img src="/images/mobile/home/bg-bridge.png" alt="" className='w-full h-full'/>
            <img src="/images/mobile/home/text-bridge.png" onClick={() => router.push('/bridge')} className='absolute left-0 -bottom-6 w-[22.564vw] h-[20.512vw]' alt="" />
          </div>
          <div className='relative w-[65.64vw] h-[47.43vw] top-[10.256vw] left-[40.256vw]'>
            <img src="/images/mobile/home/bg-market.png" alt="" className='w-full h-full'/>
            <img src="/images/mobile/home/text-market.png"  onClick={() => router.push('/marketplace')}  className='absolute right-[9.856vw] bottom-[8.697vw] w-[37.435vw] h-[11.282vw]' alt="" />
          </div>
          <div className='relative w-[63.076vw] h-[56.153vw] -top-[12.85vw] -left-[10.256vw]'>
            <img src="/images/mobile/home/bg-dapps.png" alt="" className='w-full h-full'/>
            <img src="/images/mobile/home/text-dapps.png" onClick={() => router.push('/dapps')} className='absolute left-[21.538vw] top-[6.153vw] w-[20.512vw] h-[8.717vw]' alt="" />
          </div>
          <div className='relative w-[77.435vw] h-[54.684vw] -top-[45.641vw] -right-[34.871vw]'>
            <img src="/images/mobile/home/bg-dashboard.png" alt="" className='w-full h-full'/>
            <img src="/images/mobile/home/text-dashboard.png" onClick={() => router.push('/dashboard')} className='absolute right-[18.974vw] bottom-[10.471vw] w-[30.769vw] h-[9.271vw]' alt="" />
          </div>
           <div className='relative w-[73.846vw] h-[47.692vw] -top-[65.64vw] -left-[17.948vw]'>
            <img src="/images/mobile/home/bg-vaults.png" alt="" className='w-full h-full'/>
            <img src="/images/mobile/home/text-vaults.png" onClick={() => router.push('/earn')} className='absolute left-[32.307vw] top-[7.692vw] w-[21.538vw] h-[11.794vw]' alt="" />
          </div>
          <div className='relative w-[77.435vw] h-[51.794vw] -top-[76.923vw] -right-[33.846vw]'>
            <img src="/images/mobile/home/bg-cave.png" alt="" className='w-full h-full'/>
            <img src="/images/mobile/home/text-cave.png" onClick={() => router.push('/cave')} className='absolute top-0 left-[21.025vw] w-[32.679vw] h-[14.407vw]' alt="" />
          </div>
        </div>
      </div>
      <BGTMobileView
        visible={bgt.visible && bgt.type === CoinType.BGT}
        onClose={() => {
          bgt.handleBgt(false);
        }}
      />
      <IBGTMobileView
        visible={bgt.visible && bgt.type === CoinType.iBGT}
        onClose={() => {
          bgt.handleBgt(false);
        }}
      />
    </div>
  );
};

export default Home;