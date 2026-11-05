import { ExperimentConfig, DependentVariables, TrialResult, InquiryQuestion, Language } from '../types';

export function calculateRustResults(config: ExperimentConfig): DependentVariables {
  const { temperature, pH, oxygen, water } = config;

  if (water === 'Not Present') {
    return {
      rustRate: 0.0,
      totalRustMass: 0.0,
      surfaceCoverage: 0,
      timeToInitialRustHours: 0,
      severity: 'None',
      observation:
        'No brown rust formed. The iron nail preserved its polished metallic luster. Water (moisture) is an essential condition for rusting; in dry air, iron cannot undergo electrochemical oxidation or hydration (e.g. anhydrous CaCl₂ test).',
      observationZh:
        '沒有形成棕色鐵銹。鐵釘保持其金屬光澤。水 (水分) 是鐵銹蝕的必要條件；在完全乾燥無水的空氣中 (例如使用無水氯化鈣 CaCl₂ 乾燥劑)，鐵無法進行電化學氧化與水合反應。',
    };
  }

  if (oxygen === 'Not Present') {
    return {
      rustRate: 0.0,
      totalRustMass: 0.0,
      surfaceCoverage: 0,
      timeToInitialRustHours: 0,
      severity: 'None',
      observation:
        'No brown rust formed. The iron nail preserved its polished metallic luster. Dissolved oxygen is an essential reactant for the electrochemical oxidation of iron (e.g. boiled water with oil barrier test).',
      observationZh:
        '沒有形成棕色鐵銹。鐵釘保持其金屬光澤。水中溶解氧是鐵發生電化學氧化的必要反應物 (例如煮沸去氧水加油層隔絕測試)。',
    };
  }

  // Oxygen is Present
  // 1. pH Factor (Acid accelerates, Alkaline passivates)
  let phFactor = 1.0;
  if (pH === 3) {
    phFactor = 2.65; // Acidic accelerates corrosion
  } else if (pH === 7) {
    phFactor = 1.0; // Neutral baseline
  } else if (pH === 12) {
    phFactor = 0.08; // Alkaline passivates iron surface
  }

  // 2. Temperature Factor (25°C to 45°C - Arrhenius kinetic acceleration)
  const tempFactor = 1.0 + (temperature - 25) * 0.038;

  // Base rate at 25°C, pH 7, O2 Present = 4.5 mg/day
  const baseDailyRate = 4.5;
  const rawRate = baseDailyRate * phFactor * tempFactor;

  // Slight realistic experimental variation
  const roundedRate = Math.round(rawRate * 100) / 100;
  const totalMass = Math.round(roundedRate * 7 * 10) / 10; // 7-day total

  // Surface coverage %
  let coverage = 0;
  if (roundedRate > 0) {
    coverage = Math.min(98, Math.max(5, Math.round((roundedRate / 23.5) * 95 + 3)));
  }

  // Time to initial visible rust (hours)
  let initialHours = 0;
  if (roundedRate >= 15) {
    initialHours = Math.round((24 / (roundedRate / 4.5)) * 10) / 10;
  } else if (roundedRate >= 4) {
    initialHours = Math.round((18 - (temperature - 25) * 0.3) * 10) / 10;
  } else if (roundedRate > 0) {
    initialHours = Math.round((80 - (temperature - 25) * 1.0) * 10) / 10;
  }

  // Severity classification & detailed observation
  let severity: DependentVariables['severity'] = 'None';
  let observation = '';
  let observationZh = '';

  if (totalMass === 0) {
    severity = 'None';
    observation = 'No brown rust observed. The metal surface remained completely unchanged.';
    observationZh = '未觀察到棕色鐵銹。鐵釘金屬表面完全保持原樣。';
  } else if (totalMass < 10) {
    severity = 'Minimal';
    observation =
      'Very faint brown specks of rust. High alkalinity (pH 12) passivated the metal surface with a protective oxide/hydroxide layer, strongly suppressing oxidation.';
    observationZh =
      '鐵釘表面僅有極微量棕色銹點。強鹼性環境 (pH 12) 使鐵金屬表面鈍化，形成保護性不溶膜，強烈抑制氧化反應。';
  } else if (totalMass < 45) {
    severity = 'Moderate';
    observation =
      'Noticeable uniform brown rust coating along the nail shaft. Standard atmospheric oxidation occurred with dissolved oxygen.';
    observationZh =
      '鐵釘表面呈現均勻且明顯的棕色鐵銹層。鐵金屬與水及溶解氧發生標準常態電化學氧化。';
  } else if (totalMass < 90) {
    severity = 'Heavy';
    observation =
      'Dense brown rust layer with noticeable flaking brown sediment settling at the bottom. Elevated temperature boosted reaction kinetics.';
    observationZh =
      '鐵釘表面覆蓋厚厚的紅棕色鐵銹層，燒杯底部有明顯脫落的棕色鐵銹沉積物。高溫加速了化學反應速率。';
  } else {
    severity = 'Severe';
    observation =
      'Extensive dark brown rust crust with heavy flaky brown precipitates and cloudiness. Combination of acidic environment (pH 3) and high thermal energy dramatically accelerated iron oxidation.';
    observationZh =
      '鐵釘表面形成大面積深棕色粗糙鐵銹硬殼，並有大量鬆散剝落的紅棕色沉澱物。酸性環境 (pH 3) 與高溫共同極大幅度加快了鐵的氧化與銹蝕速率。';
  }

  return {
    rustRate: roundedRate,
    totalRustMass: totalMass,
    surfaceCoverage: coverage,
    timeToInitialRustHours: initialHours,
    severity,
    observation,
    observationZh,
  };
}

