import React from 'react';
import { ExperimentConfig, PHValue, OxygenPresence } from '../types';
import { Play, RotateCcw, FlaskConical, Thermometer, Wind, Droplets, Sparkles, HelpCircle } from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface ControlsPanelProps {
  config: ExperimentConfig;
  onChangeConfig: (newConfig: Partial<ExperimentConfig>) => void;
  onRunTrial: () => void;
  isRunning: boolean;
  onOpenTheory: () => void;
  lang?: Language;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  config,
  onChangeConfig,
  onRunTrial,
  isRunning,
  onOpenTheory,
  lang = 'en',
}) => {
  const t = translations[lang];

  return (
    <div
      id="controls-panel"
      className="bg-slate-900/90 rounded-2xl p-6 shadow-xl border border-slate-800 backdrop-blur-sm flex flex-col gap-6"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-cyan-400" />
            {t.controlsHeader}
          </h2>
        </div>
        <button
          id="btn-open-theory"
          onClick={onOpenTheory}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          {t.theoryBtn}
        </button>
      </div>

      <div className="space-y-5">
        {/* 1. Variable: Temperature Buttons (25°C, 35°C, 45°C) */}
        <div id="control-temperature" className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label
              className="text-sm font-semibold text-slate-200 flex items-center gap-2"
            >
              <Thermometer className="w-4 h-4 text-rose-400" />
              {t.tempLabel}
            </label>
            <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-md">
              <span className="text-sm font-bold text-rose-400 font-mono">
                {config.temperature}°C
              </span>
              <span className="text-[11px] text-rose-300/80 font-normal">
                ({config.temperature <= 25 ? t.roomTemp : config.temperature >= 45 ? t.highTemp : t.warmTemp})
              </span>
            </div>
          </div>

          {/* Temperature Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {[25, 35, 45].map((tempVal) => (
              <button
                key={tempVal}
                type="button"
                id={`btn-temp-${tempVal}`}
                disabled={isRunning}
                onClick={() => onChangeConfig({ temperature: tempVal })}
                className={`py-3 px-2.5 text-xs font-mono font-bold rounded-xl border transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                  config.temperature === tempVal
                    ? 'bg-rose-500/25 text-rose-200 border-rose-500/60 shadow-md shadow-rose-500/20 ring-2 ring-rose-500/40 scale-[1.02]'
                    : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-600'
                }`}
              >
                <span className="text-base font-extrabold">{tempVal}°C</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Variable: pH Dropdown (3, 7, 12) */}
        <div id="control-ph" className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="ph-dropdown"
              className="text-sm font-semibold text-slate-200 flex items-center gap-2"
            >
              <Droplets className="w-4 h-4 text-sky-400" />
              {t.phLabel}
            </label>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                config.pH === 3
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : config.pH === 7
                  ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                  : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
              }`}
            >
              pH {config.pH} (
              {config.pH === 3
                ? t.phAcidic
                : config.pH === 7
                ? t.phNeutral
                : t.phAlkaline}
              )
            </span>
          </div>

          <select
            id="ph-dropdown"
            disabled={isRunning}
            value={config.pH}
            onChange={(e) => onChangeConfig({ pH: Number(e.target.value) as PHValue })}
            className="w-full bg-slate-800 text-slate-100 text-sm font-medium border border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value={3}>pH 3 — {t.phAcidic}</option>
            <option value={7}>pH 7 — {t.phNeutral}</option>
            <option value={12}>pH 12 — {t.phAlkaline}</option>
          </select>
          <p className="text-[11px] text-slate-400 italic">
            {config.pH === 3 && t.phAcidicDesc}
            {config.pH === 7 && t.phNeutralDesc}
            {config.pH === 12 && t.phAlkalineDesc}
          </p>
        </div>

        {/* 3. Variable: Dissolved Oxygen */}
        <div id="control-oxygen" className="space-y-2">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Wind className="w-4 h-4 text-cyan-400" />
            {t.oxygenLabel}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              id="btn-oxygen-present"
              disabled={isRunning}
              onClick={() => onChangeConfig({ oxygen: 'Present' })}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                config.oxygen === 'Present'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-100 ring-2 ring-cyan-500/40'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{t.oxygenPresent}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                  O₂ + H₂O
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {t.oxygenPresentDesc}
              </p>
            </button>

            <button
              type="button"
              id="btn-oxygen-not-present"
              disabled={isRunning}
              onClick={() => onChangeConfig({ oxygen: 'Not Present' })}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                config.oxygen === 'Not Present'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-100 ring-2 ring-amber-500/40'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{t.oxygenAbsent}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                  No O₂
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {t.oxygenAbsentDesc}
              </p>
            </button>
          </div>
        </div>

        {/* Action Button: Run Trial */}
        <div className="pt-2">
          <button
            type="button"
            id="btn-run-trial"
            disabled={isRunning}
            onClick={onRunTrial}
            className={`w-full py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer ${
              isRunning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait animate-pulse'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-5 h-5 animate-spin" />
                <span>{t.simulatingBtn}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{t.runTrialBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Presets for Controlled Experiments */}
        <div className="border-t border-slate-800 pt-3">
          <div className="text-[11px] font-semibold text-slate-400 mb-2">
            {t.quickSetupsLabel}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              disabled={isRunning}
              onClick={() => onChangeConfig({ temperature: 25, pH: 7, oxygen: 'Present' })}
              className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors disabled:opacity-50 text-left cursor-pointer"
            >
              {t.presetBaseline}
            </button>
            <button
              type="button"
              disabled={isRunning}
              onClick={() => onChangeConfig({ temperature: 25, pH: 3, oxygen: 'Present' })}
              className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors disabled:opacity-50 text-left cursor-pointer"
            >
              {t.presetAcidRain}
            </button>
            <button
              type="button"
              disabled={isRunning}
              onClick={() => onChangeConfig({ temperature: 25, pH: 7, oxygen: 'Not Present' })}
              className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors disabled:opacity-50 text-left cursor-pointer"
            >
              {t.presetBoiledWater}
            </button>
            <button
              type="button"
              disabled={isRunning}
              onClick={() => onChangeConfig({ temperature: 45, pH: 3, oxygen: 'Present' })}
              className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 transition-colors disabled:opacity-50 text-left cursor-pointer"
            >
              {t.presetAccelerated}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
