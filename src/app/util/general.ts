export const round = (num: number, places: number) => {
  const mult = Math.pow(10, places);
  return Math.floor(Math.round(num * mult)) / mult;
};

export const sliceSvgSuffix = (text?: string) =>
  text?.replace('.svg', '') ?? '';

export const downloadBlob = (blob: Blob, fileName: string) => {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.click();

  setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
};
