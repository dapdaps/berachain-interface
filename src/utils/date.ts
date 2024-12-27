import * as dateFns from 'date-fns';

export function getUTCTimestamp(datetime?: any) {
  let d = new Date();
  if (datetime) {
    d = new Date(datetime);
  }
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds()
  ).getTime();
}

export function getUTCDatetime(datetime?: any) {
  let d = new Date();
  if (datetime) {
    d = new Date(datetime);
  }
  const M = d.getUTCMonth() + 1 < 10 ? '0' + (d.getUTCMonth() + 1) : d.getUTCMonth() + 1;
  const D = d.getUTCDate() < 10 ? '0' + d.getUTCDate() : d.getUTCDate();
  const H = d.getUTCHours() < 10 ? '0' + d.getUTCHours() : d.getUTCHours();
  const m = d.getUTCMinutes() < 10 ? '0' + d.getUTCMinutes() : d.getUTCMinutes();
  const s = d.getUTCSeconds() < 10 ? '0' + d.getUTCSeconds() : d.getUTCSeconds();
  return `${d.getUTCFullYear()}-${M}-${D}T${H}:${m}:${s}Z`;
}


export function secondsToDuration(seconds: any) {
  const years = Math.floor(seconds / (365 * 24 * 60 * 60));
  seconds %= 365 * 24 * 60 * 60;
  const months = Math.floor(seconds / (30 * 24 * 60 * 60));
  seconds %= 30 * 24 * 60 * 60;
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds %= 24 * 60 * 60;
  const hours = Math.floor(seconds / (60 * 60));
  seconds %= 60 * 60;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  };
}
export function getRemainingDatetime(start: Date, end: Date) {
  const lastSeconds = dateFns.differenceInSeconds(new Date(end), new Date(start));
  const daySeconds = 86400;
  const hourSeconds = 3600;
  const minuteSeconds = 60;
  if (lastSeconds > 0) {
    const lastDays = Math.floor(lastSeconds / daySeconds);
    const lastDaysSeconds = lastSeconds % daySeconds;
    let lastHours: any = Math.floor(lastDaysSeconds / hourSeconds);
    lastHours = lastHours < 10 ? `0${lastHours}` : lastHours;
    const lastHoursSeconds: any = lastDaysSeconds % hourSeconds;
    let lastMinutes: any = Math.floor(lastHoursSeconds / minuteSeconds);
    lastMinutes = lastMinutes < 10 ? `0${lastMinutes}` : lastMinutes;
    let lastMinutesSeconds: any = lastHoursSeconds % minuteSeconds;
    lastMinutesSeconds = lastMinutesSeconds < 10 ? `0${lastMinutesSeconds}` : lastMinutesSeconds;
    return `${lastDays > 0 ? lastDays + ' days ' : ''}${lastHours}:${lastMinutes}:${lastMinutesSeconds}`;
  }
  return '';
}
