import HomeEarthTop from "../home-earth/components/top";
import Lights from "./components/lights";

const PlaygroundLayout = (props: any) => {
  const { children } = props;

  return (
    <div className="w-full">
      <HomeEarthTop isLogo={false} isAirdrop={false} />
      <div className="absolute left-0 top-0 w-full h-[430px] pointer-events-none overflow-hidden">
        <Lights className="!absolute left-0 top-0" delay={0} />
        <Lights className="!absolute right-[-80px] top-[-50px] rotate-[30deg]" delay={0.5} />
        <Lights className="!absolute left-[-50px] bottom-[0px] rotate-[10deg]" delay={1} />
        <Lights className="!absolute right-[-90px] bottom-[30px] rotate-[0deg]" delay={1.5} />
      </div>
      <div className="w-full relative z-[1]">
        {children}
      </div>
    </div>
  );
};

export default PlaygroundLayout;
