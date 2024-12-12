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
  const M = d.getUTCMonth() < 10 ? '0' + d.getUTCMonth() : d.getUTCMonth();
  const D = d.getUTCDate() < 10 ? '0' + d.getUTCDate() : d.getUTCDate();
  const H = d.getUTCHours() < 10 ? '0' + d.getUTCHours() : d.getUTCHours();
  const m = d.getUTCMinutes() < 10 ? '0' + d.getUTCMinutes() : d.getUTCMinutes();
  const s = d.getUTCSeconds() < 10 ? '0' + d.getUTCSeconds() : d.getUTCSeconds();
  return `${d.getUTCFullYear()}-${M}-${D}T${H}:${m}:${s}Z`;
}
