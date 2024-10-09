import { beraB } from '@/configs/tokens/bera-bArtio';
import { polygonZkevm } from '@/configs/tokens/polygonZkevm';
import { ethereum } from '@/configs/tokens/ethereum';
import type { Token } from '@/types';

const mapFn = (item: Token) => {
  if (item.address === 'native') {
    return {
      ...item,
      address: '0x0000000000000000000000000000000000000000'
    }
  }
  return item
}

const allTokens: { [key: number]: Token[] } = {
  80084: Object.values(beraB).map(mapFn),
  1101: Object.values(polygonZkevm).map(mapFn),
  1: Object.values(ethereum).map(mapFn),
}

export default allTokens;