import { Language } from '../types';
export type { Language };

export interface TranslationDictionary {
  // Navigation & Header
  appTitle: string;
  appSubtitle: string;
  versionBadge: string;
  scientificGuide: string;
  switchLangText: string;

  // Overview Card
  overviewTitle: string;
  independentVarsLabel: string;
  independentVarsDesc: string;
  dependentVarLabel: string;
  dependentVarDesc: string;
  loggedTrials: string;
  trialsRecorded: string;

  // Controls Panel
  controlsHeader: string;
  theoryBtn: string;
  tempLabel: string;
  roomTemp: string;
  warmTemp: string;
  highTemp: string;
  waterLabel: string;
  waterPresent: string;
  waterAbsent: string;
  waterPresentDesc: string;
  waterAbsentDesc: string;
  phLabel: string;
  phNotApplicable: string;
  phAcidic: string;
  phNeutral: string;
  phAlkaline: string;
  phAcidicDesc: string;
  phNeutralDesc: string;
  phAlkalineDesc: string;
  oxygenLabel: string;
  oxygenPresent: string;
  oxygenAbsent: string;
  oxygenPresentDesc: string;
  oxygenAbsentDesc: string;
  runTrialBtn: string;
  simulatingBtn: string;
  quickSetupsLabel: string;
  presetBaseline: string;
  presetDryAir: string;
  presetAcidRain: string;
  presetBoiledWater: string;
  presetAccelerated: string;

  // Apparatus Visualizer
  reactionChamberTitle: string;
  simulatingDayOf: (day: number) => string;
  observationPeriod: string;
  beakerTitle: string;
  thermometerProbe: string;
  spargerTube: string;
  phSensor: string;
  airBubbling: string;
  boiledSolution: string;
  oxygenPresentBadge: string;
  oxygenFreeBadge: string;
  waterPresentBadge: string;
  waterAbsentBadge: string;
  calciumChlorideDryingAgent: string;
  submergedNail: string;
  nailDay: (day: number) => string;
  cleanNail: string;
  rustFlakes: string;
  liquidAcidic: string;
  liquidNeutral: string;
  liquidAlkaline: string;
  realtimeMetrics: string;
  rustRateLabel: string;
  rustMassLabel: string;
  severityLabel: string;
  surfaceCoverageLabel: string;
  initialRustLabel: string;
  hoursUnit: string;
  mgPerDayUnit: string;
  mgUnit: string;
  observationLabel: string;

  // Severity Terms
  severityNone: string;
  severityMinimal: string;
  severityModerate: string;
  severityHeavy: string;
  severitySevere: string;

  // Results Table
  tableHeader: string;
  trialCountLabel: (count: number) => string;
  tableSubtitle: string;
  exportCsv: string;
  clearTable: string;
  selectAll: string;
  clearSelection: string;
  evidenceLogged: string;
  colEvidence: string;
  colTrial: string;
  colTime: string;
  colTemp: string;
  colWater: string;
  colPh: string;
  colOxygen: string;
  colRate: string;
  colMass: string;
  colInitial: string;
  colState: string;
  valPresent: string;
  valAbsent: string;
  valWaterPresent: string;
  valWaterAbsent: string;
  selectedBadge: string;
  selectAsEvidence: string;
  noTrialsYet: string;
  confirmReset: string;

  // Inquiry Section
  inquiryHeader: string;
  inquirySubtitle: string;
  lockedNotice: (minTrials: number) => string;
  lockedRemainingNotice: (remaining: number) => string;
  teacherUnlockBtn: string;
  selectedEvidenceTitle: string;
  noEvidenceSelectedWarning: (min: number) => string;
  evidenceValidTag: string;
  evidenceIncompleteTag: string;
  questionOf: (current: number, total: number) => string;
  submitClaimBtn: string;
  submittedBtn: string;
  requiredEvidenceRule: string;

  // Theory Modal
  theoryModalTitle: string;
  theoryModalSubtitle: string;
  tabMechanism: string;
  tabFactors: string;
  closeGuide: string;
  sourceAttribution: string;

  // Footer
  footerTitle: string;
  footerEquation: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appTitle: 'Rusting Rate Investigation Lab',
    appSubtitle: 'Electrochemical redox modeling • Independent variables: Temp, Water, pH, O₂',
    versionBadge: 'v2.4 SIMULATION',
    scientificGuide: 'Scientific Guide',
    switchLangText: '繁體中文',

