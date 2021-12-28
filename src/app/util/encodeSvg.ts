// ref: https://github.com/yoksel/url-encoder/

const currentColorReg = /currentColor/g;
const symbols = /[\r\n%#()<>?[\\\]^`{|}]/g;

export const encodeSVG = (
  data: string,
  replaceCurrentColor?: string | null
) => {
  // Use single quotes instead of double to avoid encoding.
  // if (externalQuotesValue === `double`) {
  //   data = data.replace(/"/g, `'`);
  // } else {
  //   data = data.replace(/'/g, `"`);
  // }

  data = data.replace(/>\s{1,}</g, `><`);
  data = data.replace(/\s{2,}/g, ` `);

  if (replaceCurrentColor) {
    data = data.replace(currentColorReg, replaceCurrentColor);
  }

  // Using encodeURIComponent() as replacement function
  // allows to keep result code readable
  return data.replace(symbols, encodeURIComponent);
};
