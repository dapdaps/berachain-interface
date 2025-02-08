import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { cloneDeep } from 'lodash';

dayjs.extend(duration);

const DEFAULT = {
  startSplit: ['0', '0', '0', '0'],
  endSplit: ['0', '0', '0', '0'],
  start: 0,
  end: 0,
};

export function useCountdown(props: any) {
  const { startTime, endTime } = props;

  const timer = useRef<any>(0);
  const [result, setResult] = useState<{ end: number; start: number; endSplit: string[]; startSplit: string[]; }>(cloneDeep(DEFAULT));

  useEffect(() => {
    if (startTime && endTime) {
      const calc = () => {
        clearTimeout(timer.current);
        timer.current = setTimeout(calc, 1000);
        const _result = cloneDeep(DEFAULT);

        const curr = dayjs();
        const end = dayjs(endTime);
        if (curr.isBefore(end)) {
          const diff = end.diff(curr);
          const diffDuration = dayjs.duration(diff);
          const days = diffDuration.days();
          const hours = diffDuration.hours();
          const minutes = diffDuration.minutes();
          const seconds = diffDuration.seconds();

          _result.end = diff;
          _result.endSplit = [days + '', formatNumber(hours), formatNumber(minutes), formatNumber(seconds)];
        }

        const start = dayjs(startTime);
        if (curr.isBefore(start)) {
          const diff = start.diff(curr);
          const diffDuration = dayjs.duration(diff);
          const days = diffDuration.days();
          const hours = diffDuration.hours();
          const minutes = diffDuration.minutes();
          const seconds = diffDuration.seconds();

          _result.start = diff;
          _result.startSplit = [days + '', formatNumber(hours), formatNumber(minutes), formatNumber(seconds)];
        }

        setResult(_result);

        return _result;
      };

      calc();
    }

    return () => {
      clearTimeout(timer.current);
    };
  }, [endTime, startTime]);

  return [result];
}

const formatNumber = (num: number) => {
  return num < 10 ? '0' + num : num.toString();
};
