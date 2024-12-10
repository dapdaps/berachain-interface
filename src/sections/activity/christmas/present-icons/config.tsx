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
    name: "$Snowflake"
  },
  elf_hat: {
    icon: ElfHatIcon,
    shadowIcon: ElfHatShadowIcon,
    name: "Elf’s Hat",
    w: 88,
    h: 69
  },
  santa_hat: {
    icon: SantaHatIcon,
    shadowIcon: SantaHatShadowIcon,
    name: "Santa Hat",
    w: 104,
    h: 75
  },
  elf_jacket: {
    icon: ElfJacketIcon,
    shadowIcon: ElfHatShadowIcon,
    name: "Elf’s Jacket",
    w: 60,
    h: 87
  },
  santa_coat: {
    icon: SantaCoatIcon,
    shadowIcon: SantaCoatShadowIcon,
    name: "Santa Coat",
    w: 64,
    h: 91
  },
  scarf: {
    icon: ScarfIcon,
    shadowIcon: ScarfShadowIcon,
    name: "Scarf",
    w: 89,
    h: 67
  },
  snowboard: {
    icon: SnowBoardIcon,
    shadowIcon: SnowboardShadowIcon,
    name: "Snowboard",
    w: 146,
    h: 37
  },
  sleigh: {
    icon: SleighIcon,
    shadowIcon: SleighShadowIcon,
    name: "Sleigh",
    w: 139,
    h: 61
  }
} as Record<string, any>;
