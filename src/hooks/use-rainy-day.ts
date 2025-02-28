import { useEffect, useMemo } from 'react';
import { SceneStatus } from '@/configs/scene';
import { Scene } from '@/hooks/use-scene';
import { random } from 'lodash';
import Big from 'big.js';
import { RAINY_DAY, useRainyDayStore } from '@/stores/rainy-day';
import { useActivityStore } from '@/stores/useActivityStore';

export function useRainyDay(props?: { isLoadPrice?: boolean; }) {
  const { isLoadPrice } = props || {};

  const { isDefaultTheme } = useActivityStore();
  const { rainyDay, setRainyDay, beraPrice, setBeraPrice } = useRainyDayStore();

  const _isDefaultTheme = isDefaultTheme();

  const isRainyDay = useMemo(() => {
    return rainyDay?.status === SceneStatus.Ongoing && _isDefaultTheme;
  }, [rainyDay, _isDefaultTheme]);

  const getBera1DPrice = async () => {
    try {
      const res = await fetch('/api.dapdap.net/api/token/price/latest').then(res => res.json());
      if (res.code === 0) {
        const beraRes = res.data['BERA'];
        setRainyDay({
          ...RAINY_DAY,
          status: Big(beraRes.change_percent || 0).lt(0) ? SceneStatus.Ongoing : SceneStatus.Ended,
        } as Scene);
        setBeraPrice({
          price: beraRes.price,
          percentage: beraRes.change_percent,
        });
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!isLoadPrice) return;

    getBera1DPrice();
    const timer = setInterval(getBera1DPrice, 60000);

    return () => {
      clearInterval(timer);
    };
  }, [isLoadPrice]);

  return {
    rainyDay,
    isRainyDay,
    beraPrice,
  };
}
