import type { TranslationDictionary } from '../i18n.types';
import {
  getNumberParam,
  getStringParam,
  pluralizeEn,
} from '../translation-helpers';

export const enDictionary = {
  'common.on': 'On',
  'common.off': 'Off',
  'common.visible': 'Visible',
  'common.hidden': 'Hidden',
  'common.original': 'Original',
  'common.optimized': 'Optimized',
  'common.copy': 'Copy',
  'common.clear': 'Clear',
  'common.theme': 'Theme',
  'common.theme.dark': 'Dark',
  'common.theme.light': 'Light',
  'common.language': 'Language',
  'common.language.en': 'English',
  'common.language.zhHant': '繁中',
  'common.batch': 'Batch',
  'common.optimization': 'Optimization',
  'common.quickPreview': 'Quick preview',
  'common.markup': 'Markup',
  'common.previewTone': 'Preview tone',
  'common.review': 'Review',
  'common.numberPrecision': 'Number precision',
  'common.transformPrecision': 'Transform precision',

  'app.status.scanningDirectory': 'Scanning directory',
  'app.status.restoringDirectory': 'Restoring last directory',
  'app.status.optimizingAssets': 'Optimizing SVG assets',
  'app.status.preparingZip': 'Preparing ZIP export',
  'app.status.batchReady': 'Batch ready',
  'app.status.noSvgFound': 'No SVG files found',
  'app.status.awaitingDirectory': 'Awaiting directory',

  'app.header.eyebrow': 'SVG Asset Operations',
  'app.header.description.compact':
    'Compact view keeps the grid in focus while batch context moves into the display popup.',
  'app.header.description.withBatch':
    'Keep the active batch in view, inspect the selected asset, and export once the directory is ready.',
  'app.header.description.empty':
    'Batch-review SVG assets, compare output, and export optimized files without leaving the workspace.',
  'app.header.fact.batch': 'Batch',
  'app.header.fact.batchCount': (params) => {
    const count = getNumberParam(params, 'count');
    return `${count} ${pluralizeEn(count, 'asset', 'assets')}`;
  },
  'app.header.fact.optimized': 'Optimized',
  'app.header.fact.optimizedReady': (params) =>
    `${getNumberParam(params, 'count')} ready`,
  'app.header.compact': 'Compact',
  'app.header.viewSource': 'View source',
  'app.header.installApp': 'Install app',
  'app.header.applyUpdate': 'Apply update',

  'app.toolbar.openDirectory': 'Open SVG directory',
  'app.toolbar.optimizeFiles': (params) => {
    const count = getNumberParam(params, 'count');
    return `Optimize ${count} ${pluralizeEn(count, 'file', 'files')}`;
  },
  'app.toolbar.exportZip': 'Export optimized ZIP',
  'app.toolbar.scanLikelyDuplicates': 'Scan likely duplicates',
  'app.toolbar.rescanLikelyDuplicates': 'Re-scan likely duplicates',
  'app.toolbar.scanningLikelyDuplicates': 'Scanning likely duplicates...',
  'app.toolbar.showingLikelyDuplicates': 'Showing likely duplicates',
  'app.toolbar.likelyDuplicates': 'Likely duplicates',
  'app.toolbar.showSvgProbe': 'Show SVG compare',
  'app.toolbar.hideSvgProbe': 'Hide SVG compare',
  'app.toolbar.reviewDisplay': 'Review display',
  'app.toolbar.optimizationProfile': 'Optimization profile',

  'app.previewTone.originalArtwork': 'Original artwork',
  'app.previewTone.contrastTone': (params) =>
    `${getStringParam(params, 'tone')} contrast tone`,

  'app.display.ariaLabel': 'Display and reference',
  'app.display.eyebrow': 'Review',
  'app.display.title': 'Display & reference',
  'app.display.description':
    'Change only how you inspect the current session. Optimized output and exports stay untouched.',
  'app.display.currentSetup': 'Current review setup',
  'app.display.compactLayout': 'Compact layout',
  'app.display.comfortLayout': 'Comfort layout',
  'app.display.previewTone': 'Preview tone',
  'app.display.contrastSwap': 'Contrast swap',
  'app.display.markup': 'Markup',
  'app.display.quickPreview': 'Quick preview',
  'app.display.batch': 'Batch',
  'app.display.optimized': 'Optimized',
  'app.display.pinnedCount': (params) =>
    `${getNumberParam(params, 'count')} pinned`,
  'app.display.placeholder': 'white / #111111 / currentColor',
  'app.display.inputHint':
    'Use a named color or hex value for currentColor and single-tone artwork. Contrast swap flips that tone to a light or dark bench color for faster readability checks.',
  'app.display.swapTitle': 'Swap to contrast tone',
  'app.display.swapDescription':
    'Useful when you want to test the same icon against the opposite light or dark reading condition without changing export output.',
  'app.display.keepMarkupTitle': 'Keep markup beside grid',
  'app.display.keepMarkupDescription':
    'Keep original and optimized markup open beside the asset grid while reviewing changes.',
  'app.display.guidanceEyebrow': 'How to use it',
  'app.display.guidance.1':
    'Change preview fill when you need to verify dark icons on light surfaces, or the reverse.',
  'app.display.guidance.2':
    'Tick card checkboxes to pin assets into the quick preview strip at the bottom of the workspace.',
  'app.display.guidance.3':
    'Use the compact toggle in the header when you want to scan larger batches with less surrounding detail.',
  'app.display.note':
    'Display settings only affect preview and inspection in this session. They never rewrite optimized or exported SVG files.',

  'app.profile.ariaLabel': 'Optimization profile',
  'app.profile.eyebrow': 'Optimization',
  'app.profile.title': 'Optimization profile',
  'app.profile.description':
    'These settings change how optimized SVG output is rewritten for single-file optimize, batch optimize, and ZIP export.',
  'app.profile.note':
    'Profile changes affect optimized output, not just preview. Restore the defaults if a custom combination starts breaking assets.',

  'app.workspace.currentBatch': 'Current batch',
  'app.workspace.activeDescription':
    'Review the selected asset while batch optimization and export remain available for the full directory.',
  'app.workspace.noSelectionTitle': 'No SVG selected',
  'app.workspace.noSelectionDescription':
    'Pick a card to inspect source, output, and compression deltas.',
  'app.workspace.shortcut.hideMarkup': 'Hide markup',
  'app.workspace.shortcut.openMarkup': 'Open markup',
  'app.workspace.shortcut.scanningDuplicates': 'Scanning duplicates...',
  'app.workspace.shortcut.showingItsGroup': 'Showing its group',
  'app.workspace.shortcut.showItsGroup': 'Show its group',
  'app.workspace.shortcut.findItsDuplicates': 'Find its duplicates',
  'app.workspace.shortcut.showingAllGroups': 'Showing all groups',
  'app.workspace.shortcut.browseDuplicateGroups': 'Browse duplicate groups',
  'app.workspace.shortcut.rescanDuplicates': 'Re-scan duplicates',
  'app.workspace.stat.batch': 'Batch',
  'app.workspace.stat.batchLoaded': (params) => {
    const count = getNumberParam(params, 'count');
    return `${count} ${pluralizeEn(count, 'asset', 'assets')} loaded`;
  },
  'app.workspace.stat.optimized': 'Optimized',
  'app.workspace.stat.optimizedReady': (params) =>
    `${getNumberParam(params, 'count')} ready`,
  'app.workspace.stat.awaitingOptimization': 'Awaiting optimization',
  'app.workspace.stat.quickPreview': 'Quick preview',
  'app.workspace.stat.duplicateReview': 'Duplicate review',
  'app.workspace.filter.label': 'Filter file names',
  'app.workspace.filter.placeholder': 'Search by file name',
  'app.workspace.filter.hint.idle':
    'Leave this blank to keep the full batch in view.',
  'app.workspace.filter.hint.matches': (params) => {
    const count = getNumberParam(params, 'count');
    const total = getNumberParam(params, 'total');
    const query = getStringParam(params, 'query');

    return `Showing ${count} of ${total} assets matching "${query}".`;
  },
  'app.workspace.filter.emptyTitle': 'No icons match this file-name filter',
  'app.workspace.filter.emptyDescription':
    'Try a shorter query or clear the filter to bring the current batch back into view.',
  'app.workspace.signal.preview': (params) =>
    `Preview ${getStringParam(params, 'tone')}`,
  'app.workspace.signal.showingDuplicatesOnly':
    'Showing likely duplicates only',
  'app.workspace.signal.markupOpen': 'Markup open',
  'app.workspace.signal.contrastPreview': 'Contrast preview',
  'app.workspace.signal.quickPreviewCount': (params) =>
    `${getNumberParam(params, 'count')} in quick preview`,
  'app.workspace.reviewEyebrow': 'Duplicate review',

  'app.duplicate.status.scanning': 'Scanning',
  'app.duplicate.status.notScanned': 'Not scanned',
  'app.duplicate.status.noMatches': 'No matches',
  'app.duplicate.status.likelyCount': (params) =>
    `${getNumberParam(params, 'count')} likely`,
  'app.duplicate.headline.building': 'Building duplicate review set',
  'app.duplicate.headline.scanOnDemand': 'Scan on demand',
  'app.duplicate.headline.noDuplicates': 'No likely duplicates found',
  'app.duplicate.headline.focusedGroupAssets': (params) => {
    const count = getNumberParam(params, 'count');
    return `${count} ${pluralizeEn(count, 'asset', 'assets')} in the focused group`;
  },
  'app.duplicate.headline.likelyInView': (params) => {
    const count = getNumberParam(params, 'count');
    return `${count} likely ${pluralizeEn(count, 'duplicate', 'duplicates')} in view`;
  },
  'app.duplicate.headline.groupsReady': (params) => {
    const count = getNumberParam(params, 'count');
    return `${count} ${pluralizeEn(count, 'group', 'groups')} ready to review`;
  },
  'app.duplicate.hint.building':
    'Rendered fingerprints are being compared across the current batch.',
  'app.duplicate.hint.scanOnDemand':
    'Run duplicate review only when you want to compare visually similar assets.',
  'app.duplicate.hint.noDuplicates':
    'The last scan did not surface any visually matching duplicate groups in this batch.',
  'app.duplicate.hint.focusedGroup':
    'The grid is narrowed to the active group. Use Show all matches in the rail to widen the comparison again.',
  'app.duplicate.hint.filtered':
    'The grid is narrowed to assets that share a visual fingerprint.',
  'app.duplicate.hint.default':
    'Use the duplicate rail to step through groups, pin candidates, and compare before deleting anything.',
  'app.duplicate.panelEyebrow': 'Likely duplicate groups',
  'app.duplicate.panelSummary': (params) => {
    const groupCount = getNumberParam(params, 'groupCount');
    const assetCount = getNumberParam(params, 'assetCount');

    return `${groupCount} ${pluralizeEn(groupCount, 'group', 'groups')} · ${assetCount} ${pluralizeEn(assetCount, 'asset', 'assets')}`;
  },
  'app.duplicate.panelDescription':
    'Review candidates in the rail, then keep the main grid free for whichever group you want to inspect in detail.',
  'app.duplicate.rescan': 'Re-scan',
  'app.duplicate.showAllMatches': 'Show all matches',
  'app.duplicate.groupEyebrow': (params) =>
    `Group ${getNumberParam(params, 'index')}`,
  'app.duplicate.candidates': (params) => {
    const count = getNumberParam(params, 'count');
    return `${count} ${pluralizeEn(count, 'candidate', 'candidates')}`;
  },
  'app.duplicate.optimizedVisualMatch': (params) =>
    `${getNumberParam(params, 'optimizedCount')} optimized · heuristic visual match`,
  'app.duplicate.showingThisGroup': 'Showing this group',
  'app.duplicate.showGroup': 'Show group',
  'app.duplicate.pinGroup': 'Pin group',
  'app.duplicate.item.optimizedReady': 'Optimized ready',
  'app.duplicate.item.originalOnly': 'Original only',
  'app.duplicate.badge.pinned': 'Pinned',
  'app.duplicate.badge.focused': 'Focused',

  'app.empty.badge.noSvg': 'No SVG files found',
  'app.empty.badge.ready': 'Workspace ready',
  'app.empty.title.noSvg': 'Choose another directory with SVG assets',
  'app.empty.title.ready': 'Open a directory to start an SVG review batch',
  'app.empty.description':
    'SVGOLOT loads each SVG into a focused review workflow so you can inspect output, tune the shared profile, and export only when the batch is ready to ship.',
  'app.empty.openDirectory': 'Open SVG directory',
  'app.empty.reconnectLastDirectory': (params) =>
    `Reconnect ${getStringParam(params, 'name')}`,
  'app.empty.reconnectLastDirectoryHint': (params) =>
    `The browser still remembers ${getStringParam(params, 'name')}. Reconnect it without browsing for the folder again.`,
  'app.empty.step1.title': 'Load a directory',
  'app.empty.step1.description':
    'Import a folder of SVG assets so the workspace can build a review batch and select the first file automatically.',
  'app.empty.step2.title': 'Inspect and tune',
  'app.empty.step2.description':
    'Review previews, keep markup beside the asset grid, and tune the shared SVGO profile before changing the whole batch.',
  'app.empty.step3.title': 'Optimize with control',
  'app.empty.step3.description':
    'Run one-off fixes from a card or optimize the full directory, then export only when the output is ready to hand off.',

  'app.quickPreview.ariaLabel': 'Quick preview selection',
  'app.quickPreview.eyebrow': 'Quick preview',
  'app.quickPreview.pinnedIcons': (params) => {
    const count = getNumberParam(params, 'count');
    return `${count} pinned ${pluralizeEn(count, 'icon', 'icons')}`;
  },
  'app.quickPreview.focused': (params) =>
    `Focused: ${getStringParam(params, 'name')}`,
  'app.quickPreview.clear': 'Clear',
  'app.quickPreview.removeAriaLabel': 'Remove from quick preview',

  'app.svgProbe.eyebrow': 'Paste SVG',
  'app.svgProbe.title': 'Compare an external SVG',
  'app.svgProbe.description':
    'Paste raw SVG markup, preview it with the current tone settings, then check whether the current batch contains heuristic visual matches.',
  'app.svgProbe.fieldLabel': 'SVG markup',
  'app.svgProbe.placeholder': '<svg viewBox="0 0 24 24">...</svg>',
  'app.svgProbe.fieldHint':
    'Paste a complete <svg>...</svg> string. The preview uses the current tone and contrast settings.',
  'app.svgProbe.optimizeButton': 'Optimize pasted SVG',
  'app.svgProbe.optimizingButton': 'Optimizing pasted SVG...',
  'app.svgProbe.searchButton': 'Find similar icons',
  'app.svgProbe.searchingButton': 'Finding similar icons...',
  'app.svgProbe.copyOptimizedButton': 'Copy optimized SVG',
  'app.svgProbe.batchHint':
    'Open an SVG directory first to compare against the current batch.',
  'app.svgProbe.validation.idle':
    'Paste SVG markup to preview it here and compare it against the loaded batch.',
  'app.svgProbe.validation.invalid':
    'This content is not valid SVG. Paste a complete <svg>...</svg> block.',
  'app.svgProbe.validation.ready':
    'SVG is ready. Preview it and run a heuristic similarity check against the current batch.',
  'app.svgProbe.previewEyebrow': 'Live preview',
  'app.svgProbe.previewAlt': 'Pasted SVG preview',
  'app.svgProbe.previewReady': 'Preview ready with current tone',
  'app.svgProbe.previewUnavailable': 'Preview unavailable',
  'app.svgProbe.previewInvalidHint':
    'Fix the SVG markup and the icon preview will appear here.',
  'app.svgProbe.previewEmpty': 'No SVG pasted yet',
  'app.svgProbe.previewEmptyHint':
    'Paste any SVG string and the icon will appear here.',
  'app.svgProbe.optimizedEyebrow': 'Optimized preview',
  'app.svgProbe.optimizedPreviewAlt': 'Optimized pasted SVG preview',
  'app.svgProbe.optimizedReady': 'Optimized SVG is ready',
  'app.svgProbe.optimizedHint':
    'This preview uses the current optimization profile. Copy the optimized markup when you want to reuse it elsewhere.',
  'app.svgProbe.optimizedDetailsEyebrow': 'Optimization details',
  'app.svgProbe.optimizedDetailsTitle': 'Review the optimized result',
  'app.svgProbe.optimizedDetailsDescription':
    'Shows the before-and-after sizes, the resulting compression ratio, and the exact optimized markup from the current profile.',
  'app.svgProbe.metric.originalSize': 'Original size',
  'app.svgProbe.metric.optimizedSize': 'Optimized size',
  'app.svgProbe.metric.compressionRatio': 'Compression ratio',
  'app.svgProbe.metric.compressionRatioHint': 'of the original size',
  'app.svgProbe.metric.sizeChange': 'Size change',
  'app.svgProbe.metric.saved': (params) =>
    `Saved ${getStringParam(params, 'size')} (${getStringParam(params, 'percent')}%)`,
  'app.svgProbe.metric.larger': (params) =>
    `${getStringParam(params, 'size')} larger (${getStringParam(params, 'percent')}%)`,
  'app.svgProbe.metric.sizeUnchanged': 'No size change',
  'app.svgProbe.optimizedMarkupEyebrow': 'Optimized markup',
  'app.svgProbe.optimizedMarkupDescription':
    'Exact SVG output generated by the current optimization profile.',
  'app.svgProbe.optimizingPreview': 'Building optimized preview',
  'app.svgProbe.optimizingHint':
    'The current optimization profile is being applied to the pasted SVG.',
  'app.svgProbe.optimizedUnavailable': 'Optimized preview unavailable',
  'app.svgProbe.optimizedUnavailableHint':
    'Try optimizing again after adjusting the pasted SVG or the current profile.',
  'app.svgProbe.optimizeFailed':
    'The current optimization profile could not optimize this pasted SVG.',
  'app.svgProbe.status.idle': 'Not searched yet',
  'app.svgProbe.status.searching': 'Comparing against current batch',
  'app.svgProbe.status.noMatches': 'No similar icons found',
  'app.svgProbe.status.matches': (params) => {
    const count = getNumberParam(params, 'count');
    return `${count} heuristic ${pluralizeEn(count, 'match', 'matches')} found`;
  },
  'app.svgProbe.resultsEyebrow': 'Match results',
  'app.svgProbe.resultsDescription':
    'Uses the same visual fingerprint heuristic as duplicate review. Select a result to jump to that asset.',
  'app.svgProbe.noMatchesHint':
    'Nothing in the current batch landed on the same visual fingerprint as the pasted SVG.',
  'app.svgProbe.loading': 'Loading the SVG probe tools...',
  'app.svgProbe.toast.copiedOptimized': 'Copied optimized pasted SVG.',

  'markup.ariaLabel': 'Markup review panel',
  'markup.selectedAsset': 'Selected asset',
  'markup.optimizedReady': 'Optimized output ready',
  'markup.awaitingOptimization': 'Awaiting optimization',
  'markup.originalTitle': 'Original',
  'markup.originalDescription':
    'Raw source currently loaded from the selected file.',
  'markup.optimizedTitle': 'Optimized',
  'markup.optimizedDescription.ready':
    'Export-ready markup generated from the active profile.',
  'markup.optimizedDescription.awaiting':
    'Run optimization to generate the export-ready result.',
  'markup.copy': 'Copy',
  'markup.optimizedEmpty':
    'No optimized SVG yet. Run optimization from the toolbar or directly from a card.',
  'markup.empty.title': 'Markup review stays here',
  'markup.empty.description':
    'Select an SVG card to compare original and optimized output without leaving the workspace.',
  'markup.toast.original': (params) =>
    `Copied original markup for ${getStringParam(params, 'name')}.`,
  'markup.toast.optimized': (params) =>
    `Copied optimized markup for ${getStringParam(params, 'name')}.`,

  'svgCard.quickPreview': 'Quick preview',
  'svgCard.duplicateMatches': (params) => {
    const count = getNumberParam(params, 'count');
    return `${count} ${pluralizeEn(count, 'match', 'matches')}`;
  },
  'svgCard.aria.swapPreviewTone': 'Swap to a contrasting preview tone',
  'svgCard.alt.swapPreviewTone': 'swap preview tone',
  'svgCard.aria.copyOptimized': 'Copy optimized SVG',
  'svgCard.alt.copyOptimized': 'copy svg',
  'svgCard.aria.optimize': 'Optimize SVG',
  'svgCard.alt.optimize': 'optimize svg',
  'svgCard.aria.downloadOptimized': 'Download optimized SVG',
  'svgCard.alt.downloadOptimized': 'download svg',
  'svgCard.notOptimizedYet': 'Not optimized yet',
  'svgCard.runOptimizeToCompare': 'Run optimize to compare',
  'svgCard.delta.saved': (params) => `${getStringParam(params, 'size')} saved`,
  'svgCard.delta.larger': (params) =>
    `${getStringParam(params, 'size')} larger`,
  'svgCard.state.optimizing': 'Optimizing',
  'svgCard.state.optimized': 'Optimized',
  'svgCard.state.original': 'Original',
  'svgCard.detail.original': 'Original',
  'svgCard.detail.optimized': 'Optimized',
  'svgCard.detail.delta': 'Delta',
  'svgCard.toast.copiedOptimized': (params) =>
    `Copied optimized SVG for ${getStringParam(params, 'name')}.`,

  'compress.overview.eyebrow': 'Profile presets',
  'compress.overview.reset': 'Back to balanced default',
  'compress.overview.ariaPresets': 'Compression presets',
  'compress.overview.customNote':
    'You are using a custom combination based on one of the presets.',
  'compress.overview.multipass': 'Multipass',
  'compress.overview.output': 'Output',
  'compress.overview.outputReadable': 'Readable',
  'compress.overview.outputMinified': 'Minified',
  'compress.overview.numbers': 'Numbers',
  'compress.overview.transforms': 'Transforms',
  'compress.overview.pluginsActive': (params) =>
    `${getNumberParam(params, 'activeCount')} / ${getNumberParam(params, 'totalCount')} plugins active`,
  'compress.overview.guidance.1':
    'Multipass cleans harder, but adds a little processing time.',
  'compress.overview.guidance.2':
    'Readable output helps review and diffs, while minified output stays smaller.',
  'compress.overview.guidance.3':
    'Lower precision is smaller, higher precision is safer for detailed curves and transforms.',
  'compress.core.eyebrow': 'Core behavior',
  'compress.core.description':
    'Choose whether optimized output should favor smaller files, easier review, or a balance of both.',
  'compress.core.multipass.title': 'Multipass',
  'compress.core.multipass.description':
    'Run extra cleanup passes when you want the profile to squeeze a little harder.',
  'compress.core.multipass.aria': 'Toggle multipass optimization',
  'compress.core.pretty.title': 'Prettify output',
  'compress.core.pretty.description':
    'Keep the optimized markup readable for audits, pull requests, and handoff review.',
  'compress.core.pretty.aria': 'Toggle pretty output',
  'compress.precision.eyebrow': 'Precision',
  'compress.precision.description':
    'Lower values reduce file size more aggressively. Raise them if icon edges or transforms start looking off.',
  'compress.precision.number.copy': (params) =>
    `${getStringParam(params, 'hint')} for most coordinate cleanup`,
  'compress.precision.number.aria': 'Number precision',
  'compress.precision.transform.copy': (params) =>
    `${getStringParam(params, 'hint')} when transforms need extra safety`,
  'compress.precision.transform.aria': 'Transform precision',
  'compress.precision.scale.smaller': 'Smaller',
  'compress.precision.scale.safer': 'Safer',
  'compress.advanced.eyebrow': 'Advanced transforms',
  'compress.advanced.description':
    'Leave the default mix alone for most SVG batches. Change individual transforms only when a specific export pattern needs special handling.',
  'compress.advanced.reviewOutput': 'Review output',
  'compress.preset.safe.label': 'Safe',
  'compress.preset.safe.short': 'Preserve more structure and geometry detail.',
  'compress.preset.safe.description':
    'Higher precision, readable output, and fewer structural rewrites for sensitive artwork, product icons, and review-heavy batches.',
  'compress.preset.balanced.label': 'Balanced',
  'compress.preset.balanced.short':
    'Recommended starting point for most icon sets.',
  'compress.preset.balanced.description':
    'The default workbench profile. It keeps the usual cleanup wins without pushing too hard on precision or risky transforms.',
  'compress.preset.extreme.label': 'Max compression',
  'compress.preset.extreme.short':
    'Push harder for size reduction and review the result.',
  'compress.preset.extreme.description':
    'Lower precision and a wider plugin set for the smallest practical output. Use it when bytes matter more than editability.',
  'compress.profile.title.safe': 'Safe preset is active',
  'compress.profile.title.balanced': 'Balanced preset is active',
  'compress.profile.title.extreme': 'Max compression preset is active',
  'compress.profile.title.customSmaller':
    'Custom profile, leaning toward smaller files',
  'compress.profile.title.customSafer':
    'Custom profile, leaning toward safer geometry',
  'compress.profile.title.customDefault':
    'Custom profile based on the defaults',
  'compress.profile.description.lowerPrecision':
    'Lower precision is tuned for smaller files, so review delicate curves and transforms after optimization.',
  'compress.profile.description.higherPrecision':
    'Higher precision keeps more numeric detail, which is safer for intricate geometry.',
  'compress.profile.description.middlePrecision':
    'Current precision stays close to the recommended middle ground for product icon sets.',
  'compress.profile.description.multipassOn':
    'Multipass is enabled for deeper cleanup.',
  'compress.profile.description.multipassOff':
    'Single-pass cleanup stays faster and a little more predictable.',
  'compress.profile.description.outputReadable':
    'Readable output is on, which helps reviews and diffs but can add bytes.',
  'compress.profile.description.outputMinified':
    'Output stays minified for smaller exports.',
  'compress.precision.aggressive': 'Aggressive',
  'compress.precision.balanced': 'Balanced',
  'compress.precision.safe': 'Safe',
  'compress.precision.verySafe': 'Very safe',
  'compress.category.metadata': 'Metadata',
  'compress.category.style': 'Style',
  'compress.category.geometry': 'Geometry',
  'compress.category.structure': 'Structure',
  'compress.category.order': 'Order',
  'compress.category.cleanup': 'Cleanup',
  'compress.categoryDescription.metadata':
    'Removes editor or document metadata that usually does not change how the SVG renders.',
  'compress.categoryDescription.style':
    'Rewrites style or color information into a smaller and more portable form.',
  'compress.categoryDescription.geometry':
    'Rewrites shapes, paths, or transforms into a smaller equivalent form.',
  'compress.categoryDescription.structure':
    'Simplifies grouping and element structure so the markup is easier to optimize.',
  'compress.categoryDescription.order':
    'Normalizes markup order for more consistent output between runs.',
  'compress.categoryDescription.cleanup':
    'Removes redundant markup that commonly comes from design-tool exports.',

  'compress.plugin.name.removeDoctype': 'Remove doctype',
  'compress.plugin.name.removeXMLProcInst': 'Remove XML instructions',
  'compress.plugin.name.removeComments': 'Remove comments',
  'compress.plugin.name.removeMetadata': 'Remove <metadata>',
  'compress.plugin.name.removeXMLNS': 'Remove xmlns',
  'compress.plugin.name.removeEditorsNSData': 'Remove editor data',
  'compress.plugin.name.cleanupAttrs': 'Clean up attribute whitespace',
  'compress.plugin.name.mergeStyles': 'Merge styles',
  'compress.plugin.name.inlineStyles': 'Inline styles',
  'compress.plugin.name.minifyStyles': 'Minify styles',
  'compress.plugin.name.convertStyleToAttrs': 'Style to attributes',
  'compress.plugin.name.cleanupIds': 'Clean up IDs',
  'compress.plugin.name.removeRasterImages': 'Remove raster images',
  'compress.plugin.name.removeUselessDefs': 'Remove unused defs',
  'compress.plugin.name.cleanupNumericValues': 'Round/rewrite numbers',
  'compress.plugin.name.cleanupListOfValues': 'Round/rewrite number lists',
  'compress.plugin.name.convertColors': 'Minify colours',
  'compress.plugin.name.removeUnknownsAndDefaults':
    'Remove unknowns & defaults',
  'compress.plugin.name.removeNonInheritableGroupAttrs':
    'Remove unneeded group attrs',
  'compress.plugin.name.removeUselessStrokeAndFill':
    'Remove useless stroke & fill',
  'compress.plugin.name.removeViewBox': 'Remove viewBox',
  'compress.plugin.name.cleanupEnableBackground':
    'Remove/tidy enable-background',
  'compress.plugin.name.removeHiddenElems': 'Remove hidden elements',
  'compress.plugin.name.removeEmptyText': 'Remove empty text',
  'compress.plugin.name.convertShapeToPath': 'Shapes to (smaller) paths',
  'compress.plugin.name.moveElemsAttrsToGroup': 'Move attrs to parent group',
  'compress.plugin.name.moveGroupAttrsToElems': 'Move group attrs to elements',
  'compress.plugin.name.collapseGroups': 'Collapse useless groups',
  'compress.plugin.name.convertPathData': 'Round/rewrite paths',
  'compress.plugin.name.convertEllipseToCircle':
    'Convert non-eccentric <ellipse> to <circle>',
  'compress.plugin.name.convertTransform': 'Round/rewrite transforms',
  'compress.plugin.name.removeEmptyAttrs': 'Remove empty attrs',
  'compress.plugin.name.removeEmptyContainers': 'Remove empty containers',
  'compress.plugin.name.mergePaths': 'Merge paths',
  'compress.plugin.name.removeUnusedNS': 'Remove unused namespaces',
  'compress.plugin.name.reusePaths': 'Replace duplicate elements with links',
  'compress.plugin.name.sortAttrs': 'Sort attrs',
  'compress.plugin.name.sortDefsChildren': 'Sort children of <defs>',
  'compress.plugin.name.removeTitle': 'Remove <title>',
  'compress.plugin.name.removeDesc': 'Remove <desc>',
  'compress.plugin.name.removeDimensions': 'Prefer viewBox to width/height',
  'compress.plugin.name.removeStyleElement': 'Remove style elements',
  'compress.plugin.name.removeScriptElement': 'Remove script elements',
  'compress.plugin.name.removeOffCanvasPaths': 'Remove out-of-bounds paths',

  'compress.pluginDescription.cleanupIds':
    'Renames or removes unused IDs. Review carefully if CSS, masks, or scripts target specific IDs.',
  'compress.pluginDescription.inlineStyles':
    'Moves style rules onto elements so the SVG is easier to embed without external CSS.',
  'compress.pluginDescription.convertStyleToAttrs':
    'Rewrites style declarations as SVG attributes when the visual result stays the same.',
  'compress.pluginDescription.removeXMLNS':
    'Drops the xmlns attribute. Useful only when the target environment adds it back or does not require it.',
  'compress.pluginDescription.removeRasterImages':
    'Deletes embedded bitmap images. Turn this on only when raster content should never ship.',
  'compress.pluginDescription.removeUnknownsAndDefaults':
    'Strips unknown or default attributes. Helpful for cleanup, but some design exports rely on those values.',
  'compress.pluginDescription.removeViewBox':
    'Removes viewBox. This can break responsive scaling, so leave it off unless width and height must be authoritative.',
  'compress.pluginDescription.removeTitle':
    'Removes title text. Leave it off if the SVG relies on built-in accessible labeling.',
  'compress.pluginDescription.removeDesc':
    'Removes desc text that can help documentation and accessibility tooling.',
  'compress.pluginDescription.removeDimensions':
    'Drops width and height so viewBox controls scaling. Useful for responsive icon systems.',
  'compress.pluginDescription.removeStyleElement':
    'Deletes <style> blocks. Only enable when styles are already inlined or are no longer needed.',
  'compress.pluginDescription.removeScriptElement':
    'Deletes embedded scripts to harden exported SVG files.',
  'compress.pluginDescription.removeOffCanvasPaths':
    'Removes artwork outside the canvas. Good for cleanup, risky if overflow content is intentional.',
  'compress.pluginDescription.reusePaths':
    'Replaces duplicate shapes with references. Smaller output, but a little harder to edit manually.',

  'toast.notifications': 'Notifications',
  'toast.dismiss': 'Dismiss notification',
} as const satisfies TranslationDictionary;

export type TranslationKey = keyof typeof enDictionary;
