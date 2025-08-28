import HomeEarthTop from "../home-earth/components/top";
import Lights from "./components/lights";

const PlaygroundLayout = (props: any) => {
  const { children } = props;

  return (
    <div className="w-full">
      <HomeEarthTop isLogo={false} isAirdrop={false} className="!pt-[0]" />
      <div className="absolute w-full top-[98px] flex justify-center items-center gap-[4px] z-[2]">
        <div className="text-[60px] font-CherryBomb [text-shadow:_0_4px_0_#4B371F] leading-[90%] text-white font-[400]">
          Playground
        </div>
        <button
          type="button"
          className="text-black text-center font-CherryBomb text-[16px] font-[400] leading-[90%] w-[55px] h-[30px] rotate-[-8.017deg] translate-y-[5px] flex-shrink-0 rounded-[12px] border border-black bg-[linear-gradient(180deg,_#FFCE78_0%,_#9E762F_100%)]"
        >
          Rules
        </button>
      </div>
      <div className="absolute left-0 top-0 w-full h-[430px] pointer-events-none overflow-hidden bg-[url('/images/playground/lights-long.png')] bg-[length:100%_auto] bg-bottom bg-no-repeat">
        <Lights className="!absolute left-0 top-0" delay={0} />
        <Lights className="!absolute right-[-80px] top-[-50px] rotate-[30deg]" delay={0.5} />
        {/* <Lights className="!absolute left-[-50px] bottom-[0px] rotate-[10deg]" delay={1} />
        <Lights className="!absolute right-[-90px] bottom-[30px] rotate-[0deg]" delay={1.5} /> */}
      </div>
      <div className="w-full min-h-[100dvh] bg-[url('/images/playground/bg-ground.png')] bg-[length:100%_auto] bg-bottom bg-no-repeat relative z-[1]">
        {children}
      </div>
    </div>
  );
};

export default PlaygroundLayout;
