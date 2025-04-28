import { beraB } from "@/configs/tokens/bera-bArtio";
import { getDappLogo } from '@/sections/dashboard/utils';

export default {
  name: "BeraPaw",
  icon: getDappLogo("BeraPaw"),
  path: "/staking/berapaw",
  chains: {
    80094: {
      pairs: [

      ]
    }
  }
};