    overviewTitle: 'How do environmental variables influence the rate of iron rusting?',
    independentVarsLabel: 'Independent Variables:',
    independentVarsDesc: 'Temperature (25°C - 45°C), Water (Present / Not Present), Solution pH (3, 7, 12), Presence of Oxygen (Present / Not Present).',
    dependentVarLabel: 'Designed Dependent Variable:',
    dependentVarDesc: 'Rate of Rusting (mg/day) & Total Rust Mass Formed (mg).',
    loggedTrials: 'Logged Trials',
    trialsRecorded: 'Recorded',

    controlsHeader: 'Independent Variables Setup',
    theoryBtn: 'Theory & Chemistry',
    tempLabel: '1. Temperature (°C)',
    roomTemp: 'Room Temp',
    warmTemp: 'Warm',
    highTemp: 'High Temp',
    waterLabel: '2. Presence of Water (H₂O)',
    waterPresent: 'Water Present (Aqueous)',
    waterAbsent: 'No Water (Dry Air / CaCl₂)',
    waterPresentDesc: 'Water provides the necessary reaction medium and reactant for electrochemical hydration of iron.',
    waterAbsentDesc: 'Desiccated with anhydrous calcium chloride (CaCl₂). In the absence of water, iron cannot rust.',
    phLabel: '3. Solution pH (Aqueous)',
    phNotApplicable: 'N/A (Dry Environment - No Aqueous Ions)',
    phAcidic: 'Strongly Acidic (pH 3)',
    phNeutral: 'Neutral Water (pH 7)',
    phAlkaline: 'Alkaline (pH 12)',
    phAcidicDesc: 'High H⁺ ion concentration accelerates iron oxidation (Fe + 2H⁺ ➔ Fe²⁺ + H₂). Prevents oxide passivation.',
    phNeutralDesc: 'Standard aqueous baseline. Normal atmospheric corrosion rate with dissolved oxygen.',
    phAlkalineDesc: 'Passivating alkaline environment. Promotes insoluble Fe(OH)₂ layer, strongly suppressing rust.',
    oxygenLabel: '4. Presence of Oxygen (O₂)',
    oxygenPresent: 'Aerated (O₂ Present)',
    oxygenAbsent: 'Boiled & Deoxygenated (No O₂)',
    oxygenPresentDesc: 'Oxygen is available as the essential cathodic electron acceptor (O₂ + 2H₂O + 4e⁻ ➔ 4OH⁻).',
    oxygenAbsentDesc: 'Water boiled to expel dissolved gases and sealed with an oil barrier. Lack of electron acceptor prevents rusting.',
    runTrialBtn: 'Run 7-Day Trial',
    simulatingBtn: 'Simulating Experiment...',
    quickSetupsLabel: 'Quick Setups:',
    presetBaseline: 'Baseline (25°C, H₂O, O₂)',
    presetDryAir: 'Dry Air (No Water)',
    presetAcidRain: 'Acid Rain (pH 3)',
    presetBoiledWater: 'Boiled Water (No O₂)',
    presetAccelerated: 'Accelerated (45°C, pH 3)',

    reactionChamberTitle: 'Laboratory Reaction Chamber',
    simulatingDayOf: (day: number) => `Simulating: Day ${day} of 7`,
    observationPeriod: '7-Day Observation Period',
    beakerTitle: 'Closed Glass Beaker Setup',
    thermometerProbe: 'Digital Thermometer Probe',
    spargerTube: 'Aeration Sparger Tube',
    phSensor: 'Digital pH Sensor',
    airBubbling: 'Continuous Air / O₂ Bubbling',
    boiledSolution: 'Boiled Deoxygenated Solution (Oil Barrier)',
    oxygenPresentBadge: 'Dissolved Oxygen (O₂) Present',
    oxygenFreeBadge: 'Oxygen-Free (De-aerated)',
    waterPresentBadge: 'Water (H₂O) Present',
    waterAbsentBadge: 'Dry Chamber (Anhydrous CaCl₂)',
    calciumChlorideDryingAgent: 'Anhydrous CaCl₂ Desiccant',
    submergedNail: 'Submerged Iron Nail',
    nailDay: (day: number) => `Iron Nail (Day ${day})`,
    cleanNail: 'Clean Fe Metal',
    rustFlakes: 'Rust Flakes Deposition',
    liquidAcidic: 'Dilute Acidic Solution (pH 3.0)',
    liquidNeutral: 'Neutral Solution (pH 7.0)',
    liquidAlkaline: 'Alkaline Solution (pH 12.0)',
    realtimeMetrics: 'Real-time Metrics',
    rustRateLabel: 'Rusting Rate',
    rustMassLabel: 'Total Rust Mass',
    severityLabel: 'Estimated Severity',
    surfaceCoverageLabel: 'Surface Coverage',
    initialRustLabel: 'Time to Visible Rust',
    hoursUnit: 'hours',
    mgPerDayUnit: 'mg / day',
    mgUnit: 'mg',
    observationLabel: 'Observation',

