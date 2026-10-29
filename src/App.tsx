import React, { useState, useEffect, useRef } from 'react';
import { ExperimentConfig, TrialResult, DependentVariables } from './types';
import { calculateRustResults } from './utils/rustModel';
import { ApparatusVisualizer } from './components/ApparatusVisualizer';
import { ControlsPanel } from './components/ControlsPanel';
import { ResultsTable } from './components/ResultsTable';
import { InquirySection } from './components/InquirySection';
import { ScientificTheoryModal } from './components/ScientificTheoryModal';
import { FlaskConical, HelpCircle, Globe } from 'lucide-react';
import { Language, translations } from './utils/translations';

export default function App() {
  // Language state (defaults to Traditional Chinese as requested by user, with toggle to English)
  const [lang, setLang] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('preferred_lang') as Language;
      return stored === 'en' || stored === 'zh' ? stored : 'zh';
    } catch {
      return 'zh';
    }
  });

  const t = translations[lang];

  // State for experimental configuration (Independent variables)
  const [config, setConfig] = useState<ExperimentConfig>({
    temperature: 25,
    pH: 7,
    oxygen: 'Present',
  });

  // Current visual result on apparatus
  const [currentResult, setCurrentResult] = useState<DependentVariables | null>(() =>
    calculateRustResults({ temperature: 25, pH: 7, oxygen: 'Present' })
  );

  // List of recorded trials (previous rows remain visible)
  const [trials, setTrials] = useState<TrialResult[]>([]);

  // Selected trial IDs for supporting evidence in inquiry
  const [selectedTrialIds, setSelectedTrialIds] = useState<string[]>([]);

  // Simulation execution animation state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simulationDay, setSimulationDay] = useState<number>(7);

  // Theory modal state
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);

  // Animation interval reference
  const timerRef = useRef<number | null>(null);

  // Update visual apparatus when config changes (if not running)
  const handleChangeConfig = (newConfig: Partial<ExperimentConfig>) => {
    if (isRunning) return;
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    setCurrentResult(calculateRustResults(updated));
  };

  // Run experimental trial
  const handleRunTrial = () => {
    if (isRunning) return;

    setIsRunning(true);
    setSimulationDay(1);

    const calculated = calculateRustResults(config);
    setCurrentResult(calculated);

    let currentDay = 1;
    timerRef.current = window.setInterval(() => {
      currentDay += 1;
      setSimulationDay(currentDay);

      if (currentDay >= 7) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRunning(false);

        // Append new trial to results table
        const newTrial: TrialResult = {
          id: `trial-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          trialNumber: trials.length + 1,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          config: { ...config },
          results: calculated,
        };

        setTrials((prev) => {
          const nextTrials = [...prev, newTrial];
          // Auto-select latest trial for evidence convenience if fewer than 2 selected
          setSelectedTrialIds((currSelected) => {
            if (currSelected.length < 2) {
              return [...currSelected, newTrial.id];
            }
            return currSelected;
          });
          return nextTrials;
        });
      }
    }, 180);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Selection toggle for evidence
  const handleToggleSelectTrial = (trialId: string) => {
    setSelectedTrialIds((prev) =>
      prev.includes(trialId)
        ? prev.filter((id) => id !== trialId)
        : [...prev, trialId]
    );
  };

  const handleSelectAllTrials = () => {
    setSelectedTrialIds(trials.map((tr) => tr.id));
  };

  const handleClearSelectedTrials = () => {
    setSelectedTrialIds([]);
  };

  const handleClearAllTrials = () => {
    if (trials.length === 0) return;
    if (window.confirm(t.confirmReset)) {
      setTrials([]);
      setSelectedTrialIds([]);
    }
  };

  const toggleLanguage = () => {
    const nextLang: Language = lang === 'en' ? 'zh' : 'en';
    setLang(nextLang);
    try {
      localStorage.setItem('preferred_lang', nextLang);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))]" />

      {/* Top Navigation Header */}
      <header className="relative bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-cyan-500/20">
              <FlaskConical className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-100 leading-tight tracking-tight">
                  {t.appTitle}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {t.versionBadge}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Switcher Interconversion Button */}
            <button
              id="header-lang-btn"
              type="button"
              onClick={toggleLanguage}
              className="text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title={lang === 'en' ? '切換至繁體中文版' : 'Switch to English Version'}
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>{t.switchLangText}</span>
            </button>

            {/* Scientific Guide Button */}
            <button
              id="header-theory-btn"
              type="button"
              onClick={() => setIsTheoryOpen(true)}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{t.scientificGuide}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Research Context & Variables Overview Banner */}
        <section
          id="investigation-overview-card"
          className="w-full bg-slate-900/90 rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="space-y-2 flex-1 w-full">
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              {t.overviewTitle}
            </h2>
            <div className="text-xs sm:text-sm text-slate-400 w-full leading-relaxed">
              <span className="text-slate-200 font-semibold">{t.independentVarsLabel}</span> {t.independentVarsDesc}<br />
              <span className="text-cyan-300 font-semibold">{t.dependentVarLabel}</span> {t.dependentVarDesc}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">{t.loggedTrials}</div>
              <div className="text-lg font-bold text-cyan-400 font-mono">{trials.length} {t.trialsRecorded}</div>
            </div>
          </div>
        </section>

        {/* Section 1: Laboratory Apparatus & Independent Variables Control */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Visual Laboratory Apparatus (5 cols) */}
          <div className="lg:col-span-6 xl:col-span-5">
            <ApparatusVisualizer
              config={config}
              currentResult={currentResult}
              isRunning={isRunning}
              simulationDay={simulationDay}
              lang={lang}
            />
          </div>

          {/* Right Column: Independent Variables Setup Panel (7 cols) */}
          <div className="lg:col-span-6 xl:col-span-7">
            <ControlsPanel
              config={config}
              onChangeConfig={handleChangeConfig}
              onRunTrial={handleRunTrial}
              isRunning={isRunning}
              onOpenTheory={() => setIsTheoryOpen(true)}
              lang={lang}
            />
          </div>
        </section>

        {/* Section 2: Results Table (Logs all trials, previous rows remain visible) */}
        <section id="results-section">
          <ResultsTable
            trials={trials}
            selectedTrialIds={selectedTrialIds}
            onToggleSelectTrial={handleToggleSelectTrial}
            onSelectAllTrials={handleSelectAllTrials}
            onClearSelectedTrials={handleClearSelectedTrials}
            onClearAllTrials={handleClearAllTrials}
            lang={lang}
          />
        </section>

        {/* Section 3: Inquiry & Evidence-Based Questioning (After N trials) */}
        <section id="inquiry-container">
          <InquirySection
            trials={trials}
            selectedTrialIds={selectedTrialIds}
            requiredTrialsCount={2}
            lang={lang}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/60 border-t border-slate-800/80 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{t.footerTitle}</span>
          <span className="text-slate-400 font-mono">{t.footerEquation}</span>
        </div>
      </footer>

      {/* Scientific Theory & Chemistry Modal */}
      <ScientificTheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
        lang={lang}
      />
    </div>
  );
}
