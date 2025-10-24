import { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';


const START_DATE = new Date(2025, 9, 20); 

function getWeekRoundInfo(now: Date) {
  const diffMs = now.getTime() - START_DATE.getTime();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const round = Math.floor(diffMs / weekMs) + 1;

  const startDateOfRound = new Date(START_DATE.getTime() + (round - 1) * weekMs);
  const endDateOfRound = new Date(startDateOfRound.getTime() + weekMs - 1);

  const toSimpleDate = (d: Date) => dayjs(d).utc().format('MMM D');

  return {
    round,
    startDate: toSimpleDate(startDateOfRound),
    endDate: toSimpleDate(endDateOfRound),
    startDateOfRound,
    endDateOfRound,
  };
}

export default function useWeekRound() {
  const {round, startDate, endDate, startDateOfRound, endDateOfRound} = useMemo(() => {
    const now = new Date();
    return getWeekRoundInfo(now);
  }, []);

  const [countdown, setCountdown] = useState<{ days: string, hours: string, minutes: string, seconds: string }>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00"
  });

  useEffect(() => {
    function updateCountdown() {
      const now = new Date().getTime();
      const end = endDateOfRound.getTime();
      let diff = Math.max(end - now, 0);

      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      diff -= days * 24 * 60 * 60 * 1000;

      const hours = Math.floor(diff / (60 * 60 * 1000));
      diff -= hours * 60 * 60 * 1000;

      const minutes = Math.floor(diff / (60 * 1000));
      diff -= minutes * 60 * 1000;

      const seconds = Math.floor(diff / 1000);

      function pad(num: number) {
        return num.toString().padStart(2, '0');
      }

      setCountdown({
        days: days.toString(),
        hours: pad(hours),
        minutes: pad(minutes),
        seconds: pad(seconds)
      });
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [endDateOfRound]);


  return {
    round,
    startDate,
    endDate,
    countdown,
  };
}
