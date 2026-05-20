import type { TranslationEntry } from '../i18n.types';
import { getNumberParam, getStringParam } from '../translation-helpers';
import type { TranslationKey } from './en';

export const zhHantDictionary = {
  'common.on': '開',
  'common.off': '關',
  'common.visible': '顯示',
  'common.hidden': '隱藏',
  'common.original': '原始',
  'common.optimized': '已優化',
  'common.copy': '複製',
  'common.clear': '清除',
  'common.theme': '主題',
  'common.theme.dark': '深色',
  'common.theme.light': '淺色',
  'common.language': '語系',
  'common.language.en': 'English',
  'common.language.zhHant': '繁中',
  'common.batch': '批次',
  'common.optimization': '優化',
  'common.quickPreview': '快速預覽',
  'common.markup': '標記',
  'common.previewTone': '預覽色調',
  'common.review': '檢視',
  'common.numberPrecision': '數值精度',
  'common.transformPrecision': 'Transform 精度',

  'app.status.scanningDirectory': '正在掃描目錄',
  'app.status.optimizingAssets': '正在優化 SVG 素材',
  'app.status.preparingZip': '正在準備 ZIP 匯出',
  'app.status.batchReady': '批次已就緒',
  'app.status.noSvgFound': '找不到 SVG 檔案',
  'app.status.awaitingDirectory': '等待開啟目錄',

  'app.header.eyebrow': 'SVG 資產操作',
  'app.header.description.compact':
    '精簡檢視會讓格線保持在焦點，並把批次脈絡移到顯示彈窗中。',
  'app.header.description.withBatch':
    '保持批次內容在視線中、檢視目前選取的素材，等目錄準備好後再匯出。',
  'app.header.description.empty':
    '在不離開工作區的情況下批次檢視 SVG、比較輸出，並匯出優化後的檔案。',
  'app.header.fact.batch': '批次',
  'app.header.fact.batchCount': (params) =>
    `${getNumberParam(params, 'count')} 個素材`,
  'app.header.fact.optimized': '已優化',
  'app.header.fact.optimizedReady': (params) =>
    `${getNumberParam(params, 'count')} 個可用`,
  'app.header.compact': '精簡',
  'app.header.viewSource': '查看原始碼',
  'app.header.installApp': '安裝應用',
  'app.header.applyUpdate': '套用更新',

  'app.toolbar.openDirectory': '開啟 SVG 目錄',
  'app.toolbar.optimizeFiles': (params) =>
    `優化 ${getNumberParam(params, 'count')} 個檔案`,
  'app.toolbar.exportZip': '匯出優化 ZIP',
  'app.toolbar.scanLikelyDuplicates': '掃描疑似重複',
  'app.toolbar.rescanLikelyDuplicates': '重新掃描疑似重複',
  'app.toolbar.scanningLikelyDuplicates': '正在掃描疑似重複...',
  'app.toolbar.showingLikelyDuplicates': '顯示疑似重複',
  'app.toolbar.likelyDuplicates': '疑似重複',
  'app.toolbar.showSvgProbe': '顯示 SVG 比對',
  'app.toolbar.hideSvgProbe': '隱藏 SVG 比對',
  'app.toolbar.reviewDisplay': '檢視顯示',
  'app.toolbar.optimizationProfile': '優化設定檔',

  'app.previewTone.originalArtwork': '原始圖稿',
  'app.previewTone.contrastTone': (params) =>
    `${getStringParam(params, 'tone')} 對比色調`,

  'app.display.ariaLabel': '顯示與參考',
  'app.display.eyebrow': '檢視',
  'app.display.title': '顯示與參考',
  'app.display.description':
    '這裡只會改變你檢視目前工作階段的方式，不會影響優化輸出與匯出內容。',
  'app.display.currentSetup': '目前檢視設定',
  'app.display.compactLayout': '精簡版面',
  'app.display.comfortLayout': '舒適版面',
  'app.display.previewTone': '預覽色調',
  'app.display.contrastSwap': '對比切換',
  'app.display.markup': '標記',
  'app.display.quickPreview': '快速預覽',
  'app.display.batch': '批次',
  'app.display.optimized': '已優化',
  'app.display.pinnedCount': (params) =>
    `已釘選 ${getNumberParam(params, 'count')} 個`,
  'app.display.placeholder': 'white / #111111 / currentColor',
  'app.display.inputHint':
    '對於 currentColor 與單色圖稿，可輸入命名色或十六進位色值。對比切換會把這個色調翻成淺色或深色工作台顏色，方便快速檢查可讀性。',
  'app.display.swapTitle': '切換為對比色調',
  'app.display.swapDescription':
    '當你想在不改變匯出結果的前提下，測試同一個圖示在相反明暗閱讀情境下的表現時很有用。',
  'app.display.keepMarkupTitle': '讓標記固定在格線旁',
  'app.display.keepMarkupDescription':
    '在檢視變更時，讓原始與優化後的標記持續顯示在素材格線旁。',
  'app.display.guidanceEyebrow': '使用方式',
  'app.display.guidance.1':
    '當你需要驗證深色圖示在淺色背景上的可讀性，或反過來時，可以調整預覽填色。',
  'app.display.guidance.2':
    '勾選卡片上的核取方塊，可把素材釘選到工作區底部的快速預覽列。',
  'app.display.guidance.3':
    '想在較大的批次裡快速掃描時，可使用 header 的精簡切換，減少周邊細節。',
  'app.display.note':
    '顯示設定只會影響這次工作階段中的預覽與檢視，不會改寫優化或匯出的 SVG 檔案。',

  'app.profile.ariaLabel': '優化設定檔',
  'app.profile.eyebrow': '優化',
  'app.profile.title': '優化設定檔',
  'app.profile.description':
    '這些設定會改變單檔優化、批次優化與 ZIP 匯出時，優化後的 SVG 如何被重寫。',
  'app.profile.note':
    '設定檔變更會直接影響優化輸出，而不只是預覽。如果自訂組合開始破壞素材，請恢復預設值。',

  'app.workspace.currentBatch': '目前批次',
  'app.workspace.activeDescription':
    '檢視目前選取的素材，同時保留整個目錄的批次優化與匯出操作。',
  'app.workspace.noSelectionTitle': '尚未選取 SVG',
  'app.workspace.noSelectionDescription':
    '選一張卡片即可檢視來源、輸出與壓縮差異。',
  'app.workspace.shortcut.hideMarkup': '隱藏標記',
  'app.workspace.shortcut.openMarkup': '開啟標記',
  'app.workspace.shortcut.scanningDuplicates': '正在掃描重複...',
  'app.workspace.shortcut.showingItsGroup': '正在顯示其群組',
  'app.workspace.shortcut.showItsGroup': '顯示其群組',
  'app.workspace.shortcut.findItsDuplicates': '找出它的重複項',
  'app.workspace.shortcut.showingAllGroups': '正在顯示所有群組',
  'app.workspace.shortcut.browseDuplicateGroups': '瀏覽重複群組',
  'app.workspace.shortcut.rescanDuplicates': '重新掃描重複',
  'app.workspace.stat.batch': '批次',
  'app.workspace.stat.batchLoaded': (params) =>
    `已載入 ${getNumberParam(params, 'count')} 個素材`,
  'app.workspace.stat.optimized': '已優化',
  'app.workspace.stat.optimizedReady': (params) =>
    `${getNumberParam(params, 'count')} 個可用`,
  'app.workspace.stat.awaitingOptimization': '等待優化',
  'app.workspace.stat.quickPreview': '快速預覽',
  'app.workspace.stat.duplicateReview': '重複檢視',
  'app.workspace.filter.label': '篩選檔名',
  'app.workspace.filter.placeholder': '輸入檔名關鍵字',
  'app.workspace.filter.hint.idle': '留白即可保留整個批次在畫面中。',
  'app.workspace.filter.hint.matches': (params) =>
    `目前顯示 ${getNumberParam(params, 'count')} / ${getNumberParam(params, 'total')} 個符合「${getStringParam(params, 'query')}」的素材。`,
  'app.workspace.filter.emptyTitle': '沒有圖示符合目前的檔名篩選',
  'app.workspace.filter.emptyDescription':
    '請嘗試更短的關鍵字，或直接清除篩選，把目前批次重新帶回畫面中。',
  'app.workspace.signal.preview': (params) =>
    `預覽 ${getStringParam(params, 'tone')}`,
  'app.workspace.signal.showingDuplicatesOnly': '只顯示疑似重複',
  'app.workspace.signal.markupOpen': '標記已開啟',
  'app.workspace.signal.contrastPreview': '對比預覽',
  'app.workspace.signal.quickPreviewCount': (params) =>
    `快速預覽中有 ${getNumberParam(params, 'count')} 個`,
  'app.workspace.reviewEyebrow': '重複檢視',

  'app.duplicate.status.scanning': '掃描中',
  'app.duplicate.status.notScanned': '尚未掃描',
  'app.duplicate.status.noMatches': '沒有相符項',
  'app.duplicate.status.likelyCount': (params) =>
    `${getNumberParam(params, 'count')} 個疑似重複`,
  'app.duplicate.headline.building': '正在建立重複檢視集合',
  'app.duplicate.headline.scanOnDemand': '按需掃描',
  'app.duplicate.headline.noDuplicates': '未找到疑似重複',
  'app.duplicate.headline.focusedGroupAssets': (params) =>
    `焦點群組內有 ${getNumberParam(params, 'count')} 個素材`,
  'app.duplicate.headline.likelyInView': (params) =>
    `目前畫面中有 ${getNumberParam(params, 'count')} 個疑似重複`,
  'app.duplicate.headline.groupsReady': (params) =>
    `已有 ${getNumberParam(params, 'count')} 組待檢視`,
  'app.duplicate.hint.building': '系統正在比對目前批次中的渲染指紋。',
  'app.duplicate.hint.scanOnDemand':
    '只有在你想比較視覺相似素材時，再啟動重複檢視即可。',
  'app.duplicate.hint.noDuplicates':
    '上一次掃描沒有在這個批次中找到視覺上相符的重複群組。',
  'app.duplicate.hint.focusedGroup':
    '目前格線已縮小到焦點群組。若想重新展開比較範圍，請使用側欄中的「顯示所有相符項」。',
  'app.duplicate.hint.filtered': '目前格線只顯示共享視覺指紋的素材。',
  'app.duplicate.hint.default':
    '使用重複群組側欄逐組檢視、釘選候選項目，並在刪除前完成比對。',
  'app.duplicate.panelEyebrow': '疑似重複群組',
  'app.duplicate.panelSummary': (params) =>
    `${getNumberParam(params, 'groupCount')} 組 · ${getNumberParam(params, 'assetCount')} 個素材`,
  'app.duplicate.panelDescription':
    '先在側欄檢視候選項目，再把主格線留給你想深入比對的群組。',
  'app.duplicate.rescan': '重新掃描',
  'app.duplicate.showAllMatches': '顯示所有相符項',
  'app.duplicate.groupEyebrow': (params) =>
    `群組 ${getNumberParam(params, 'index')}`,
  'app.duplicate.candidates': (params) =>
    `${getNumberParam(params, 'count')} 個候選項`,
  'app.duplicate.optimizedVisualMatch': (params) =>
    `${getNumberParam(params, 'optimizedCount')} 個已優化 · 啟發式視覺相似`,
  'app.duplicate.showingThisGroup': '正在顯示此群組',
  'app.duplicate.showGroup': '顯示群組',
  'app.duplicate.pinGroup': '釘選群組',
  'app.duplicate.item.optimizedReady': '已優化可檢視',
  'app.duplicate.item.originalOnly': '只有原始版本',
  'app.duplicate.badge.pinned': '已釘選',
  'app.duplicate.badge.focused': '焦點',

  'app.empty.badge.noSvg': '找不到 SVG 檔案',
  'app.empty.badge.ready': '工作區已就緒',
  'app.empty.title.noSvg': '請改選其他含有 SVG 素材的目錄',
  'app.empty.title.ready': '開啟目錄以開始 SVG 檢視批次',
  'app.empty.description':
    'SVGOLOT 會把每個 SVG 載入成一個專注的檢視流程，讓你先檢查輸出、調整共用設定檔，再決定是否在批次準備好時匯出。',
  'app.empty.openDirectory': '開啟 SVG 目錄',
  'app.empty.step1.title': '載入目錄',
  'app.empty.step1.description':
    '匯入一個包含 SVG 素材的資料夾，讓工作區建立檢視批次，並自動選取第一個檔案。',
  'app.empty.step2.title': '檢視並調整',
  'app.empty.step2.description':
    '檢查預覽、讓標記固定在格線旁，並在變更整個批次前先調整共用的 SVGO 設定檔。',
  'app.empty.step3.title': '受控優化',
  'app.empty.step3.description':
    '你可以從單一卡片做單次修正，也可以優化整個目錄，最後只在輸出真正可交付時才匯出。',

  'app.quickPreview.ariaLabel': '快速預覽選取區',
  'app.quickPreview.eyebrow': '快速預覽',
  'app.quickPreview.pinnedIcons': (params) =>
    `已釘選 ${getNumberParam(params, 'count')} 個圖示`,
  'app.quickPreview.focused': (params) =>
    `焦點：${getStringParam(params, 'name')}`,
  'app.quickPreview.clear': '清除',
  'app.quickPreview.removeAriaLabel': '從快速預覽移除',

  'app.svgProbe.eyebrow': '貼上 SVG',
  'app.svgProbe.title': '比對外部 SVG',
  'app.svgProbe.description':
    '貼上原始 SVG 標記，先用目前的色調設定預覽，再檢查目前批次裡是否有啟發式視覺相似的圖示。',
  'app.svgProbe.fieldLabel': 'SVG 標記',
  'app.svgProbe.placeholder': '<svg viewBox="0 0 24 24">...</svg>',
  'app.svgProbe.fieldHint':
    '請貼上完整的 <svg>...</svg> 字串。預覽會沿用目前的色調與對比設定。',
  'app.svgProbe.optimizeButton': '優化貼上的 SVG',
  'app.svgProbe.optimizingButton': '正在優化貼上的 SVG...',
  'app.svgProbe.searchButton': '查找相似圖示',
  'app.svgProbe.searchingButton': '正在查找相似圖示...',
  'app.svgProbe.copyOptimizedButton': '複製優化後 SVG',
  'app.svgProbe.batchHint': '請先開啟 SVG 目錄，才能和目前批次比對。',
  'app.svgProbe.validation.idle':
    '貼上 SVG 標記後，這裡會顯示預覽，並可和目前批次做比對。',
  'app.svgProbe.validation.invalid':
    '目前內容不是有效的 SVG。請貼上完整的 <svg>...</svg> 區塊。',
  'app.svgProbe.validation.ready':
    'SVG 已就緒，可以先預覽，再執行啟發式相似比對。',
  'app.svgProbe.previewEyebrow': '即時預覽',
  'app.svgProbe.previewAlt': '貼上的 SVG 預覽',
  'app.svgProbe.previewReady': '已套用目前預覽色調',
  'app.svgProbe.previewUnavailable': '目前無法預覽',
  'app.svgProbe.previewInvalidHint': '修正 SVG 標記後，這裡就會顯示圖示預覽。',
  'app.svgProbe.previewEmpty': '尚未貼上 SVG',
  'app.svgProbe.previewEmptyHint': '貼上任意 SVG 字串後，這裡會顯示該圖示。',
  'app.svgProbe.optimizedEyebrow': '優化後預覽',
  'app.svgProbe.optimizedPreviewAlt': '優化後的貼上 SVG 預覽',
  'app.svgProbe.optimizedReady': '優化後 SVG 已就緒',
  'app.svgProbe.optimizedHint':
    '這個預覽使用目前的優化設定檔。若你想在其他地方重用結果，可以直接複製優化後的標記。',
  'app.svgProbe.optimizedDetailsEyebrow': '優化資訊',
  'app.svgProbe.optimizedDetailsTitle': '檢視優化結果',
  'app.svgProbe.optimizedDetailsDescription':
    '顯示目前設定檔下的優化前後大小、壓縮比，以及可直接檢查或複製的優化後標記。',
  'app.svgProbe.metric.originalSize': '優化前大小',
  'app.svgProbe.metric.optimizedSize': '優化後大小',
  'app.svgProbe.metric.compressionRatio': '壓縮比',
  'app.svgProbe.metric.compressionRatioHint': '占原始大小',
  'app.svgProbe.metric.sizeChange': '大小變化',
  'app.svgProbe.metric.saved': (params) =>
    `節省 ${getStringParam(params, 'size')}（${getStringParam(params, 'percent')}%）`,
  'app.svgProbe.metric.larger': (params) =>
    `增加 ${getStringParam(params, 'size')}（${getStringParam(params, 'percent')}%）`,
  'app.svgProbe.metric.sizeUnchanged': '大小沒有變化',
  'app.svgProbe.optimizedMarkupEyebrow': '優化後內容',
  'app.svgProbe.optimizedMarkupDescription':
    '目前優化設定檔產生的精確 SVG 輸出。',
  'app.svgProbe.optimizingPreview': '正在建立優化後預覽',
  'app.svgProbe.optimizingHint': '系統正在把目前的優化設定檔套用到貼上的 SVG。',
  'app.svgProbe.optimizedUnavailable': '目前無法顯示優化後預覽',
  'app.svgProbe.optimizedUnavailableHint':
    '請在調整貼上的 SVG 或目前設定檔後，再試著重新優化。',
  'app.svgProbe.optimizeFailed': '目前的優化設定檔無法成功優化這段貼上的 SVG。',
  'app.svgProbe.status.idle': '尚未查找',
  'app.svgProbe.status.searching': '正在和目前批次比對',
  'app.svgProbe.status.noMatches': '沒有找到相似圖示',
  'app.svgProbe.status.matches': (params) =>
    `找到 ${getNumberParam(params, 'count')} 個相似圖示`,
  'app.svgProbe.resultsEyebrow': '比對結果',
  'app.svgProbe.resultsDescription':
    '使用與重複檢視相同的視覺指紋啟發式。點選任一結果即可跳到該素材。',
  'app.svgProbe.noMatchesHint':
    '這表示目前批次中，沒有圖示和貼上的 SVG 落在同一個視覺指紋。',
  'app.svgProbe.loading': '正在載入 SVG 比對工具...',
  'app.svgProbe.toast.copiedOptimized': '已複製優化後的貼上 SVG。',

  'markup.ariaLabel': '標記檢視面板',
  'markup.selectedAsset': '選取的素材',
  'markup.optimizedReady': '優化輸出已準備好',
  'markup.awaitingOptimization': '等待優化',
  'markup.originalTitle': '原始',
  'markup.originalDescription': '目前從所選檔案載入的原始內容。',
  'markup.optimizedTitle': '優化後',
  'markup.optimizedDescription.ready': '依照目前設定檔產生、可直接匯出的標記。',
  'markup.optimizedDescription.awaiting': '執行優化以產生可匯出的結果。',
  'markup.copy': '複製',
  'markup.optimizedEmpty':
    '尚未產生優化後的 SVG。請從工具列或直接在卡片上執行優化。',
  'markup.empty.title': '標記檢視會顯示在這裡',
  'markup.empty.description':
    '選取一張 SVG 卡片後，就能在不離開工作區的情況下比較原始與優化後的輸出。',
  'markup.toast.original': (params) =>
    `已複製 ${getStringParam(params, 'name')} 的原始標記。`,
  'markup.toast.optimized': (params) =>
    `已複製 ${getStringParam(params, 'name')} 的優化後標記。`,

  'svgCard.quickPreview': '快速預覽',
  'svgCard.duplicateMatches': (params) =>
    `${getNumberParam(params, 'count')} 個相符項`,
  'svgCard.aria.swapPreviewTone': '切換到對比預覽色調',
  'svgCard.alt.swapPreviewTone': '切換預覽色調',
  'svgCard.aria.copyOptimized': '複製優化後 SVG',
  'svgCard.alt.copyOptimized': '複製 svg',
  'svgCard.aria.optimize': '優化 SVG',
  'svgCard.alt.optimize': '優化 svg',
  'svgCard.aria.downloadOptimized': '下載優化後 SVG',
  'svgCard.alt.downloadOptimized': '下載 svg',
  'svgCard.notOptimizedYet': '尚未優化',
  'svgCard.runOptimizeToCompare': '先執行優化再比較',
  'svgCard.delta.saved': (params) => `節省 ${getStringParam(params, 'size')}`,
  'svgCard.delta.larger': (params) => `增加 ${getStringParam(params, 'size')}`,
  'svgCard.state.optimizing': '優化中',
  'svgCard.state.optimized': '已優化',
  'svgCard.state.original': '原始',
  'svgCard.detail.original': '原始',
  'svgCard.detail.optimized': '已優化',
  'svgCard.detail.delta': '差異',
  'svgCard.toast.copiedOptimized': (params) =>
    `已複製 ${getStringParam(params, 'name')} 的優化後 SVG。`,

  'compress.overview.eyebrow': '設定檔預設',
  'compress.overview.reset': '回到平衡預設值',
  'compress.overview.ariaPresets': '壓縮預設',
  'compress.overview.customNote': '你正在使用以某個預設為基礎的自訂組合。',
  'compress.overview.multipass': '多次處理',
  'compress.overview.output': '輸出',
  'compress.overview.outputReadable': '可讀',
  'compress.overview.outputMinified': '最小化',
  'compress.overview.numbers': '數值',
  'compress.overview.transforms': 'Transform',
  'compress.overview.pluginsActive': (params) =>
    `已啟用 ${getNumberParam(params, 'activeCount')} / ${getNumberParam(params, 'totalCount')} 個外掛`,
  'compress.overview.guidance.1':
    '多次處理能更積極清理，但會增加一些處理時間。',
  'compress.overview.guidance.2':
    '可讀輸出較利於檢視與 diff，而最小化輸出則更節省體積。',
  'compress.overview.guidance.3':
    '較低精度可縮小檔案，較高精度則對複雜曲線與 transform 更安全。',
  'compress.core.eyebrow': '核心行為',
  'compress.core.description':
    '決定優化後輸出要偏向更小的檔案、更容易檢視，或在兩者之間取得平衡。',
  'compress.core.multipass.title': '多次處理',
  'compress.core.multipass.description':
    '當你想讓設定檔再多擠出一點空間時，可啟用額外清理輪次。',
  'compress.core.multipass.aria': '切換多次處理優化',
  'compress.core.pretty.title': '輸出排版',
  'compress.core.pretty.description':
    '讓優化後的標記保持可讀，方便審查、PR 與交接檢視。',
  'compress.core.pretty.aria': '切換可讀輸出',
  'compress.precision.eyebrow': '精度',
  'compress.precision.description':
    '較低的數值會更積極地縮小檔案。若圖示邊緣或 transform 開始失真，就把它們調高。',
  'compress.precision.number.copy': (params) =>
    `${getStringParam(params, 'hint')}，適合大多數座標清理`,
  'compress.precision.number.aria': '數值精度',
  'compress.precision.transform.copy': (params) =>
    `${getStringParam(params, 'hint')}，適合需要額外安全性的 transform`,
  'compress.precision.transform.aria': 'Transform 精度',
  'compress.precision.scale.smaller': '更小',
  'compress.precision.scale.safer': '更安全',
  'compress.advanced.eyebrow': '進階轉換',
  'compress.advanced.description':
    '大多數 SVG 批次都可以維持預設組合。只有在特定匯出模式需要特殊處理時，再調整個別轉換。',
  'compress.advanced.reviewOutput': '檢查輸出',
  'compress.preset.safe.label': '安全',
  'compress.preset.safe.short': '保留更多結構與幾何細節。',
  'compress.preset.safe.description':
    '提供更高精度、可讀輸出，以及較少的結構重寫，適合敏感圖稿、產品圖示與重視審查的批次。',
  'compress.preset.balanced.label': '平衡',
  'compress.preset.balanced.short': '多數圖示集建議從這裡開始。',
  'compress.preset.balanced.description':
    '這是預設工作台設定檔。它保留常見的清理收益，但不會在精度或高風險轉換上推得太激進。',
  'compress.preset.extreme.label': '極致壓縮',
  'compress.preset.extreme.short': '更積極縮小體積，但請務必檢查結果。',
  'compress.preset.extreme.description':
    '使用較低精度與更廣的外掛集合來取得更小輸出。當位元組比可編輯性更重要時再使用。',
  'compress.profile.title.safe': '目前啟用安全預設',
  'compress.profile.title.balanced': '目前啟用平衡預設',
  'compress.profile.title.extreme': '目前啟用極致壓縮預設',
  'compress.profile.title.customSmaller': '自訂設定，偏向更小檔案',
  'compress.profile.title.customSafer': '自訂設定，偏向更安全的幾何保留',
  'compress.profile.title.customDefault': '自訂設定，接近預設組合',
  'compress.profile.description.lowerPrecision':
    '較低精度是為了更小的檔案而調整，因此優化後請務必檢查細緻曲線與 transform。',
  'compress.profile.description.higherPrecision':
    '較高精度能保留更多數值細節，對複雜幾何更安全。',
  'compress.profile.description.middlePrecision':
    '目前精度接近產品圖示集常用的建議中間值。',
  'compress.profile.description.multipassOn':
    '已啟用多次處理，以取得更深入的清理效果。',
  'compress.profile.description.multipassOff': '單次處理更快，也稍微更可預測。',
  'compress.profile.description.outputReadable':
    '已啟用可讀輸出，較利於檢視與 diff，但可能增加一些位元組。',
  'compress.profile.description.outputMinified':
    '輸出維持最小化，以便獲得更小的匯出檔案。',
  'compress.precision.aggressive': '激進',
  'compress.precision.balanced': '平衡',
  'compress.precision.safe': '安全',
  'compress.precision.verySafe': '非常安全',
  'compress.category.metadata': '中繼資料',
  'compress.category.style': '樣式',
  'compress.category.geometry': '幾何',
  'compress.category.structure': '結構',
  'compress.category.order': '順序',
  'compress.category.cleanup': '清理',
  'compress.categoryDescription.metadata':
    '移除通常不會改變 SVG 顯示結果的編輯器或文件中繼資料。',
  'compress.categoryDescription.style':
    '把樣式或色彩資訊改寫成更精簡且更容易攜帶的形式。',
  'compress.categoryDescription.geometry':
    '把形狀、path 或 transform 改寫成更小但等價的形式。',
  'compress.categoryDescription.structure':
    '簡化群組與元素結構，讓標記更容易被優化。',
  'compress.categoryDescription.order':
    '正規化標記順序，讓多次輸出結果更一致。',
  'compress.categoryDescription.cleanup': '移除設計工具匯出常見的冗餘標記。',

  'compress.plugin.name.removeDoctype': '移除 doctype',
  'compress.plugin.name.removeXMLProcInst': '移除 XML 指令',
  'compress.plugin.name.removeComments': '移除註解',
  'compress.plugin.name.removeMetadata': '移除 <metadata>',
  'compress.plugin.name.removeXMLNS': '移除 xmlns',
  'compress.plugin.name.removeEditorsNSData': '移除編輯器資料',
  'compress.plugin.name.cleanupAttrs': '清理屬性空白',
  'compress.plugin.name.mergeStyles': '合併樣式',
  'compress.plugin.name.inlineStyles': '內嵌樣式',
  'compress.plugin.name.minifyStyles': '最小化樣式',
  'compress.plugin.name.convertStyleToAttrs': '樣式轉屬性',
  'compress.plugin.name.cleanupIds': '清理 ID',
  'compress.plugin.name.removeRasterImages': '移除點陣圖片',
  'compress.plugin.name.removeUselessDefs': '移除未使用 defs',
  'compress.plugin.name.cleanupNumericValues': '重寫數值',
  'compress.plugin.name.cleanupListOfValues': '重寫數值列表',
  'compress.plugin.name.convertColors': '最小化色彩值',
  'compress.plugin.name.removeUnknownsAndDefaults': '移除未知與預設值',
  'compress.plugin.name.removeNonInheritableGroupAttrs': '移除多餘群組屬性',
  'compress.plugin.name.removeUselessStrokeAndFill': '移除無效描邊與填色',
  'compress.plugin.name.removeViewBox': '移除 viewBox',
  'compress.plugin.name.cleanupEnableBackground': '清理 enable-background',
  'compress.plugin.name.removeHiddenElems': '移除隱藏元素',
  'compress.plugin.name.removeEmptyText': '移除空文字',
  'compress.plugin.name.convertShapeToPath': '形狀轉為較小 path',
  'compress.plugin.name.moveElemsAttrsToGroup': '將屬性移到父群組',
  'compress.plugin.name.moveGroupAttrsToElems': '將群組屬性移回元素',
  'compress.plugin.name.collapseGroups': '摺疊無用群組',
  'compress.plugin.name.convertPathData': '重寫 path 資料',
  'compress.plugin.name.convertEllipseToCircle': '將非離心 ellipse 轉成 circle',
  'compress.plugin.name.convertTransform': '重寫 transform',
  'compress.plugin.name.removeEmptyAttrs': '移除空屬性',
  'compress.plugin.name.removeEmptyContainers': '移除空容器',
  'compress.plugin.name.mergePaths': '合併 path',
  'compress.plugin.name.removeUnusedNS': '移除未使用 namespace',
  'compress.plugin.name.reusePaths': '以連結重用重複元素',
  'compress.plugin.name.sortAttrs': '排序屬性',
  'compress.plugin.name.sortDefsChildren': '排序 <defs> 子項',
  'compress.plugin.name.removeTitle': '移除 <title>',
  'compress.plugin.name.removeDesc': '移除 <desc>',
  'compress.plugin.name.removeDimensions': '以 viewBox 取代寬高',
  'compress.plugin.name.removeStyleElement': '移除 style 元素',
  'compress.plugin.name.removeScriptElement': '移除 script 元素',
  'compress.plugin.name.removeOffCanvasPaths': '移除畫布外 path',

  'compress.pluginDescription.cleanupIds':
    '重新命名或移除未使用的 ID。若 CSS、遮罩或腳本會依賴特定 ID，請務必仔細檢查。',
  'compress.pluginDescription.inlineStyles':
    '把樣式規則移到元素上，讓 SVG 在沒有外部 CSS 的情況下也更容易嵌入。',
  'compress.pluginDescription.convertStyleToAttrs':
    '在視覺結果不變時，把 style 宣告改寫成 SVG 屬性。',
  'compress.pluginDescription.removeXMLNS':
    '移除 xmlns 屬性。只有在目標環境會補回它，或根本不需要時才適合開啟。',
  'compress.pluginDescription.removeRasterImages':
    '刪除內嵌的點陣圖片。只有在確定不應隨檔案出貨任何點陣內容時才開啟。',
  'compress.pluginDescription.removeUnknownsAndDefaults':
    '移除未知或預設屬性。對清理很有幫助，但某些設計匯出會依賴這些值。',
  'compress.pluginDescription.removeViewBox':
    '移除 viewBox。這可能破壞響應式縮放，因此除非 width 與 height 必須成為唯一依據，否則建議關閉。',
  'compress.pluginDescription.removeTitle':
    '移除 title 文字。如果 SVG 依賴內建的可及性標籤，請保持關閉。',
  'compress.pluginDescription.removeDesc':
    '移除 desc 文字，而這些內容有時仍有助於文件與可及性工具。',
  'compress.pluginDescription.removeDimensions':
    '移除 width 與 height，改由 viewBox 控制縮放。適合響應式圖示系統。',
  'compress.pluginDescription.removeStyleElement':
    '刪除 <style> 區塊。只有在樣式已內嵌或已不需要時才建議開啟。',
  'compress.pluginDescription.removeScriptElement':
    '刪除內嵌腳本，讓匯出的 SVG 更安全。',
  'compress.pluginDescription.removeOffCanvasPaths':
    '移除畫布外的圖形。很適合清理，但若溢出內容本來就是刻意保留，會有風險。',
  'compress.pluginDescription.reusePaths':
    '以參照取代重複圖形。輸出會更小，但手動編輯時會稍微麻煩。',

  'toast.notifications': '通知',
  'toast.dismiss': '關閉通知',
} satisfies Record<TranslationKey, TranslationEntry>;
