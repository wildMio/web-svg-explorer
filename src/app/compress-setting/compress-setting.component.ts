import { AsyncPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { combineLatest, map } from 'rxjs';

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

const EXPLICIT_PLUGIN_DESCRIPTIONS: Partial<Record<string, string>> = {
  cleanupIds:
    'Renames or removes unused IDs. Review carefully if CSS, masks, or scripts target specific IDs.',
  inlineStyles:
    'Moves style rules onto elements so the SVG is easier to embed without external CSS.',
  convertStyleToAttrs:
    'Rewrites style declarations as SVG attributes when the visual result stays the same.',
  removeXMLNS:
    'Drops the xmlns attribute. Useful only when the target environment adds it back or does not require it.',
  removeRasterImages:
    'Deletes embedded bitmap images. Turn this on only when raster content should never ship.',
  removeUnknownsAndDefaults:
    'Strips unknown or default attributes. Helpful for cleanup, but some design exports rely on those values.',
  removeViewBox:
    'Removes viewBox. This can break responsive scaling, so leave it off unless width and height must be authoritative.',
  removeTitle:
    'Removes title text. Leave it off if the SVG relies on built-in accessible labeling.',
  removeDesc:
    'Removes desc text that can help documentation and accessibility tooling.',
  removeDimensions:
    'Drops width and height so viewBox controls scaling. Useful for responsive icon systems.',
  removeStyleElement:
    'Deletes <style> blocks. Only enable when styles are already inlined or are no longer needed.',
  removeScriptElement: 'Deletes embedded scripts to harden exported SVG files.',
  removeOffCanvasPaths:
    'Removes artwork outside the canvas. Good for cleanup, risky if overflow content is intentional.',
  reusePaths:
    'Replaces duplicate shapes with references. Smaller output, but a little harder to edit manually.',
};

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
  pluginCards$ = this.plugins$.pipe(
    map((plugins) => plugins.map((plugin) => this.toPluginCard(plugin))),
  );
  floatPrecisionHint$ = this.floatPrecision$.pipe(
    map((value) => this.describePrecision(value)),
  );
  transformPrecisionHint$ = this.transformPrecision$.pipe(
    map((value) => this.describePrecision(value)),
  );
  profileSummary$ = combineLatest([
    this.activePreset$,
    this.multipass$,
    this.pretty$,
    this.floatPrecision$,
    this.transformPrecision$,
    this.activePluginCount$,
    this.plugins$,
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
          multipassLabel: multipass ? 'On' : 'Off',
          prettyLabel: pretty ? 'Readable' : 'Minified',
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
      return 'Safe preset is active';
    }

    if (activePreset === 'balanced') {
      return 'Balanced preset is active';
    }

    if (activePreset === 'extreme') {
      return 'Max compression preset is active';
    }

    if (floatPrecision <= 1 || transformPrecision <= 1) {
      return 'Custom profile, leaning toward smaller files';
    }

    if (floatPrecision >= 5 || transformPrecision >= 6) {
      return 'Custom profile, leaning toward safer geometry';
    }

    return 'Custom profile based on the defaults';
  }

  private buildProfileDescription(
    activePreset: CompressionPresetId | 'custom',
    multipass: boolean,
    pretty: boolean,
    floatPrecision: number,
    transformPrecision: number,
  ) {
    if (activePreset !== 'custom') {
      return this.presetOptions.find(({ id }) => id === activePreset)
        ?.description as string;
    }

    const precisionBias =
      floatPrecision <= 1 || transformPrecision <= 1
        ? 'Lower precision is tuned for smaller files, so review delicate curves and transforms after optimization.'
        : floatPrecision >= 5 || transformPrecision >= 6
          ? 'Higher precision keeps more numeric detail, which is safer for intricate geometry.'
          : 'Current precision stays close to the recommended middle ground for product icon sets.';

    const passMode = multipass
      ? 'Multipass is enabled for deeper cleanup.'
      : 'Single-pass cleanup stays faster and a little more predictable.';

    const outputMode = pretty
      ? 'Readable output is on, which helps reviews and diffs but can add bytes.'
      : 'Output stays minified for smaller exports.';

    return `${precisionBias} ${passMode} ${outputMode}`;
  }

  private describePrecision(value: number) {
    if (value <= 1) {
      return 'Aggressive';
    }

    if (value <= 3) {
      return 'Balanced';
    }

    if (value <= 5) {
      return 'Safe';
    }

    return 'Very safe';
  }

  private toPluginCard(plugin: PluginSetting): PluginCard {
    return {
      ...plugin,
      category: this.getPluginCategory(plugin.id),
      description: this.describePlugin(plugin),
      caution: CAUTION_PLUGIN_IDS.has(plugin.id),
    };
  }

  private describePlugin(plugin: PluginSetting) {
    const explicitDescription = EXPLICIT_PLUGIN_DESCRIPTIONS[plugin.id];

    if (explicitDescription) {
      return explicitDescription;
    }

    switch (this.getPluginCategory(plugin.id)) {
      case 'Metadata':
        return 'Removes editor or document metadata that usually does not change how the SVG renders.';
      case 'Style':
        return 'Rewrites style or color information into a smaller and more portable form.';
      case 'Geometry':
        return 'Rewrites shapes, paths, or transforms into a smaller equivalent form.';
      case 'Structure':
        return 'Simplifies grouping and element structure so the markup is easier to optimize.';
      case 'Order':
        return 'Normalizes markup order for more consistent output between runs.';
      default:
        return 'Removes redundant markup that commonly comes from design-tool exports.';
    }
  }

  private getPluginCategory(id: string) {
    if (id.includes('Style') || id.includes('style') || id.includes('Colors')) {
      return 'Style';
    }

    if (
      id.includes('Path') ||
      id.includes('Transform') ||
      id.includes('Shape') ||
      id.includes('Ellipse') ||
      id.includes('Numeric') ||
      id.includes('ListOfValues')
    ) {
      return 'Geometry';
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
      return 'Metadata';
    }

    if (
      id.startsWith('merge') ||
      id.startsWith('move') ||
      id.includes('Group') ||
      id.includes('Defs') ||
      id === 'collapseGroups'
    ) {
      return 'Structure';
    }

    if (id.startsWith('sort')) {
      return 'Order';
    }

    return 'Cleanup';
  }
}
