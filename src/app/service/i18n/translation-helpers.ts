import type { TranslationParams } from './i18n.types';

export const getNumberParam = (
  params: TranslationParams,
  key: string,
  fallback = 0,
) => {
  const value = params[key];
  const parsedValue =
    typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''));

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

export const getStringParam = (
  params: TranslationParams,
  key: string,
  fallback = '',
) => String(params[key] ?? fallback);

export const pluralizeEn = (count: number, singular: string, plural: string) =>
  count === 1 ? singular : plural;

export const interpolate = (template: string, params: TranslationParams) =>
  template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) =>
    String(params[key] ?? ''),
  );
