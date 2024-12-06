import SnowIcon from "./icon-snow";
import ElfHatIcon from "./icon-elf-hat";
import SantaHatIcon from "./icon-santa-hat";
import ElfJacketIcon from "./icon-elf-jacket";
import ScarfIcon from "./icon-scarf";
import SleighIcon from "./icon-sleigh";
import SnowBoardIcon from "./icon-snowboard";
import SantaCoatIcon from "./icon-santa-coat";
import ElfHatShadowIcon from "./icon-elf-hat-shadow";
import SantaHatShadowIcon from "./icon-santa-hat-shadow";
import SantaCoatShadowIcon from "./icon-santa-coat-shadow";
import ScarfShadowIcon from "./icon-scarf-shadow";
import SnowboardShadowIcon from "./icon-snowboard-shadow";
import SleighShadowIcon from "./icon-sleigh-shadow";

export default {
  token: {
    icon: SnowIcon,
    positionClassName: "top-[-106px] left-[106px]",
    name: "$Snowflake"
  },
  elf_hat: {
    icon: ElfHatIcon,
    shadowIcon: ElfHatShadowIcon,
    positionClassName: "top-[-86px] left-[96px]",
    name: "Elf’s Hat",
    smallSizePositionClassName: "w-[88px] h-[69px]"
  },
  santa_hat: {
    icon: SantaHatIcon,
    shadowIcon: SantaHatShadowIcon,
    positionClassName: "top-[-76px] left-[106px]",
    name: "Santa Hat",
    smallSizePositionClassName: "w-[104px] h-[75px]"
  },
  elf_jacket: {
    icon: ElfJacketIcon,
    shadowIcon: ElfHatShadowIcon,
    positionClassName: "top-[-100px] left-[130px]",
    name: "Elf’s Jacket",
    smallSizePositionClassName: "w-[60px] h-[87px]"
  },
  santa_coat: {
    icon: SantaCoatIcon,
    shadowIcon: SantaCoatShadowIcon,
    positionClassName: "top-[-100px] left-[130px]",
    name: "Santa Coat",
    smallSizePositionClassName: "w-[64px] h-[91px]"
  },
  scarf: {
    icon: ScarfIcon,
    shadowIcon: ScarfShadowIcon,
    positionClassName: "top-[-86px] left-[106px]",
    name: "Scarf",
    smallSizePositionClassName: "w-[89px] h-[67px]"
  },
  snowboard: {
    icon: SnowBoardIcon,
    shadowIcon: SnowboardShadowIcon,
    positionClassName: "top-[-56px] left-[56px]",
    name: "Snowboard",
    smallSizePositionClassName: "w-[146px] h-[37px]"
  },
  sleigh: {
    icon: SleighIcon,
    shadowIcon: SleighShadowIcon,
    positionClassName: "top-[-100px] left-[80px]",
    name: "Sleigh",
    smallSizePositionClassName: "w-[139px] h-[61px]"
  }
} as Record<string, any>;
