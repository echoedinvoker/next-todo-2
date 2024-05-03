export function timeFormatter({
 milliseconds = 0,
 seconds = 0,
 minutes = 0,
 hours = 0,
 days = 0,
 }: {
  milliseconds?: number;
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
  }) {
  const totalSeconds = milliseconds / 1000 + seconds + minutes * 60 + hours * 3600 + days * 86400;
  const totalMinutes = totalSeconds / 60;
  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / 24;

  const remainingSeconds = Math.floor(totalSeconds % 60);
  const remainingMinutes = Math.floor(totalMinutes % 60);
  const remainingHours = Math.floor(totalHours % 24);
  const remainingDays = Math.floor(totalDays);

  return `${remainingDays ? `${remainingDays}d ` : ""}${remainingHours ? `${remainingHours}h ` : ""}${remainingMinutes ? `${remainingMinutes}m ` : ""}${remainingSeconds ? `${remainingSeconds}s ` : ""}`;
}
