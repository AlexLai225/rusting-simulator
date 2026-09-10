export type OxygenPresence = 'Present' | 'Not Present';
export type PHValue = 3 | 7 | 12;

export interface ExperimentConfig {
  temperature: number; // 25 to 45 °C (25, 35, 45 °C)
  pH: PHValue;
  oxygen: OxygenPresence;
}

export interface DependentVariables {
  rustRate: number; // mg / day
  totalRustMass: number; // mg over 7 days
  surfaceCoverage: number; // % (0 to 100)
  timeToInitialRustHours: number; // hours until first visible rust
  severity: 'None' | 'Minimal' | 'Moderate' | 'Heavy' | 'Severe';
  observation: string;
}

export interface TrialResult {
  id: string;
  trialNumber: number;
  timestamp: string;
  config: ExperimentConfig;
  results: DependentVariables;
}

export interface InquiryOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export type QuestionType = 'multiple-choice' | 'reactants-input' | 'claim-with-collision-theory';

export interface InquiryQuestion {
  id: string;
  title: string;
  prompt: string;
  questionType?: QuestionType;
  options?: InquiryOption[];
  variableFocus: 'all' | 'temperature' | 'pH' | 'oxygen';
  minEvidenceRows: number;
}
