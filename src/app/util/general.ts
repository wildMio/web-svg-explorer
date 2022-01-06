export function round(num: number, places: number) {
  const mult = Math.pow(10, places);
  return Math.floor(Math.round(num * mult)) / mult;
}
