import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import type {
  AppLanguage,
  TranslationDictionary,
  TranslationParams,
} from './i18n/i18n.types';
import type { TranslationKey } from './i18n/locales/en';
import { interpolate } from './i18n/translation-helpers';

const LANGUAGE_STORAGE_KEY = 'svgolot-language';

const localeLoaders: Record<AppLanguage, () => Promise<TranslationDictionary>> =
  {
    en: () =>
      import('./i18n/locales/en').then(({ enDictionary }) => enDictionary),
    'zh-Hant': () =>
      import('./i18n/locales/zh-hant').then(
        ({ zhHantDictionary }) => zhHantDictionary,
      ),
  };

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private readonly document = inject<Document>(DOCUMENT);
  private readonly dictionaries = new Map<AppLanguage, TranslationDictionary>();
  private readonly pendingLoads = new Map<
    AppLanguage,
    Promise<TranslationDictionary>
  >();
  private readonly dictionary = signal<TranslationDictionary | null>(null);
  private requestId = 0;

  readonly language = signal<AppLanguage>(this.resolveInitialLanguage());
  readonly language$ = toObservable(this.language);
  readonly ready = computed(() => this.dictionary() !== null);
  readonly loadingLanguage = signal<AppLanguage | null>(null);
  readonly isLoading = computed(() => this.loadingLanguage() !== null);
  readonly languageOptions = [
    {
      id: 'en',
      labelKey: 'common.language.en',
    },
    {
      id: 'zh-Hant',
      labelKey: 'common.language.zhHant',
    },
  ] satisfies ReadonlyArray<{ id: AppLanguage; labelKey: TranslationKey }>;

  constructor() {
    effect(() => {
      const language = this.language();

      this.document.documentElement.lang = language;

      try {
        this.document.defaultView?.localStorage.setItem(
          LANGUAGE_STORAGE_KEY,
          language,
        );
      } catch {
        // Ignore storage failures in restricted environments.
      }
    });
  }

  initialize() {
    return this.activateLanguage(this.language(), { initial: true });
  }

  setLanguage(language: AppLanguage) {
    if (language === this.language() || this.loadingLanguage() === language) {
      return;
    }

    void this.activateLanguage(language).catch((error: unknown) => {
      console.error(`Failed to load locale: ${language}`, error);
    });
  }

  t(key: TranslationKey | string, params: TranslationParams = {}) {
    const entry = this.dictionary()?.[key] ?? key;

    return typeof entry === 'function'
      ? entry(params)
      : interpolate(entry, params);
  }

  private async activateLanguage(
    language: AppLanguage,
    options: { initial?: boolean } = {},
  ) {
    const requestId = ++this.requestId;

    this.loadingLanguage.set(language);

    try {
      const dictionary = await this.loadDictionary(language);

      if (requestId !== this.requestId) {
        return;
      }

      this.dictionary.set(dictionary);
      this.language.set(language);
    } catch (error) {
      if (options.initial && language !== 'en') {
        return this.activateLanguage('en', { initial: true });
      }

      throw error;
    } finally {
      if (requestId === this.requestId) {
        this.loadingLanguage.set(null);
      }
    }
  }

  private loadDictionary(language: AppLanguage) {
    const cachedDictionary = this.dictionaries.get(language);

    if (cachedDictionary) {
      return Promise.resolve(cachedDictionary);
    }

    const pendingDictionary = this.pendingLoads.get(language);

    if (pendingDictionary) {
      return pendingDictionary;
    }

    const request = localeLoaders[language]().then(
      (dictionary) => {
        this.dictionaries.set(language, dictionary);
        this.pendingLoads.delete(language);
        return dictionary;
      },
      (error: unknown) => {
        this.pendingLoads.delete(language);
        throw error;
      },
    );

    this.pendingLoads.set(language, request);

    return request;
  }

  private resolveInitialLanguage(): AppLanguage {
    const storedLanguage = this.readStoredLanguage();

    if (storedLanguage) {
      return storedLanguage;
    }

    const browserLanguages =
      this.document.defaultView?.navigator.languages ?? [];

    return browserLanguages.some((language) =>
      language.toLowerCase().startsWith('zh'),
    )
      ? 'zh-Hant'
      : 'en';
  }

  private readStoredLanguage(): AppLanguage | null {
    try {
      const storedLanguage =
        this.document.defaultView?.localStorage.getItem(LANGUAGE_STORAGE_KEY) ??
        null;

      return storedLanguage === 'en' || storedLanguage === 'zh-Hant'
        ? storedLanguage
        : null;
    } catch {
      return null;
    }
  }
}
