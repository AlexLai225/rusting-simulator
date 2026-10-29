import React from 'react';
import { ExperimentConfig, DependentVariables } from '../types';
import { Thermometer, Wind, Droplets, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface ApparatusVisualizerProps {
  config: ExperimentConfig;
  currentResult: DependentVariables | null;
  isRunning: boolean;
  simulationDay: number;
  lang?: Language;
}

export const ApparatusVisualizer: React.FC<ApparatusVisualizerProps> = ({
  config,
  currentResult,
  isRunning,
  simulationDay,
  lang = 'en',
}) => {
  const { temperature, pH, oxygen } = config;
  const t = translations[lang];
  const isZh = lang === 'zh';

  // Visual calculations
  const effectiveResult = currentResult;
  const coveragePercent = effectiveResult
    ? isRunning
      ? Math.min(100, Math.round((effectiveResult.surfaceCoverage * simulationDay) / 7))
      : effectiveResult.surfaceCoverage
    : 0;

  const currentMass = effectiveResult
    ? isRunning
      ? Math.round(((effectiveResult.totalRustMass * simulationDay) / 7) * 10) / 10
      : effectiveResult.totalRustMass
    : 0;

  // Liquid color based on pH
  let liquidColor = 'rgba(219, 234, 254, 0.55)'; // pH 7 pale blue
  let liquidLabel = t.liquidNeutral;
  let liquidBorder = '#93c5fd';

  if (pH === 3) {
    liquidColor = 'rgba(254, 215, 170, 0.65)'; // pH 3 warm amber
    liquidLabel = t.liquidAcidic;
    liquidBorder = '#fdba74';
  } else if (pH === 12) {
    liquidColor = 'rgba(233, 213, 255, 0.6)'; // pH 12 pale purple
    liquidLabel = t.liquidAlkaline;
    liquidBorder = '#d8b4fe';
  }

  // Rust color shades
  const rustColor = '#c2410c';
  const rustDark = '#7c2d12';

  // Heat glow opacity
  const heatIntensity = (temperature - 25) / 20; // 0 to 1

  const localizedSeverity = effectiveResult
    ? isZh
      ? effectiveResult.severity === 'None'
        ? t.severityNone
        : effectiveResult.severity === 'Minimal'
        ? t.severityMinimal
        : effectiveResult.severity === 'Moderate'
        ? t.severityModerate
        : effectiveResult.severity === 'Heavy'
        ? t.severityHeavy
        : t.severitySevere
      : effectiveResult.severity
    : '';

  return (
    <div
      id="apparatus-container"
      className="relative flex flex-col items-center bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-xl border border-slate-800 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at 50% 85%, rgba(239, 68, 68, ${
            heatIntensity * 0.25
          }), transparent 70%)`,
        }}
      />

      {/* Header status bar */}
      <div className="w-full flex items-center justify-between z-10 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="font-semibold text-sm tracking-wide text-slate-200 uppercase">
            {t.reactionChamberTitle}
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {isRunning ? (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              {t.simulatingDayOf(simulationDay)}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
              {t.observationPeriod}
            </span>
          )}
        </div>
      </div>

      {/* Main SVG/Visual Setup */}
      <div className="relative w-full max-w-[420px] h-[340px] flex items-center justify-center my-2 select-none">
        <svg
          viewBox="0 0 400 340"
          className="w-full h-full drop-shadow-2xl overflow-visible"
        >
          <defs>
            {/* Glass gradient */}
            <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="15%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="85%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
            </linearGradient>

            {/* Steel nail gradient */}
            <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="35%" stopColor="#cbd5e1" />
              <stop offset="65%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            {/* Rust texture pattern */}
            <pattern
              id="rustPattern"
              x="0"
              y="0"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <rect width="10" height="10" fill="transparent" />
              <circle cx="2" cy="2" r="1.5" fill="#9a3412" opacity="0.9" />
              <circle cx="7" cy="6" r="1.8" fill="#7c2d12" opacity="0.95" />
              <circle cx="4" cy="8" r="1.2" fill="#c2410c" opacity="0.85" />
            </pattern>
          </defs>

          {/* 1. Heating Element Base (Heat stage) */}
          <g id="heating-element" transform="translate(100, 290)">
            <rect
              x="0"
              y="0"
              width="200"
              height="18"
              rx="6"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="1.5"
            />
            {/* Heating coil slots glowing with temperature */}
            <line
              x1="25"
              y1="9"
              x2="175"
              y2="9"
              stroke={temperature > 30 ? '#ef4444' : '#475569'}
              strokeWidth="4"
              strokeDasharray="6,4"
              strokeLinecap="round"
              className="transition-colors duration-500"
            />
            {temperature > 30 && (
              <text
                x="100"
                y="-4"
                textAnchor="middle"
                fill="#f87171"
                fontSize="8"
                fontWeight="bold"
                fontFamily="sans-serif"
                className="animate-pulse"
              >
                {isZh ? '🔥 恆溫加熱底座' : '🔥 THERMAL HEATING STAGE'}
              </text>
            )}
          </g>

          {/* 2. Glass Beaker (250 mL Pyrex beaker) */}
          <g id="glass-beaker">
            {/* Beaker lip and spout */}
            <path
              d="M 115 110 L 122 110 L 122 270 Q 122 282 134 282 L 266 282 Q 278 282 278 270 L 278 110 L 285 110"
              fill="none"
              stroke="#64748b"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Beaker glass background fill */}
            <path
              d="M 122 110 L 122 270 Q 122 282 134 282 L 266 282 Q 278 282 278 270 L 278 110 Z"
              fill="url(#glassGrad)"
              opacity="0.25"
            />

            {/* Volume graduation lines */}
            <line x1="124" y1="150" x2="140" y2="150" stroke="#94a3b8" strokeWidth="1" strokeOpacity="0.7" />
            <text x="145" y="153" fill="#94a3b8" fontSize="8" fontFamily="monospace">200ml</text>
            <line x1="124" y1="185" x2="135" y2="185" stroke="#94a3b8" strokeWidth="1" strokeOpacity="0.5" />
            <line x1="124" y1="215" x2="140" y2="215" stroke="#94a3b8" strokeWidth="1" strokeOpacity="0.7" />
            <text x="145" y="218" fill="#94a3b8" fontSize="8" fontFamily="monospace">100ml</text>
          </g>

          {/* 3. Aqueous Solution Fill */}
          <g id="aqueous-solution">
            <path
              d="M 124 135 L 124 270 Q 124 280 134 280 L 266 280 Q 276 280 276 270 L 276 135 Z"
              fill={liquidColor}
              className="transition-colors duration-700"
            />
            {/* Meniscus surface line */}
            <ellipse
              cx="200"
              cy="135"
              rx="76"
              ry="5"
              fill={liquidBorder}
              fillOpacity="0.4"
              stroke={liquidBorder}
              strokeWidth="1.5"
            />
          </g>

          {/* 4. Oxygen Environment Setup */}
          {oxygen === 'Not Present' ? (
            /* Boiled + Sealed de-aerated water with oil barrier */
            <g id="deoxygenated-barrier">
              {/* Rubber stopper seal */}
              <polygon
                points="115,70 285,70 270,95 130,95"
                fill="#1e293b"
                stroke="#0f172a"
                strokeWidth="2"
              />
              <rect x="180" y="55" width="40" height="15" rx="3" fill="#334155" />
              <text
                x="200"
                y="85"
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="9"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {isZh ? '密閉氣密膠塞' : 'AIRTIGHT SEAL'}
              </text>

              {/* Floating mineral oil barrier */}
              <rect
                x="122"
                y="124"
                width="156"
                height="12"
                fill="#eab308"
                opacity="0.8"
              />
              <text
                x="200"
                y="133"
                textAnchor="middle"
                fill="#713f12"
                fontSize="8"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {isZh ? '礦物油隔絕層 (阻隔空氣與氧氣)' : 'Mineral Oil Barrier (No O₂)'}
              </text>
            </g>
          ) : (
            /* Bubbles in liquid */
            <g id="aerated-bubbles-liquid">
              <circle cx="160" cy="210" r="3.5" fill="#bae6fd" opacity="0.75" />
              <circle cx="155" cy="180" r="2.5" fill="#bae6fd" opacity="0.6" />
              <circle cx="240" cy="230" r="3" fill="#bae6fd" opacity="0.7" />
              <circle cx="245" cy="195" r="4" fill="#bae6fd" opacity="0.65" />
              <circle cx="180" cy="250" r="2" fill="#bae6fd" opacity="0.7" />
              <circle cx="215" cy="160" r="3" fill="#bae6fd" opacity="0.8" />
            </g>
          )}

          {/* 5. Submerged Iron Nail */}
          <g id="iron-nail" transform="translate(200, 205) rotate(18)">
            {/* Nail head */}
            <rect
              x="-24"
              y="-75"
              width="48"
              height="10"
              rx="2"
              fill="url(#steelGrad)"
              stroke="#475569"
              strokeWidth="1"
            />
            {/* Nail shaft */}
            <polygon
              points="-9,-65 9,-65 6,70 0,85 -6,70"
              fill="url(#steelGrad)"
              stroke="#475569"
              strokeWidth="1"
            />

            {/* Dynamic Rust Coating on Nail */}
            {coveragePercent > 0 && (
              <g id="rust-layer" opacity={Math.min(1, coveragePercent / 80 + 0.2)}>
                {/* Base rust wash */}
                <polygon
                  points="-9,-65 9,-65 6,70 0,85 -6,70"
                  fill={rustColor}
                  opacity={(coveragePercent / 100) * 0.85}
                />
                {/* Textured rust spots */}
                <polygon
                  points="-9,-65 9,-65 6,70 0,85 -6,70"
                  fill="url(#rustPattern)"
                  opacity={coveragePercent / 100}
                />
                {/* Dark corrosion patches for heavy rust */}
                {coveragePercent >= 40 && (
                  <>
                    <ellipse cx="-2" cy="-10" rx="5" ry="12" fill={rustDark} opacity="0.8" />
                    <ellipse cx="2" cy="30" rx="4" ry="15" fill={rustDark} opacity="0.75" />
                    <circle cx="0" cy="65" r="4" fill={rustDark} opacity="0.9" />
                  </>
                )}
              </g>
            )}
          </g>

          {/* 6. Flaked Rust Sediment at beaker bottom */}
          {coveragePercent > 30 && (
            <g id="rust-sediment">
              <ellipse
                cx="200"
                cy="278"
                rx={Math.min(70, 30 + coveragePercent * 0.45)}
                ry="5"
                fill={rustDark}
                opacity={Math.min(0.9, coveragePercent / 100)}
              />
              <circle cx="175" cy="275" r="2.5" fill="#ea580c" opacity="0.8" />
              <circle cx="190" cy="277" r="3" fill="#c2410c" opacity="0.9" />
              <circle cx="215" cy="276" r="2" fill="#78350f" opacity="0.85" />
              <circle cx="230" cy="275" r="2.5" fill="#ea580c" opacity="0.8" />
            </g>
          )}

          {/* 7. Glass Beaker Highlights & Reflections */}
          <path
            d="M 124 135 L 124 268 Q 124 280 135 280 L 145 280"
            stroke="#ffffff"
            strokeWidth="2.5"
            fill="none"
            opacity="0.35"
          />
          <path
            d="M 276 135 L 276 268 Q 276 280 265 280"
            stroke="#38bdf8"
            strokeWidth="1.5"
            fill="none"
            opacity="0.3"
          />

          {/* 8. Digital Thermometer inserted into beaker */}
          <g id="thermometer-probe" transform="translate(145, 50)">
            <rect x="0" y="0" width="8" height="150" rx="4" fill="#e2e8f0" stroke="#94a3b8" />
            <rect
              x="2"
              y="50"
              width="4"
              height="96"
              rx="2"
              fill="#ef4444"
              className="transition-all duration-300"
            />
            {/* Top digital display head */}
            <rect x="-12" y="-18" width="32" height="20" rx="4" fill="#0f172a" stroke="#475569" />
            <text
              x="4"
              y="-4"
              textAnchor="middle"
              fill="#38bdf8"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {temperature}°C
            </text>
          </g>

          {/* 9. Foreground Oxygen Label */}
          {oxygen === 'Present' && (
            <g id="aerated-bubbles">
              <rect
                x="95"
                y="12"
                width="210"
                height="20"
                rx="10"
                fill="#090d16"
                fillOpacity="0.94"
                stroke="#0284c7"
                strokeWidth="1.2"
                strokeOpacity="0.8"
              />
              <text
                x="200"
                y="25.5"
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="9"
                fontFamily="sans-serif"
                fontWeight="700"
              >
                ☁ {t.oxygenPresentBadge}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Real-time Metric Readout Cards */}
      <div className="w-full grid grid-cols-2 gap-3 mt-2 z-10">
        <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700/70 text-center flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t.rustRateLabel}</span>
          </div>
          <span className="text-xl font-bold text-amber-400">
            {effectiveResult ? effectiveResult.rustRate.toFixed(2) : '0.00'}{' '}
            <span className="text-xs font-normal text-slate-400">{t.mgPerDayUnit}</span>
          </span>
        </div>

        <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700/70 text-center flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span>{t.rustMassLabel}</span>
          </div>
          <span className="text-xl font-bold text-slate-100">
            {currentMass.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-400">{t.mgUnit}</span>
          </span>
        </div>
      </div>

      {/* Observation Banner */}
      {effectiveResult && !isRunning && (
        <div className="w-full mt-3 p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-300 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
          <div>
            <strong className="text-slate-100 font-semibold">
              {isZh ? `實驗觀察 (${localizedSeverity})：` : `Trial Observation (${localizedSeverity} Rust): `}
            </strong>
            <span className="text-amber-300 font-medium leading-relaxed">
              {isZh && effectiveResult.observationZh ? effectiveResult.observationZh : effectiveResult.observation}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