export function getInquiryQuestions(lang: Language = 'en'): InquiryQuestion[] {
  if (lang === 'zh') {
    return [
      {
        id: 'q1_primary',
        title: '主要科學結論',
        prompt: '在以下哪種條件組合下，鐵的銹蝕速率會最快？',
        minEvidenceRows: 2,
        variableFocus: 'all',
        questionType: 'multiple-choice',
        options: [
          {
            id: 'opt_1_1',
            text: '較低溫度、存在氧氣及鹼性條件',
            isCorrect: false,
            explanation:
              '不正確。鹼性條件使鐵表面生成緻密的保護性氫氧化物/氧化物鈍化層，且較低溫度下粒子平均動能較小，銹蝕非常緩慢。',
          },
          {
            id: 'opt_1_2',
            text: '較高溫度、欠缺水分或欠缺氧氣',
            isCorrect: false,
            explanation:
              '不正確。水和氧氣是銹蝕的兩個必要條件。若欠缺水分或欠缺氧氣，鐵的銹蝕速率均為 0.0 mg/day。',
          },
          {
            id: 'opt_1_3',
            text: '較高溫度、同時存在水與氧氣，以及酸性條件',
            isCorrect: true,
            explanation:
              '正確！銹蝕是電化學氧化還原過程。高溫增加粒子碰撞頻率與能量，水與氧氣是必需的反應條件，而酸性條件 (H⁺) 能加快 Fe²⁺ 離子生成並阻止表面鈍化。',
          },
          {
            id: 'opt_1_4',
            text: '較低溫度、欠缺氧氣及中性條件',
            isCorrect: false,
            explanation:
              '不正確。在沒有氧氣或水分的情況下，不論溫度與 pH 為何，鐵的銹蝕速率均為 0.0 mg/day。',
          },
        ],
      },
      {
        id: 'q2_ph',
        title: '溶液酸鹼度 (pH) 的影響',
        prompt: '在有水及氧氣存在的情況下，溶液酸鹼度 (pH) 如何影響鐵的銹蝕速率？',
        minEvidenceRows: 3,
        variableFocus: 'pH',
        questionType: 'multiple-choice',
        options: [
          {
            id: 'opt_ph_1',
            text: '鹼性條件下銹蝕最快，因為鹼液最能溶解金屬。',
            isCorrect: false,
            explanation:
              '不正確。鹼性環境中鐵表面會迅速形成不溶性 Fe(OH)₂ 保護膜，阻隔氧氣與水進一步接觸，抑制銹蝕。',
          },
          {
            id: 'opt_ph_2',
            text: '中性水中的鐵銹蝕速度總是快於酸性溶液。',
            isCorrect: false,
            explanation:
              '不正確。酸性溶液提供高濃度 H⁺ 離子，能直接與鐵反應生成 Fe²⁺(aq) 與 H₂(g)，加速銹蝕。',
          },
          {
            id: 'opt_ph_3',
            text: '酸性條件顯著加快銹蝕，而鹼性條件因鈍化保護作用而強烈抑制銹蝕。',
            isCorrect: true,
            explanation:
              '正確！對照相同溫度下 pH 3、pH 7 與 pH 12 的實驗可知：酸性環境 (pH 3) 銹蝕速率最高，而鹼性環境 (pH 12) 產生保護性鈍化膜，使銹蝕速率接近零。',
          },
        ],
      },
      {
        id: 'q3_reactants',
        title: '銹蝕的必要條件 (反應物)',
        prompt: '根據你的實驗數據，鐵發生銹蝕需要甚麼必要條件？簡略解釋為何需要這些條件。',
        minEvidenceRows: 3,
        variableFocus: 'reactants',
        questionType: 'reactants-input',
      },
      {
        id: 'q4_temp',
        title: '溫度的影響',
        prompt: '在水和氧氣存在且 pH 保持不變的情況下，提高溫度會有甚麼影響？',
        minEvidenceRows: 2,
        variableFocus: 'temperature',
        questionType: 'temperature-explanation',
        options: [
          {
            id: 'opt_t_1',
            text: '當溫度升高時，質量增加較大，因為銹蝕變得更加嚴重。',
            isCorrect: true,
            explanation:
              '正確！當溫度升高時，質量增加較大，因為銹蝕變得更加嚴重。',
          },
          {
            id: 'opt_t_2',
            text: '當溫度升高時，質量增加較小，因為高溫抑制銹蝕。',
            isCorrect: false,
            explanation:
              '不正確。溫度升高會加快化學反應速率，加劇銹蝕，而非減少質量增加。',
          },
          {
            id: 'opt_t_3',
            text: '溫度對鐵的銹蝕嚴重程度和質量增加沒有影響。',
            isCorrect: false,
            explanation:
              '不正確。化學反應的銹蝕程度與生成物質量極度依賴反應溫度。',
          },
        ],
      },
    ];
  }

  // English fallback
  return [
    {
      id: 'q1_primary',
      title: 'Primary Scientific Conclusion',
      prompt: 'The rate of rusting will be faster under...',
      minEvidenceRows: 2,
      variableFocus: 'all',
      questionType: 'multiple-choice',
      options: [
        {
          id: 'opt_1_1',
          text: 'Lower temperature, presence of oxygen, and alkaline condition',
          isCorrect: false,
          explanation:
            'Incorrect. Alkaline pH creates a passivating protective hydroxide layer on iron, and lower temperature decreases molecular kinetic energy, leading to very slow rusting.',
        },
        {
          id: 'opt_1_2',
          text: 'Higher temperature, absence of water or absence of oxygen',
          isCorrect: false,
          explanation:
            'Incorrect. Both water and oxygen are essential conditions. If either water or oxygen is absent, iron cannot rust (0.0 mg/day).',
        },
        {
          id: 'opt_1_3',
          text: 'Higher temperature, presence of both water and oxygen, and acidic condition',
          isCorrect: true,
          explanation:
            'Correct! Rusting is an electrochemical oxidation reaction. Higher temperature increases kinetic collision rates, both water and oxygen are mandatory reactants, and acidic condition accelerates redox reaction by preventing protective passivation.',
        },
        {
          id: 'opt_1_4',
          text: 'Lower temperature, absence of oxygen, and neutral condition',
          isCorrect: false,
          explanation:
            'Incorrect. When oxygen or water is absent, the rate of rusting is 0.0 mg/day regardless of pH and temperature.',
        },
      ],
    },
    {
      id: 'q2_ph',
      title: 'Effect of Solution pH',
      prompt: 'When water and oxygen are present, how does solution pH influence the corrosion rate of iron?',
      minEvidenceRows: 3,
      variableFocus: 'pH',
      questionType: 'multiple-choice',
      options: [
        {
          id: 'opt_ph_1',
          text: 'Alkaline conditions cause the most rapid rusting because bases dissolve metals fastest.',
          isCorrect: false,
          explanation:
            'Incorrect. Alkaline pH forms a passivating insoluble film of Fe(OH)2 / Fe3O4 that shields iron from further corrosion.',
        },
        {
          id: 'opt_ph_2',
          text: 'Neutral water always rusts iron faster than acidic solutions.',
          isCorrect: false,
          explanation:
            'Incorrect. Acidic solutions supply H+ ions that accelerate the reduction half-reaction and dissolve passivating oxide films.',
        },
        {
          id: 'opt_ph_3',
          text: 'Acidic conditions accelerate rusting, while alkaline conditions strongly inhibit it through passivation.',
          isCorrect: true,
          explanation:
            'Correct! Comparing trials at the same temperature with pH 3, pH 7, and pH 12 shows that acidic condition yields the highest rust rate, whereas alkaline condition produces near-zero rust due to protective hydroxide passivation.',
        },
      ],
    },
    {
      id: 'q3_reactants',
      title: 'Requirement of Reactants',
      prompt: 'Based on your trials, what are the essential conditions required for rusting? Explain briefly why they are needed.',
      minEvidenceRows: 3,
      variableFocus: 'reactants',
      questionType: 'reactants-input',
    },
    {
      id: 'q4_temp',
      title: 'Effect of Temperature',
      prompt: 'When water and oxygen are present and pH is constant, what is the effect of increasing temperature?',
      minEvidenceRows: 2,
      variableFocus: 'temperature',
      questionType: 'temperature-explanation',
      options: [
        {
          id: 'opt_t_1',
          text: 'When the temperature increases, the mass increase is greater as the rusting becomes more serious.',
          isCorrect: true,
          explanation:
            'Correct! When the temperature increases, the mass increase is greater as the rusting becomes more serious.',
        },
        {
          id: 'opt_t_2',
          text: 'When the temperature increases, the mass increase is smaller because high temperature inhibits rusting.',
          isCorrect: false,
          explanation:
            'Incorrect. Higher temperature accelerates chemical reaction rates; it does not decrease rust formation.',
        },
        {
          id: 'opt_t_3',
          text: 'Temperature has no observable effect on the severity of rusting or mass increase.',
          isCorrect: false,
          explanation:
            'Incorrect. Chemical reaction severity and rust mass strongly depend on temperature.',
        },
      ],
    },
  ];
}

