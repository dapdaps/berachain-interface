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
    icon: <SnowIcon />,
    renderHints: (props?: any) => <TokenHints {...props} />
  },
  "elf-hat": {
    icon: <ElfHatIcon />,
    renderHints: () => <Hints name="Elf’s Hat" />
  },
  "santa-hat": {
    icon: <SantaHatIcon />,
    renderHints: () => <Hints name="Santa Hat" />
  },
  "elf-jacket": {
    icon: <ElfJacketIcon />,
    renderHints: () => <Hints name="Elf’s Jacket" />
  },
  "santa-coat": {
    icon: <SantaCoatIcon />,
    renderHints: () => <Hints name="Santa Coat" />
  },
  scarf: {
    icon: <ScarfIcon />,
    renderHints: () => <Hints name="Scarf" />
  },
  snowboard: {
    icon: <SnowBoardIcon />,
    renderHints: () => <Hints name="Snowboard" />
  },
  sleigh: {
    icon: <SleighIcon />,
    renderHints: () => <Hints name="Sleigh" />
  }
};
