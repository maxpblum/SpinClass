export function toTimeString(ts: DOMHighResTimeStamp): string {
  // DOMHighResTimeStamp is milliseconds.
  const totalSec = Math.floor(ts / 1000);
  const secPastMinute = totalSec % 60;
  const minutes = Math.floor(totalSec / 60);
  return `${minutes}:${secPastMinute}`;
}