// Keep constant for backward compatibility
export const INQUIRY_QUESTIONS = getInquiryQuestions('en');

export interface EvidenceValidation {
  isValid: boolean;
  message: string;
  comparisonDetails: string[];
}

export interface ReactantsEvaluation {
  isConditionsCorrect: boolean;
  isExplanationValid: boolean;
  isOverallCorrect: boolean;
  feedback: string;
  detectedConditions: string[];
  missingConditions: string[];
}

export function evaluateReactantsAnswer(
  conditions: string,
  explanation: string,
  lang: Language = 'en'
): ReactantsEvaluation {
  const normCond = conditions.toLowerCase();
  const normExp = explanation.toLowerCase();

  const mentionsOxygen =
    normCond.includes('oxygen') ||
    normCond.includes('o2') ||
    normCond.includes('air') ||
    normCond.includes('氧') ||
    normCond.includes('空氣') ||
    normExp.includes('oxygen') ||
    normExp.includes('o2') ||
    normExp.includes('氧') ||
    normExp.includes('空氣');

  const mentionsWater =
    normCond.includes('water') ||
    normCond.includes('h2o') ||
    normCond.includes('moisture') ||
    normCond.includes('水') ||
    normCond.includes('濕氣') ||
    normExp.includes('water') ||
    normExp.includes('h2o') ||
    normExp.includes('moisture') ||
    normExp.includes('水') ||
    normExp.includes('濕氣');

  const detectedConditions: string[] = [];
  const missingConditions: string[] = [];

  const oxygenLabel = lang === 'zh' ? '氧氣 / 空氣 (O₂)' : 'Oxygen (O₂)';
  const waterLabel = lang === 'zh' ? '水 (H₂O)' : 'Water (H₂O)';

  if (mentionsOxygen) detectedConditions.push(oxygenLabel);
  else missingConditions.push(oxygenLabel);

  if (mentionsWater) detectedConditions.push(waterLabel);
  else missingConditions.push(waterLabel);

  const isConditionsCorrect = mentionsOxygen && mentionsWater;

  // Check if explanation indicates they are reactants / react together
  const mentionsReactants =
    normExp.includes('reactant') ||
    normExp.includes('react') ||
    normExp.includes('oxidiz') ||
    normExp.includes('redox') ||
    normExp.includes('reagent') ||
    normExp.includes('chemical reaction') ||
    normExp.includes('combine') ||
    normExp.includes('反應') ||
    normExp.includes('氧化') ||
    normExp.includes('反應物') ||
    normExp.includes('結合') ||
    normExp.includes('化學');

  const isExplanationValid = normExp.trim().length >= 6 && mentionsReactants;
  const isOverallCorrect = isConditionsCorrect && isExplanationValid;

  let feedback = '';
  if (lang === 'zh') {
    if (isOverallCorrect) {
      feedback =
        '科學論述非常出色！你正確指出了氧氣 (空氣) 與水是銹蝕的兩個必要條件，因為它們是鐵發生電化學氧化還原反應的必要化學反應物 (4Fe + 3O₂ + 2nH₂O ➔ 2Fe₂O₃·nH₂O)。';
    } else if (!isConditionsCorrect && isExplanationValid) {
      feedback = `你提及了化學反應物的概念，但答案必須明確指出「氧氣 (空氣)」和「水」這兩項必要條件。缺漏條件：${missingConditions.join('、')}。`;
    } else if (isConditionsCorrect && !isExplanationValid) {
      feedback =
        '你正確指出了氧氣與水是銹蝕的必要條件！請在解釋中進一步說明：它們是參與氧化還原反應以將鐵金屬氧化的「化學反應物」。';
    } else {
      feedback =
        '鐵的銹蝕必須同時存在氧氣 (空氣) 與水，因為兩者是氧化金屬鐵所必需的化學反應物。請修改答案，同時寫出這兩項條件並解釋其作為反應物的角色。';
    }
  } else {
    if (isOverallCorrect) {
      feedback =
        'Excellent scientific reasoning! You correctly identified that both oxygen and water are essential because they are the necessary chemical reactants for the electrochemical oxidation of iron (4 Fe + 3 O₂ + 2n H₂O → 2 Fe₂O₃·nH₂O).';
    } else if (!isConditionsCorrect && isExplanationValid) {
      feedback = `You mentioned that reactants are required, but your answer must explicitly identify both Oxygen and Water as the essential conditions. Missing: ${missingConditions.join(', ')}.`;
    } else if (isConditionsCorrect && !isExplanationValid) {
      feedback =
        'You correctly identified Oxygen and Water as the essential conditions! However, please explain in your explanation that they are the chemical reactants in the redox reaction that oxidizes iron.';
    } else {
      feedback =
        'Rusting requires both Oxygen and Water because they act as the chemical reactants needed to oxidize metallic iron. Please revise your answer to specify both conditions and explain their role as reactants.';
    }
  }

  return {
    isConditionsCorrect,
    isExplanationValid,
    isOverallCorrect,
    feedback,
    detectedConditions,
    missingConditions,
  };
}

