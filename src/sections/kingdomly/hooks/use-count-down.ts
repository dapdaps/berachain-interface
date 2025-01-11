import { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

interface CountDownProps {
  targetTimestamp: number;
  format?: string;
  padZero?: boolean;
  onEnd?: () => void;
}

export const useCountDown = ({ 
  targetTimestamp, 
  format = 'DDd HHh mmm sss', 
  padZero = false, 
  onEnd 
}: CountDownProps) => {
  const calculateCountdown = useCallback(() => {

    if (!targetTimestamp) return '0'

    const now = dayjs();
    const target = dayjs(targetTimestamp);
    const diff = target.diff(now);

    if (diff <= 0) {
      onEnd?.();
      return '0';
    }

    const timeLeft = dayjs.duration(diff);
    const formatNumber = (value: number, length: number) => 
      padZero ? value.toString().padStart(length, '0') : value.toString();

    return format
      .replace('YYYY', formatNumber(Math.floor(timeLeft.asYears()), 4))
      .replace('MM', formatNumber(Math.floor(timeLeft.asMonths() % 12), 2))
      .replace('DD', formatNumber(Math.floor(timeLeft.asDays() % 30), 2))
      .replace('HH', formatNumber(Math.floor(timeLeft.asHours() % 24), 2))
      .replace('mm', formatNumber(Math.floor(timeLeft.asMinutes() % 60), 2))
      .replace('ss', formatNumber(Math.floor(timeLeft.asSeconds() % 60), 2));
  }, [targetTimestamp, format, padZero, onEnd]);

  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    setCountdown(calculateCountdown());
    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateCountdown]);

  return countdown;
};
