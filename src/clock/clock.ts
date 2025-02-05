export function toTimeString(ts: DOMHighResTimeStamp): string {
  // DOMHighResTimeStamp is milliseconds.
  const totalSec = Math.floor(ts / 1000);
  const secPastMinute = totalSec % 60;
  const secZeroPad = secPastMinute < 10 ? '0' : '';
  const minutes = Math.floor(totalSec / 60);
  return `${minutes}:${secZeroPad}${secPastMinute}`;
}
