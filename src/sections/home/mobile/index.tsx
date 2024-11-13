import ConnectWallet from '@/components/connect-wallet';
import BGTCoin, { CoinType } from '@/layouts/main/BGTCoin';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import BGTMobileView from '@/sections/bgt/mobile';
import { useBgt } from '@/sections/home/hooks/useBgt';
import IBGTMobileView from '@/sections/bgt/ibgt/mobile';
import { useProgressRouter } from '@/hooks/use-progress-router';
import clsx from 'clsx';
import { useBgtCount } from '@/hooks/use-bgt-count';
import useIsMobile from '@/hooks/use-isMobile';
import Big from 'big.js';
import { motion } from 'framer-motion';
import { useTapSoundStore } from '@/stores/tap-sound';
import useClickTracking from '@/hooks/use-click-tracking';

const Home = () => {
  const router = useProgressRouter();
  const bgt = useBgt();
  const { iBGTCount, BGTCount } = useBgtCount();
  const isMobile = useIsMobile();
  const tapSound = useTapSoundStore();
  const { handleReport } = useClickTracking();

  const [viewportHeight, setViewportHeight] = useState('100vh');
  const [visibleHeight, setVisibleHeight] = useState(844);

  const handleBGTClick = (type: CoinType) => {
    bgt.handleBgt(true, type);
    tapSound.play?.();
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
    <div className='relative w-full h-dvh overflow-hidden bg-[#B6DF5D]'>
      <div className='w-full flex items-center justify-between px-3 fixed top-4 left-0 right-0 z-[10]'>
        <div className='flex h-[10.77vw] rounded-[5.12vw] bg-white bg-opacity-60 backdrop-blur-[10px]'>
          <ConnectWallet />
        </div>
        <div
          className='text-white flex items-center justify-end gap-x-[10px]'
          style={isMobile && ((Big(BGTCount || 0).gt(0) && Big(BGTCount || 0).lt(1e2)) || (Big(iBGTCount || 0).gt(0) && Big(iBGTCount || 0).lt(1e2))) ? { scale: 0.85 } : {}}
        >
          <BGTCoin
            type={CoinType.BGT}
            count={BGTCount}
            bp='1015-009'
            onClick={handleBGTClick}
          />
          <BGTCoin
            type={CoinType.iBGT}
            count={iBGTCount}
            bp='1015-010'
            onClick={handleBGTClick}
          />
        </div>
      </div>
      <div className='w-full h-dvh overflow-y-scroll overflow-x-hidden'>
        <div
          className='relative w-full overflow-hidden'
          style={{
            backgroundImage: "url('/images/mobile/beratown-home.jpg')",
            backgroundSize: '100%',
            backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat',
            height: visibleHeight + 130 + 'px',
          }}
        >
          <motion.div
            className='relative w-[182px] h-[25.128vw] top-[19.487vw] left-[10.256vw]'
            whileTap="tap"
          >
            <motion.img
              src='/images/mobile/home/bg-bridge.png'
              alt=''
              className='w-full h-full'
              variants={EntryAnimationBg}
              transition={EntryAnimation}
            />
            <motion.img
              src='/images/mobile/home/text-bridge.png'
              onClick={() => {
                router.push('/bridge');
                tapSound.play?.();
              }}
              className='absolute left-0 -bottom-6 w-[22.564vw] h-[20.512vw]'
              alt=''
              variants={EntryAnimationSignpost}
              transition={EntryAnimation}
              data-bp="1015-003"
            />
          </motion.div>
          <motion.div
            className='relative w-[65.64vw] h-[47.43vw] top-[10.256vw] left-[40.256vw]'
            whileTap="tap"
          >
            <motion.img
              src='/images/mobile/home/bg-market.png'
              alt=''
              className='w-full h-full'
              variants={EntryAnimationBg}
              transition={EntryAnimation}
            />
            <motion.img
              src='/images/mobile/home/text-market.png'
              onClick={() => {
                router.push('/marketplace');
                tapSound.play?.();
              }}
              className='absolute right-[9.856vw] bottom-[8.697vw] w-[37.435vw] h-[11.282vw]'
              alt=''
              variants={EntryAnimationSignpost}
              transition={EntryAnimation}
              data-bp="1015-004"
            />
          </motion.div>
          <motion.div
            className='relative w-[63.076vw] h-[56.153vw] -top-[12.85vw] -left-[10.256vw]'
            whileTap="tap"
          >
            <motion.img
              src='/images/mobile/home/bg-dapps.png'
              alt=''
              className='w-full h-full'
              variants={EntryAnimationBg}
              transition={EntryAnimation}
            />
            <motion.img
              src='/images/mobile/home/text-dapps.png'
              onClick={() => {
                router.push('/dapps');
                tapSound.play?.();
                // handleReport('1015-005');
              }}
              className='absolute left-[21.538vw] top-[6.153vw] w-[20.512vw] h-[8.717vw]'
              alt=''
              variants={EntryAnimationSignpost}
              transition={EntryAnimation}
              data-bp="1015-005"
            />
          </motion.div>
          <motion.div
            className='relative w-[77.435vw] h-[54.684vw] -top-[45.641vw] -right-[34.871vw]'
            whileTap="tap"
          >
            <motion.img
              src='/images/mobile/home/bg-dashboard.png'
              alt=''
              className='w-full h-full'
              variants={EntryAnimationBg}
              transition={EntryAnimation}
            />
            <motion.img
              src='/images/mobile/home/text-dashboard.png'
              onClick={() => {
                router.push('/dashboard');
                tapSound.play?.();
                // handleReport('1015-006');
              }}
              className='absolute right-[18.974vw] bottom-[10.471vw] w-[30.769vw] h-[9.271vw]'
              alt=''
              variants={EntryAnimationSignpost}
              transition={EntryAnimation}
              data-bp="1015-006"
            />
          </motion.div>
          <motion.div
            className='relative w-[73.846vw] h-[47.692vw] -top-[65.64vw] -left-[17.948vw]'
            whileTap="tap"
          >
            <motion.img
              src='/images/mobile/home/bg-vaults.png'
              alt=''
              className='w-full h-full'
              variants={EntryAnimationBg}
              transition={EntryAnimation}
            />
            <motion.img
              src='/images/mobile/home/text-vaults.png'
              onClick={() => {
                router.push('/earn');
                tapSound.play?.();
                // handleReport('1015-007');
              }}
              className='absolute left-[32.307vw] top-[7.692vw] w-[21.538vw] h-[11.794vw]'
              alt=''
              variants={EntryAnimationSignpost}
              transition={EntryAnimation}
              data-bp="1015-007"
            />
          </motion.div>
          <motion.div
            className='relative w-[77.435vw] h-[51.794vw] -top-[76.923vw] -right-[33.846vw]'
            whileTap="tap"
          >
            <motion.img
              src='/images/mobile/home/bg-cave.png'
              alt=''
              className='w-full h-full'
              variants={EntryAnimationBg}
              transition={EntryAnimation}
            />
            <motion.img
              src='/images/mobile/home/text-cave.png'
              onClick={() => {
                router.push('/cave');
                tapSound.play?.();
                // handleReport('1015-008');
              }}
              className='absolute top-0 left-[21.025vw] w-[32.679vw] h-[14.407vw]'
              alt=''
              variants={EntryAnimationSignpost}
              transition={EntryAnimation}
              data-bp="1015-008"
            />
          </motion.div>
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

const EntryAnimation = {
  type: 'spring',
  stiffness: 200,
  damping: 10,
};
const EntryAnimationBg = {
  tap: {
    y: 4,
    scale: 0.95,
  },
};
const EntryAnimationSignpost = {
  tap: {
    y: -8,
    scale: 1.10,
  },
};
