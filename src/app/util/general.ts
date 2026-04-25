export const round = (num: number, places: number) => {
  const mult = Math.pow(10, places);
  return Math.floor(Math.round(num * mult)) / mult;
};

export const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes)) {
    return '--';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let value = bytes;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const precision = unitIndex === 0 || value >= 100 ? 0 : 1;
  return `${round(value, precision)} ${units[unitIndex]}`;
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
