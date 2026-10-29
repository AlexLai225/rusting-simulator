import { ExperimentConfig, DependentVariables, TrialResult, InquiryQuestion, Language } from '../types';

export function calculateRustResults(config: ExperimentConfig): DependentVariables {
  const { temperature, pH, oxygen } = config;

  if (oxygen === 'Not Present') {
    return {
      rustRate: 0.0,
      totalRustMass: 0.0,
      surfaceCoverage: 0,
      timeToInitialRustHours: 0,
      severity: 'None',
      observation:
        'No brown rust formed. The iron nail preserved its polished metallic luster. Dissolved oxygen is an essential reactant for the electrochemical oxidation of iron.',
      observationZh:
        '沒有形成棕色鐵銹。鐵釘保持其金屬光澤。水中溶解氧是鐵發生電化學氧化的必要反應物。',
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
            text: '較高溫度、欠缺氧氣及酸性條件',
            isCorrect: false,
            explanation:
              '不正確。欠缺氧氣 (陰極還原反應的必要電子接收體) 時，即使在高溫或酸性溶液中，鐵亦無法發生銹蝕。',
          },
          {
            id: 'opt_1_3',
            text: '較高溫度、存在氧氣及酸性條件',
            isCorrect: true,
            explanation:
              '正確！銹蝕是電化學氧化還原過程。高溫增加粒子碰撞頻率與能量，氧氣是必需的陰極反應物，而酸性條件 (H⁺) 能加快 Fe²⁺ 離子生成並阻止表面鈍化。',
          },
          {
            id: 'opt_1_4',
            text: '較低溫度、欠缺氧氣及中性條件',
            isCorrect: false,
            explanation:
              '不正確。在沒有氧氣的情況下，不論溫度與 pH 為何，鐵的銹蝕速率均為 0.0 mg/day。',
          },
        ],
      },
      {
        id: 'q2_ph',
        title: '溶液酸鹼度 (pH) 的影響',
        prompt: '在有氧氣存在的情況下，溶液酸鹼度 (pH) 如何影響鐵的銹蝕速率？',
        minEvidenceRows: 2,
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
              '正確！對照相同溫度與含氧條件的實驗可知：pH 3 酸性環境銹蝕速率最高，而 pH 12 鹼性環境產生保護性鈍化膜，使銹蝕速率接近零。',
          },
        ],
      },
      {
        id: 'q3_reactants',
        title: '銹蝕的必要條件 (反應物)',
        prompt: '根據你的實驗數據，鐵發生銹蝕需要甚麼必要條件？簡略解釋為何需要這些條件。',
        minEvidenceRows: 2,
        variableFocus: 'oxygen',
        questionType: 'reactants-input',
      },
      {
        id: 'q4_temp',
        title: '溫度效應與碰撞理論',
        prompt: '在氧氣存在且 pH 保持不變的情況下，提高溫度會有甚麼影響？',
        minEvidenceRows: 2,
        variableFocus: 'temperature',
        questionType: 'claim-with-collision-theory',
        options: [
          {
            id: 'opt_t_1',
            text: '提高溫度會顯著增加鐵的銹蝕速率。',
            isCorrect: true,
            explanation:
              '正確！提高溫度會顯著加速鐵的銹蝕速率。',
          },
          {
            id: 'opt_t_2',
            text: '提高溫度會顯著減慢鐵的銹蝕速率。',
            isCorrect: false,
            explanation:
              '不正確。熱能使反應物粒子運動加快，增加反應速率，而非減慢。',
          },
          {
            id: 'opt_t_3',
            text: '溫度對鐵的銹蝕速率沒有明顯影響。',
            isCorrect: false,
            explanation:
              '不正確。化學反應的速率極度依賴反應溫度。',
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
          text: 'Higher temperature, absence of oxygen, and acidic condition',
          isCorrect: false,
          explanation:
            'Incorrect. Without oxygen (the necessary cathodic electron acceptor), iron cannot undergo rusting even at higher temperatures or in acidic solutions.',
        },
        {
          id: 'opt_1_3',
          text: 'Higher temperature, presence of oxygen, and acidic condition',
          isCorrect: true,
          explanation:
            'Correct! Rusting is an electrochemical oxidation reaction. Higher temperature increases kinetic collision rates, oxygen is the mandatory cathodic electron acceptor, and acidic condition accelerates redox electron transfer by preventing protective oxide passivation.',
        },
        {
          id: 'opt_1_4',
          text: 'Lower temperature, absence of oxygen, and neutral condition',
          isCorrect: false,
          explanation:
            'Incorrect. When oxygen is absent, the rate of rusting is 0.0 mg/day regardless of pH and temperature.',
        },
      ],
    },
    {
      id: 'q2_ph',
      title: 'Effect of Solution pH',
      prompt: 'How does solution pH influence the corrosion rate of iron when oxygen is present?',
      minEvidenceRows: 2,
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
            'Correct! Comparing trials with identical temperature and oxygen, acidic condition yields the highest rust rate, whereas alkaline condition produces near-zero rust due to protective hydroxide passivation.',
        },
      ],
    },
    {
      id: 'q3_reactants',
      title: 'Requirement of Reactants',
      prompt: 'Based on your trials, what are the essential conditions required for rusting? Explain briefly why they are needed.',
      minEvidenceRows: 2,
      variableFocus: 'oxygen',
      questionType: 'reactants-input',
    },
    {
      id: 'q4_temp',
      title: 'Effect of Temperature & Collision Theory',
      prompt: 'When oxygen is present and pH is constant, what is the effect of increasing temperature?',
      minEvidenceRows: 2,
      variableFocus: 'temperature',
      questionType: 'claim-with-collision-theory',
      options: [
        {
          id: 'opt_t_1',
          text: 'Higher temperature significantly increases the rate of rusting.',
          isCorrect: true,
          explanation:
            'Correct! Increasing temperature accelerates the rate of rusting.',
        },
        {
          id: 'opt_t_2',
          text: 'Higher temperature significantly decreases the rate of rusting.',
          isCorrect: false,
          explanation:
            'Incorrect. Thermal energy accelerates chemical reactions; it does not decrease their rate.',
        },
        {
          id: 'opt_t_3',
          text: 'Temperature has no observable effect on the rate of rusting.',
          isCorrect: false,
          explanation:
            'Incorrect. Chemical reaction rates strongly depend on temperature.',
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

export interface CollisionTheoryEvaluation {
  mentionsKineticEnergy: boolean;
  mentionsCollisionFrequency: boolean;
  mentionsEffectiveCollisions: boolean;
  isValid: boolean;
  feedback: string;
}

export function evaluateCollisionTheory(explanation: string, lang: Language = 'en'): CollisionTheoryEvaluation {
  const norm = explanation.toLowerCase();

  const mentionsKineticEnergy =
    norm.includes('kinetic') ||
    norm.includes('thermal energy') ||
    norm.includes('energy') ||
    norm.includes('speed') ||
    norm.includes('faster') ||
    norm.includes('velocity') ||
    norm.includes('動能') ||
    norm.includes('能量') ||
    norm.includes('運動') ||
    norm.includes('速度');

  const mentionsCollisionFrequency =
    norm.includes('frequen') ||
    norm.includes('collide more') ||
    norm.includes('more collision') ||
    norm.includes('rate of collision') ||
    norm.includes('often') ||
    norm.includes('number of collision') ||
    norm.includes('碰撞') ||
    norm.includes('頻率') ||
    norm.includes('次數');

  const mentionsEffectiveCollisions =
    norm.includes('effective') ||
    norm.includes('activation energy') ||
    norm.includes('successful') ||
    norm.includes('exceed') ||
    norm.includes('greater than ea') ||
    norm.includes('ea') ||
    norm.includes('活化能') ||
    norm.includes('有效碰撞') ||
    norm.includes('大於');

  const hasLength = norm.trim().length >= 8;
  const countKeyPoints =
    (mentionsKineticEnergy ? 1 : 0) +
    (mentionsCollisionFrequency ? 1 : 0) +
    (mentionsEffectiveCollisions ? 1 : 0);

  const isValid = hasLength && countKeyPoints >= 2;

  let feedback = '';
  if (lang === 'zh') {
    if (isValid) {
      feedback =
        '運用碰撞理論解釋得非常準確！你清楚指出了升高溫度會賦予反應物粒子更大的平均動能，增加碰撞頻率，並使具備大於或等於活化能 (Ea) 的有效碰撞比例顯著提升。';
    } else {
      feedback =
        '為加強你的碰撞理論論述，請包含以下要點：(1) 溫度升高使反應物粒子擁有更大的平均動能，運動速度加快；(2) 粒子互相碰撞的頻率增加；(3) 擁有足夠能量 (≥ 活化能) 發生化學反應的有效碰撞比例大幅增加。';
    }
  } else {
    if (isValid) {
      feedback =
        'Superb explanation using Collision Theory! You clearly connected temperature with particle kinetic energy, increased collision frequency, and a higher proportion of effective collisions possessing energy greater than or equal to the activation energy (Ea).';
    } else {
      feedback =
        'To strengthen your Collision Theory explanation, make sure to explain: (1) Higher temperature gives reactant particles greater average kinetic energy, so they move faster; (2) Particles collide more frequently; (3) A larger fraction of collisions have sufficient energy (≥ activation energy) to result in effective chemical reactions.';
    }
  }

  return {
    mentionsKineticEnergy,
    mentionsCollisionFrequency,
    mentionsEffectiveCollisions,
    isValid,
    feedback,
  };
}

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
    const o2Text = isZh
      ? t.config.oxygen === 'Present' ? '存在' : '不存在'
      : t.config.oxygen;
    const sevText = isZh
      ? t.results.severity === 'None' ? '無銹蝕' : t.results.severity === 'Minimal' ? '輕微' : t.results.severity === 'Moderate' ? '中度' : t.results.severity === 'Heavy' ? '嚴重' : '極嚴重'
      : t.results.severity;

    return isZh
      ? `實驗 #${t.trialNumber}：[溫度: ${t.config.temperature}°C, pH: ${t.config.pH}, 氧氣: ${o2Text}] → 銹蝕速率: ${t.results.rustRate} mg/day (${sevText})`
      : `Trial #${t.trialNumber}: [Temp: ${t.config.temperature}°C, pH: ${t.config.pH}, O₂: ${o2Text}] → Rust Rate: ${t.results.rustRate} mg/day (${sevText})`;
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
          ? `證據不充分：所選實驗的銹蝕速率完全相同 (${minRate} mg/day)。為證明哪些條件加速銹蝕，請選取具對比性的實驗 (例如 45°C / pH 3 / 存在氧氣 vs 室溫 / 中性 / 無氧)。`
          : `Evidence Incomplete: All selected trials produced the exact same rust rate (${minRate} mg/day). To prove which conditions accelerate rusting, select contrasting trials (e.g. 45°C / pH 3 / O₂ Present vs. room temp / neutral / no O₂).`,
        comparisonDetails,
      };
    }

    const hasAccelerated = selectedTrials.some(
      (t) => t.config.oxygen === 'Present' && (t.config.temperature >= 40 || t.config.pH === 3)
    );
    const hasBaselineOrSlow = selectedTrials.some(
      (t) => t.config.oxygen === 'Not Present' || t.config.pH === 12 || (t.config.temperature <= 30 && t.config.pH === 7)
    );

    if (!hasAccelerated || !hasBaselineOrSlow) {
      return {
        isValid: false,
        message: isZh
          ? '證據不充分：為證明高溫 (45°C)、氧氣存在與酸性 (pH 3) 加快銹蝕，請至少選取一個具備上述加速條件的實驗，並與基準或較慢的實驗進行對照。'
          : 'Evidence Incomplete: To demonstrate that high temperature (45°C), oxygen presence, and acidic pH (pH 3) accelerate rusting, please select at least one trial with these accelerating conditions and compare it against a baseline or slower trial.',
        comparisonDetails,
      };
    }

    return {
      isValid: true,
      message: isZh
        ? '支持證據有效：數據清楚表明高溫、溶解氧與酸性 pH 顯著提高了銹蝕速率。'
        : 'Valid supporting evidence: Demonstrates that higher temperature, dissolved oxygen, and acidic pH significantly increase the rate of rusting compared to baseline or inhibited conditions.',
      comparisonDetails,
    };
  }

  // Question 2: Oxygen Requirement ('oxygen')
  if (question.variableFocus === 'oxygen') {
    const hasPresent = selectedTrials.some((t) => t.config.oxygen === 'Present');
    const hasAbsent = selectedTrials.some((t) => t.config.oxygen === 'Not Present');

    if (!hasPresent) {
      return {
        isValid: false,
        message: isZh
          ? '證據不充分：所選實驗均為「無氧氣」(速率為 0.0 mg/day)。為證明氧氣是銹蝕必需的，必須同時選取至少一個「存在氧氣」的實驗。'
          : 'Evidence Incomplete: All your selected trials have Oxygen "Not Present" (rate: 0.0 mg/day). To prove that oxygen is required for rusting, you must also select at least one trial with Oxygen "Present" to demonstrate active corrosion.',
        comparisonDetails,
      };
    }

    if (!hasAbsent) {
      return {
        isValid: false,
        message: isZh
          ? '證據不充分：所選實驗均「存在氧氣」。為證明氧氣是不可或缺的反應物，請至少選取一個「無氧氣」的對照組 (顯示 0.0 mg/day)。'
          : 'Evidence Incomplete: All your selected trials have Oxygen "Present". To prove that oxygen is an indispensable reactant, you must select at least one trial with Oxygen "Not Present" showing 0.0 mg/day.',
        comparisonDetails,
      };
    }

    const controlledPair = selectedTrials.some((t1) =>
      selectedTrials.some(
        (t2) =>
          t1.id !== t2.id &&
          t1.config.temperature === t2.config.temperature &&
          t1.config.pH === t2.config.pH &&
          t1.config.oxygen !== t2.config.oxygen
      )
    );

    return {
      isValid: true,
      message: isZh
        ? controlledPair
          ? '極佳的對照實驗證據：在相同溫度和 pH 下，有氧與無氧的對比直接確立了氧氣是銹蝕的必需反應物。'
          : '支持證據有效：數據表明無氧時完全停止銹蝕 (0.0 mg/day)，而有氧時發生銹蝕。'
        : controlledPair
        ? 'Excellent controlled evidence: Comparing identical temperature and pH with and without dissolved oxygen directly isolates O₂ as the mandatory reactant.'
        : 'Valid supporting evidence: Demonstrates that absence of oxygen stops rusting (0.0 mg/day) while oxygen presence permits corrosion.',
      comparisonDetails,
    };
  }

  // Question 3: Effect of pH ('pH')
  if (question.variableFocus === 'pH') {
    const o2PresentTrials = selectedTrials.filter((t) => t.config.oxygen === 'Present');

    if (o2PresentTrials.length < 2) {
      return {
        isValid: false,
        message: isZh
          ? '證據無效：無氧條件下任何 pH 均不生銹 (皆為 0.0 mg/day)。為探究 pH 的影響，請選取「存在氧氣」的實驗。'
          : 'Invalid Evidence: When oxygen is absent, iron cannot rust at any pH (0.0 mg/day for all). To investigate the effect of pH, you must select trials where Oxygen is "Present".',
        comparisonDetails,
      };
    }

    const uniquePHs = new Set(o2PresentTrials.map((t) => t.config.pH));
    if (uniquePHs.size < 2) {
      const singlePH = Array.from(uniquePHs)[0];
      return {
        isValid: false,
        message: isZh
          ? `證據不充分：所選實驗均使用相同 pH (${singlePH})。為探究 pH 效應，請選取對比不同 pH (例如 pH 3 vs pH 7 vs pH 12) 且均有氧的實驗。`
          : `Evidence Incomplete: All selected trials use the same pH (${singlePH}). To prove the effect of pH, select trials comparing different pH values (e.g. pH 3 vs pH 7 vs pH 12) with Oxygen Present.`,
        comparisonDetails,
      };
    }

    return {
      isValid: true,
      message: isZh
        ? '有效的對照證據：在有氧條件下對照不同 pH 值，證明酸性 pH 3 加快銹蝕，而鹼性 pH 12 鈍化抑制銹蝕。'
        : 'Valid controlled evidence: Comparing different pH values with oxygen present shows that acidic pH 3 accelerates corrosion and alkaline pH 12 inhibits it.',
      comparisonDetails,
    };
  }

  // Question 4: Effect of Temperature ('temperature')
  if (question.variableFocus === 'temperature') {
    const o2PresentTrials = selectedTrials.filter((t) => t.config.oxygen === 'Present');

    if (o2PresentTrials.length < 2) {
      return {
        isValid: false,
        message: isZh
          ? '證據無效：無氧時任何溫度下均不生銹 (0.0 mg/day)。為觀察溫度效應，請選取「存在氧氣」的實驗。'
          : 'Invalid Evidence: Without oxygen, iron cannot rust at any temperature (0.0 mg/day). To observe temperature effects, select trials where Oxygen is "Present".',
        comparisonDetails,
      };
    }

    const temps = o2PresentTrials.map((t) => t.config.temperature);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    if (maxTemp - minTemp < 5) {
      return {
        isValid: false,
        message: isZh
          ? `證據不充分：所選實驗溫度相同 (${minTemp}°C)。為評估溫度效應，請選取不同溫度 (例如 25°C vs 45°C) 且有氧的實驗。`
          : `Evidence Incomplete: All selected trials are at the same temperature (${minTemp}°C). To evaluate temperature effects, select trials tested at different temperatures (e.g. 25°C vs 45°C) with Oxygen Present.`,
        comparisonDetails,
      };
    }

    return {
      isValid: true,
      message: isZh
        ? `有效的對照證據：對比 ${minTemp}°C 與 ${maxTemp}°C 證明溫度升高會提高粒子碰撞速率與銹蝕形成速度。`
        : `Valid controlled evidence: Comparing ${minTemp}°C vs ${maxTemp}°C demonstrates that higher temperature increases molecular collision rate and rust formation speed.`,
      comparisonDetails,
    };
  }

  return {
    isValid: true,
    message: isZh ? '已從實驗數據中選取有效的支持證據。' : 'Valid supporting evidence selected from your logged experimental trials.',
    comparisonDetails,
  };
}
