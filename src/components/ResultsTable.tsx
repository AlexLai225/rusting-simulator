import React from 'react';
import { TrialResult } from '../types';
import { Table, CheckSquare, Square, Trash2, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface ResultsTableProps {
  trials: TrialResult[];
  selectedTrialIds: string[];
  onToggleSelectTrial: (trialId: string) => void;
  onSelectAllTrials: () => void;
  onClearSelectedTrials: () => void;
  onClearAllTrials: () => void;
  lang?: Language;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  trials,
  selectedTrialIds,
  onToggleSelectTrial,
  onSelectAllTrials,
  onClearSelectedTrials,
  onClearAllTrials,
  lang = 'en',
}) => {
  const t = translations[lang];
  const isZh = lang === 'zh';

  const exportToCSV = () => {
    if (trials.length === 0) return;
    const headers = isZh
      ? [
          '實驗次數',
          '溫度 (°C)',
          '溶液酸鹼度 (pH)',
          '氧氣存在狀態',
          '銹蝕速率 (mg/day)',
          '7天總銹質量 (mg)',
          '初現鐵銹時間 (小時)',
          '銹蝕程度',
          '實驗觀察',
        ]
      : [
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

    const rows = trials.map((tr) => {
      const o2Text = isZh ? (tr.config.oxygen === 'Present' ? '存在' : '不存在') : tr.config.oxygen;
      const obsText = isZh && tr.results.observationZh ? tr.results.observationZh : tr.results.observation;
      const sevText = isZh
        ? tr.results.severity === 'None'
          ? t.severityNone
          : tr.results.severity === 'Minimal'
          ? t.severityMinimal
          : tr.results.severity === 'Moderate'
          ? t.severityModerate
          : tr.results.severity === 'Heavy'
          ? t.severityHeavy
          : t.severitySevere
        : tr.results.severity;

      return [
        tr.trialNumber,
        tr.config.temperature,
        tr.config.pH,
        o2Text,
        tr.results.rustRate,
        tr.results.totalRustMass,
        tr.results.timeToInitialRustHours,
        sevText,
        `"${obsText.replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', isZh ? '鐵銹蝕探究實驗數據.csv' : 'rusting_investigation_trials.csv');
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
              {t.tableHeader}
            </h2>
            <span className="bg-cyan-500/10 text-cyan-400 text-xs font-semibold font-mono px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              {t.trialCountLabel(trials.length)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t.tableSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {trials.length > 0 && (
            <>
              <button
                id="btn-export-csv"
                onClick={exportToCSV}
                className="text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title={t.exportCsv}
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                {t.exportCsv}
              </button>
              <button
                id="btn-clear-trials"
                onClick={onClearAllTrials}
                className="text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                title={t.clearTable}
              >
                <Trash2 className="w-3.5 h-3.5" />
                {t.clearTable}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Evidence Toolbar for Student Selection */}
      {trials.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              {t.evidenceLogged}:
            </span>
            <span className="font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {selectedTrialIds.length} / {trials.length}
            </span>
            {selectedTrialIds.length < 2 && (
              <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" />
                {isZh ? '(需選取至少 2 次實驗以進行對照)' : '(Select ≥ 2 trials for controlled inquiry)'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSelectAllTrials}
              className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-700 transition-colors cursor-pointer"
            >
              {t.selectAll}
            </button>
            <button
              onClick={onClearSelectedTrials}
              className="text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700/60 transition-colors cursor-pointer"
            >
              {t.clearSelection}
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950 text-slate-300 border-b border-slate-800 font-semibold tracking-wider uppercase text-[11px]">
              <th className="py-3 px-3 w-16 text-center">{t.colEvidence}</th>
              <th className="py-3 px-3">{t.colTrial}</th>
              <th className="py-3 px-3">{t.colTime}</th>
              <th className="py-3 px-3">{t.colTemp}</th>
              <th className="py-3 px-3">{t.colPh}</th>
              <th className="py-3 px-3">{t.colOxygen}</th>
              <th className="py-3 px-3">{t.colRate}</th>
              <th className="py-3 px-3">{t.colMass}</th>
              <th className="py-3 px-3">{t.colInitial}</th>
              <th className="py-3 px-3 min-w-[200px]">{t.colState}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {trials.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-10 text-center text-slate-500">
                  <p className="text-sm font-medium">{t.noTrialsYet}</p>
                </td>
              </tr>
            ) : (
              trials.map((trial) => {
                const isSelected = selectedTrialIds.includes(trial.id);
                const obsText = isZh && trial.results.observationZh ? trial.results.observationZh : trial.results.observation;
                const localizedSev = isZh
                  ? trial.results.severity === 'None'
                    ? t.severityNone
                    : trial.results.severity === 'Minimal'
                    ? t.severityMinimal
                    : trial.results.severity === 'Moderate'
                    ? t.severityModerate
                    : trial.results.severity === 'Heavy'
                    ? t.severityHeavy
                    : t.severitySevere
                  : trial.results.severity;

                return (
                  <tr
                    key={trial.id}
                    onClick={() => onToggleSelectTrial(trial.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/30 hover:bg-cyan-950/40 text-slate-100'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    {/* Checkbox for evidence selection */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSelectTrial(trial.id);
                        }}
                        className="text-slate-400 hover:text-cyan-400 cursor-pointer"
                        title={isSelected ? t.selectedBadge : t.selectAsEvidence}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-cyan-400 fill-cyan-950" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                        )}
                      </button>
                    </td>

                    {/* Trial # */}
                    <td className="py-3 px-3 font-mono font-bold text-slate-100">
                      #{trial.trialNumber}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {trial.timestamp}
                    </td>

                    {/* Temperature */}
                    <td className="py-3 px-3 font-mono">
                      <span className="font-semibold text-rose-300">{trial.config.temperature}°C</span>
                    </td>

                    {/* pH */}
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
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
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          trial.config.oxygen === 'Present'
                            ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                            : 'bg-slate-700/60 text-slate-400 border-slate-600'
                        }`}
                      >
                        {trial.config.oxygen === 'Present' ? t.valPresent : t.valAbsent}
                      </span>
                    </td>

                    {/* Rust Rate (mg/day) */}
                    <td className="py-3 px-3 font-mono font-bold">
                      <span
                        className={
                          trial.results.rustRate > 10
                            ? 'text-amber-400'
                            : trial.results.rustRate > 0
                            ? 'text-sky-300'
                            : 'text-slate-500'
                        }
                      >
                        {trial.results.rustRate.toFixed(2)}
                      </span>
                    </td>

                    {/* Total Rust Mass (mg) */}
                    <td className="py-3 px-3 font-mono font-bold text-slate-200">
                      {trial.results.totalRustMass.toFixed(1)} mg
                    </td>

                    {/* Time to initial rust (hrs) */}
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {trial.results.timeToInitialRustHours > 0
                        ? `${trial.results.timeToInitialRustHours}h`
                        : '—'}
                    </td>

                    {/* Observed State */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`font-semibold text-[11px] ${
                            trial.results.severity === 'Severe'
                              ? 'text-rose-400'
                              : trial.results.severity === 'Heavy'
                              ? 'text-amber-400'
                              : trial.results.severity === 'Moderate'
                              ? 'text-sky-400'
                              : trial.results.severity === 'Minimal'
                              ? 'text-slate-300'
                              : 'text-slate-500'
                          }`}
                        >
                          {localizedSev}
                        </span>
                        <span className="text-[11px] text-slate-400 leading-tight line-clamp-2">
                          {obsText}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