    severityNone: 'None',
    severityMinimal: 'Minimal',
    severityModerate: 'Moderate',
    severityHeavy: 'Heavy',
    severitySevere: 'Severe',

    tableHeader: 'Experimental Results Log',
    trialCountLabel: (count: number) => `${count} ${count === 1 ? 'Trial' : 'Trials'} Recorded`,
    tableSubtitle: 'Check rows to select them as Supporting Evidence for the scientific inquiry question below.',
    exportCsv: 'Export CSV',
    clearTable: 'Clear Table',
    selectAll: 'Select All',
    clearSelection: 'Clear Selection',
    evidenceLogged: 'Evidence Selected',
    colEvidence: 'Evidence',
    colTrial: 'Trial #',
    colTime: 'Timestamp',
    colTemp: 'Temperature',
    colWater: 'Water (H₂O)',
    colPh: 'Solution pH',
    colOxygen: 'Oxygen (O₂)',
    colRate: 'Rust Rate',
    colMass: 'Total Rust (7d)',
    colInitial: 'Initial Rust',
    colState: 'Observed State',
    valPresent: 'Present',
    valAbsent: 'Not Present',
    valWaterPresent: 'Present',
    valWaterAbsent: 'Not Present',
    selectedBadge: 'Selected',
    selectAsEvidence: 'Select as Evidence',
    noTrialsYet: 'No experimental trials logged yet. Configure independent variables above and click "Run 7-Day Trial" to begin collecting scientific data.',
    confirmReset: 'Are you sure you want to reset all logged experimental trials?',

    inquiryHeader: 'Scientific Inquiry & Evidence-Based Claims',
    inquirySubtitle: 'Connect experimental empirical data to chemical theories. Select logged trials from the table as supporting evidence to validate your scientific claims.',
    lockedNotice: (minTrials: number) => `Requires at least ${minTrials} logged trials to test claims`,
    lockedRemainingNotice: (remaining: number) => `Complete ${remaining} more experiment(s) with different variables to unlock the scientific inquiry analysis module.`,
    teacherUnlockBtn: 'Unlock Questions Now (Teacher Mode)',
    selectedEvidenceTitle: 'Selected Supporting Evidence',
    noEvidenceSelectedWarning: (min: number) => `No trials selected from the table above. Please check at least ${min} trials in the table to provide empirical evidence.`,
    evidenceValidTag: 'Evidence Valid',
    evidenceIncompleteTag: 'Evidence Incomplete',
    questionOf: (current: number, total: number) => `Question ${current} of ${total}`,
    submitClaimBtn: 'Validate Claim with Evidence',
    submittedBtn: 'Re-evaluate Claim',
    requiredEvidenceRule: 'HKDSE Requirement: Controlled comparison requires varying only 1 independent variable while holding others constant.',

    theoryModalTitle: 'HKDSE Chemistry Guide: Chapter 13',
    theoryModalSubtitle: 'Curriculum-aligned reference for redox mechanisms and kinetic factors influencing iron corrosion',
    tabMechanism: 'Mechanism of Rusting',
    tabFactors: 'Factors that Speed Up Rusting',
    closeGuide: 'Close Guide',
    sourceAttribution: 'Source: HKDSE Chemistry • Chapter 13',