export interface TemperatureExplanationEvaluation {
  mentionsTemperatureIncrease: boolean;
  mentionsMassIncrease: boolean;
  mentionsRustingSerious: boolean;
  isValid: boolean;
  feedback: string;
}

export function evaluateTemperatureAnswer(
  explanation: string,
  lang: Language = 'en'
): TemperatureExplanationEvaluation {
  const norm = explanation.toLowerCase();

  const mentionsTemperatureIncrease =
    norm.includes('temp') ||
    norm.includes('heat') ||
    norm.includes('warm') ||
    norm.includes('hot') ||
    norm.includes('溫') ||
    norm.includes('升') ||
    norm.includes('熱');

  const mentionsMassIncrease =
    norm.includes('mass') ||
    norm.includes('weight') ||
    norm.includes('rate') ||
    norm.includes('greater') ||
    norm.includes('increase') ||
    norm.includes('more') ||
    norm.includes('higher') ||
    norm.includes('質') ||
    norm.includes('重') ||
    norm.includes('增') ||
    norm.includes('大');

  const mentionsRustingSerious =
    norm.includes('serious') ||
    norm.includes('severe') ||
    norm.includes('rust') ||
    norm.includes('corros') ||
    norm.includes('嚴') ||
    norm.includes('銹') ||
    norm.includes('锈') ||
    norm.includes('蝕') ||
    norm.includes('腐');

  const hasLength = norm.trim().length >= 5;
  const countKeyPoints =
    (mentionsTemperatureIncrease ? 1 : 0) +
    (mentionsMassIncrease ? 1 : 0) +
    (mentionsRustingSerious ? 1 : 0);

  const isValid = hasLength && countKeyPoints >= 2;

  let feedback = '';
  if (lang === 'zh') {
    if (isValid) {
      feedback =
        '論述非常出色！你正確指出了當溫度升高時，生成鐵銹的質量增加較大，因為鐵的銹蝕變得更加嚴重。';
    } else {
      feedback =
        '請完善你的解釋：當溫度升高時，生成鐵銹的質量增加較大，因為鐵的銹蝕變得更加嚴重。';
    }
  } else {
    if (isValid) {
      feedback =
        'Excellent scientific explanation! You correctly identified that when the temperature increases, the mass increase is greater as the rusting becomes more serious.';
    } else {
      feedback =
        'Please refine your answer to state that when the temperature increases, the mass increase is greater as the rusting becomes more serious.';
    }
  }

  return {
    mentionsTemperatureIncrease,
    mentionsMassIncrease,
    mentionsRustingSerious,
    isValid,
    feedback,
  };
}

