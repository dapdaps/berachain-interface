import { useEffect, useMemo } from 'react';
import { SceneStatus } from '@/configs/scene';
import { Scene } from '@/hooks/use-scene';
import { random } from 'lodash';
import Big from 'big.js';
import { RAINY_DAY, useRainyDayStore } from '@/stores/rainy-day';

export function useRainyDay(props?: { isLoadPrice?: boolean; }) {
  const { isLoadPrice } = props || {};

  const { rainyDay, setRainyDay, beraPrice, setBeraPrice } = useRainyDayStore();

  const isRainyDay = useMemo(() => {
    return rainyDay?.status === SceneStatus.Ongoing;
  }, [rainyDay]);

  const getBera1DPrice = () => {
    const _price = random(4, 6, true);
    const _lastDayPrice = random(4, 6, true);
    const res = {
      price: _price,
      lastDayPrice: _lastDayPrice,
      percentage: Big(_price).minus(_lastDayPrice).div(_lastDayPrice).times(100).toFixed(2),
    };
    console.log('getBera1DPrice: %o, isRainyDay: %o', res, Big(res.price).gte(res.lastDayPrice));
    setRainyDay({
      ...RAINY_DAY,
      status: Big(res.price).gte(res.lastDayPrice) ? SceneStatus.Ongoing : SceneStatus.Ended,
    } as Scene);
    setBeraPrice(res);
  };

  useEffect(() => {
    if (!isLoadPrice) return;

    getBera1DPrice();
    const timer = setInterval(getBera1DPrice, 5000);

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
