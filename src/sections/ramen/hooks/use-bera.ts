import { usePriceStore } from '@/stores/usePriceStore';
import { useMemo } from 'react';
import { bera } from '@/configs/tokens/bera';

export function useBera() {
  const prices = usePriceStore(store => store.price);

  const beraPrice = useMemo(() => {
    return prices?.[bera.bera.symbol] ?? '0';
  }, [prices]);

  return [beraPrice];
}
