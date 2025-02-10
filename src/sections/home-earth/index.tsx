'use client';

import HomeEarthTop from '@/sections/home-earth/components/top';
import CloudCircle from '@/sections/home-earth/components/cloud-circle';
import MountainCircle from '@/sections/home-earth/components/mountain-circle';
import Navigation from '@/sections/home-earth/components/navigation';
import Follower from '@/sections/home-earth/components/follower';
import Signpost from '@/sections/home-earth/components/signpost';
import useIsMobile from '@/hooks/use-isMobile';
import MobileHome from '@/sections/home/mobile';

// seconds per lap
const SPEED = 200;

const HomeEarth = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileHome />
    );
  }

  return (
    <div className="w-full relative h-[calc(100dvh_-_68px)] flex flex-col items-center">
      <Follower />
      {/*<Signpost />*/}
      <HomeEarthTop />
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
        <img src="/images/background/bear.gif" alt="" className="w-[360px] h-[356px] absolute z-[4] top-[37.4dvh]" />
      </div>
    </div>
  );
};

export default HomeEarth;
