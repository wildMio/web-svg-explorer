export const round = (num: number, places: number) => {
  const mult = Math.pow(10, places);
  return Math.floor(Math.round(num * mult)) / mult;
};

export const sliceSvgSuffix = (text?: string) =>
  text?.replace('.svg', '') ?? '';