    footerTitle: 'Rusting Rate Investigation Simulation • High School Chemistry & Physical Science',
    footerEquation: 'Iron Corrosion Redox Model: 4 Fe + 3 O₂ + 2n H₂O → 2 Fe₂O₃·nH₂O',
  },
  zh: {
    appTitle: '鐵銹蝕速率探究實驗室',
    appSubtitle: '電化學氧化還原模型 • 自變量：溫度、水 (H₂O)、酸鹼度 (pH)、氧氣 (O₂)',
    versionBadge: 'v2.4 實驗模擬',
    scientificGuide: '科學指南',
    switchLangText: 'English',

    overviewTitle: '環境因素如何影響鐵的銹蝕速率？',
    independentVarsLabel: '自變量 (獨立變量)：',
    independentVarsDesc: '溫度 (25°C - 45°C)、水 (存在 / 不存在)、溶液酸鹼度 pH (3, 7, 12)、氧氣 (存在 / 不存在)。',
    dependentVarLabel: '設計應變量 (因變量)：',
    dependentVarDesc: '銹蝕速率 (毫克/天) 及 生成鐵銹總質量 (毫克)。',
    loggedTrials: '已記錄實驗',
    trialsRecorded: '次紀錄',

    controlsHeader: '自變量設定',
    theoryBtn: '反應機制與化學原理',
    tempLabel: '1. 溫度 (°C)',
    roomTemp: '室溫',
    warmTemp: '溫熱',
    highTemp: '高溫',
    waterLabel: '2. 水的存在狀態 (H₂O)',
    waterPresent: '存在水 (水溶液)',
    waterAbsent: '無水 (乾燥空氣 / 無水 CaCl₂)',
    waterPresentDesc: '水為鐵的電化學水合反應及離子移動提供必需的反應物與液體介質。',
    waterAbsentDesc: '裝置內置無水氯化鈣 (CaCl₂) 乾燥劑以吸盡水分。欠缺水分時，鐵完全不會銹蝕。',
    phLabel: '3. 溶液酸鹼度 (pH) [有水時]',
    phNotApplicable: '不適用 (乾燥環境無水溶液與離子)',
    phAcidic: '強酸性 (pH 3)',
    phNeutral: '中性水 (pH 7)',
    phAlkaline: '鹼性 (pH 12)',
    phAcidicDesc: '高濃度 H⁺ 離子促進鐵的氧化 (Fe + 2H⁺ ➔ Fe²⁺ + H₂)，並阻止保護性氧化膜形成。',
    phNeutralDesc: '標準水溶液基準條件。在溶有氧氣的情況下呈現標準常態銹蝕速率。',
    phAlkalineDesc: '鹼性鈍化環境。表面迅速生成不溶性氫氧化物保護層，強烈抑制進一步銹蝕。',
    oxygenLabel: '4. 氧氣的存在狀態 (O₂)',
    oxygenPresent: '充氣 (存在氧氣)',
    oxygenAbsent: '煮沸脫氧 (無氧)',
    oxygenPresentDesc: '透過空氣/氧氣供應陰極還原反應的必要反應物 (O₂ + 2H₂O + 4e⁻ ➔ 4OH⁻)。',
    oxygenAbsentDesc: '蒸餾水預先煮沸驅除溶解氣體，並以油層隔絕空氣。欠缺電子接收體，無法發生銹蝕。',
    runTrialBtn: '進行 7 天實驗',
    simulatingBtn: '實驗模擬進行中...',
    quickSetupsLabel: '快速預設條件：',
    presetBaseline: '基準條件 (25°C, 有水, 有氧)',
    presetDryAir: '乾燥空氣 (無水)',
    presetAcidRain: '模擬酸雨環境 (pH 3)',
    presetBoiledWater: '煮沸去氧水 (無氧)',
    presetAccelerated: '加速銹蝕 (45°C, pH 3)',

    reactionChamberTitle: '實驗室反應容器',
    simulatingDayOf: (day: number) => `實驗進行中：第 ${day} 天 (共 7 天)`,
    observationPeriod: '7 天觀察週期',
    beakerTitle: '密閉玻璃燒杯裝置',
    thermometerProbe: '電子溫度計探頭',
    spargerTube: '充氣導管',
    phSensor: '電子 pH 感應器',
    airBubbling: '持續通入空氣 / 氧氣微泡',
    boiledSolution: '煮沸脫氧溶液 (隔絕油層)',
    oxygenPresentBadge: '水中溶有氧氣 (O₂)',
    oxygenFreeBadge: '無氧 (已脫氣)',
    waterPresentBadge: '存在水分 (H₂O)',
    waterAbsentBadge: '乾燥無水 (無水氯化鈣 CaCl₂)',
    calciumChlorideDryingAgent: '無水氯化鈣乾燥劑 (CaCl₂)',
    submergedNail: '浸泡鐵釘',
    nailDay: (day: number) => `鐵釘 (第 ${day} 天)`,
    cleanNail: '潔淨鐵金屬',
    rustFlakes: '脫落鐵銹沉積',
    liquidAcidic: '稀酸性溶液 (pH 3.0)',
    liquidNeutral: '中性溶液 (pH 7.0)',
    liquidAlkaline: '鹼性溶液 (pH 12.0)',
    realtimeMetrics: '即時測量數據',
    rustRateLabel: '銹蝕速率',
    rustMassLabel: '生成鐵銹總質量',
    severityLabel: '銹蝕嚴重程度',
    surfaceCoverageLabel: '表面覆蓋率',
    initialRustLabel: '初現鐵銹時間',
    hoursUnit: '小時',
    mgPerDayUnit: '毫克 / 天',
    mgUnit: '毫克',
    observationLabel: '實驗觀察',

    severityNone: '無銹蝕',
    severityMinimal: '輕微',
    severityModerate: '中度',
    severityHeavy: '嚴重',
    severitySevere: '極嚴重',

    tableHeader: '實驗結果記錄表',
    trialCountLabel: (count: number) => `已記錄 ${count} 次實驗`,
    tableSubtitle: '勾選各行數據，作為下方科學探究問題的支持證據 (佐證)。',
    exportCsv: '匯出 CSV',
    clearTable: '清空記錄',
    selectAll: '全選',
    clearSelection: '清除選取',
    evidenceLogged: '已選取佐證',
    colEvidence: '佐證',
    colTrial: '實驗 #',
    colTime: '記錄時間',
    colTemp: '溫度',
    colWater: '水 (H₂O)',
    colPh: '溶液 pH',
    colOxygen: '氧氣 (O₂)',
    colRate: '銹蝕速率',
    colMass: '7天總銹質量',
    colInitial: '初現銹蝕',
    colState: '觀察狀態',
    valPresent: '存在',
    valAbsent: '不存在',
    valWaterPresent: '存在',
    valWaterAbsent: '不存在',
    selectedBadge: '已選取',
    selectAsEvidence: '選取為佐證',
    noTrialsYet: '尚未記錄任何實驗數據。請在上方設定自變量並點擊「進行 7 天實驗」開始收集科學數據。',
    confirmReset: '你確定要清空所有已記錄的實驗數據嗎？',

    inquiryHeader: '科學探究與佐證結論',
    inquirySubtitle: '將實驗所得數據與化學理論結合。從數據表中選取已完成的實驗作為支持證據 (佐證)，以驗證你的科學論述。',
    lockedNotice: (minTrials: number) => `需至少完成 ${minTrials} 次實驗以解鎖探究問題`,
    lockedRemainingNotice: (remaining: number) => `請再完成 ${remaining} 次不同變量的實驗，以解鎖科學探究分析模組。`,
    teacherUnlockBtn: '立即解鎖問題 (教師/除錯模式)',
    selectedEvidenceTitle: '已選取的支持證據 (佐證)',
    noEvidenceSelectedWarning: (min: number) => `尚未在上方表格中選取任何實驗。請勾選至少 ${min} 個實驗以提供實驗證據。`,
    evidenceValidTag: '證據有效 (公平測試)',
    evidenceIncompleteTag: '證據不充足或未控制變量',
    questionOf: (current: number, total: number) => `問題 ${current} / ${total}`,
    submitClaimBtn: '以實驗證據驗證結論',
    submittedBtn: '重新驗證結論',
    requiredEvidenceRule: '香港中學文憑考試要求：公平測試對照需固定其他控制變量，僅改變單一自變量。',

    theoryModalTitle: '香港中學文憑化學科指南：第13章',
    theoryModalSubtitle: '課程對齊參考資料：鐵銹蝕的電化學氧化還原機制與動力學加速因素',
    tabMechanism: '鐵的銹蝕機制',
    tabFactors: '加速銹蝕的因素',
    closeGuide: '關閉指南',
    sourceAttribution: '資料來源：香港中學文憑考試化學科 • 第13章',

    footerTitle: '鐵銹蝕速率探究模擬實驗 • 高中化學科與科學課程',
    footerEquation: '鐵銹蝕氧化還原模型：4 Fe + 3 O₂ + 2n H₂O → 2 Fe₂O₃·nH₂O',
  },
};
