import React, { useState } from 'react';
import { TrialResult, InquiryQuestion } from '../types';
import { INQUIRY_QUESTIONS, validateEvidence, EvidenceValidation } from '../utils/rustModel';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Sparkles,
  Layers,
  ChevronRight,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface InquirySectionProps {
  trials: TrialResult[];
  selectedTrialIds: string[];
  requiredTrialsCount?: number;
}

export const InquirySection: React.FC<InquirySectionProps> = ({
  trials,
  selectedTrialIds,
  requiredTrialsCount = 3,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [submissionResult, setSubmissionResult] = useState<{
    submitted: boolean;
    isOverallCorrect: boolean;
    claimIsCorrect: boolean;
    evidenceIsValid: boolean;
    explanation: string;
    validation: EvidenceValidation;
  } | null>(null);
  const [overrideUnlock, setOverrideUnlock] = useState(false);

  const question: InquiryQuestion = INQUIRY_QUESTIONS[currentQuestionIndex];
  const selectedTrials = trials.filter((t) => selectedTrialIds.includes(t.id));
  const isUnlocked = trials.length >= requiredTrialsCount || overrideUnlock;

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    if (submissionResult?.submitted) {
      setSubmissionResult(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOptionId) return;

    const validation = validateEvidence(question, selectedTrials, selectedOptionId);
    const chosenOption = question.options.find((opt) => opt.id === selectedOptionId);
    const claimIsCorrect = chosenOption ? chosenOption.isCorrect : false;
    const evidenceIsValid = validation.isValid;
    const isOverallCorrect = claimIsCorrect && evidenceIsValid;

    let explanation = '';
    if (isOverallCorrect) {
      explanation = chosenOption?.explanation || 'Hypothesis successfully validated.';
      import('canvas-confetti')
        .then((module) => {
          const confettiFunc = module.default || module;
          if (typeof confettiFunc === 'function') {
            confettiFunc({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.7 },
            });
          }
        })
        .catch(() => {
          // ignore if confetti fails in sandboxed iframe contexts
        });
    } else if (claimIsCorrect && !evidenceIsValid) {
      explanation =
        'Your scientific claim is accurate! However, scientific method requires your claim to be substantiated with proper controlled experimental trials. Please review the evidence criteria below and select the appropriate trial rows from the Results Table.';
    } else {
      explanation = chosenOption?.explanation || 'The selected claim is scientifically inaccurate.';
    }

    setSubmissionResult({
      submitted: true,
      isOverallCorrect,
      claimIsCorrect,
      evidenceIsValid,
      explanation,
      validation,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < INQUIRY_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId('');
      setSubmissionResult(null);
    }
  };

  return (
    <div
      id="inquiry-section"
      className="bg-slate-900/90 rounded-2xl p-6 shadow-xl border border-slate-800 backdrop-blur-sm flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Scientific Inquiry & Evidence-Based Claims
            </h2>
            <p className="text-xs text-slate-400">
              Formulate scientific conclusions and cite logged trials as supporting evidence
            </p>
          </div>
        </div>

        {/* Question Switcher Tabs */}
        {isUnlocked && (
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl text-xs border border-slate-800 overflow-x-auto">
            {INQUIRY_QUESTIONS.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentQuestionIndex(idx);
                  setSelectedOptionId('');
                  setSubmissionResult(null);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  idx === currentQuestionIndex
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Q{idx + 1}: {q.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Locked / In-Progress State */}
      {!isUnlocked ? (
        <div
          id="inquiry-locked-card"
          className="p-6 rounded-2xl bg-slate-950/60 border border-amber-500/30 flex flex-col items-center text-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="max-w-md">
            <h3 className="font-bold text-slate-100 text-base">
              Conduct {requiredTrialsCount} Trials to Unlock Scientific Analysis
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Scientists need experimental data before forming hypotheses and drawing valid conclusions. Currently, you have logged{' '}
              <span className="font-bold text-amber-400 font-mono">
                {trials.length} of {requiredTrialsCount}
              </span>{' '}
              required trials.
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-xs bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (trials.length / requiredTrialsCount) * 100)}%`,
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOverrideUnlock(true)}
              className="text-xs text-amber-400 hover:text-amber-300 underline font-medium transition-colors"
            >
              (Preview question now without waiting)
            </button>
          </div>
        </div>
      ) : (
        /* Unlocked Inquiry Question Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Prompt */}
          <div
            id="question-prompt-box"
            className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-cyan-400 uppercase">
                Investigation Question {currentQuestionIndex + 1} of {INQUIRY_QUESTIONS.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Requires ≥ {question.minEvidenceRows} Evidence Rows
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              {question.prompt}
            </h3>
          </div>

          {/* Answer Options Radio Group */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
              Select Your Scientific Claim:
            </label>
            <div className="space-y-2">
              {question.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                return (
                  <label
                    key={option.id}
                    id={`option-${option.id}`}
                    onClick={() => handleSelectOption(option.id)}
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400/40 text-slate-100'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <input
                      type="radio"
                      name="inquiry-option"
                      value={option.id}
                      checked={isSelected}
                      onChange={() => handleSelectOption(option.id)}
                      className="mt-0.5 w-4 h-4 text-cyan-500 focus:ring-cyan-400 border-slate-700 bg-slate-900 cursor-pointer"
                    />
                    <span className="text-sm font-medium leading-relaxed">
                      {option.text}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Supporting Evidence Selection Indicator */}
          <div
            id="supporting-evidence-box"
            className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Supporting Evidence Selection
                </span>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                  selectedTrials.length >= question.minEvidenceRows
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}
              >
                {selectedTrials.length} of {question.minEvidenceRows} minimum rows selected
              </span>
            </div>

            {selectedTrials.length === 0 ? (
              <div className="p-3 bg-slate-900 rounded-lg border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Evidence Required:</strong> Please go to the <strong>Results Table</strong> above and check the boxes for the trials that support your claim.
                </span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="text-[11px] text-slate-400 font-medium">
                  Citing data from {selectedTrials.length} experimental trial(s):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedTrials.map((t) => (
                    <div
                      key={t.id}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs flex flex-col gap-0.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-200">
                        <span className="font-mono">Trial #{t.trialNumber}</span>
                        <span className="text-cyan-400 font-semibold font-mono">
                          {t.results.rustRate} mg/day
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {t.config.temperature}°C • pH {t.config.pH} • O₂: {t.config.oxygen}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submission Button */}
          <div className="flex items-center gap-3">
            <button
              id="btn-submit-inquiry"
              type="submit"
              disabled={!selectedOptionId}
              className={`py-3 px-6 rounded-xl font-bold text-sm text-slate-950 flex items-center gap-2 transition-all ${
                !selectedOptionId
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 shadow-lg shadow-cyan-500/20 active:scale-[0.99]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Scientific Claim & Evidence</span>
            </button>

            {currentQuestionIndex < INQUIRY_QUESTIONS.length - 1 && submissionResult?.isOverallCorrect && (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="py-3 px-5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Evaluation / Feedback Report */}
          {submissionResult && submissionResult.submitted && (
            <div
              id="inquiry-feedback-card"
              className={`p-5 rounded-2xl border transition-all ${
                submissionResult.isOverallCorrect
                  ? 'bg-slate-950 border-emerald-500/50 text-emerald-200 shadow-lg shadow-emerald-500/10'
                  : submissionResult.claimIsCorrect && !submissionResult.evidenceIsValid
                  ? 'bg-slate-950 border-amber-500/50 text-amber-200 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950 border-rose-500/50 text-rose-200 shadow-lg shadow-rose-500/10'
              }`}
            >
              <div className="flex items-start gap-3">
                {submissionResult.isOverallCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : submissionResult.claimIsCorrect && !submissionResult.evidenceIsValid ? (
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                )}

                <div className="space-y-3 flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-base text-slate-100">
                        {submissionResult.isOverallCorrect
                          ? 'Hypothesis Confirmed & Supported by Evidence!'
                          : submissionResult.claimIsCorrect && !submissionResult.evidenceIsValid
                          ? 'Scientific Claim is Correct, but Supporting Evidence is Incomplete'
                          : 'Scientific Claim Inaccurate'}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {submissionResult.explanation}
                    </p>
                  </div>

                  {/* CER: Claim - Evidence - Reasoning Breakdown */}
                  <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="font-bold text-cyan-400 uppercase tracking-wider text-[10px]">
                        Scientific CER Evaluation
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span
                          className={`px-2 py-0.5 rounded font-semibold border ${
                            submissionResult.claimIsCorrect
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}
                        >
                          Claim: {submissionResult.claimIsCorrect ? 'Valid' : 'Incorrect'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded font-semibold border ${
                            submissionResult.evidenceIsValid
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          Evidence: {submissionResult.evidenceIsValid ? 'Supported' : 'Insufficient'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <strong className="text-cyan-400 shrink-0">Claim:</strong>
                      <span className="text-slate-200">
                        {question.options.find((o) => o.id === selectedOptionId)?.text}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <strong className="text-cyan-400 shrink-0">Evidence:</strong>
                      <div className="text-slate-200 space-y-1.5 flex-1">
                        {submissionResult.validation.comparisonDetails.length > 0 ? (
                          submissionResult.validation.comparisonDetails.map((detail, idx) => (
                            <div
                              key={idx}
                              className="font-mono text-[11px] bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-300"
                            >
                              {detail}
                            </div>
                          ))
                        ) : (
                          <span className="italic text-rose-400">
                            No trial rows selected as evidence.
                          </span>
                        )}
                        <p
                          className={`text-[11px] font-medium mt-1 ${
                            submissionResult.evidenceIsValid ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {submissionResult.validation.message}
                        </p>
                      </div>
                    </div>

                    {submissionResult.isOverallCorrect && (
                      <div className="flex items-start gap-2 border-t border-slate-800 pt-2">
                        <strong className="text-cyan-400 shrink-0">Reasoning:</strong>
                        <span className="text-slate-300 leading-relaxed">
                          Corrosion of iron is an electrochemical redox process (4 Fe + 3 O₂ + 6 H₂O → 4 Fe(OH)₃). Dissolved oxygen acts as the cathodic electron acceptor. Acidic pH provides abundant H⁺ ions which accelerate electron exchange and prevent protective oxide passivation, while higher temperatures exponentially increase molecular collision frequency and reaction rate via Arrhenius kinetics.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
