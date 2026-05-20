export type AppLanguage = 'en' | 'zh-Hant';

export type TranslationParamValue =
  | string
  | number
  | boolean
  | null
  | undefined;
export type TranslationParams = Record<string, TranslationParamValue>;
export type TranslationEntry = string | ((params: TranslationParams) => string);
export type TranslationDictionary = Record<string, TranslationEntry>;
