import React from 'react';
import { ExperimentConfig, PHValue, OxygenPresence } from '../types';
import { Play, RotateCcw, FlaskConical, Thermometer, Wind, Droplets, Sparkles, HelpCircle } from 'lucide-react';

interface ControlsPanelProps {
  config: ExperimentConfig;
  onChangeConfig: (newConfig: Partial<ExperimentConfig>) => void;
  onRunTrial: () => void;
  isRunning: boolean;
  onOpenTheory: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  config,
  onChangeConfig,
  onRunTrial,
  isRunning,
  onOpenTheory,
}) => {
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
            Independent Variables Setup
          </h2>
        </div>
        <button
          id="btn-open-theory"
          onClick={onOpenTheory}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Theory & Chemistry
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
              1. Temperature (°C)
            </label>
            <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-md">
              <span className="text-sm font-bold text-rose-400 font-mono">
                {config.temperature}°C
              </span>
              <span className="text-[11px] text-rose-300/80 font-normal">
                ({config.temperature <= 25 ? 'Room Temp' : config.temperature >= 45 ? 'High Temp' : 'Warm'})
              </span>
            </div>
          </div>

          {/* Temperature Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {[25, 35, 45].map((t) => (
              <button
                key={t}
                type="button"
                id={`btn-temp-${t}`}
                disabled={isRunning}
                onClick={() => onChangeConfig({ temperature: t })}
                className={`py-3 px-2.5 text-xs font-mono font-bold rounded-xl border transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                  config.temperature === t
                    ? 'bg-rose-500/25 text-rose-200 border-rose-500/60 shadow-md shadow-rose-500/20 ring-2 ring-rose-500/40 scale-[1.02]'
                    : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-600'
                }`}
              >
                <span className="text-base font-extrabold">{t}°C</span>
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
              2. Solution pH
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
              {config.pH === 3
                ? 'Acidic (pH 3)'
                : config.pH === 7
                ? 'Neutral (pH 7)'
                : 'Alkaline (pH 12)'}
            </span>
          </div>

          <select
            id="ph-dropdown"
            value={config.pH}
            disabled={isRunning}
            onChange={(e) =>
              onChangeConfig({ pH: Number(e.target.value) as PHValue })
            }
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all cursor-pointer"
          >
            <option value="3" className="bg-slate-900 text-slate-100">pH 3 (Acidic Solution - High [H⁺])</option>
            <option value="7" className="bg-slate-900 text-slate-100">pH 7 (Neutral Distilled Water - [H⁺] = [OH⁻])</option>
            <option value="12" className="bg-slate-900 text-slate-100">pH 12 (Alkaline / Basic Solution - High [OH⁻])</option>
          </select>
        </div>

        {/* 3. Variable: Presence of Oxygen Dropdown (Present or Not Present) */}
        <div id="control-oxygen" className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="oxygen-dropdown"
              className="text-sm font-semibold text-slate-200 flex items-center gap-2"
            >
              <Wind className="w-4 h-4 text-emerald-400" />
              3. Presence of Oxygen (O₂)
            </label>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                config.oxygen === 'Present'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {config.oxygen === 'Present' ? 'O₂ Present' : 'O₂ Absent / Sealed'}
            </span>
          </div>

          <select
            id="oxygen-dropdown"
            value={config.oxygen}
            disabled={isRunning}
            onChange={(e) =>
              onChangeConfig({ oxygen: e.target.value as OxygenPresence })
            }
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all cursor-pointer"
          >
            <option value="Present" className="bg-slate-900 text-slate-100">Present (Dissolved Atmospheric Oxygen)</option>
            <option value="Not Present" className="bg-slate-900 text-slate-100">
              Not Present (Boiled Deoxygenated Liquid + Mineral Oil Seal)
            </option>
          </select>
        </div>
      </div>

      {/* Run Trial Button */}
      <div className="pt-2">
        <button
          id="btn-run-trial"
          type="button"
          disabled={isRunning}
          onClick={onRunTrial}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 flex items-center justify-center gap-2.5 transition-all text-base ${
            isRunning
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 shadow-lg shadow-cyan-500/20 active:scale-[0.99]'
          }`}
        >
          {isRunning ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-slate-300">Simulating Reaction (7 Days)...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-slate-950" />
              <span>Run Trial & Log Result</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
