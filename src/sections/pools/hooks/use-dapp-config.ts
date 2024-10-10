import pools from '@/configs/pools';
import { useMemo } from 'react';

export default function useDappConfig(dex: string) {
  return useMemo(() => pools[dex.toLowerCase()], [dex]);
}
