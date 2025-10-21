import { useEffect, useState } from "react";

export const useTimeLeft = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-11-19T21:00:00Z');
    const updateCountdown = () => {
      const now = new Date();
      const timeDiff = targetDate.getTime() - now.getTime();
      
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          total: timeDiff
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0
        });
      }
    };

    updateCountdown();
    
    const interval = setInterval(updateCountdown, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
};