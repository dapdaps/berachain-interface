'use client';

import { motion } from 'framer-motion';
import CloudSvg from '@public/images/background/cloud.svg';
import CloudRainySvg from '@public/images/background/cloud-rainy.svg';
import { useEffect, useState } from 'react';

export const Clouds = (props: any) => {
  const { isRainyDay } = props;

  const [screenWidth, setScreenWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.screen.availWidth);
    };

    if (typeof window !== 'undefined') {
      updateScreenWidth();
      window.addEventListener('resize', updateScreenWidth);
    }

    return () => {
      window.removeEventListener('resize', updateScreenWidth);
    };
  }, []);
  return (
    <>
      <motion.div
        initial={{
          x: screenWidth
        }}
        animate={{
          x: -screenWidth
        }}
        transition={{
          duration: 36,
          ease: 'linear',
          repeat: Infinity
        }}
        className='absolute top-[109px] '
      >
        {isRainyDay ? <CloudRainySvg /> : <CloudSvg />}
      </motion.div>
      <motion.div
        initial={{
          x: screenWidth
        }}
        animate={{
          x: -screenWidth
        }}
        transition={{
          duration: 48,
          ease: 'linear',
          repeat: Infinity,
          delay: 10
        }}
        className='absolute top-[13px]'
      >
        {isRainyDay ? <CloudRainySvg /> : <CloudSvg />}
      </motion.div>
      <motion.div
        initial={{
          x: screenWidth
        }}
        animate={{
          x: -screenWidth
        }}
        transition={{
          duration: 48,
          ease: 'linear',
          repeat: Infinity,
          delay: 24
        }}
        className='absolute top-[143px]'
      >
        {isRainyDay ? <CloudRainySvg /> : <CloudSvg />}
      </motion.div>
    </>
  );
};

export const DappClouds = (props: any) => {
  const { isRainyDay } = props;

  const [screenWidth, setScreenWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.screen.availWidth);
    };

    if (typeof window !== 'undefined') {
      updateScreenWidth();
      window.addEventListener('resize', updateScreenWidth);
    }

    return () => {
      window.removeEventListener('resize', updateScreenWidth);
    };
  }, []);
  return (
    <>
      <motion.div
        initial={{
          x: 212
        }}
        animate={{
          x: -screenWidth
        }}
        transition={{
          duration: 24,
          ease: 'linear',
          repeat: Infinity
        }}
        className='absolute bottom-[479px]'
      >
        {isRainyDay ? <CloudRainySvg /> : <CloudSvg />}
      </motion.div>
      <motion.div
        initial={{
          x: screenWidth
        }}
        animate={{
          x: -screenWidth
        }}
        transition={{
          duration: 24,
          ease: 'linear',
          repeat: Infinity,
          delay: 8
        }}
        className='absolute bottom-[559px]'
      >
        {isRainyDay ? <CloudRainySvg /> : <CloudSvg />}
      </motion.div>
      <motion.div
        initial={{
          x: screenWidth
        }}
        animate={{
          x: -screenWidth
        }}
        transition={{
          duration: 24,
          ease: 'linear',
          repeat: Infinity,
          delay: 16
        }}
        className='absolute bottom-[129px]'
      >
        {isRainyDay ? <CloudRainySvg /> : <CloudSvg />}
      </motion.div>
    </>
  );
};
