import { ExperimentConfig, DependentVariables, TrialResult, InquiryQuestion } from '../types';

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

  // 2. Temperature Factor (25°C to 50°C - Arrhenius kinetic acceleration)
  const tempFactor = 1.0 + (temperature - 25) * 0.038;

  // Base rate at 25°C, pH 7, O2 Present = 4.5 mg/day
  const baseDailyRate = 4.5;
  const rawRate = baseDailyRate * phFactor * tempFactor;
  
  // Slight realistic experimental variation (+-1%)
  const roundedRate = Math.round(rawRate * 100) / 100;
  const totalMass = Math.round(roundedRate * 7 * 10) / 10; // 7-day total

  // Surface coverage %
  let coverage = 0;
  if (roundedRate > 0) {
    // 0 to 25 mg/day maps to 5% - 98% coverage
    coverage = Math.min(98, Math.max(5, Math.round((roundedRate / 23.5) * 95 + 3)));
  }

  // Time to initial visible rust (hours)
  let initialHours = 0;
  if (roundedRate >= 15) {
    initialHours = Math.round(24 / (roundedRate / 4.5) * 10) / 10; // 3 to 6 hours
  } else if (roundedRate >= 4) {
    initialHours = Math.round((18 - (temperature - 25) * 0.3) * 10) / 10; // 10 to 18 hours
  } else if (roundedRate > 0) {
    initialHours = Math.round((80 - (temperature - 25) * 1.0) * 10) / 10; // 55 to 80 hours
  }

  // Severity classification & detailed observation
  let severity: DependentVariables['severity'] = 'None';
  let observation = '';

  if (totalMass === 0) {
    severity = 'None';
    observation = 'No brown rust observed. The metal surface remained completely unchanged.';
  } else if (totalMass < 10) {
    severity = 'Minimal';
    observation =
      'Very faint brown specks of rust. High alkalinity (pH 12) passivated the metal surface with a protective oxide/hydroxide layer, strongly suppressing oxidation.';
  } else if (totalMass < 45) {
    severity = 'Moderate';
    observation =
      'Noticeable uniform brown rust coating along the nail shaft. Standard atmospheric oxidation occurred with dissolved oxygen.';
  } else if (totalMass < 90) {
    severity = 'Heavy';
    observation =
      'Dense brown rust layer with noticeable flaking brown sediment settling at the bottom. Elevated temperature boosted reaction kinetics.';
  } else {
    severity = 'Severe';
    observation =
      'Extensive dark brown rust crust with heavy flaky brown precipitates and cloudiness. Combination of acidic environment (pH 3) and high thermal energy (temperature) dramatically accelerated iron oxidation.';
  }

  return {
    rustRate: roundedRate,
    totalRustMass: totalMass,
    surfaceCoverage: coverage,
    timeToInitialRustHours: initialHours,
    severity,
    observation,
  };
}

