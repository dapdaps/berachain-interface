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
            style={{ clipPath: `path("M18.9114 5.11072C2.51142 13.1107 -2.58852 33.6113 -0.588519 43.6113C-0.588519 53.1114 1.91148 77.8111 1.91148 86.6111C1.91148 95.4111 14.0781 97.2778 18.9114 97.1111C17.5781 100.444 15.7114 109.611 18.9114 119.611C22.9114 132.111 77.9114 129.111 88.9114 124.611C97.7114 121.011 99.5781 102.778 99.4114 94.1111L126.411 84.1113C152.912 84.1113 161.411 86.1113 175.411 84.1113C189.411 82.1113 187.911 75.6111 179.411 61.6111C172.611 50.4111 153.245 53.9444 144.411 57.1111C135.911 35.6111 103.411 0.611248 90.9114 -2.38875C78.4114 -5.38875 39.4114 -4.88928 18.9114 5.11072Z")` }}
            data-bp="1015-003"
            onClick={() => {
              router.push('/bridge');
              tapSound.play?.();
            }}
            
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
              className='absolute left-0 -bottom-6 w-[22.564vw] h-[20.512vw]'
              variants={EntryAnimationSignpost}
              transition={EntryAnimation}
            />
          </motion.div>
          <motion.div
            className='relative w-[65.64vw] h-[47.43vw] top-[10.256vw] left-[40.256vw]'
            whileTap="tap"
            style={{ clipPath: `path("M107.336 15.4999C83.736 14.2999 68.836 36.9999 64.336 48.4999C51.836 33.5 48 25 29.5 25C1.5 25 -1.16401 75.5 0.335993 91C1.83599 106.5 25.836 103.5 32.336 106C37.536 108 47.5027 116.5 51.836 120.5C52.1693 122.833 53.136 130.8 54.336 144C55.536 157.2 65.5027 161.5 70.336 162C112.669 158.667 191.436 152.3 201.836 149.5C217.494 145.284 212.951 134 209.336 110.5C206.797 94 195.169 96 189.836 97.5V91C193.836 87.6667 201.836 75 201.836 51C201.836 21 165.836 -7 143.336 -7C125.336 -7 111.836 7.99991 107.336 15.4999Z")` }}
            onClick={() => {
              router.push('/marketplace');
              tapSound.play?.();
            }}
            data-bp="1015-004"
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
              className='absolute right-[9.856vw] bottom-[8.697vw] w-[37.435vw] h-[11.282vw]'
              variants={EntryAnimationSignpost}
              transition={EntryAnimation}
            />
          </motion.div>
          <motion.div
            className='relative w-[63.076vw] h-[56.153vw] -top-[12.85vw] -left-[10.256vw]'
            whileTap="tap"
            data-bp="1015-005"
            onClick={() => {
              router.push('/dapps');
              tapSound.play?.();
              // handleReport('1015-005');
            }}
            style={{ clipPath: `path("M79.9479 -6C60.7479 -6 54.7813 8.66667 53.9479 16.5C27.9479 19.7 26.4479 39.5 29.4479 51.5C23.6146 50.3333 8.94794 52.6 8.94794 75C8.94794 90 14.6147 99.3333 17.948 101C13.9479 107 13.6146 116.833 13.9479 123.5C3.94794 126 -13.552 159.5 17.948 171.5C49.448 183.5 50.948 181.5 92.948 182C134.948 182.5 133.948 171 150.948 161.5C164.548 153.9 161.948 142.5 159.948 136C168.115 131 184.448 119.2 184.448 112V75C187.281 69.5 190.448 56.3 180.448 47.5C170.448 38.7 151.948 75 133.448 47.5C133.448 47.5 135.948 37 133.448 28.5C129.498 15.0689 116.948 13.6667 106.448 16.5C105.448 8.66667 99.1479 -6 79.9479 -6Z")` }}
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
              className='absolute left-[21.538vw] top-[6.153vw] w-[20.512vw] h-[8.717vw]'
              alt=''
              variants={EntryAnimationSignpost}
              transition={EntryAnimation}
            />
          </motion.div>
          <motion.div
            className='relative w-[77.435vw] h-[54.684vw] -top-[45.641vw] -right-[34.871vw]'
            whileTap="tap"
            onClick={() => {
              router.push('/dashboard');
              tapSound.play?.();
              // handleReport('1015-006');
            }}
            data-bp="1015-006"
            style={{ clipPath: `path("M57.3664 53.4998C40.8449 53.4998 20.3664 96 11.8664 116C2.36636 119.5 -6.64894 141.062 6.86638 151C23.8664 163.5 63.1997 161.833 75.8664 156.5C75.8664 162.333 78.1664 174 87.3664 178C96.5664 182 157.366 183 192.366 183.5C220.366 183.9 214.366 166 214.366 148C219.366 142.5 224.56 136 226.866 130.5C232.066 118.1 223.2 99 214.366 91.5C210.866 88.5283 210.866 80.5 210.866 68C210.866 52.2165 186.366 56 167.866 53.4998C167.2 50.4999 161.966 39.9 160.366 29.5C158.366 16.5 146.366 -9.5 134.866 -9.5C123.366 -9.5 113.366 6.5 107.366 19.5C102.566 29.9 96.8664 48.3332 97.3664 53.4998C90.3664 52.6665 65.8664 53.4998 57.3664 53.4998Z")` }}
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
              className='absolute right-[18.974vw] bottom-[10.471vw] w-[30.769vw] h-[9.271vw]'
              alt=''
              variants={EntryAnimationSignpost}
              transition={EntryAnimation}
            />
          </motion.div>
          <motion.div
            className='relative w-[73.846vw] h-[47.692vw] -top-[65.64vw] -left-[17.948vw]'
            whileTap="tap"
            onClick={() => {
              router.push('/earn');
              tapSound.play?.();
              // handleReport('1015-007');
            }}
            data-bp="1015-007"
            style={{ clipPath: `path("M119.949 9.00092C115.382 -6.52529 83.4491 4.00029 43.9491 9.0014C23.9491 11.5336 32.9491 52.0024 26.4491 76.5C8.44908 84 -3.55103 98.5024 0.948975 120.502C3.50529 133 89.9491 124.502 155.449 120.502C207.849 117.302 198.116 99.5024 191.449 90.5024C194.449 82.0024 199.549 71.6024 201.949 52.0024C204.349 32.4024 174.449 29.0024 146.949 29.0024C136.949 16.501 124.949 25.9995 119.949 9.00092Z")` }}
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
              className='absolute left-[32.307vw] top-[7.692vw] w-[21.538vw] h-[11.794vw]'
              alt=''
              variants={EntryAnimationSignpost}
              transition={EntryAnimation}
            />
          </motion.div>
          <motion.div
            className='relative w-[77.435vw] h-[51.794vw] -top-[76.923vw] -right-[33.846vw]'
            whileTap="tap"
            onClick={() => {
              router.push('/cave');
              tapSound.play?.();
              // handleReport('1015-008');
            }}
            data-bp="1015-008"
            style={{ clipPath: `path("M43.8874 23.9999C40.6874 26.3999 42.5541 41.6666 43.8874 48.9999C31.4874 63.3999 26.3874 77.9999 25.3875 83.5C12.3875 83.5 -2.61254 100.5 0.387461 108C3.38746 115.5 20.3875 125 82.3875 128.5C144.387 132 193.387 128 206.387 121.5C219.387 115 211.387 102.5 206.387 88C201.387 73.5 184.887 67 177.887 62C172.287 58 171.221 39.6667 171.387 31C173.887 30.0001 178.687 25.2002 177.887 14.0002C176.887 0.000192642 163.387 -0.999808 153.387 1.00019C145.387 2.60019 136.721 10.3335 133.387 14.0002C131.554 12.8334 124.687 9.99992 111.887 7.99992C99.0875 5.99992 80.8875 15.1666 73.3875 19.9999C64.8875 20.3333 47.0874 21.5999 43.8874 23.9999Z")`}}
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
              className='absolute top-0 left-[21.025vw] w-[32.679vw] h-[14.407vw]'
              alt=''
              variants={EntryAnimationSignpost}
              transition={EntryAnimation}
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
