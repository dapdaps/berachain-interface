import { bera } from "@/configs/tokens/bera";
import { polygonZkevm } from "@/configs/tokens/polygonZkevm";
import { ethereum } from "@/configs/tokens/ethereum";
import type { Token } from "@/types";
import { arbitrum } from "./tokens/arbitrum";
import { avalanche } from "./tokens/avalanche";
import { base } from "./tokens/base";
import { bsc } from "./tokens/bsc";
import { gnosis } from "./tokens/gnosis";
import { linea } from "./tokens/linea";
import { manta } from "./tokens/manta";
import { mantle } from "./tokens/mantle";
import { metis } from "./tokens/metis";
import { mode } from "./tokens/mode";
import { polygon } from "./tokens/polygon";
import { zkSync } from "./tokens/zkSync";
import { optimism } from "./tokens/optimism";
import { blast } from "./tokens/blast";
import { scroll } from './tokens/scroll';

const mapFn = (item: Token) => {
  if (item.address === "native") {
    return {
      ...item,
      address: "0x0000000000000000000000000000000000000000"
    };
  }
  return item;
};

const allTokens: { [key: number]: Token[] } = {
  80094: Object.values(bera).map(mapFn),
  // 1101: Object.values(polygonZkevm).map(mapFn),
  1: Object.values(ethereum).map(mapFn),
  534352: Object.values(scroll).map(mapFn),
  42161: Object.values(arbitrum).map(mapFn),
  43114: Object.values(avalanche).map(mapFn),
  8453: Object.values(base).map(mapFn),
  56: Object.values(bsc)
    .map(mapFn)
    .filter((item) => {
      return ['RDNT', 'JONES', 'BSC-USD', 'BTCB'].indexOf(item.symbol) === -1;
    }),
  100: Object.values(gnosis).map(mapFn),
  59144: Object.values(linea).map(mapFn),
  169: Object.values(manta).map(mapFn),
  5000: Object.values(mantle).map(mapFn),
  1088: Object.values(metis).map(mapFn),
  34443: Object.values(mode).map(mapFn),
  137: Object.values(polygon)
    .map(mapFn)
    .filter((item) => {
      return ['WETH'].indexOf(item.symbol) === -1;
    }),
  1101: Object.values(polygonZkevm).map(mapFn),
  324: Object.values(zkSync).map(mapFn),
  10: Object.values(optimism).map(mapFn),
  81457: Object.values(blast).map(mapFn)
};

export default allTokens;
