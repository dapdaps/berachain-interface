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
  const M = d.getUTCMonth() + 1 < 10 ? '0' + d.getUTCMonth() + 1 : d.getUTCMonth() + 1;
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