// Backward compatibility alias
export type CollisionTheoryEvaluation = TemperatureExplanationEvaluation;
export const evaluateCollisionTheory = evaluateTemperatureAnswer;

export function validateEvidence(
  question: InquiryQuestion,
  selectedTrials: TrialResult[],
  selectedOptionId?: string,
  lang: Language = 'en'
): EvidenceValidation {
  const isZh = lang === 'zh';

  if (selectedTrials.length < question.minEvidenceRows) {
    return {
      isValid: false,
      message: isZh
        ? `請在結果數據表中至少勾選 ${question.minEvidenceRows} 次實驗數據作為支持證據。`
        : `Please select at least ${question.minEvidenceRows} trial rows from the results table as supporting evidence.`,
      comparisonDetails: [],
    };
  }

  const comparisonDetails: string[] = selectedTrials.map((t) => {
    const wText = isZh
      ? t.config.water === 'Present' ? '有水' : '無水'
      : t.config.water === 'Present' ? 'H₂O' : 'No H₂O';
    const o2Text = isZh
      ? t.config.oxygen === 'Present' ? '有氧' : '無氧'
      : t.config.oxygen === 'Present' ? 'O₂' : 'No O₂';
    const sevText = isZh
      ? t.results.severity === 'None' ? '無銹蝕' : t.results.severity === 'Minimal' ? '輕微' : t.results.severity === 'Moderate' ? '中度' : t.results.severity === 'Heavy' ? '嚴重' : '極嚴重'
      : t.results.severity;

    return isZh
      ? `實驗 #${t.trialNumber}：[溫度: ${t.config.temperature}°C, 水: ${wText}, pH: ${t.config.water === 'Present' ? t.config.pH : '—'}, 氧氣: ${o2Text}] → 銹蝕速率: ${t.results.rustRate} mg/day (${sevText})`
      : `Trial #${t.trialNumber}: [Temp: ${t.config.temperature}°C, Water: ${wText}, pH: ${t.config.water === 'Present' ? t.config.pH : 'N/A'}, O₂: ${o2Text}] → Rust Rate: ${t.results.rustRate} mg/day (${sevText})`;
  });

  // Check if student selected an option (for multiple-choice or claim-based questions)
  if (question.questionType !== 'reactants-input' && !selectedOptionId) {
    return {
      isValid: false,
      message: isZh
        ? '請在提交結論前先選取一個選項。'
        : 'Please choose an answer option before submitting your claim.',
      comparisonDetails,
    };
  }

  // Question 1: Primary Conclusion ('all')
  if (question.variableFocus === 'all') {
    const rates = selectedTrials.map((t) => t.results.rustRate);
    const minRate = Math.min(...rates);
    const maxRate = Math.max(...rates);

    if (minRate === maxRate) {
      return {
        isValid: false,
        message: isZh
          ? `證據不充分：所選實驗的銹蝕速率完全相同 (${minRate} mg/day)。為證明哪些條件加速銹蝕，請選取具對比性的實驗 (例如 45°C / pH 3 / 存在水與氧氣 vs 室溫 / 中性 / 無氧或無水)。`
          : `Evidence Incomplete: All selected trials produced the exact same rust rate (${minRate} mg/day). To prove which conditions accelerate rusting, select contrasting trials (e.g. 45°C / pH 3 / Water & O₂ Present vs. room temp / neutral / no O₂ or dry).`,
        comparisonDetails,
      };
    }

    const hasAccelerated = selectedTrials.some(
      (t) => t.config.water === 'Present' && t.config.oxygen === 'Present' && (t.config.temperature >= 40 || t.config.pH === 3)
    );
    const hasBaselineOrSlow = selectedTrials.some(
      (t) => t.config.water === 'Not Present' || t.config.oxygen === 'Not Present' || t.config.pH === 12 || (t.config.temperature <= 30 && t.config.pH === 7)
    );

    if (!hasAccelerated || !hasBaselineOrSlow) {
      return {
        isValid: false,
        message: isZh
          ? '證據不充分：為證明高溫 (45°C)、存在水與氧氣及酸性 (pH 3) 加快銹蝕，請至少選取一個具備上述加速條件的實驗，並與基準或較慢的實驗進行對照。'
          : 'Evidence Incomplete: To demonstrate that high temperature (45°C), presence of water & oxygen, and acidic pH (pH 3) accelerate rusting, please select at least one trial with these accelerating conditions and compare it against a baseline or slower trial.',
        comparisonDetails,
      };
    }

    return {
      isValid: true,
      message: isZh
        ? '支持證據有效：數據清楚表明高溫、存在水與溶解氧，以及酸性 pH 顯著提高了銹蝕速率。'
        : 'Valid supporting evidence: Demonstrates that higher temperature, water, dissolved oxygen, and acidic pH significantly increase the rate of rusting compared to baseline or inhibited conditions.',
      comparisonDetails,
    };
  }

  // Question 2: Effect of Solution pH ('pH') - Must include acidic, neutral, and alkaline at the same temperature
  if (question.variableFocus === 'pH') {
    const activeCorrosionTrials = selectedTrials.filter(
      (t) => t.config.oxygen === 'Present' && t.config.water === 'Present'
    );

    if (activeCorrosionTrials.length < 3) {
      return {
        isValid: false,
        message: isZh
          ? '證據不充分：支持證據必須包含在相同溫度下測試的酸性 (pH 3)、中性 (pH 7) 及鹼性 (pH 12) 三組有水有氧實驗。目前選取少於 3 組有效實驗。'
          : 'Evidence Incomplete: Supporting evidence must include trials for acidic (pH 3), neutral (pH 7), and alkaline (pH 12) tested at the same temperature with water and oxygen present.',
        comparisonDetails,
      };
    }

    // Check if there is any temperature at which all 3 pH values (3, 7, 12) are present
    const temps = Array.from(new Set(activeCorrosionTrials.map((t) => t.config.temperature)));
    const matchedTemp = temps.find((temp) => {
      const phsAtTemp = new Set(
        activeCorrosionTrials.filter((t) => t.config.temperature === temp).map((t) => t.config.pH)
      );
      return phsAtTemp.has(3) && phsAtTemp.has(7) && phsAtTemp.has(12);
    });

    if (!matchedTemp) {
      const allPHs = new Set(activeCorrosionTrials.map((t) => t.config.pH));
      const missingPHs: string[] = [];
      if (!allPHs.has(3)) missingPHs.push(isZh ? '酸性 (pH 3)' : 'Acidic (pH 3)');
      if (!allPHs.has(7)) missingPHs.push(isZh ? '中性 (pH 7)' : 'Neutral (pH 7)');
      if (!allPHs.has(12)) missingPHs.push(isZh ? '鹼性 (pH 12)' : 'Alkaline (pH 12)');

      if (missingPHs.length > 0) {
        return {
          isValid: false,
          message: isZh
            ? `證據不充分：支持證據必須同時包含相同溫度下的酸性 (pH 3)、中性 (pH 7) 及鹼性 (pH 12) 三組對照實驗。缺漏條件：${missingPHs.join('、')}。`
            : `Evidence Incomplete: Supporting evidence must include trials for all three conditions: acidic (pH 3), neutral (pH 7), and alkaline (pH 12) at the same temperature. Missing: ${missingPHs.join(', ')}.`,
          comparisonDetails,
        };
      } else {
        return {
          isValid: false,
          message: isZh
            ? '變量未受控 (非公平測試)：所選的 pH 3、pH 7 及 pH 12 實驗是在不同溫度下進行的。探究 pH 影響時必須控制溫度保持相同 (例如全部在 25°C、或全部在 35°C、或全部在 45°C 進行)。'
            : 'Uncontrolled Variable: The selected pH 3, pH 7, and pH 12 trials were conducted at different temperatures. To investigate pH as a fair test, temperature must be held constant across all three trials (e.g., all tested at 25°C, 35°C, or 45°C).',
          comparisonDetails,
        };
      }
    }

    return {
      isValid: true,
      message: isZh
        ? `有效的對照證據：在相同溫度 (${matchedTemp}°C) 下完整對比 pH 3、pH 7 與 pH 12，證明酸性加快銹蝕，而鹼性抑制鈍化，完全符合公平測試要求。`
        : `Valid controlled evidence: Comparing pH 3, pH 7, and pH 12 at the same temperature (${matchedTemp}°C) proves that acidic condition accelerates rusting and alkaline condition inhibits it, satisfying fair test requirements.`,
      comparisonDetails,
    };
  }

  // Question 3: Reactants / Essential Conditions (Water & Oxygen) - Must include 3 specific trials
  if (question.variableFocus === 'reactants' || question.variableFocus === 'oxygen' || question.variableFocus === 'water') {
    const hasOxygenAndWater = selectedTrials.some(
      (t) => t.config.oxygen === 'Present' && t.config.water === 'Present'
    );
    const hasOxygenOnlyNoWater = selectedTrials.some(
      (t) => t.config.oxygen === 'Present' && t.config.water === 'Not Present'
    );
    const hasWaterOnlyNoOxygen = selectedTrials.some(
      (t) => t.config.water === 'Present' && t.config.oxygen === 'Not Present'
    );

    const missingTrials: string[] = [];
    if (!hasOxygenAndWater) {
      missingTrials.push(isZh ? '(1) 同時存在氧氣與水' : '(1) Both oxygen and water present');
    }
    if (!hasOxygenOnlyNoWater) {
      missingTrials.push(isZh ? '(2) 只有氧氣而無水 (乾燥空氣 / 無水 CaCl₂)' : '(2) Oxygen only and absence of water (dry air / CaCl₂)');
    }
    if (!hasWaterOnlyNoOxygen) {
      missingTrials.push(isZh ? '(3) 只有水而無氧氣 (煮沸去氧水)' : '(3) Water only and absence of oxygen (boiled deoxygenated water)');
    }

    if (missingTrials.length > 0) {
      return {
        isValid: false,
        message: isZh
          ? `證據不充分：支持證據必須包含以下三組對照實驗以確立必要條件：(1) 同時存在氧氣與水；(2) 只有氧氣而無水；(3) 只有水而無氧氣。目前缺漏：${missingTrials.join('、')}。`
          : `Evidence Incomplete: Supporting evidence must include all three control trials: (1) Both oxygen and water present; (2) Oxygen only and absence of water; (3) Water only and absence of oxygen. Currently missing: ${missingTrials.join(', ')}.`,
        comparisonDetails,
      };
    }

    return {
      isValid: true,
      message: isZh
        ? '極佳的對照實驗證據：完整提供了 (1) 水氧共存 (有銹蝕)、(2) 有氧無水 (0.0 mg/day)、(3) 有水無氧 (0.0 mg/day) 的三組實驗，無可置疑地確立了水和氧氣兩者皆為鐵銹蝕的必要條件！'
        : 'Excellent controlled evidence: Successfully includes all three trials: (1) Both oxygen and water present (active rusting), (2) Oxygen only with no water (0.0 mg/day), and (3) Water only with no oxygen (0.0 mg/day), conclusively proving that both water and oxygen are essential conditions for rusting!',
      comparisonDetails,
    };
  }

  // Question 4: Effect of Temperature ('temperature')
  if (question.variableFocus === 'temperature') {
    const activeCorrosionTrials = selectedTrials.filter(
      (t) => t.config.oxygen === 'Present' && t.config.water === 'Present'
    );

    if (activeCorrosionTrials.length < 2) {
      return {
        isValid: false,
        message: isZh
          ? '證據無效：無氧或無水時任何溫度下均不生銹 (0.0 mg/day)。為觀察溫度效應，請選取「存在水且存在氧氣」的實驗。'
          : 'Invalid Evidence: Without oxygen or water, iron cannot rust at any temperature (0.0 mg/day). To observe temperature effects, select trials where Water and Oxygen are "Present".',
        comparisonDetails,
      };
    }

    // Check if there are different temperatures tested at the same pH (controlled variable)
    const phGroups = Array.from(new Set(activeCorrosionTrials.map((t) => t.config.pH)));
    const matchedPH = phGroups.find((phVal) => {
      const tempsAtPH = activeCorrosionTrials.filter((t) => t.config.pH === phVal).map((t) => t.config.temperature);
      const min = Math.min(...tempsAtPH);
      const max = Math.max(...tempsAtPH);
      return max - min >= 5;
    });

    if (!matchedPH) {
      return {
        isValid: false,
        message: isZh
          ? '證據不充分：公平測試要求在探究溫度影響時保持溶液 pH 相同 (例如均為 pH 7)，並對照不同溫度 (例如 25°C vs 35°C 或 45°C)。'
          : 'Evidence Incomplete: A fair test requires holding solution pH constant (e.g. all at pH 7) while comparing different temperatures (e.g. 25°C vs 35°C or 45°C) with water and oxygen present.',
        comparisonDetails,
      };
    }

    const trialsAtPH = activeCorrosionTrials.filter((t) => t.config.pH === matchedPH);
    const temps = trialsAtPH.map((t) => t.config.temperature);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    return {
      isValid: true,
      message: isZh
        ? `有效的對照證據：在相同 pH ${matchedPH} 下對比 ${minTemp}°C 與 ${maxTemp}°C，證明當溫度升高時，生成鐵銹質量增加較大，銹蝕變得更加嚴重。`
        : `Valid controlled evidence: Comparing ${minTemp}°C vs ${maxTemp}°C at constant pH ${matchedPH} proves that when temperature increases, the mass increase is greater as rusting becomes more serious.`,
      comparisonDetails,
    };
  }

  return {
    isValid: true,
    message: isZh ? '已從實驗數據中選取有效的支持證據。' : 'Valid supporting evidence selected from your logged experimental trials.',
    comparisonDetails,
  };
}
