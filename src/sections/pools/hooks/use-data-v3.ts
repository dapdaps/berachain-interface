import { useCallback, useEffect, useMemo, useState } from "react";
import { FEES } from "@/configs/pools";
import {
  priceToUsablePrice,
  priceToUsableTick,
  tickToPrice
} from "../tick-math";
import { sortTokens } from "../utils";
import usePoolInfo from "./use-detail-v3";

export default function useData({
  defaultToken0,
  defaultToken1,
  defaultFee,
  dex
}: any) {
  const [token0, setToken0] = useState<any>(defaultToken0);
  const [token1, setToken1] = useState<any>(defaultToken1);
  const [value0, setValue0] = useState<any>();
  const [value1, setValue1] = useState<any>();
  const [fee, setFee] = useState<any>(defaultFee);
  const [noPair, setNoPair] = useState(false);
  const [lowerPrice, setLowerPrice] = useState<any>();
  const [upperPrice, setUpperPrice] = useState<any>();
  const [currentPrice, setCurrentPrice] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { info, loading: infoLoading } = usePoolInfo({
    token0,
    token1,
    fee,
    dex
  });

  const onCleanAll = () => {
    // setToken0(null);
    // setToken1(null);
    // setFee('');
    onPriceChange("upper", "");
    onPriceChange("lower", "");
    setValue0("");
    setValue1("");
    // setCurrentPrice("");
    setNoPair(false);
  };

  const onSelectToken = (token: any, type: number) => {
    if (type === 0) {
      setToken0(token);
      if (token.address === token1?.address) {
        setToken1(null);
      }
    } else {
      setToken1(token);
      if (token.address === token0?.address) {
        setToken0(null);
      }
    }
  };

  const onSelectFee = (fee: number) => {
    setFee(fee);
  };

  const onExchangeTokens = () => {
    const [_token1, _token0] = [token0, token1];
    setToken0(_token0);
    setToken1(_token1);
  };

  const reverse = useMemo(() => {
    if (!token0 || !token1) return false;
    const [_token0] = sortTokens(token0, token1);

    return _token0.address === token1.address;
  }, [token0, token1]);

  const rangeType = useMemo(() => {
    if (!token0 || !token1 || !lowerPrice || !upperPrice) return 0;
    if (lowerPrice === "0" && upperPrice === "∞") return 3;
    if (!currentPrice || !info) return 0;
    const lowerTick = priceToUsableTick({
      price: lowerPrice,
      token0,
      token1,
      fee
    });
    const upperTick = priceToUsableTick({
      price: upperPrice,
      token0,
      token1,
      fee
    });
    const currentTick =
      info.currentTick ||
      priceToUsableTick({ price: currentPrice, token0, token1, fee });
    const [_lowerTick, _upperTick] =
      lowerTick > upperTick ? [upperTick, lowerTick] : [lowerTick, upperTick];

    // if (currentTick < _upperTick && currentTick > _lowerTick) return 0;
    if (currentTick < _lowerTick) return 1;
    if (currentTick > _upperTick) return 2;
    return 0;
  }, [lowerPrice, upperPrice, currentPrice, info]);

  const onPriceChange = useCallback(
    (type: "upper" | "lower", price: any) => {
      if (!price) {
        type === "upper" ? setUpperPrice("") : setLowerPrice("");
        return;
      }
      if (price === "0" || price === "∞") {
        type === "upper" ? setUpperPrice(price) : setLowerPrice(price);
        return;
      }
      const _price = priceToUsablePrice({ price, token0, token1, fee });

      type === "upper" ? setUpperPrice(_price) : setLowerPrice(_price);
    },
    [token0, token1, fee]
  );

  const onPointChange = useCallback(
    (stepType: "add" | "minus", type: "upper" | "lower") => {
      const tickLower = priceToUsableTick({
        price: lowerPrice,
        token0,
        token1,
        fee
      });

      const tickUpper = priceToUsableTick({
        price: upperPrice,
        token0,
        token1,
        fee
      });

      let tick = type === "lower" ? tickLower : tickUpper;

      const space = FEES[fee].space;

      if (reverse) {
        stepType === "add" ? (tick -= space) : (tick += space);
      } else {
        stepType === "add" ? (tick += space) : (tick -= space);
      }

      const price = tickToPrice({ tick, token0, token1 });

      type === "upper" ? setUpperPrice(price) : setLowerPrice(price);
    },
    [token0, token1, fee, reverse, lowerPrice, upperPrice]
  );

  const onSetPriceByTick = (percent: number) => {
    const { currentTick } = info;
    const _lowerPrice = tickToPrice({
      token0,
      token1,
      tick: currentTick * (1 - percent)
    });
    const _upperPrice = tickToPrice({
      token0,
      token1,
      tick: currentTick * (1 + percent)
    });

    const [_lp, _up] =
      _lowerPrice < _upperPrice
        ? [_lowerPrice, _upperPrice]
        : [_upperPrice, _lowerPrice];

    setLowerPrice(_lp === Infinity ? 0 : _lp);
    setUpperPrice(_up === Infinity ? "∞" : _up);
  };

  useEffect(() => {
    if (infoLoading) {
      setLoading(true);
      return;
    }
    setNoPair(!info);
    if (!info?.currentTick) {
      setLoading(false);
      setCurrentPrice("");
      setLowerPrice("");
      setUpperPrice("");
      return;
    }

    const { currentTick } = info;
    const _currentPrice = tickToPrice({ token0, token1, tick: currentTick });
    setCurrentPrice(_currentPrice === Infinity ? 0 : _currentPrice);
    onSetPriceByTick(0.2);
    setLoading(false);
  }, [info, infoLoading]);

  const mergedFee = useMemo(() => fee || info?.fee, [fee, info]);

  return {
    token0,
    token1,
    value0,
    value1,
    fee: mergedFee,
    currentPrice,
    lowerPrice,
    upperPrice,
    noPair,
    loading,
    info,
    reverse,
    rangeType,
    onCleanAll,
    onSelectToken,
    onSelectFee,
    onExchangeTokens,
    onPriceChange,
    onPointChange,
    setValue0,
    setValue1,
    setToken0,
    setToken1,
    setCurrentPrice,
    setNoPair,
    onSetPriceByTick
  };
}
