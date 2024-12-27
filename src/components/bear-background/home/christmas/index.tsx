import Bear from '@/components/bear-background/components/bear';
import BeraTown from '@/components/bear-background/components/bera-town';
import MoveBg from '@/components/bear-background/components/move-bg';
import Snow from '@/components/bear-background/home/christmas/snow';

const BeraBgHomeChristmas = () => {
  return (
    <>
      <MoveBg
        width={1544}
        repeat={6}
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
