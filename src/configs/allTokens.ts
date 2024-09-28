import { beraB } from '@/configs/tokens/bera-bArtio';
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
}

export default allTokens;