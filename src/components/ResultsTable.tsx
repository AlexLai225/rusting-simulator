import React from 'react';
import { TrialResult } from '../types';
import { Table, CheckSquare, Square, Trash2, Download, CheckCircle, AlertCircle } from 'lucide-react';

interface ResultsTableProps {
  trials: TrialResult[];
  selectedTrialIds: string[];
  onToggleSelectTrial: (trialId: string) => void;
  onSelectAllTrials: () => void;
  onClearSelectedTrials: () => void;
  onClearAllTrials: () => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  trials,
  selectedTrialIds,
  onToggleSelectTrial,
  onSelectAllTrials,
  onClearSelectedTrials,
  onClearAllTrials,
}) => {
  const exportToCSV = () => {
    if (trials.length === 0) return;
    const headers = [
      'Trial Number',
      'Temperature (°C)',
      'pH',
      'Oxygen Presence',
      'Rusting Rate (mg/day)',
      'Total Rust Mass (mg)',
      'Time to Initial Rust (hours)',
      'Severity',
      'Observation',
    ];
    const rows = trials.map((t) => [
      t.trialNumber,
      t.config.temperature,
      t.config.pH,
      t.config.oxygen,
      t.results.rustRate,
      t.results.totalRustMass,
      t.results.timeToInitialRustHours,
      t.results.severity,
      `"${t.results.observation.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'rusting_investigation_trials.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id="results-table-card"
      className="bg-slate-900/90 rounded-2xl p-6 shadow-xl border border-slate-800 backdrop-blur-sm flex flex-col gap-4"
    >
      {/* Table Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">
              Experimental Results Log
            </h2>
            <span className="bg-cyan-500/10 text-cyan-400 text-xs font-semibold font-mono px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              {trials.length} {trials.length === 1 ? 'Trial' : 'Trials'} Recorded
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Check rows to select them as <span className="font-semibold text-cyan-400">Supporting Evidence</span> for the scientific inquiry question below.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {trials.length > 0 && (
            <>
              <button
                id="btn-export-csv"
                onClick={exportToCSV}
                className="text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
                title="Download trials as CSV"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                Export CSV
              </button>
              <button
                id="btn-clear-trials"
                onClick={onClearAllTrials}
                className="text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
                title="Reset all recorded trials"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Evidence Selection Status Bar */}
      <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Selected Evidence:</span>
          {selectedTrialIds.length > 0 ? (
            <span className="bg-cyan-500 text-slate-950 font-bold px-2 py-0.5 rounded-md text-[11px] font-mono shadow-xs">
              {selectedTrialIds.length} {selectedTrialIds.length === 1 ? 'Trial' : 'Trials'} Selected
            </span>
          ) : (
            <span className="text-slate-500 italic">No trials selected yet</span>
          )}
        </div>

        {trials.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={onSelectAllTrials}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Select All
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={onClearSelectedTrials}
              className="text-slate-400 hover:text-slate-300 font-medium transition-colors"
            >
              Deselect All
            </button>
          </div>
        )}
      </div>

      {/* Table Content */}
      {trials.length === 0 ? (
        <div
          id="empty-trials-placeholder"
          className="text-center py-12 px-4 border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/40"
        >
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-3 border border-cyan-500/20">
            <Table className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-200 text-sm">No Trials Logged Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Configure your independent variables (Temperature, pH, Oxygen) in the panel above and click <span className="font-semibold text-cyan-400">"Run Trial"</span> to record your first experiment.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table id="table-results" className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-300 font-semibold border-b border-slate-800 select-none">
              <tr>
                <th className="py-3 px-3.5 text-center w-12">Evidence</th>
                <th className="py-3 px-3">Trial #</th>
                <th className="py-3 px-3">Temp (°C)</th>
                <th className="py-3 px-3">pH</th>
                <th className="py-3 px-3">Oxygen (O₂)</th>
                <th className="py-3 px-3 text-cyan-400 font-bold bg-cyan-950/30">
                  Rust Rate (mg/day)
                </th>
                <th className="py-3 px-3">Total Mass (7d)</th>
                <th className="py-3 px-3">Severity / Observation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {trials.map((trial) => {
                const isSelected = selectedTrialIds.includes(trial.id);
                return (
                  <tr
                    key={trial.id}
                    id={`trial-row-${trial.trialNumber}`}
                    onClick={() => onToggleSelectTrial(trial.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 hover:bg-cyan-900/40 font-medium'
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    {/* Checkbox for Evidence Selection */}
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                        )}
                      </div>
                    </td>

                    {/* Trial Number */}
                    <td className="py-3 px-3 font-bold font-mono text-slate-100">
                      #{trial.trialNumber}
                    </td>

                    {/* Temperature */}
                    <td className="py-3 px-3 font-mono">
                      <span className="font-semibold text-rose-400">
                        {trial.config.temperature}°C
                      </span>
                    </td>

                    {/* pH */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          trial.config.pH === 3
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : trial.config.pH === 7
                            ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                            : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                        }`}
                      >
                        pH {trial.config.pH}
                      </span>
                    </td>

                    {/* Oxygen */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          trial.config.oxygen === 'Present'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {trial.config.oxygen}
                      </span>
                    </td>

                    {/* Dependent: Rust Rate (mg/day) */}
                    <td className="py-3 px-3 font-bold font-mono text-cyan-300 bg-cyan-950/30">
                      {trial.results.rustRate.toFixed(2)}{' '}
                      <span className="text-[10px] font-normal text-slate-400 font-sans">
                        mg/d
                      </span>
                    </td>

                    {/* Dependent: Total Rust Mass */}
                    <td className="py-3 px-3 font-semibold font-mono text-slate-100">
                      {trial.results.totalRustMass.toFixed(1)} mg
                    </td>

                    {/* Severity Badge & Brief Observation */}
                    <td className="py-3 px-3 max-w-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            trial.results.severity === 'Severe'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : trial.results.severity === 'Heavy'
                              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                              : trial.results.severity === 'Moderate'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : trial.results.severity === 'Minimal'
                              ? 'bg-slate-800 text-slate-300 border border-slate-700'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {trial.results.severity}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate" title={trial.results.observation}>
                          {trial.results.observation}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
