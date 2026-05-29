import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import type { AppLanguage } from './i18n/i18n.types';
import { I18nService } from './i18n.service';

const SITE_NAME = 'SVGOLOT';
const SITE_URL = 'https://svgolot.web.app/';
const SITE_REPOSITORY_URL = 'https://github.com/wildMio/web-svg-explorer';
const PREVIEW_IMAGE_URL = `${SITE_URL}assets/seo/preview.webp`;
const PREVIEW_IMAGE_ALT_KEY = 'app.seo.imageAlt';

const CONTENT_LANGUAGE_BY_APP_LANGUAGE: Record<AppLanguage, string> = {
  en: 'en',
  'zh-Hant': 'zh-TW',
};

const OG_LOCALE_BY_APP_LANGUAGE: Record<AppLanguage, string> = {
  en: 'en_US',
  'zh-Hant': 'zh_TW',
};

const FEATURE_LIST_BY_APP_LANGUAGE: Record<AppLanguage, string[]> = {
  en: [
    'Batch SVG inspection',
    'Shared SVGO profile tuning',
    'Likely duplicate detection',
    'Optimized ZIP export',
  ],
  'zh-Hant': [
    '批次 SVG 檢查',
    '共用 SVGO 設定調整',
    '疑似重複素材掃描',
    '優化 ZIP 匯出',
  ],
};

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly document = inject<Document>(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly i18n = inject(I18nService);

  constructor() {
    effect(() => {
      if (!this.i18n.ready()) {
        return;
      }

      const language = this.i18n.language();
      const title = this.i18n.t('app.seo.title');
      const description = this.i18n.t('app.seo.description');
      const imageAlt = this.i18n.t(PREVIEW_IMAGE_ALT_KEY);

      this.title.setTitle(title);
      this.updateNamedMeta('description', description);
      this.updateNamedMeta(
        'robots',
        'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
      );
      this.updateNamedMeta(
        'googlebot',
        'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
      );
      this.updateNamedMeta('twitter:card', 'summary_large_image');
      this.updateNamedMeta('twitter:title', title);
      this.updateNamedMeta('twitter:description', description);
      this.updateNamedMeta('twitter:image', PREVIEW_IMAGE_URL);
      this.updateNamedMeta('twitter:image:alt', imageAlt);

      this.updatePropertyMeta('og:type', 'website');
      this.updatePropertyMeta('og:site_name', SITE_NAME);
      this.updatePropertyMeta('og:title', title);
      this.updatePropertyMeta('og:description', description);
      this.updatePropertyMeta('og:url', SITE_URL);
      this.updatePropertyMeta('og:locale', OG_LOCALE_BY_APP_LANGUAGE[language]);
      this.updatePropertyMeta(
        'og:locale:alternate',
        OG_LOCALE_BY_APP_LANGUAGE[language === 'en' ? 'zh-Hant' : 'en'],
      );
      this.updatePropertyMeta('og:image', PREVIEW_IMAGE_URL);
      this.updatePropertyMeta('og:image:type', 'image/webp');
      this.updatePropertyMeta('og:image:width', '800');
      this.updatePropertyMeta('og:image:height', '412');
      this.updatePropertyMeta('og:image:alt', imageAlt);

      this.updateCanonicalLink(SITE_URL);
      this.updateStructuredData(language, description);
    });
  }

  initialize() {}

  private updateNamedMeta(name: string, content: string) {
    this.meta.updateTag({ name, content }, `name='${name}'`);
  }

  private updatePropertyMeta(property: string, content: string) {
    this.meta.updateTag({ property, content }, `property='${property}'`);
  }

  private updateCanonicalLink(url: string) {
    const existingCanonical = this.document.querySelector<HTMLLinkElement>(
      "link[rel='canonical']",
    );

    if (existingCanonical) {
      existingCanonical.href = url;
      return;
    }

    const canonical = this.document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = url;
    this.document.head.append(canonical);
  }

  private updateStructuredData(language: AppLanguage, description: string) {
    const script = this.ensureStructuredDataScript();
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: SITE_NAME,
      url: SITE_URL,
      description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      browserRequirements:
        'Requires JavaScript and a modern browser with local file access support.',
      inLanguage: CONTENT_LANGUAGE_BY_APP_LANGUAGE[language],
      image: PREVIEW_IMAGE_URL,
      screenshot: PREVIEW_IMAGE_URL,
      isAccessibleForFree: true,
      featureList: FEATURE_LIST_BY_APP_LANGUAGE[language],
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      sameAs: [SITE_REPOSITORY_URL],
    };

    script.textContent = JSON.stringify(structuredData);
  }

  private ensureStructuredDataScript() {
    const existingScript = this.document.getElementById(
      'app-seo-structured-data',
    );

    if (existingScript instanceof HTMLScriptElement) {
      return existingScript;
    }

    const script = this.document.createElement('script');
    script.id = 'app-seo-structured-data';
    script.type = 'application/ld+json';
    this.document.head.append(script);
    return script;
  }
}
