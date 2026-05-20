import { AsyncPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { combineLatest, map } from 'rxjs';

import { I18nService } from '../service/i18n.service';
import { type CompressionPresetId, SvgoService } from '../service/svgo.service';

type PluginSetting = {
  id: string;
  name: string;
  active: boolean;
};

type PluginCard = PluginSetting & {
  category: string;
  description: string;
  caution: boolean;
};

type PluginCategoryId =
  | 'metadata'
  | 'style'
  | 'geometry'
  | 'structure'
  | 'order'
  | 'cleanup';

type ProfileSummary = {
  title: string;
  description: string;
  activePreset: CompressionPresetId | 'custom';
  multipassLabel: string;
  prettyLabel: string;
  floatPrecision: number;
  floatPrecisionHint: string;
  transformPrecision: number;
  transformPrecisionHint: string;
  activePluginCount: number;
  pluginCount: number;
};

const CAUTION_PLUGIN_IDS = new Set<string>([
  'cleanupIds',
  'removeXMLNS',
  'removeRasterImages',
  'removeUnknownsAndDefaults',
  'removeViewBox',
  'removeTitle',
  'removeDesc',
  'removeDimensions',
  'removeStyleElement',
  'removeOffCanvasPaths',
  'reusePaths',
]);

@Component({
  selector: 'app-compress-setting',
  templateUrl: './compress-setting.component.html',
  styleUrls: ['./compress-setting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'settings-root',
  },
  imports: [AsyncPipe],
})
export class CompressSettingComponent {
  private readonly svgoService = inject(SvgoService);
  readonly i18n = inject(I18nService);

  presetOptions = this.svgoService.presetOptions;
  activePreset$ = this.svgoService.activePreset$;
  multipass$ = this.svgoService.multipass$;
  floatPrecision$ = this.svgoService.floatPrecision$;
  transformPrecision$ = this.svgoService.transformPrecision$;
  pretty$ = this.svgoService.pretty$;
  plugins$ = this.svgoService.plugins$;
  activePluginCount$ = this.plugins$.pipe(
    map((plugins) => plugins.filter(({ active }) => active).length),
  );
  pluginCards$ = combineLatest([this.plugins$, this.i18n.language$]).pipe(
    map(([plugins]) => plugins.map((plugin) => this.toPluginCard(plugin))),
  );
  floatPrecisionHint$ = combineLatest([
    this.floatPrecision$,
    this.i18n.language$,
  ]).pipe(map(([value]) => this.describePrecision(value)));
  transformPrecisionHint$ = combineLatest([
    this.transformPrecision$,
    this.i18n.language$,
  ]).pipe(map(([value]) => this.describePrecision(value)));
  profileSummary$ = combineLatest([
    this.activePreset$,
    this.multipass$,
    this.pretty$,
    this.floatPrecision$,
    this.transformPrecision$,
    this.activePluginCount$,
    this.plugins$,
    this.i18n.language$,
  ]).pipe(
    map(
      ([
        activePreset,
        multipass,
        pretty,
        floatPrecision,
        transformPrecision,
        activePluginCount,
        plugins,
      ]) =>
        ({
          title: this.buildProfileTitle(
            activePreset,
            floatPrecision,
            transformPrecision,
          ),
          description: this.buildProfileDescription(
            activePreset,
            multipass,
            pretty,
            floatPrecision,
            transformPrecision,
          ),
          activePreset,
          multipassLabel: multipass
            ? this.i18n.t('common.on')
            : this.i18n.t('common.off'),
          prettyLabel: pretty
            ? this.i18n.t('compress.overview.outputReadable')
            : this.i18n.t('compress.overview.outputMinified'),
          floatPrecision,
          floatPrecisionHint: this.describePrecision(floatPrecision),
          transformPrecision,
          transformPrecisionHint: this.describePrecision(transformPrecision),
          activePluginCount,
          pluginCount: plugins.length,
        }) satisfies ProfileSummary,
    ),
  );

  updateMultipass(multipass: boolean) {
    this.multipass$.next(multipass);
  }
  updateFloatPrecision(floatPrecision: number | null) {
    this.floatPrecision$.next(floatPrecision ?? 0);
  }
  updateTransformPrecision(transformPrecision: number | null) {
    this.transformPrecision$.next(transformPrecision ?? 0);
  }
  updatePretty(pretty: boolean) {
    this.pretty$.next(pretty);
  }

  applyPreset(presetId: CompressionPresetId) {
    this.svgoService.applyPreset(presetId);
  }

  restoreDefaults() {
    this.svgoService.resetSettings();
  }

  presetLabel(presetId: CompressionPresetId) {
    return this.i18n.t(`compress.preset.${presetId}.label`);
  }

  presetShortDescription(presetId: CompressionPresetId) {
    return this.i18n.t(`compress.preset.${presetId}.short`);
  }

  updatePlugin(plugin: PluginSetting, active: boolean) {
    this.plugins$.next(
      this.plugins$
        .getValue()
        .map((currentPlugin) =>
          currentPlugin.id === plugin.id
            ? { ...currentPlugin, active }
            : currentPlugin,
        ),
    );
  }

  private buildProfileTitle(
    activePreset: CompressionPresetId | 'custom',
    floatPrecision: number,
    transformPrecision: number,
  ) {
    if (activePreset === 'safe') {
      return this.i18n.t('compress.profile.title.safe');
    }

    if (activePreset === 'balanced') {
      return this.i18n.t('compress.profile.title.balanced');
    }

    if (activePreset === 'extreme') {
      return this.i18n.t('compress.profile.title.extreme');
    }

    if (floatPrecision <= 1 || transformPrecision <= 1) {
      return this.i18n.t('compress.profile.title.customSmaller');
    }

    if (floatPrecision >= 5 || transformPrecision >= 6) {
      return this.i18n.t('compress.profile.title.customSafer');
    }

    return this.i18n.t('compress.profile.title.customDefault');
  }

  private buildProfileDescription(
    activePreset: CompressionPresetId | 'custom',
    multipass: boolean,
    pretty: boolean,
    floatPrecision: number,
    transformPrecision: number,
  ) {
    if (activePreset !== 'custom') {
      return this.i18n.t(`compress.preset.${activePreset}.description`);
    }

    const precisionBias =
      floatPrecision <= 1 || transformPrecision <= 1
        ? this.i18n.t('compress.profile.description.lowerPrecision')
        : floatPrecision >= 5 || transformPrecision >= 6
          ? this.i18n.t('compress.profile.description.higherPrecision')
          : this.i18n.t('compress.profile.description.middlePrecision');

    const passMode = multipass
      ? this.i18n.t('compress.profile.description.multipassOn')
      : this.i18n.t('compress.profile.description.multipassOff');

    const outputMode = pretty
      ? this.i18n.t('compress.profile.description.outputReadable')
      : this.i18n.t('compress.profile.description.outputMinified');

    return `${precisionBias} ${passMode} ${outputMode}`;
  }

  private describePrecision(value: number) {
    if (value <= 1) {
      return this.i18n.t('compress.precision.aggressive');
    }

    if (value <= 3) {
      return this.i18n.t('compress.precision.balanced');
    }

    if (value <= 5) {
      return this.i18n.t('compress.precision.safe');
    }

    return this.i18n.t('compress.precision.verySafe');
  }

  private toPluginCard(plugin: PluginSetting): PluginCard {
    const categoryId = this.getPluginCategoryId(plugin.id);

    return {
      ...plugin,
      name: this.getPluginName(plugin),
      category: this.i18n.t(`compress.category.${categoryId}`),
      description: this.describePlugin(plugin, categoryId),
      caution: CAUTION_PLUGIN_IDS.has(plugin.id),
    };
  }

  private getPluginName(plugin: PluginSetting) {
    const translationKey = `compress.plugin.name.${plugin.id}`;
    const translatedName = this.i18n.t(translationKey);

    return translatedName === translationKey ? plugin.name : translatedName;
  }

  private describePlugin(plugin: PluginSetting, categoryId: PluginCategoryId) {
    const explicitTranslationKey = `compress.pluginDescription.${plugin.id}`;
    const explicitDescription = this.i18n.t(explicitTranslationKey);

    if (explicitDescription !== explicitTranslationKey) {
      return explicitDescription;
    }

    return this.i18n.t(`compress.categoryDescription.${categoryId}`);
  }

  private getPluginCategoryId(id: string): PluginCategoryId {
    if (id.includes('Style') || id.includes('style') || id.includes('Colors')) {
      return 'style';
    }

    if (
      id.includes('Path') ||
      id.includes('Transform') ||
      id.includes('Shape') ||
      id.includes('Ellipse') ||
      id.includes('Numeric') ||
      id.includes('ListOfValues')
    ) {
      return 'geometry';
    }

    if (
      id.startsWith('remove') &&
      (id.includes('Title') ||
        id.includes('Desc') ||
        id.includes('Metadata') ||
        id.includes('Comments') ||
        id.includes('Doctype') ||
        id.includes('XML'))
    ) {
      return 'metadata';
    }

    if (
      id.startsWith('merge') ||
      id.startsWith('move') ||
      id.includes('Group') ||
      id.includes('Defs') ||
      id === 'collapseGroups'
    ) {
      return 'structure';
    }

    if (id.startsWith('sort')) {
      return 'order';
    }

    return 'cleanup';
  }
}
