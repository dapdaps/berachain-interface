import SnowIcon from "./icon-snow";
import ElfHatIcon from "./icon-elf-hat";
import SantaHatIcon from "./icon-santa-hat";
import ElfJacketIcon from "./icon-elf-jacket";
import ScarfIcon from "./icon-scarf";
import SleighIcon from "./icon-sleigh";
import SnowBoardIcon from "./icon-snowboard";
import SantaCoatIcon from "./icon-santa-coat";
import TokenHints from "./hints-token";
import Hints from "./hints";

export default {
  token: {
    icon: SnowIcon,
    renderHints: (props?: any) => <TokenHints {...props} />,
    positionClassName: "top-[-106px] left-[106px]",
    name: "$Snowflake"
  },
  "elf-hat": {
    icon: ElfHatIcon,
    renderHints: (props?: any) => <Hints {...props} />,
    positionClassName: "top-[-86px] left-[96px]",
    name: "Elf’s Hat",
    smallSizePositionClassName: "w-[88px] h-[69px]"
  },
  "santa-hat": {
    icon: SantaHatIcon,
    renderHints: (props?: any) => <Hints {...props} />,
    positionClassName: "top-[-76px] left-[106px]",
    name: "Santa Hat",
    smallSizePositionClassName: "w-[104px] h-[75px]"
  },
  "elf-jacket": {
    icon: ElfJacketIcon,
    renderHints: (props?: any) => <Hints {...props} />,
    positionClassName: "top-[-100px] left-[130px]",
    name: "Elf’s Jacket",
    smallSizePositionClassName: "w-[60px] h-[87px]"
  },
  "santa-coat": {
    icon: SantaCoatIcon,
    renderHints: (props?: any) => <Hints {...props} />,
    positionClassName: "top-[-100px] left-[130px]",
    name: "Santa Coat",
    smallSizePositionClassName: "w-[64px] h-[91px]"
  },
  scarf: {
    icon: ScarfIcon,
    renderHints: (props?: any) => <Hints {...props} />,
    positionClassName: "top-[-86px] left-[106px]",
    name: "Scarf",
    smallSizePositionClassName: "w-[89px] h-[67px]"
  },
  snowboard: {
    icon: SnowBoardIcon,
    renderHints: (props?: any) => <Hints {...props} />,
    positionClassName: "top-[-56px] left-[56px]",
    name: "Snowboard",
    smallSizePositionClassName: "w-[146px] h-[37px]"
  },
  sleigh: {
    icon: SleighIcon,
    renderHints: (props?: any) => <Hints {...props} />,
    positionClassName: "top-[-100px] left-[80px]",
    name: "Sleigh",
    smallSizePositionClassName: "w-[139px] h-[61px]"
  }
} as Record<string, any>;
