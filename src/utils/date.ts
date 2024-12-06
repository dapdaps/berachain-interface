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
