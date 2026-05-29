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

  'app.status.scanningDirectory': 'Reading SVG directory',
  'app.status.restoringDirectory': 'Reconnecting last directory',
  'app.status.optimizingAssets': 'Optimizing current batch',
  'app.status.preparingZip': 'Preparing ZIP export',
  'app.status.batchReady': 'Batch ready for review',
  'app.status.noSvgFound': 'This folder has no SVG files',
  'app.status.awaitingDirectory': 'Open an SVG directory',

  'app.header.eyebrow': 'SVG Asset Operations',
  'app.header.description.compact':
    'Compact view moves secondary details into Display settings so the grid stays front and center.',
  'app.header.description.withBatch':
    'Review the current batch, inspect the selected asset, then export when everything looks right.',
  'app.header.description.empty':
    'Load SVGs, review results, and export the final batch from one workspace.',
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
  'app.seo.title': 'SVGOLOT | Batch SVG inspection, optimization, and export',
  'app.seo.description':
    'Open an SVG directory, inspect previews and markup, tune SVGO settings, detect likely duplicates, and export an optimized ZIP from one browser workspace.',
  'app.seo.imageAlt': 'SVGOLOT batch SVG inspection and optimization workspace',

  'app.toolbar.openDirectory': 'Open SVG directory',
  'app.toolbar.optimizeFiles': (params) => {
    const count = getNumberParam(params, 'count');
    return `Optimize ${count} ${pluralizeEn(count, 'file', 'files')}`;
  },
  'app.toolbar.exportZip': 'Export optimized ZIP',
  'app.toolbar.scanLikelyDuplicates': 'Scan likely duplicates',
  'app.toolbar.rescanLikelyDuplicates': 'Re-scan likely duplicates',
  'app.toolbar.scanningLikelyDuplicates': 'Scanning likely duplicates...',
  'app.toolbar.showingLikelyDuplicates': 'Likely duplicates only',
  'app.toolbar.likelyDuplicates': 'View likely duplicates',
  'app.toolbar.showSvgProbe': 'Show SVG comparison',
  'app.toolbar.hideSvgProbe': 'Hide SVG comparison',
  'app.toolbar.reviewDisplay': 'Display settings',
  'app.toolbar.optimizationProfile': 'Optimization settings',

  'app.previewTone.originalArtwork': 'Original artwork',
  'app.previewTone.contrastTone': (params) =>
    `${getStringParam(params, 'tone')} contrast tone`,

  'app.display.ariaLabel': 'Display and reference',
  'app.display.eyebrow': 'Review',
  'app.display.title': 'Display & reference',
  'app.display.description':
    'These settings only change what you see on screen. They do not change optimized output or exports.',
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
    'Enter a named color, hex value, or currentColor. Best for currentColor or single-tone icons.',
  'app.display.swapTitle': 'Swap to contrast tone',
  'app.display.swapDescription':
    'Check the same icon on light and dark surfaces without changing the exported SVG.',
  'app.display.keepMarkupTitle': 'Keep markup beside grid',
  'app.display.keepMarkupDescription':
    'Keep original and optimized markup visible beside the grid so you can compare while reviewing.',
  'app.display.guidanceEyebrow': 'How to use it',
  'app.display.guidance.1':
    'Adjust the preview tone when you need to check icon readability on lighter or darker backgrounds.',
  'app.display.guidance.2':
    'Use card checkboxes to pin icons into the quick preview strip for side-by-side comparison.',
  'app.display.guidance.3':
    'Switch to Compact mode when you want to scan larger batches with less surrounding detail.',
  'app.display.note':
    'Display settings affect preview only for this session. They never rewrite SVG files.',

  'app.profile.ariaLabel': 'Optimization profile',
  'app.profile.eyebrow': 'Optimization',
  'app.profile.title': 'Optimization profile',
  'app.profile.description':
    'These settings directly affect single-file optimization, batch optimization, and ZIP export output.',
  'app.profile.note':
    'These settings change real output, not just preview. Restore defaults if a custom setup starts breaking icons.',

  'app.workspace.currentBatch': 'Current batch',
  'app.workspace.activeDescription':
    'Review the selected asset while batch optimization and export remain available for the full directory.',
  'app.workspace.noSelectionTitle': 'No SVG selected',
  'app.workspace.noSelectionDescription':
    'Pick a card to inspect source, output, and compression deltas.',
  'app.workspace.shortcut.hideMarkup': 'Hide markup',
  'app.workspace.shortcut.openMarkup': 'Show markup',
  'app.workspace.shortcut.scanningDuplicates': 'Finding similar icons...',
  'app.workspace.shortcut.showingItsGroup': 'Viewing this group only',
  'app.workspace.shortcut.showItsGroup': 'View this group',
  'app.workspace.shortcut.findItsDuplicates': 'Find similar icons',
  'app.workspace.shortcut.showingAllGroups': 'Viewing all groups',
  'app.workspace.shortcut.browseDuplicateGroups': 'View all groups',
  'app.workspace.shortcut.rescanDuplicates': 'Scan again',
  'app.workspace.stat.batch': 'Batch',
  'app.workspace.stat.batchLoaded': (params) => {
    const count = getNumberParam(params, 'count');
    return `${count} ${pluralizeEn(count, 'asset', 'assets')} loaded`;
  },
  'app.workspace.stat.optimized': 'Optimized',
  'app.workspace.stat.optimizedReady': (params) =>
    `${getNumberParam(params, 'count')} ready`,
  'app.workspace.stat.awaitingOptimization': 'Not optimized yet',
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
    'Try a shorter query, or clear the filter.',
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
  'app.duplicate.status.noMatches': 'No likely duplicates',
  'app.duplicate.status.likelyCount': (params) =>
    `${getNumberParam(params, 'count')} likely matches`,
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
    'Comparing icon appearance. This can take a moment.',
  'app.duplicate.hint.scanOnDemand':
    'Run this scan when you want to find icons that look alike.',
  'app.duplicate.hint.noDuplicates':
    'The last scan did not find any clearly similar groups in this batch.',
  'app.duplicate.hint.focusedGroup':
    'Only this group is showing. Use Show all matches to go back.',
  'app.duplicate.hint.filtered':
    'The grid is filtered to assets that landed in the same appearance-based group.',
  'app.duplicate.hint.default':
    'Step through groups, pin the candidates you want to compare, then review them side by side.',
  'app.duplicate.panelEyebrow': 'Likely duplicate groups',
  'app.duplicate.panelSummary': (params) => {
    const groupCount = getNumberParam(params, 'groupCount');
    const assetCount = getNumberParam(params, 'assetCount');

    return `${groupCount} ${pluralizeEn(groupCount, 'group', 'groups')} · ${assetCount} ${pluralizeEn(assetCount, 'asset', 'assets')}`;
  },
  'app.duplicate.panelDescription':
    'Use the rail to choose a group, then use the main grid for closer review and comparison.',
  'app.duplicate.rescan': 'Re-scan',
  'app.duplicate.showAllMatches': 'Show all matches',
  'app.duplicate.groupEyebrow': (params) =>
    `Group ${getNumberParam(params, 'index')}`,
  'app.duplicate.candidates': (params) => {
    const count = getNumberParam(params, 'count');
    return `${count} ${pluralizeEn(count, 'candidate', 'candidates')}`;
  },
  'app.duplicate.optimizedVisualMatch': (params) =>
    `${getNumberParam(params, 'optimizedCount')} optimized · may look similar`,
  'app.duplicate.showingThisGroup': 'Viewing group',
  'app.duplicate.showGroup': 'View group',
  'app.duplicate.pinGroup': 'Pin whole group',
  'app.duplicate.item.optimizedReady': 'Optimized ready',
  'app.duplicate.item.originalOnly': 'Original only',
  'app.duplicate.badge.pinned': 'Pinned',
  'app.duplicate.badge.focused': 'Focused',

  'app.empty.badge.noSvg': 'No SVG files found',
  'app.empty.badge.ready': 'Workspace ready',
  'app.empty.title.noSvg': 'Choose another directory with SVG assets',
  'app.empty.title.ready': 'Open a directory to start an SVG review batch',
  'app.empty.description':
    'Open an SVG folder to preview files, compare results, and export the final batch.',
  'app.empty.openDirectory': 'Open SVG directory',
  'app.empty.reconnectLastDirectory': (params) =>
    `Reconnect ${getStringParam(params, 'name')}`,
  'app.empty.reconnectLastDirectoryHint': (params) =>
    `The browser still remembers ${getStringParam(params, 'name')}. If permission is still available, you can reconnect right away.`,
  'app.empty.step1.title': 'Load a directory',
  'app.empty.step1.description':
    'Choose a folder with SVG files. The workspace builds a batch and selects the first file.',
  'app.empty.step2.title': 'Inspect and tune',
  'app.empty.step2.description':
    'Review previews and markup first, then adjust shared optimization settings if needed.',
  'app.empty.step3.title': 'Optimize when ready',
  'app.empty.step3.description':
    'Optimize one icon or the full folder, then export after checking the result.',

  'app.quickPreview.ariaLabel': 'Quick preview selection',
  'app.quickPreview.eyebrow': 'Quick preview',
  'app.quickPreview.pinnedIcons': (params) => {
    const count = getNumberParam(params, 'count');
    return `${count} pinned ${pluralizeEn(count, 'icon', 'icons')}`;
  },
  'app.quickPreview.focused': (params) =>
    `Focused: ${getStringParam(params, 'name')}`,
  'app.quickPreview.clear': 'Clear pinned icons',
  'app.quickPreview.removeAriaLabel': 'Remove from quick preview',

  'app.svgProbe.eyebrow': 'Paste SVG',
  'app.svgProbe.title': 'Compare an external SVG',
  'app.svgProbe.description':
    'Paste an SVG, preview it, then check whether the current batch has similar icons.',
  'app.svgProbe.fieldLabel': 'SVG markup',
  'app.svgProbe.placeholder': '<svg viewBox="0 0 24 24">...</svg>',
  'app.svgProbe.fieldHint':
    'Paste the full <svg>...</svg> content. The preview uses your current display settings.',
  'app.svgProbe.optimizeButton': 'Optimize this SVG',
  'app.svgProbe.optimizingButton': 'Optimizing this SVG...',
  'app.svgProbe.searchButton': 'Find similar icons',
  'app.svgProbe.searchingButton': 'Finding similar icons...',
  'app.svgProbe.copyOptimizedButton': 'Copy optimized result',
  'app.svgProbe.clearButton': 'Clear SVG',
  'app.svgProbe.batchHint':
    'Open an SVG directory first to compare with the current batch.',
  'app.svgProbe.validation.idle': 'Paste SVG here to preview it first.',
  'app.svgProbe.validation.invalid':
    'This is not valid SVG. Make sure you pasted a complete <svg>...</svg> block.',
  'app.svgProbe.validation.ready':
    'Your SVG is ready. You can optimize it or look for similar icons.',
  'app.svgProbe.previewEyebrow': 'Live preview',
  'app.svgProbe.previewAlt': 'Pasted SVG preview',
  'app.svgProbe.previewReady': 'Preview ready with current tone',
  'app.svgProbe.previewUnavailable': 'Preview unavailable',
  'app.svgProbe.previewInvalidHint':
    'Fix the SVG markup and the preview will appear here.',
  'app.svgProbe.previewEmpty': 'No SVG pasted yet',
  'app.svgProbe.previewEmptyHint':
    'Paste an SVG string and the icon will appear here.',
  'app.svgProbe.optimizedEyebrow': 'Optimized preview',
  'app.svgProbe.optimizedPreviewAlt': 'Optimized pasted SVG preview',
  'app.svgProbe.optimizedReady': 'Optimized SVG is ready',
  'app.svgProbe.optimizedHint':
    'This uses the current optimization settings. Copy it if you want to reuse it.',
  'app.svgProbe.optimizedDetailsEyebrow': 'Optimization details',
  'app.svgProbe.optimizedDetailsTitle': 'Review the optimized result',
  'app.svgProbe.optimizedDetailsDescription':
    'Shows before-and-after sizes, compression ratio, and the result you can copy.',
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
    'SVG output generated by the current optimization settings.',
  'app.svgProbe.optimizingPreview': 'Building optimized preview',
  'app.svgProbe.optimizingHint':
    'Applying the current optimization settings to the pasted SVG.',
  'app.svgProbe.optimizedUnavailable': 'Optimized preview unavailable',
  'app.svgProbe.optimizedUnavailableHint':
    'Adjust the SVG or optimization settings and try again.',
  'app.svgProbe.optimizeFailed':
    'The current optimization settings could not process this SVG. Check the content or adjust the settings and try again.',
  'app.svgProbe.status.idle': 'Not compared yet',
  'app.svgProbe.status.searching': 'Comparing with current batch',
  'app.svgProbe.status.noMatches': 'No similar icons',
  'app.svgProbe.status.matches': (params) => {
    const count = getNumberParam(params, 'count');
    return `${count} similar ${pluralizeEn(count, 'icon', 'icons')} found`;
  },
  'app.svgProbe.resultsEyebrow': 'Match results',
  'app.svgProbe.resultsDescription':
    'These are candidate icons that look similar. Select one to jump to it.',
  'app.svgProbe.noMatchesHint':
    'No icon in the current batch looks close to the pasted SVG.',
  'app.svgProbe.loading': 'Loading the SVG probe tools...',
  'app.svgProbe.toast.copiedOptimized':
    'Copied optimized result for the pasted SVG.',

  'markup.ariaLabel': 'Markup review panel',
  'markup.selectedAsset': 'Selected asset',
  'markup.optimizedReady': 'Optimized result ready',
  'markup.awaitingOptimization': 'Not optimized yet',
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
    'No optimized SVG yet. Run optimization from the toolbar or a card.',
  'markup.empty.title': 'Markup review stays here',
  'markup.empty.description':
    'Select an SVG card to compare original and optimized output here.',
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
  'svgCard.alt.swapPreviewTone': 'Swap preview tone',
  'svgCard.aria.copyOptimized': 'Copy optimized SVG',
  'svgCard.alt.copyOptimized': 'Copy optimized SVG',
  'svgCard.aria.optimize': 'Optimize SVG',
  'svgCard.alt.optimize': 'Optimize SVG',
  'svgCard.aria.downloadOptimized': 'Download optimized SVG',
  'svgCard.alt.downloadOptimized': 'Download optimized SVG',
  'svgCard.notOptimizedYet': 'Not optimized yet',
  'svgCard.runOptimizeToCompare': 'Run optimize to compare',
  'svgCard.delta.saved': (params) => `${getStringParam(params, 'size')} saved`,
  'svgCard.delta.larger': (params) =>
    `${getStringParam(params, 'size')} larger`,
  'svgCard.state.optimizing': 'Optimizing',
  'svgCard.state.optimized': 'Optimized',
  'svgCard.state.original': 'Not optimized',
  'svgCard.detail.original': 'Original',
  'svgCard.detail.optimized': 'Optimized',
  'svgCard.detail.delta': 'Delta',
  'svgCard.toast.copiedOptimized': (params) =>
    `Copied optimized SVG for ${getStringParam(params, 'name')}.`,

  'compress.overview.eyebrow': 'Profile presets',
  'compress.overview.reset': 'Back to balanced default',
  'compress.overview.ariaPresets': 'Compression presets',
  'compress.overview.customNote':
    'You are using a custom version of one of the presets.',
  'compress.overview.multipass': 'Multipass',
  'compress.overview.output': 'Output',
  'compress.overview.outputReadable': 'Readable',
  'compress.overview.outputMinified': 'Minified',
  'compress.overview.numbers': 'Numbers',
  'compress.overview.transforms': 'Transforms',
  'compress.overview.pluginsActive': (params) =>
    `${getNumberParam(params, 'activeCount')} / ${getNumberParam(params, 'totalCount')} plugins active`,
  'compress.overview.guidance.1':
    'Multipass runs extra cleanup rounds. It usually makes files smaller, but it takes longer.',
  'compress.overview.guidance.2':
    'Readable output is easier to inspect and diff, while minified output keeps files smaller.',
  'compress.overview.guidance.3':
    'Lower precision saves more space, while higher precision is safer for detailed curves and transforms.',
  'compress.core.eyebrow': 'Core behavior',
  'compress.core.description':
    'Choose whether optimization should favor smaller files, easier review, or a balance of both.',
  'compress.core.multipass.title': 'Multipass',
  'compress.core.multipass.description':
    'Turn this on when you want to squeeze files a little harder and do not mind extra processing time.',
  'compress.core.multipass.aria': 'Toggle multipass optimization',
  'compress.core.pretty.title': 'Readable output',
  'compress.core.pretty.description':
    'Keep the optimized SVG readable for inspection, code review, and handoff.',
  'compress.core.pretty.aria': 'Toggle pretty output',
  'compress.precision.eyebrow': 'Precision',
  'compress.precision.description':
    'Lower values compress more aggressively. Raise them if icon edges or transforms start to look wrong.',
  'compress.precision.number.copy': (params) =>
    `${getStringParam(params, 'hint')} for general coordinate cleanup`,
  'compress.precision.number.aria': 'Number precision',
  'compress.precision.transform.copy': (params) =>
    `${getStringParam(params, 'hint')} when transforms need a more conservative setting`,
  'compress.precision.transform.aria': 'Transform precision',
  'compress.precision.scale.smaller': 'Smaller',
  'compress.precision.scale.safer': 'Safer',
  'compress.advanced.eyebrow': 'Advanced transforms',
  'compress.advanced.description':
    'The defaults are right for most SVG batches. Change individual transforms only when a specific output issue needs extra handling.',
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
