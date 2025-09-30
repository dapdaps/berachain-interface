import { formatTimeAgo } from "@/utils/date";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export function useTimeAgo({ date }: { date: string | dayjs.Dayjs | number }) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    // Update immediately
    setTimeAgo(formatTimeAgo(date));

    // If time difference is less than 1 minute, update every second
    const targetDate = dayjs(date);
    const diff = dayjs().diff(targetDate, 'second');
    if (diff < 60) {
      const interval = setInterval(() => {
        setTimeAgo(formatTimeAgo(date));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [date]);

  return {
    timeAgo,
  };
}
