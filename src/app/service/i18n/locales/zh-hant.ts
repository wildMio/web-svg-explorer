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

  'app.status.scanningDirectory': '正在讀取 SVG 目錄',
  'app.status.restoringDirectory': '正在重新連接上次的目錄',
  'app.status.optimizingAssets': '正在優化目前批次',
  'app.status.preparingZip': '正在準備 ZIP 匯出',
  'app.status.batchReady': '批次可開始檢查',
  'app.status.noSvgFound': '這個資料夾沒有 SVG 檔案',
  'app.status.awaitingDirectory': '請先開啟 SVG 目錄',

  'app.header.eyebrow': 'SVG 資產操作',
  'app.header.description.compact':
    '精簡檢視會把次要資訊收進顯示設定，讓你先專注在素材格線。',
  'app.header.description.withBatch':
    '檢查目前批次、查看選取中的素材，確認沒問題後再匯出。',
  'app.header.description.empty':
    '在同一個工作區載入 SVG、檢查結果，最後匯出整批檔案。',
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
  'app.toolbar.showingLikelyDuplicates': '只看疑似重複',
  'app.toolbar.likelyDuplicates': '查看疑似重複',
  'app.toolbar.showSvgProbe': '顯示 SVG 比對',
  'app.toolbar.hideSvgProbe': '隱藏 SVG 比對',
  'app.toolbar.reviewDisplay': '顯示設定',
  'app.toolbar.optimizationProfile': '優化設定',

  'app.previewTone.originalArtwork': '原始圖稿',
  'app.previewTone.contrastTone': (params) =>
    `${getStringParam(params, 'tone')} 對比色調`,

  'app.display.ariaLabel': '顯示與參考',
  'app.display.eyebrow': '檢視',
  'app.display.title': '顯示與參考',
  'app.display.description':
    '這些設定只影響目前畫面的看法，不會改動優化結果或匯出的檔案。',
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
    '可輸入命名色、十六進位色值或 currentColor。最適合 currentColor 或單色圖示。',
  'app.display.swapTitle': '切換為對比色調',
  'app.display.swapDescription':
    '快速檢查同一個圖示在淺底和深底上的可讀性，不會改動匯出結果。',
  'app.display.keepMarkupTitle': '讓標記固定在格線旁',
  'app.display.keepMarkupDescription':
    '讓原始與優化後的標記持續顯示在格線旁，方便一邊看圖一邊比對。',
  'app.display.guidanceEyebrow': '使用方式',
  'app.display.guidance.1':
    '想確認圖示在不同明暗背景上的可讀性時，先調整預覽色調。',
  'app.display.guidance.2':
    '勾選卡片上的核取方塊，可把圖示釘選到底部快速預覽列，方便並排比較。',
  'app.display.guidance.3':
    '大量檢查時可切換成精簡模式，把注意力留給格線與目前選取項目。',
  'app.display.note':
    '這些顯示設定只影響這次操作時的預覽，不會修改 SVG 檔案內容。',

  'app.profile.ariaLabel': '優化設定檔',
  'app.profile.eyebrow': '優化',
  'app.profile.title': '優化設定檔',
  'app.profile.description':
    '這些設定會直接影響單檔優化、整批優化與 ZIP 匯出的結果。',
  'app.profile.note':
    '這裡改的是實際輸出，不只是預覽。若自訂後讓圖示出問題，請回到預設值。',

  'app.workspace.currentBatch': '目前批次',
  'app.workspace.activeDescription':
    '檢視目前選取的素材，同時保留整個目錄的批次優化與匯出操作。',
  'app.workspace.noSelectionTitle': '尚未選取 SVG',
  'app.workspace.noSelectionDescription':
    '選一張卡片即可檢視來源、輸出與壓縮差異。',
  'app.workspace.shortcut.hideMarkup': '隱藏標記',
  'app.workspace.shortcut.openMarkup': '顯示標記',
  'app.workspace.shortcut.scanningDuplicates': '正在找相似圖示...',
  'app.workspace.shortcut.showingItsGroup': '只看這一組',
  'app.workspace.shortcut.showItsGroup': '查看這一組',
  'app.workspace.shortcut.findItsDuplicates': '找相似圖示',
  'app.workspace.shortcut.showingAllGroups': '目前顯示所有群組',
  'app.workspace.shortcut.browseDuplicateGroups': '查看所有群組',
  'app.workspace.shortcut.rescanDuplicates': '重新掃描',
  'app.workspace.stat.batch': '批次',
  'app.workspace.stat.batchLoaded': (params) =>
    `已載入 ${getNumberParam(params, 'count')} 個素材`,
  'app.workspace.stat.optimized': '已優化',
  'app.workspace.stat.optimizedReady': (params) =>
    `${getNumberParam(params, 'count')} 個可用`,
  'app.workspace.stat.awaitingOptimization': '尚未優化',
  'app.workspace.stat.quickPreview': '快速預覽',
  'app.workspace.stat.duplicateReview': '重複檢視',
  'app.workspace.filter.label': '篩選檔名',
  'app.workspace.filter.placeholder': '輸入檔名關鍵字',
  'app.workspace.filter.hint.idle': '留白即可保留整個批次在畫面中。',
  'app.workspace.filter.hint.matches': (params) =>
    `目前顯示 ${getNumberParam(params, 'count')} / ${getNumberParam(params, 'total')} 個符合「${getStringParam(params, 'query')}」的素材。`,
  'app.workspace.filter.emptyTitle': '沒有圖示符合目前的檔名篩選',
  'app.workspace.filter.emptyDescription': '試試更短的關鍵字，或直接清除篩選。',
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
  'app.duplicate.status.noMatches': '沒有疑似重複',
  'app.duplicate.status.likelyCount': (params) =>
    `${getNumberParam(params, 'count')} 個疑似項目`,
  'app.duplicate.headline.building': '正在建立重複檢視集合',
  'app.duplicate.headline.scanOnDemand': '按需掃描',
  'app.duplicate.headline.noDuplicates': '未找到疑似重複',
  'app.duplicate.headline.focusedGroupAssets': (params) =>
    `焦點群組內有 ${getNumberParam(params, 'count')} 個素材`,
  'app.duplicate.headline.likelyInView': (params) =>
    `目前畫面中有 ${getNumberParam(params, 'count')} 個疑似重複`,
  'app.duplicate.headline.groupsReady': (params) =>
    `已有 ${getNumberParam(params, 'count')} 組待檢視`,
  'app.duplicate.hint.building': '正在比對圖示外觀，可能需要一點時間。',
  'app.duplicate.hint.scanOnDemand': '想找外觀相近的圖示時，再執行這個掃描。',
  'app.duplicate.hint.noDuplicates': '上次掃描沒有找到外觀明顯相近的群組。',
  'app.duplicate.hint.focusedGroup':
    '目前只顯示這一組。要看全部結果，請按「顯示所有相符項」。',
  'app.duplicate.hint.filtered': '目前格線只顯示外觀比對後落在同一組的素材。',
  'app.duplicate.hint.default': '先逐組查看，再把候選項釘選到快速預覽比較。',
  'app.duplicate.panelEyebrow': '疑似重複群組',
  'app.duplicate.panelSummary': (params) =>
    `${getNumberParam(params, 'groupCount')} 組 · ${getNumberParam(params, 'assetCount')} 個素材`,
  'app.duplicate.panelDescription':
    '先在側欄挑出要看的群組，再用主格線做細看與比對。',
  'app.duplicate.rescan': '重新掃描',
  'app.duplicate.showAllMatches': '顯示所有相符項',
  'app.duplicate.groupEyebrow': (params) =>
    `群組 ${getNumberParam(params, 'index')}`,
  'app.duplicate.candidates': (params) =>
    `${getNumberParam(params, 'count')} 個候選項`,
  'app.duplicate.optimizedVisualMatch': (params) =>
    `${getNumberParam(params, 'optimizedCount')} 個已優化 · 外觀可能相近`,
  'app.duplicate.showingThisGroup': '目前查看中',
  'app.duplicate.showGroup': '查看這一組',
  'app.duplicate.pinGroup': '釘選整組',
  'app.duplicate.item.optimizedReady': '已優化可檢視',
  'app.duplicate.item.originalOnly': '只有原始版本',
  'app.duplicate.badge.pinned': '已釘選',
  'app.duplicate.badge.focused': '焦點',

  'app.empty.badge.noSvg': '找不到 SVG 檔案',
  'app.empty.badge.ready': '工作區已就緒',
  'app.empty.title.noSvg': '請改選其他含有 SVG 素材的目錄',
  'app.empty.title.ready': '開啟目錄以開始 SVG 檢視批次',
  'app.empty.description':
    '開啟 SVG 資料夾後，你可以預覽、比對結果，最後匯出整批檔案。',
  'app.empty.openDirectory': '開啟 SVG 目錄',
  'app.empty.reconnectLastDirectory': (params) =>
    `重新連接 ${getStringParam(params, 'name')}`,
  'app.empty.reconnectLastDirectoryHint': (params) =>
    `瀏覽器還記得 ${getStringParam(params, 'name')}。如果權限還在，可以直接重新連接。`,
  'app.empty.step1.title': '載入目錄',
  'app.empty.step1.description':
    '選擇包含 SVG 的資料夾，工作區會建立批次並選取第一個檔案。',
  'app.empty.step2.title': '檢視並調整',
  'app.empty.step2.description': '先看預覽與標記，需要時再調整共用優化設定。',
  'app.empty.step3.title': '確認後再優化',
  'app.empty.step3.description':
    '可先優化單一圖示，或一次處理整個資料夾，確認後再匯出。',

  'app.quickPreview.ariaLabel': '快速預覽選取區',
  'app.quickPreview.eyebrow': '快速預覽',
  'app.quickPreview.pinnedIcons': (params) =>
    `已釘選 ${getNumberParam(params, 'count')} 個圖示`,
  'app.quickPreview.focused': (params) =>
    `焦點：${getStringParam(params, 'name')}`,
  'app.quickPreview.clear': '清空釘選',
  'app.quickPreview.removeAriaLabel': '從快速預覽移除',

  'app.svgProbe.eyebrow': '貼上 SVG',
  'app.svgProbe.title': '比對外部 SVG',
  'app.svgProbe.description':
    '貼上 SVG 後，可先預覽，再查找批次中外觀接近的圖示。',
  'app.svgProbe.fieldLabel': 'SVG 標記',
  'app.svgProbe.placeholder': '<svg viewBox="0 0 24 24">...</svg>',
  'app.svgProbe.fieldHint':
    '請貼上完整的 <svg>...</svg> 內容。預覽會沿用目前顯示設定。',
  'app.svgProbe.optimizeButton': '優化這段 SVG',
  'app.svgProbe.optimizingButton': '正在優化這段 SVG...',
  'app.svgProbe.searchButton': '找相似圖示',
  'app.svgProbe.searchingButton': '正在找相似圖示...',
  'app.svgProbe.copyOptimizedButton': '複製優化結果',
  'app.svgProbe.clearButton': '清除 SVG',
  'app.svgProbe.batchHint': '請先開啟 SVG 目錄，才能和目前批次比對。',
  'app.svgProbe.validation.idle': '貼上 SVG 後，這裡會先顯示預覽。',
  'app.svgProbe.validation.invalid':
    '這段內容不是有效的 SVG。請確認有貼上完整的 <svg>...</svg>。',
  'app.svgProbe.validation.ready': 'SVG 已可預覽，接著可優化，或找相似圖示。',
  'app.svgProbe.previewEyebrow': '即時預覽',
  'app.svgProbe.previewAlt': '貼上的 SVG 預覽',
  'app.svgProbe.previewReady': '已套用目前預覽色調',
  'app.svgProbe.previewUnavailable': '目前無法預覽',
  'app.svgProbe.previewInvalidHint': '修正 SVG 後，這裡就會顯示預覽。',
  'app.svgProbe.previewEmpty': '尚未貼上 SVG',
  'app.svgProbe.previewEmptyHint': '貼上 SVG 後，這裡會顯示圖示。',
  'app.svgProbe.optimizedEyebrow': '優化後預覽',
  'app.svgProbe.optimizedPreviewAlt': '優化後的貼上 SVG 預覽',
  'app.svgProbe.optimizedReady': '優化後 SVG 已就緒',
  'app.svgProbe.optimizedHint': '這個結果使用目前的優化設定，可直接複製帶走。',
  'app.svgProbe.optimizedDetailsEyebrow': '優化資訊',
  'app.svgProbe.optimizedDetailsTitle': '檢視優化結果',
  'app.svgProbe.optimizedDetailsDescription':
    '顯示優化前後大小、壓縮比例與可複製的結果。',
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
  'app.svgProbe.optimizedMarkupDescription': '目前優化設定產生的 SVG 內容。',
  'app.svgProbe.optimizingPreview': '正在建立優化後預覽',
  'app.svgProbe.optimizingHint': '正在把目前的優化設定套用到你貼上的 SVG。',
  'app.svgProbe.optimizedUnavailable': '目前無法顯示優化後預覽',
  'app.svgProbe.optimizedUnavailableHint': '請調整 SVG 或優化設定後再試一次。',
  'app.svgProbe.optimizeFailed':
    '目前的優化設定無法處理這段 SVG。請先檢查內容，或調整優化設定後再試一次。',
  'app.svgProbe.status.idle': '尚未比對',
  'app.svgProbe.status.searching': '正在比對目前批次',
  'app.svgProbe.status.noMatches': '沒有找到相近圖示',
  'app.svgProbe.status.matches': (params) =>
    `找到 ${getNumberParam(params, 'count')} 個相近圖示`,
  'app.svgProbe.resultsEyebrow': '比對結果',
  'app.svgProbe.resultsDescription':
    '這裡列出外觀接近的候選項目。點一下即可跳到該素材。',
  'app.svgProbe.noMatchesHint': '目前批次裡沒有外觀接近這段 SVG 的圖示。',
  'app.svgProbe.loading': '正在載入 SVG 比對工具...',
  'app.svgProbe.toast.copiedOptimized': '已複製貼上 SVG 的優化結果。',

  'markup.ariaLabel': '標記檢視面板',
  'markup.selectedAsset': '選取的素材',
  'markup.optimizedReady': '優化結果已就緒',
  'markup.awaitingOptimization': '尚未優化',
  'markup.originalTitle': '原始',
  'markup.originalDescription': '目前從所選檔案載入的原始內容。',
  'markup.optimizedTitle': '優化後',
  'markup.optimizedDescription.ready': '依照目前設定檔產生、可直接匯出的標記。',
  'markup.optimizedDescription.awaiting': '執行優化以產生可匯出的結果。',
  'markup.copy': '複製',
  'markup.optimizedEmpty': '尚未產生優化後 SVG。請從工具列或卡片上執行優化。',
  'markup.empty.title': '標記檢視會顯示在這裡',
  'markup.empty.description':
    '選取一張 SVG 卡片後，就能在這裡比較原始與優化後的輸出。',
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
  'svgCard.alt.copyOptimized': '複製優化後 SVG',
  'svgCard.aria.optimize': '優化 SVG',
  'svgCard.alt.optimize': '優化 SVG',
  'svgCard.aria.downloadOptimized': '下載優化後 SVG',
  'svgCard.alt.downloadOptimized': '下載優化後 SVG',
  'svgCard.notOptimizedYet': '尚未優化',
  'svgCard.runOptimizeToCompare': '先執行優化再比較',
  'svgCard.delta.saved': (params) => `節省 ${getStringParam(params, 'size')}`,
  'svgCard.delta.larger': (params) => `增加 ${getStringParam(params, 'size')}`,
  'svgCard.state.optimizing': '優化中',
  'svgCard.state.optimized': '已優化',
  'svgCard.state.original': '未優化',
  'svgCard.detail.original': '原始',
  'svgCard.detail.optimized': '已優化',
  'svgCard.detail.delta': '差異',
  'svgCard.toast.copiedOptimized': (params) =>
    `已複製 ${getStringParam(params, 'name')} 的優化後 SVG。`,

  'compress.overview.eyebrow': '設定檔預設',
  'compress.overview.reset': '回到平衡預設值',
  'compress.overview.ariaPresets': '壓縮預設',
  'compress.overview.customNote': '你目前使用的是自行調整過的版本。',
  'compress.overview.multipass': '多次處理',
  'compress.overview.output': '輸出',
  'compress.overview.outputReadable': '可讀',
  'compress.overview.outputMinified': '最小化',
  'compress.overview.numbers': '數值',
  'compress.overview.transforms': 'Transform',
  'compress.overview.pluginsActive': (params) =>
    `已啟用 ${getNumberParam(params, 'activeCount')} / ${getNumberParam(params, 'totalCount')} 個外掛`,
  'compress.overview.guidance.1':
    '多次處理會多跑幾輪清理，通常能再縮小一些，但會慢一點。',
  'compress.overview.guidance.2':
    '可讀輸出方便檢查與比對，最小化輸出則更省體積。',
  'compress.overview.guidance.3':
    '精度越低越省空間，精度越高越不容易讓曲線或 transform 走樣。',
  'compress.core.eyebrow': '核心行為',
  'compress.core.description':
    '這裡決定優化結果要偏向更小、更好讀，或兩者折衷。',
  'compress.core.multipass.title': '多次處理',
  'compress.core.multipass.description':
    '想再多擠一點體積時再開啟，會多花一些處理時間。',
  'compress.core.multipass.aria': '切換多次處理優化',
  'compress.core.pretty.title': '可讀輸出',
  'compress.core.pretty.description':
    '讓優化後的 SVG 比較好讀，方便檢查、程式碼審查與交接。',
  'compress.core.pretty.aria': '切換可讀輸出',
  'compress.precision.eyebrow': '精度',
  'compress.precision.description':
    '數值越低，壓縮越積極。如果圖示邊緣或 transform 看起來不對，就把數值調高。',
  'compress.precision.number.copy': (params) =>
    `${getStringParam(params, 'hint')}，適合一般座標清理`,
  'compress.precision.number.aria': '數值精度',
  'compress.precision.transform.copy': (params) =>
    `${getStringParam(params, 'hint')}，適合需要保守一點的 transform`,
  'compress.precision.transform.aria': 'Transform 精度',
  'compress.precision.scale.smaller': '更小',
  'compress.precision.scale.safer': '更安全',
  'compress.advanced.eyebrow': '進階轉換',
  'compress.advanced.description':
    '大多數情況維持預設即可，只有遇到特定輸出問題時再調整個別轉換。',
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