export const INQUIRY_QUESTIONS: InquiryQuestion[] = [
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

export function evaluateReactantsAnswer(conditions: string, explanation: string): ReactantsEvaluation {
  const normCond = conditions.toLowerCase();
  const normExp = explanation.toLowerCase();

  const mentionsOxygen = normCond.includes('oxygen') || normCond.includes('o2') || normCond.includes('air') || normExp.includes('oxygen') || normExp.includes('o2');
  const mentionsWater = normCond.includes('water') || normCond.includes('h2o') || normCond.includes('moisture') || normExp.includes('water') || normExp.includes('h2o') || normExp.includes('moisture');

  const detectedConditions: string[] = [];
  const missingConditions: string[] = [];

  if (mentionsOxygen) detectedConditions.push('Oxygen (O₂)');
  else missingConditions.push('Oxygen (O₂)');

  if (mentionsWater) detectedConditions.push('Water (H₂O)');
  else missingConditions.push('Water (H₂O)');

  const isConditionsCorrect = mentionsOxygen && mentionsWater;

  // Check if explanation indicates they are reactants / react together
  const mentionsReactants =
    normExp.includes('reactant') ||
    normExp.includes('react') ||
    normExp.includes('oxidiz') ||
    normExp.includes('redox') ||
    normExp.includes('reagent') ||
    normExp.includes('chemical reaction') ||
    normExp.includes('combine');

  const isExplanationValid = normExp.trim().length >= 10 && mentionsReactants;
  const isOverallCorrect = isConditionsCorrect && isExplanationValid;

  let feedback = '';
  if (isOverallCorrect) {
    feedback =
      'Excellent scientific reasoning! You correctly identified that both oxygen and water are essential because they are the necessary chemical reactants for the electrochemical oxidation of iron (4 Fe + 3 O₂ + 6 H₂O → 4 Fe(OH)₃).';
  } else if (!isConditionsCorrect && isExplanationValid) {
    feedback = `You mentioned that reactants are required, but your answer must explicitly identify both Oxygen and Water as the essential conditions. Missing: ${missingConditions.join(', ')}.`;
  } else if (isConditionsCorrect && !isExplanationValid) {
    feedback =
      'You correctly identified Oxygen and Water as the essential conditions! However, please explain in your explanation that they are the chemical reactants in the redox reaction that oxidizes iron.';
  } else {
    feedback =
      'Rusting requires both Oxygen and Water because they act as the chemical reactants needed to oxidize metallic iron. Please revise your answer to specify both conditions and explain their role as reactants.';
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

export function evaluateCollisionTheory(explanation: string): CollisionTheoryEvaluation {
  const norm = explanation.toLowerCase();

  const mentionsKineticEnergy =
    norm.includes('kinetic') ||
    norm.includes('thermal energy') ||
    norm.includes('energy') ||
    norm.includes('speed') ||
    norm.includes('faster') ||
    norm.includes('velocity');

  const mentionsCollisionFrequency =
    norm.includes('frequen') ||
    norm.includes('collide more') ||
    norm.includes('more collision') ||
    norm.includes('rate of collision') ||
    norm.includes('often') ||
    norm.includes('number of collision');

  const mentionsEffectiveCollisions =
    norm.includes('effective') ||
    norm.includes('activation energy') ||
    norm.includes('successful') ||
    norm.includes('exceed') ||
    norm.includes('greater than ea') ||
    norm.includes('ea');

  const hasLength = norm.trim().length >= 15;
  const countKeyPoints =
    (mentionsKineticEnergy ? 1 : 0) +
    (mentionsCollisionFrequency ? 1 : 0) +
    (mentionsEffectiveCollisions ? 1 : 0);

  const isValid = hasLength && countKeyPoints >= 2;

  let feedback = '';
  if (isValid) {
    feedback =
      'Superb explanation using Collision Theory! You clearly connected temperature with particle kinetic energy, increased collision frequency, and a higher proportion of effective collisions possessing energy greater than or equal to the activation energy (Ea).';
  } else {
    feedback =
      'To strengthen your Collision Theory explanation, make sure to explain: (1) Higher temperature gives reactant particles greater average kinetic energy, so they move faster; (2) Particles collide more frequently; (3) A larger fraction of collisions have sufficient energy (≥ activation energy) to result in effective chemical reactions.';
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
  selectedOptionId?: string
): EvidenceValidation {
  if (selectedTrials.length < question.minEvidenceRows) {
    return {
      isValid: false,
      message: `Please select at least ${question.minEvidenceRows} trial rows from the results table as supporting evidence.`,
      comparisonDetails: [],
    };
  }

  const comparisonDetails: string[] = selectedTrials.map(
    (t) =>
      `Trial #${t.trialNumber}: [Temp: ${t.config.temperature}°C, pH: ${t.config.pH}, O₂: ${t.config.oxygen}] → Rust Rate: ${t.results.rustRate} mg/day (${t.results.severity})`
  );

  // Check if student selected an option (for multiple-choice or claim-based questions)
  if (question.questionType !== 'reactants-input' && !selectedOptionId) {
    return {
      isValid: false,
      message: 'Please choose an answer option before submitting your claim.',      comparisonDetails,
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
        message: `Evidence Incomplete: All selected trials produced the exact same rust rate (${minRate} mg/day). To prove which conditions accelerate rusting, select contrasting trials (e.g. 50°C / pH 3 / O₂ Present vs. room temp / neutral / no O₂).`,
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
        message:
          'Evidence Incomplete: To demonstrate that high temperature (50°C), oxygen presence, and acidic pH (pH 3) accelerate rusting, please select at least one trial with these accelerating conditions and compare it against a baseline or slower trial.',
        comparisonDetails,
      };
    }

    return {
      isValid: true,
      message:
        'Valid supporting evidence: Demonstrates that higher temperature, dissolved oxygen, and acidic pH significantly increase the rate of rusting compared to baseline or inhibited conditions.',
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
        message:
          'Evidence Incomplete: All your selected trials have Oxygen "Not Present" (rate: 0.0 mg/day). To prove that oxygen is required for rusting, you must also select at least one trial with Oxygen "Present" to demonstrate active corrosion.',
        comparisonDetails,
      };
    }

    if (!hasAbsent) {
      return {
        isValid: false,
        message:
          'Evidence Incomplete: All your selected trials have Oxygen "Present". To prove that oxygen is an indispensable reactant, you must select at least one trial with Oxygen "Not Present" showing 0.0 mg/day.',
        comparisonDetails,
      };
    }

    // Check if there is a controlled pair (matching temp & pH)
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
      message: controlledPair
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
        message:
          'Invalid Evidence: When oxygen is absent, iron cannot rust at any pH (0.0 mg/day for all). To investigate the effect of pH, you must select trials where Oxygen is "Present".',
        comparisonDetails,
      };
    }

    const uniquePHs = new Set(o2PresentTrials.map((t) => t.config.pH));
    if (uniquePHs.size < 2) {
      const singlePH = Array.from(uniquePHs)[0];
      return {
        isValid: false,
        message: `Evidence Incomplete: All selected trials use the same pH (${singlePH}). To prove the effect of pH, select trials comparing different pH values (e.g. pH 3 vs pH 7 vs pH 12) with Oxygen Present.`,
        comparisonDetails,
      };
    }

    return {
      isValid: true,
      message:
        'Valid controlled evidence: Comparing different pH values with oxygen present shows that acidic pH 3 accelerates corrosion and alkaline pH 12 inhibits it.',
      comparisonDetails,
    };
  }

  // Question 4: Effect of Temperature ('temperature')
  if (question.variableFocus === 'temperature') {
    const o2PresentTrials = selectedTrials.filter((t) => t.config.oxygen === 'Present');

    if (o2PresentTrials.length < 2) {
      return {
        isValid: false,
        message:
          'Invalid Evidence: Without oxygen, iron cannot rust at any temperature (0.0 mg/day). To observe temperature effects, select trials where Oxygen is "Present".',
        comparisonDetails,
      };
    }

    const temps = o2PresentTrials.map((t) => t.config.temperature);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    if (maxTemp - minTemp < 5) {
      return {
        isValid: false,
        message: `Evidence Incomplete: All selected trials are at the same temperature (${minTemp}°C). To evaluate temperature effects, select trials tested at different temperatures (e.g. 25°C vs 50°C) with Oxygen Present.`,
        comparisonDetails,
      };
    }

    return {
      isValid: true,
      message: `Valid controlled evidence: Comparing ${minTemp}°C vs ${maxTemp}°C demonstrates that higher temperature increases molecular collision rate and rust formation speed.`,
      comparisonDetails,
    };
  }

  return {
    isValid: true,
    message: 'Valid supporting evidence selected from your logged experimental trials.',
    comparisonDetails,
  };
}
