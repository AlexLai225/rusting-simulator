import React, { useState } from 'react';
import { TrialResult, InquiryQuestion } from '../types';
import {
  INQUIRY_QUESTIONS,
  validateEvidence,
  EvidenceValidation,
  evaluateReactantsAnswer,
  ReactantsEvaluation,
  evaluateCollisionTheory,
  CollisionTheoryEvaluation,
} from '../utils/rustModel';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Sparkles,
  Layers,
  ChevronRight,
  BookOpen,
  Atom,
  Flame,
} from 'lucide-react';

interface InquirySectionProps {
  trials: TrialResult[];
  selectedTrialIds: string[];
  requiredTrialsCount?: number;
}

export const InquirySection: React.FC<InquirySectionProps> = ({
  trials,
  selectedTrialIds,
  requiredTrialsCount = 2,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [reactantsConditions, setReactantsConditions] = useState<string>('');
  const [reactantsExplanation, setReactantsExplanation] = useState<string>('');
  const [collisionTheoryExplanation, setCollisionTheoryExplanation] = useState<string>('');

  const [submissionResult, setSubmissionResult] = useState<{
    submitted: boolean;
    isOverallCorrect: boolean;
    claimIsCorrect: boolean;
    evidenceIsValid: boolean;
    explanation: string;
    validation: EvidenceValidation;
    reactantsEvaluation?: ReactantsEvaluation;
    collisionEvaluation?: CollisionTheoryEvaluation;
  } | null>(null);

  const [overrideUnlock, setOverrideUnlock] = useState(false);

  const question: InquiryQuestion = INQUIRY_QUESTIONS[currentQuestionIndex];
  const selectedTrials = trials.filter((t) => selectedTrialIds.includes(t.id));
  const isUnlocked = trials.length >= requiredTrialsCount || overrideUnlock;

  const triggerConfetti = () => {
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
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    if (submissionResult?.submitted) {
      setSubmissionResult(null);
    }
  };

  const handleSwitchQuestion = (idx: number) => {
    setCurrentQuestionIndex(idx);
    setSelectedOptionId('');
    setSubmissionResult(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Q3: Essential Conditions & Reactants (Open Response)
    if (question.questionType === 'reactants-input') {
      if (!reactantsConditions.trim() || !reactantsExplanation.trim()) return;

      const reactantsEval = evaluateReactantsAnswer(reactantsConditions, reactantsExplanation);
      const validation = validateEvidence(question, selectedTrials);
      const claimIsCorrect = reactantsEval.isOverallCorrect;
      const evidenceIsValid = validation.isValid;
      const isOverallCorrect = claimIsCorrect && evidenceIsValid;

      if (isOverallCorrect) {
        triggerConfetti();
      }

      setSubmissionResult({
        submitted: true,
        isOverallCorrect,
        claimIsCorrect,
        evidenceIsValid,
        explanation: reactantsEval.feedback,
        validation,
        reactantsEvaluation: reactantsEval,
      });
      return;
    }

    // Q4: Temperature with Collision Theory Explanation
    if (question.questionType === 'claim-with-collision-theory') {
      if (!selectedOptionId || !collisionTheoryExplanation.trim()) return;

      const chosenOption = question.options?.find((opt) => opt.id === selectedOptionId);
      const chosenClaimCorrect = chosenOption ? chosenOption.isCorrect : false;
      const collisionEval = evaluateCollisionTheory(collisionTheoryExplanation);
      const validation = validateEvidence(question, selectedTrials, selectedOptionId);

      const claimIsCorrect = chosenClaimCorrect && collisionEval.isValid;
      const evidenceIsValid = validation.isValid;
      const isOverallCorrect = claimIsCorrect && evidenceIsValid;

      let explanation = '';
      if (!chosenClaimCorrect) {
        explanation = chosenOption?.explanation || 'The chosen temperature claim is inaccurate.';
      } else if (!collisionEval.isValid) {
        explanation = collisionEval.feedback;
      } else if (!evidenceIsValid) {
        explanation =
          'Your claim and collision theory explanation are scientifically accurate! However, scientific method requires your claim to be substantiated with proper experimental trial rows selected from the Results Table.';
      } else {
        explanation = collisionEval.feedback;
        triggerConfetti();
      }

      setSubmissionResult({
        submitted: true,
        isOverallCorrect,
        claimIsCorrect,
        evidenceIsValid,
        explanation,
        validation,
        collisionEvaluation: collisionEval,
      });
      return;
    }

    // Standard Multiple-Choice (Q1 & Q2)
    if (!selectedOptionId) return;

    const validation = validateEvidence(question, selectedTrials, selectedOptionId);
    const chosenOption = question.options?.find((opt) => opt.id === selectedOptionId);
    const claimIsCorrect = chosenOption ? chosenOption.isCorrect : false;
    const evidenceIsValid = validation.isValid;
    const isOverallCorrect = claimIsCorrect && evidenceIsValid;

    let explanation = '';
    if (isOverallCorrect) {
      explanation = chosenOption?.explanation || 'Hypothesis successfully validated.';
      triggerConfetti();
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
      handleSwitchQuestion(currentQuestionIndex + 1);
    }
  };

  const isSubmitDisabled =
    question.questionType === 'reactants-input'
      ? !reactantsConditions.trim() || !reactantsExplanation.trim()
      : question.questionType === 'claim-with-collision-theory'
      ? !selectedOptionId || !collisionTheoryExplanation.trim()
      : !selectedOptionId;

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
                onClick={() => handleSwitchQuestion(idx)}
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

          {/* QUESTION TYPE 1: Reactants & Essential Conditions (Open Written Input) */}
          {question.questionType === 'reactants-input' && (
            <div className="space-y-4 bg-slate-950/60 p-4 sm:p-5 rounded-xl border border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Atom className="w-4 h-4 text-cyan-400" />
                  1. Based on your trials, what are the essential condition(s) required for rusting?
                </label>
                <input
                  type="text"
                  id="input-reactants-conditions"
                  value={reactantsConditions}
                  onChange={(e) => {
                    setReactantsConditions(e.target.value);
                    if (submissionResult?.submitted) setSubmissionResult(null);
                  }}
                  placeholder="e.g., Oxygen and Water"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  2. Explain briefly why these conditions are essential for the rusting reaction:
                </label>
                <p className="text-[11px] text-slate-400 mb-2">
                  Hint: Explain their role as chemical reactants in the redox reaction of rusting.
                </p>
                <textarea
                  id="textarea-reactants-explanation"
                  rows={3}
                  value={reactantsExplanation}
                  onChange={(e) => {
                    setReactantsExplanation(e.target.value);
                    if (submissionResult?.submitted) setSubmissionResult(null);
                  }}
                  placeholder="Explain briefly: why are both conditions necessary? (e.g., explaining that oxygen and water act as the chemical reactants needed to oxidize iron...)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* QUESTION TYPE 2: Temperature Claim + Collision Theory Section */}
          {question.questionType === 'claim-with-collision-theory' && (
            <div className="space-y-4">
              {/* Claim Options Radio Group (no explanations in choices) */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Select Your Scientific Claim:
                </label>
                <div className="space-y-2">
                  {question.options?.map((option) => {
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

              {/* Collision Theory Explanation Section */}
              <div className="space-y-2 bg-slate-950/60 p-4 sm:p-5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-400" />
                    Explain your claim in terms of Collision Theory:
                  </label>
                  <span className="text-[11px] text-rose-300/80 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20 font-semibold">
                    Kinetic Theory
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  In your explanation, refer to: <strong>particle kinetic energy</strong> (speed of particles), <strong>collision frequency</strong> (how often particles collide), and <strong>effective collisions</strong> (proportion of collisions with energy ≥ activation energy).
                </p>
                <textarea
                  id="textarea-collision-theory"
                  rows={3}
                  value={collisionTheoryExplanation}
                  onChange={(e) => {
                    setCollisionTheoryExplanation(e.target.value);
                    if (submissionResult?.submitted) setSubmissionResult(null);
                  }}
                  placeholder="Explain how higher temperature affects reactant particles according to Collision Theory (kinetic energy, collision frequency, and effective collisions exceeding activation energy)..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* QUESTION TYPE 3: Standard Multiple-Choice (Q1 & Q2) */}
          {(!question.questionType || question.questionType === 'multiple-choice') && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Select Your Scientific Claim:
              </label>
              <div className="space-y-2">
                {question.options?.map((option) => {
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
          )}

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
              disabled={isSubmitDisabled}
              className={`py-3 px-6 rounded-xl font-bold text-sm text-slate-950 flex items-center gap-2 transition-all ${
                isSubmitDisabled
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
                          : 'Scientific Explanation Requires Revision'}
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
                          Claim / Explanation: {submissionResult.claimIsCorrect ? 'Valid' : 'Needs Work'}
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

                    {/* Claim Details for Q3 Reactants */}
                    {question.questionType === 'reactants-input' && (
                      <div className="space-y-1.5 text-slate-200">
                        <div className="flex items-start gap-2">
                          <strong className="text-cyan-400 shrink-0">Identified Conditions:</strong>
                          <span>{reactantsConditions || 'None provided'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <strong className="text-cyan-400 shrink-0">Your Explanation:</strong>
                          <span className="italic text-slate-300">{reactantsExplanation}</span>
                        </div>
                        {submissionResult.reactantsEvaluation && (
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[11px] font-semibold text-slate-400">Detected Reactants:</span>
                            {submissionResult.reactantsEvaluation.detectedConditions.map((c) => (
                              <span
                                key={c}
                                className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono"
                              >
                                ✓ {c}
                              </span>
                            ))}
                            {submissionResult.reactantsEvaluation.missingConditions.map((c) => (
                              <span
                                key={c}
                                className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono"
                              >
                                ✗ Missing: {c}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Claim Details for Q4 Collision Theory */}
                    {question.questionType === 'claim-with-collision-theory' && (
                      <div className="space-y-1.5 text-slate-200">
                        <div className="flex items-start gap-2">
                          <strong className="text-cyan-400 shrink-0">Claim:</strong>
                          <span>
                            {question.options?.find((o) => o.id === selectedOptionId)?.text}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <strong className="text-cyan-400 shrink-0">Collision Theory Explanation:</strong>
                          <span className="italic text-slate-300">{collisionTheoryExplanation}</span>
                        </div>
                        {submissionResult.collisionEvaluation && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                            <span className="font-semibold text-slate-400">Kinetic Criteria:</span>
                            <span
                              className={`px-2 py-0.5 rounded border ${
                                submissionResult.collisionEvaluation.mentionsKineticEnergy
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}
                            >
                              {submissionResult.collisionEvaluation.mentionsKineticEnergy ? '✓' : '○'} Particle Kinetic Energy
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded border ${
                                submissionResult.collisionEvaluation.mentionsCollisionFrequency
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}
                            >
                              {submissionResult.collisionEvaluation.mentionsCollisionFrequency ? '✓' : '○'} Collision Frequency
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded border ${
                                submissionResult.collisionEvaluation.mentionsEffectiveCollisions
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}
                            >
                              {submissionResult.collisionEvaluation.mentionsEffectiveCollisions ? '✓' : '○'} Effective Collisions (≥ Ea)
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Claim Details for Q1 & Q2 */}
                    {(!question.questionType || question.questionType === 'multiple-choice') && (
                      <div className="flex items-start gap-2">
                        <strong className="text-cyan-400 shrink-0">Claim:</strong>
                        <span className="text-slate-200">
                          {question.options?.find((o) => o.id === selectedOptionId)?.text}
                        </span>
                      </div>
                    )}

                    {/* Evidence Rows */}
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

                    {/* Scientific Reasoning Model Answer */}
                    {submissionResult.isOverallCorrect && (
                      <div className="border-t border-slate-800 pt-2.5 space-y-1.5">
                        <strong className="text-cyan-400 block">Scientific Model Answer & Reasoning:</strong>
                        {question.id === 'q3_reactants' ? (
                          <p className="text-slate-300 leading-relaxed text-xs">
                            Oxygen and water are the mandatory chemical reactants in the electrochemical rusting redox reaction:
                            <br />
                            <span className="font-mono text-cyan-300 font-semibold inline-block my-1 bg-slate-950 px-2 py-0.5 rounded border border-cyan-500/20">
                              4 Fe (s) + 3 O₂ (aq) + 6 H₂O (l) → 4 Fe(OH)₃ (s) → 2 Fe₂O₃·xH₂O (Rust)
                            </span>
                            <br />
                            Iron is oxidized at anode sites (Fe → Fe²⁺ + 2e⁻), while dissolved oxygen molecules are reduced in water at cathode sites (O₂ + 2H₂O + 4e⁻ → 4OH⁻). If either oxygen or water is absent, electron flow stops and rust cannot form.
                          </p>
                        ) : question.id === 'q4_temp' ? (
                          <p className="text-slate-300 leading-relaxed text-xs">
                            According to <strong>Collision Theory</strong>, reaction rates depend on the frequency of effective collisions possessing energy equal to or greater than the activation energy (Ea):
                            <br />
                            1. Higher temperature increases the average kinetic energy of reactant particles, causing them to move faster.
                            <br />
                            2. Particles collide more frequently per unit time (increased collision frequency).
                            <br />
                            3. An exponentially higher fraction of colliding particles have kinetic energy ≥ activation energy, drastically multiplying the rate of effective chemical collisions and accelerating iron oxidation.
                          </p>
                        ) : (
                          <p className="text-slate-300 leading-relaxed text-xs">
                            Corrosion of iron is an electrochemical redox process. Dissolved oxygen acts as the cathodic electron acceptor. Acidic pH provides abundant H⁺ ions which accelerate electron exchange and prevent protective oxide passivation, while higher temperatures exponentially increase molecular collision frequency and reaction rate via Arrhenius kinetics.
                          </p>
                        )}
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
