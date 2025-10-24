import { useMemo } from 'react';
import dayjs from 'dayjs';


const START_DATE = new Date(2025, 9, 27); 

function getWeekRoundInfo(now: Date) {
  const diffMs = now.getTime() - START_DATE.getTime();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const round = Math.floor(diffMs / weekMs) + 1;

  const startDateOfRound = new Date(START_DATE.getTime() + (round - 1) * weekMs);
  const endDateOfRound = new Date(startDateOfRound.getTime() + weekMs - 1);

  const toSimpleDate = (d: Date) => dayjs(d).format('MMM D');

  return {
    round,
    startDate: toSimpleDate(startDateOfRound),
    endDate: toSimpleDate(endDateOfRound),
  };
}

export default function useWeekRound() {
  return useMemo(() => {
    const now = new Date();
    return getWeekRoundInfo(now);
  }, []);
}
