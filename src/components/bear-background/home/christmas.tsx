import Bear from '@/components/bear-background/components/bear';
import MoveBg from '@/components/bear-background/components/move-bg';
import BeraTown from '@/components/bear-background/components/bera-town';

const BeraBgHomeChristmas = () => {

  return (
    <>
      <MoveBg
        width={1544}
        foreground="/images/background/christmas/ground.svg"
        background="/images/background/christmas/trees.svg"
      />
      <div
        className="absolute z-[11] inset-[-800px_0_0_0] opacity-100 bg-snow bg-[800px_800px] animate-snow-down"
      >
        <div
          className="absolute z-[1] inset-[-800px_0_0_0] m-[-390px] opacity-60 bg-snow animate-snow-down"
          style={{ animationDelay: '-1.5s', animationDuration: '15s', backgroundSize: '800px 800px' }}
        />
        <div
          className="absolute z-[2] inset-[-800px_0_0_0] m-[-130px] opacity-80 bg-snow animate-snow-down"
          style={{ animationDuration: '20s', backgroundSize: '800px 800px' }}
        />
      </div>
      <BeraTown isChristmas style={{ bottom: 420, zIndex: 11 }} />
      <Bear
        className="absolute w-[360px] left-1/2 bottom-[32px] translate-x-[-168px] z-10"
        isChristmas={true}
      />
    </>
  );
};

export default BeraBgHomeChristmas;
