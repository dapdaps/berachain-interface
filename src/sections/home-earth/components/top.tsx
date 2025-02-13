'use client';

import { motion } from 'framer-motion';
import Airdrop from '@/components/airdrop';

const HomeEarthTop = (props: any) => {
  const {} = props;

  return (
    <div className="relative w-full pt-[20px] flex justify-center shrink-0">
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
      <div className="absolute left-0 -top-[88px] w-[472px] h-[371px] overflow-hidden">
        <img
          src="/images/home-earth/cloud-left.svg"
          alt=""
          className="animate-cloud-float-left origin-top-left w-full h-full"
        />
      </div>
      <div className="absolute right-0 -top-[88px] w-[493px] h-[370px] overflow-hidden">
        <img
          src="/images/home-earth/cloud-right.svg"
          alt=""
          className="animate-cloud-float-right origin-top-right w-full h-full"
        />
      </div>
      <Airdrop className="!left-[unset] right-0 !top-[150px]" />
    </div>
  );
};

export default HomeEarthTop;
