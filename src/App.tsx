import React, { useState, useEffect, useRef } from 'react';
import { ExperimentConfig, TrialResult, DependentVariables } from './types';
import { calculateRustResults } from './utils/rustModel';
import { ApparatusVisualizer } from './components/ApparatusVisualizer';
import { ControlsPanel } from './components/ControlsPanel';
import { ResultsTable } from './components/ResultsTable';
import { InquirySection } from './components/InquirySection';
import { ScientificTheoryModal } from './components/ScientificTheoryModal';
import { FlaskConical, Beaker, HelpCircle, RefreshCw, BarChart2 } from 'lucide-react';

export default function App() {
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
    setSelectedTrialIds(trials.map((t) => t.id));
  };

  const handleClearSelectedTrials = () => {
    setSelectedTrialIds([]);
  };

  const handleClearAllTrials = () => {
    if (trials.length === 0) return;
    if (window.confirm('Are you sure you want to reset all logged experimental trials?')) {
      setTrials([]);
      setSelectedTrialIds([]);
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
                  Rusting Rate Investigation Lab
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  v2.4 SIMULATION
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block">
                Electrochemical redox modeling • Independent variables: Temp, pH, O₂
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="header-theory-btn"
              onClick={() => setIsTheoryOpen(true)}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Scientific Guide</span>
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
          <div className="space-y-1.5 flex-1 w-full">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
                Scientific Investigation Protocol
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Standard 7-Day Iron Nail Incubation
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              How do environmental variables influence the rate of iron rusting?
            </h2>
            <div className="text-xs sm:text-sm text-slate-400 w-full leading-relaxed">
              <span className="text-slate-200 font-semibold">Independent Variables:</span> Temperature (25°C - 50°C), Solution pH (3, 7, 12), Presence of Oxygen (Present / Not Present).<br />
              <span className="text-cyan-300 font-semibold">Designed Dependent Variable:</span> Rate of Rusting (mg/day) & Total Rust Mass Formed (mg).
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Logged Trials</div>
              <div className="text-lg font-bold text-cyan-400 font-mono">{trials.length} Recorded</div>
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
          />
        </section>

        {/* Section 3: Inquiry & Evidence-Based Questioning (After N trials) */}
        <section id="inquiry-container">
          <InquirySection
            trials={trials}
            selectedTrialIds={selectedTrialIds}
            requiredTrialsCount={2}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/60 border-t border-slate-800/80 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Rusting Rate Investigation Simulation • High School Chemistry & Physical Science</span>
          <span className="text-slate-400 font-mono">Iron Corrosion Redox Model: 4 Fe + 3 O₂ + 6 H₂O → 4 Fe(OH)₃</span>
        </div>
      </footer>

      {/* Scientific Theory & Chemistry Modal */}
      <ScientificTheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
      />
    </div>
  );
}
