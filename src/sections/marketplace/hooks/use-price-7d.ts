import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';

export function usePrice7d(props: any) {
  const { visibleTokens } = props;

  const [data, setData] = useState<Record<string, {id:number;price:string;price_key:string;timestamp:number;date:string;}[]>>({});
  const [fullData, setFullData] = useState<Record<string, {id:number;price:string;price_key:string;timestamp:number;date:string;}[]>>({});

  const symbols = useMemo(() => {
    return visibleTokens?.flat?.()?.map?.((it: any) => it.symbol) ?? [];
  }, [visibleTokens]);

  const getData = async () => {
    try {
      const res = await fetch(`/dapdap/api/token/price/7day?symbols=${symbols.join(",")}`).then((res) => res.json());
      if (res.code !== 0) {
        console.log(res.message);
        return;
      }
      const _data = res.data || {};
      const dataBySymbol: Record<string, any[]> = {};
      const fullDataBySymbol: Record<string, any[]> = {};

      Object.entries(_data).forEach(([symbol, prices]: any) => {
        const groupedData = prices.reduce((acc: Record<string, any[]>, item: any) => {
          const timestamp = item.timestamp * 1000;
          const date = dayjs(timestamp).format('YYYY-MM-DD');
          item.date = dayjs(timestamp).format('YYYY-MM-DD HH:mm');

          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(item);
          return acc;
        }, {});

        fullDataBySymbol[symbol] = Object.values(groupedData).flatMap((dayData: any) => dayData);
        dataBySymbol[symbol] = Object.values(groupedData).flatMap((dayData: any) => {
          if (dayData.length <= 3) return dayData;

          return [
            dayData[0],
            dayData[Math.floor(dayData.length / 2)],
            dayData[dayData.length - 1]
          ];
        });
      });

      setData(dataBySymbol);
      setFullData(fullDataBySymbol);
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!symbols.length) return;
    getData();
  }, [symbols]);

  return {
    data,
    fullData,
  };
}
