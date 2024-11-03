import { useMemo, useState } from 'react';
import dexs from '@/configs/swap';

export function useSwapToken() {
  const [swapToken, setSwapToken] = useState<any>(null);
  const handleSwap = (token: any) => {
    setSwapToken({
      address: token.address,
      chainId: token.chainId,
      color: '',
      decimals: token.decimals,
      icon: token.icon,
      name: token.name,
      symbol: token.symbol,
    });
  };
  const [protocols] = useMemo(() => {
    const _protocols: string[] = [];
    Object.values(dexs).forEach((item) => {
      _protocols.push(item.name);
    });
    return [_protocols];
  }, [dexs]);

  return [swapToken, setSwapToken, handleSwap, protocols];
}
