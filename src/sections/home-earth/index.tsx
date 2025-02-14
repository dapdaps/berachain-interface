'use client';

import HomeEarthTop from '@/sections/home-earth/components/top';
import CloudCircle from '@/sections/home-earth/components/cloud-circle';
import MountainCircle from '@/sections/home-earth/components/mountain-circle';
import Navigation from '@/sections/home-earth/components/navigation';
import Follower from '@/sections/home-earth/components/follower';
import Signpost from '@/sections/home-earth/components/signpost';
import useIsMobile from '@/hooks/use-isMobile';
import MobileHome from '@/sections/home/mobile';
import AirdropModal from '@/components/airdrop/modal';
import { useRef } from 'react';
import { HomeEarthContext } from './context';

// seconds per lap
const SPEED = 200;

const HomeEarth = () => {
  const isMobile = useIsMobile();
  const mountainRef = useRef<any>();
  const navigationRef = useRef<any>();
  const bearRef = useRef<any>();

  if (isMobile) {
    return (
      <MobileHome />
    );
  }

  return (
    <HomeEarthContext.Provider value={{ mountainRef, navigationRef, bearRef }}>
      <div className="w-full relative h-[calc(100dvh_-_68px)] flex flex-col items-center">
        <Follower />
        <Signpost />
        <HomeEarthTop />
        <AirdropModal />
        <div className="relative w-full overflow-hidden h-[calc(100%_-_229px)] flex justify-center">
          {/*#region Cloud*/}
          <CloudCircle speed={SPEED} />
          {/*#endregion*/}
          {/*#region Mountain*/}
          <MountainCircle speed={SPEED} />
          {/*#endregion*/}
          {/*#region Navigation*/}
          <Navigation speed={SPEED} />
          {/*#endregion*/}
          <img
            ref={bearRef}
            src="/images/background/bear.gif" 
            alt="" 
            className="w-[360px] h-[356px] absolute z-[4] top-[37.4dvh]" 
          />
        </div>
      </div>
    </HomeEarthContext.Provider>
  );
};

export default HomeEarth;
