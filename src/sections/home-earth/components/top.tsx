'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Airdrop from '@/components/airdrop';
import LGBTLogo from './lgbt-animated-logo';
import { useActivityStore } from '@/stores/useActivityStore';
import { useContext } from 'react';
import { HomeEarthContext } from '@/sections/home-earth/context';
import { VisibleAnimation } from '@/sections/home-earth/utils';
import VaultsEntrance from '@/sections/vaults/v2/entrance';

const HomeEarthTop = (props: any) => {
  const {} = props;
  const { isDefaultTheme } = useActivityStore();
  const { isRainyDay } = useContext(HomeEarthContext);

  return (
    <div className="relative w-full pt-[20px] flex justify-center shrink-0">
      {
        isDefaultTheme() ? (
          <motion.img
            src="/images/home-earth/beratown-logo.png"
            alt=""
            className="w-[340px] h-[209px]"
            variants={{
              visible: {
                opacity: 1,
                scale: 1,
              },
              invisible: {
                opacity: 0,
                scale: 0.5,
              },
            }}
            animate="visible"
            initial="invisible"
            transition={{ type: 'spring', stiffness: 200, damping: 15, duration: 1, delay: 0.3 }}
          />
        ) : <LGBTLogo />
      }
      <div className="absolute left-0 -top-[88px] w-[472px] h-[371px] overflow-hidden">
        <AnimatePresence mode="wait">
          {
            isRainyDay ? (
              <motion.img
                key="down"
                src="/images/home-earth/cloud-left-rainy.svg"
                alt=""
                className="animate-cloud-float-left origin-top-left w-full h-full"
                {...VisibleAnimation}
              />
            ) : (
              <motion.img
                key="up"
                src="/images/home-earth/cloud-left.svg"
                alt=""
                className="animate-cloud-float-left origin-top-left w-full h-full"
                {...VisibleAnimation}
              />
            )
          }
        </AnimatePresence>
      </div>
      <div className="absolute right-0 -top-[88px] w-[493px] h-[370px] overflow-hidden">
        <AnimatePresence mode="wait">
          {
            isRainyDay ? (
              <motion.img
                key="down"
                src="/images/home-earth/cloud-right-rainy.svg"
                alt=""
                className="animate-cloud-float-right origin-top-right w-full h-full"
                {...VisibleAnimation}
              />
            ) : (
              <motion.img
                key="up"
                src="/images/home-earth/cloud-right.svg"
                alt=""
                className="animate-cloud-float-right origin-top-right w-full h-full"
                {...VisibleAnimation}
              />
            )
          }
        </AnimatePresence>
      </div>
      <Airdrop className="!left-[unset] right-0 !top-[150px]" />
      <VaultsEntrance className="absolute right-[70px] top-[300px] z-[3]" />
    </div>
  );
};

export default HomeEarthTop;
