import { bera } from "@/configs/tokens/bera";
import { polygonZkevm } from "@/configs/tokens/polygonZkevm";
import { ethereum } from "@/configs/tokens/ethereum";
import type { Token } from "@/types";
import { arbitrum } from "../../../configs/tokens/arbitrum";
import { avalanche } from "../../../configs/tokens/avalanche";
import { base } from "../../../configs/tokens/base";
import { bsc } from "../../../configs/tokens/bsc";
import { gnosis } from "../../../configs/tokens/gnosis";
import { linea } from "../../../configs/tokens/linea";
import { manta } from "../../../configs/tokens/manta";
import { mantle } from "../../../configs/tokens/mantle";
import { metis } from "../../../configs/tokens/metis";
import { mode } from "../../../configs/tokens/mode";
import { polygon } from "../../../configs/tokens/polygon";
import { zkSync } from "../../../configs/tokens/zkSync";
import { optimism } from "../../../configs/tokens/optimism";
import { blast } from "../../../configs/tokens/blast";
import { scroll } from '../../../configs/tokens/scroll';

import { tokenPairs } from './bridges/stargate/config'

const mapFn = (item: Token) => {
  if (item.address === "native") {
    return {
      ...item,
      address: "0x0000000000000000000000000000000000000000"
    };
  }
  return item;
};

const fikterFn = (item: Token) => { 
  return !!tokenPairs[item.chainId]?.[item.symbol.toUpperCase()]
}

const allTokens: { [key: number]: Token[] } = {
  80094: Object.values(bera).map(mapFn).filter(fikterFn),
  // 1101: Object.values(polygonZkevm).map(mapFn),
  1: Object.values(ethereum).map(mapFn).filter(fikterFn),
  534352: Object.values(scroll).map(mapFn).filter(fikterFn) ,
  42161: Object.values(arbitrum).map(mapFn).filter(fikterFn),
  43114: Object.values(avalanche).map(mapFn).filter(fikterFn),
  8453: Object.values(base).map(mapFn).filter(fikterFn) ,
  56: Object.values(bsc)
    .map(mapFn)
    .filter((item) => {
      return ['RDNT', 'JONES', 'BSC-USD', 'BTCB'].indexOf(item.symbol) === -1;
    }).filter(fikterFn),
  100: Object.values(gnosis).map(mapFn).filter(fikterFn)  ,
  59144: Object.values(linea).map(mapFn).filter(fikterFn),
  169: Object.values(manta).map(mapFn).filter(fikterFn),
  5000: Object.values(mantle).map(mapFn).filter(fikterFn),
  1088: Object.values(metis).map(mapFn).filter(fikterFn),
  34443: Object.values(mode).map(mapFn).filter(fikterFn),
  137: Object.values(polygon)
    .map(mapFn)
    .filter((item) => {
      return ['WETH'].indexOf(item.symbol) === -1;
    }).filter(fikterFn),
  1101: Object.values(polygonZkevm).map(mapFn).filter(fikterFn),
  324: Object.values(zkSync).map(mapFn).filter(fikterFn),
  10: Object.values(optimism).map(mapFn).filter(fikterFn),
  81457: Object.values(blast).map(mapFn).filter(fikterFn)
};

export default allTokens;
