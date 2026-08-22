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
        'No rust formed. The iron nail preserved its polished metallic luster. Dissolved oxygen is an essential reactant for the electrochemical oxidation of iron.',
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
    observation = 'No rust observed.';
  } else if (totalMass < 10) {
    severity = 'Minimal';
    observation =
      'Very faint superficial speckles of iron oxide. High alkalinity (pH 12) passivated the metal surface with a protective oxide/hydroxide layer, strongly suppressing oxidation.';
  } else if (totalMass < 45) {
    severity = 'Moderate';
    observation =
      'Noticeable uniform orange-brown rust coating along the nail shaft. Standard atmospheric oxidation occurred with dissolved oxygen.';
  } else if (totalMass < 90) {
    severity = 'Heavy';
    observation =
      'Dense reddish-brown rust layer with noticeable flaking sediment settling at the bottom. Elevated temperature boosted reaction kinetics.';
  } else {
    severity = 'Severe';
    observation =
      'Extensive dark reddish-brown corrosion crust with heavy flaky precipitates and cloudiness. Combination of acidic environment (pH 3) and high thermal energy (temperature) dramatically accelerated iron oxidation.';
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
    id: 'q2_oxygen',
    title: 'Requirement of Reactants',
    prompt: 'Based on your trials, what role does oxygen play in the rusting process of iron?',
    minEvidenceRows: 2,
    variableFocus: 'oxygen',
    options: [
      {
        id: 'opt_o2_1',
        text: 'Oxygen only slows down rusting by forming an airtight oxide barrier.',
        isCorrect: false,
        explanation:
          'Incorrect. Oxygen is the electron acceptor needed to convert Fe to Fe(OH)3 and hydrated iron(III) oxide (rust).',
      },
      {
        id: 'opt_o2_2',
        text: 'Oxygen is an essential reactant; without it, the rate of rusting is virtually zero.',
        isCorrect: true,
        explanation:
          'Correct! Comparing trials where oxygen is Present vs Not Present (with other variables held constant) shows 0.0 mg/day rust formed in the absence of oxygen.',
      },
      {
        id: 'opt_o2_3',
        text: 'Oxygen has no measurable effect if the temperature is high.',
        isCorrect: false,
        explanation:
          'Incorrect. Even at high temperatures, if dissolved oxygen is absent, iron cannot rust.',
      },
    ],
  },
  {
    id: 'q3_ph',
    title: 'Effect of Solution pH',
    prompt: 'How does solution pH influence the corrosion rate of iron when oxygen is present?',
    minEvidenceRows: 2,
    variableFocus: 'pH',
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
    id: 'q4_temp',
    title: 'Effect of Temperature',
    prompt: 'When oxygen is present and pH is constant, what is the effect of increasing temperature?',
    minEvidenceRows: 2,
    variableFocus: 'temperature',
    options: [
      {
        id: 'opt_t_1',
        text: 'Higher temperature significantly increases the rate of rusting due to increased kinetic collision rate.',
        isCorrect: true,
        explanation:
          'Correct! By holding pH and oxygen constant and raising temperature, the rate of rust formation increases significantly according to Arrhenius reaction kinetics.',
      },
      {
        id: 'opt_t_2',
        text: 'Higher temperature halts rusting completely because heat destroys iron atoms.',
        isCorrect: false,
        explanation:
          'Incorrect. Heat does not destroy iron atoms; it increases molecular kinetic energy and reaction rate.',
      },
      {
        id: 'opt_t_3',
        text: 'Temperature has no observable effect on chemical reaction speed.',
        isCorrect: false,
        explanation:
          'Incorrect. All chemical reaction rates, including redox corrosion, increase with thermal energy.',
      },
    ],
  },
];

export interface EvidenceValidation {
  isValid: boolean;
  message: string;
  comparisonDetails: string[];
}

export function validateEvidence(
  question: InquiryQuestion,
  selectedTrials: TrialResult[],
  selectedOptionId: string
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

  // Check if student selected an option
  if (!selectedOptionId) {
    return {
      isValid: false,
      message: 'Please choose an answer option before submitting your claim.',
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
