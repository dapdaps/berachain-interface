import { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';

const START_DATE = new Date(Date.UTC(2025, 9, 20)); 
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function getWeekRoundInfo(now: Date) {
  const nowUtcMs = now.getTime();
  const startUtcMs = START_DATE.getTime();
  const diffMs = nowUtcMs - startUtcMs;
  const round = Math.floor(diffMs / WEEK_MS) + 1;
  const startDateOfRoundUtcMs = startUtcMs + (round - 1) * WEEK_MS;
  const endDateOfRoundUtcMs = startDateOfRoundUtcMs + WEEK_MS - 1;

  const startDateOfRound = new Date(startDateOfRoundUtcMs);
  const endDateOfRound = new Date(endDateOfRoundUtcMs);
  const toSimpleDate = (d: Date) => dayjs(d).utc().format('MMM D');

  return {
    round,
    startDate: toSimpleDate(startDateOfRound),
    endDate: toSimpleDate(endDateOfRound),
    startDateOfRound,
    endDateOfRound,
    weekTime: (startDateOfRoundUtcMs / 1000).toString(),
  };
}

export default function useWeekRound() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [prevDisabled, setPrevDisabled] = useState(false)
  const [nextDisabled, setNextDisabled] = useState(false)

  const { round, startDate, endDate, startDateOfRound, endDateOfRound, weekTime } = useMemo(() => {
    return getWeekRoundInfo(currentDate);
  }, [currentDate]);

  const [nowDateOfRound, setNowDateOfRound] = useState(endDateOfRound);

  const [countdown, setCountdown] = useState<{ days: string, hours: string, minutes: string, seconds: string }>({
    days: "0",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    function updateCountdown() {
      const nowMs = Date.now()
      const end = nowDateOfRound.getTime()

      let diff = Math.max(end - nowMs, 0);

      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      diff -= days * 24 * 60 * 60 * 1000;

      const hours = Math.floor(diff / (60 * 60 * 1000));
      diff -= hours * 60 * 60 * 1000;

      const minutes = Math.floor(diff / (60 * 1000));
      diff -= minutes * 60 * 1000;

      const seconds = Math.floor(diff / 1000);

      setCountdown({
        days: days.toString(),
        hours: pad(hours),
        minutes: pad(minutes),
        seconds: pad(seconds),
      });
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [nowDateOfRound]);

  const handleNextRound = () => {
    if (nextDisabled) {
      return;
    }
    const nextDateTime = currentDate.getTime() +  WEEK_MS;
    setCurrentDate(new Date(nextDateTime));
    setNextDisabled(true);
  };

  const handlePreviousRound = () => {
    if (prevDisabled) {
      return;
    }
    setCurrentDate(new Date(currentDate.getTime() - WEEK_MS));
  };

  useEffect(() => {
    if (round === 1) {
      setPrevDisabled(true);
    } else {
      setPrevDisabled(false);
    }

    const nextDateTime = currentDate.getTime() +  WEEK_MS;
    if (nextDateTime > Date.now()) {
      setNextDisabled(true);
    } else {
      setNextDisabled(false);
    }
    
  }, [round, currentDate]);

  return {
    round,
    startDate,
    endDate,
    countdown,
    weekTime,
    handleNextRound,
    handlePreviousRound,
    prevDisabled,
    nextDisabled,
  };
}

function pad(num: number) {
  return num.toString().padStart(2, '0');
}