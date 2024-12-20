import Bear from '@/components/bear-background/components/bear';
import MoveBg from '@/components/bear-background/components/move-bg';
import BeraTown from '@/components/bear-background/components/bera-town';
import Snow from '@/components/bear-background/home/christmas/snow';
import { useSize } from 'ahooks';
import { useMemo } from 'react';

const BeraBgHomeChristmas = () => {
  const size = useSize(window.document.getElementsByTagName('body')[0]);
  const isBigScreen = useMemo(() => size?.width > 1920, [size])
  return (
    <>
      <MoveBg
        width={1544}
        repeat={isBigScreen ? 3 : 6}
        foreground="/images/background/christmas/ground.svg"
        background="/images/background/christmas/trees.svg"
        peoples="/images/background/christmas/peoples.png"
      />
      <Snow />
      <BeraTown isChristmas style={{ bottom: 420, zIndex: 11 }} />
      <Bear
        className="absolute w-[360px] left-1/2 bottom-[147px] translate-x-[-168px] z-10"
        isChristmas={true}
      />
    </>
  );
};

export default BeraBgHomeChristmas;
