import React from 'react';
import { ExperimentConfig, DependentVariables } from '../types';
import { Thermometer, Wind, Droplets, Sparkles, CheckCircle2 } from 'lucide-react';

interface ApparatusVisualizerProps {
  config: ExperimentConfig;
  currentResult: DependentVariables | null;
  isRunning: boolean;
  simulationDay: number;
}

export const ApparatusVisualizer: React.FC<ApparatusVisualizerProps> = ({
  config,
  currentResult,
  isRunning,
  simulationDay,
}) => {
  const { temperature, pH, oxygen } = config;

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
  let liquidLabel = 'Neutral Solution (pH 7.0)';
  let liquidBorder = '#93c5fd';

  if (pH === 3) {
    liquidColor = 'rgba(254, 215, 170, 0.65)'; // pH 3 warm amber
    liquidLabel = 'Dilute Acidic Solution (pH 3.0)';
    liquidBorder = '#fdba74';
  } else if (pH === 12) {
    liquidColor = 'rgba(233, 213, 255, 0.6)'; // pH 12 pale purple
    liquidLabel = 'Alkaline Solution (pH 12.0)';
    liquidBorder = '#d8b4fe';
  }

  // Rust color shades
  const rustColor = '#c2410c'; // rich rust orange-red
  const rustDark = '#7c2d12';

  // Heat glow opacity
  const heatIntensity = (temperature - 25) / 25; // 0 to 1

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
            Laboratory Reaction Chamber
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {isRunning ? (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              Simulating: Day {simulationDay} of 7
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
              7-Day Observation Period
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
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="5" cy="5" r="3" fill="#b45309" opacity="0.85" />
              <circle cx="15" cy="12" r="4" fill="#c2410c" opacity="0.9" />
              <circle cx="10" cy="18" r="2.5" fill="#78350f" opacity="0.8" />
              <rect x="2" y="8" width="6" height="3" rx="1" fill="#ea580c" opacity="0.75" />
              <circle cx="16" cy="4" r="2" fill="#9a3412" opacity="0.85" />
            </pattern>

            {/* Heating coil glow filter */}
            <filter id="heatGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Hotplate / Heating mantle at bottom */}
          <rect
            x="80"
            y="290"
            width="240"
            height="32"
            rx="6"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="2"
          />
          {/* Heating element glow */}
          <line
            x1="100"
            y1="298"
            x2="300"
            y2="298"
            stroke={heatIntensity > 0 ? '#ef4444' : '#475569'}
            strokeWidth={3 + heatIntensity * 3}
            strokeLinecap="round"
            filter={heatIntensity > 0 ? 'url(#heatGlow)' : undefined}
            opacity={0.3 + heatIntensity * 0.7}
            className="transition-all duration-500"
          />
          <text
            x="200"
            y="314"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="10"
            fontFamily="sans-serif"
            fontWeight="bold"
          >
            HEATING STAGE: {temperature}°C
          </text>

          {/* Thermal convection waves if hot */}
          {temperature >= 35 && (
            <g opacity={heatIntensity} className="transition-opacity duration-500">
              <path
                d="M140 285 Q135 270 140 255"
                stroke="#f97316"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="4,4"
                opacity="0.6"
              />
              <path
                d="M200 285 Q195 270 200 255"
                stroke="#f97316"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="4,4"
                opacity="0.8"
              />
              <path
                d="M260 285 Q265 270 260 255"
                stroke="#f97316"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="4,4"
                opacity="0.6"
              />
            </g>
          )}

          {/* 2. Glass Beaker Outer Outline */}
          <path
            d="M 120 70 L 115 70 L 115 80 L 120 80 L 120 270 Q 120 285 135 285 L 265 285 Q 280 285 280 270 L 280 80 L 285 80 L 285 70 L 280 70 Z"
            fill="none"
            stroke="#64748b"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* 3. Liquid inside Beaker */}
          <path
            d="M 122 130 L 122 270 Q 122 283 135 283 L 265 283 Q 278 283 278 270 L 278 130 Z"
            fill={liquidColor}
            className="transition-colors duration-500"
          />
          {/* Liquid meniscus surface line */}
          <ellipse
            cx="200"
            cy="130"
            rx="78"
            ry="6"
            fill={liquidColor}
            stroke={liquidBorder}
            strokeWidth="1.5"
          />

          {/* Graduation lines on beaker */}
          <g stroke="#94a3b8" strokeWidth="1.5" opacity="0.6">
            <line x1="122" y1="160" x2="140" y2="160" />
            <line x1="122" y1="190" x2="135" y2="190" />
            <line x1="122" y1="220" x2="140" y2="220" />
            <line x1="122" y1="250" x2="135" y2="250" />
            <text x="145" y="163" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
              150 mL
            </text>
            <text x="145" y="223" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
              100 mL
            </text>
          </g>

          {/* 4. Oxygen condition visuals */}
          {oxygen === 'Not Present' ? (
            /* Airtight rubber stopper + Floating mineral oil layer */
            <g id="anoxic-layer">
              {/* Stopper at beaker top */}
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
                AIRTIGHT SEAL
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
                Mineral Oil Barrier (No O₂)
              </text>
            </g>
          ) : (
            /* Open to atmosphere + dissolved oxygen bubble stream */
            <g id="aerated-bubbles">
              {/* Open beaker top note */}
              <text
                x="200"
                y="60"
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="9"
                fontFamily="sans-serif"
                fontWeight="600"
              >
                ☁ Dissolved Oxygen (O₂) Present
              </text>
              {/* Bubbles in liquid */}
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
                  opacity={coveragePercent / 100 * 0.85}
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
        </svg>
      </div>

      {/* Real-time Metric Readout Cards */}
      <div className="w-full grid grid-cols-2 gap-3 mt-2 z-10">
        <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700/70 text-center flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Rate of Rusting</span>
          </div>
          <span className="text-xl font-bold text-amber-400">
            {effectiveResult ? effectiveResult.rustRate.toFixed(2) : '0.00'}{' '}
            <span className="text-xs font-normal text-slate-400">mg/day</span>
          </span>
        </div>

        <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700/70 text-center flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span>Rust Mass (7-Day Total)</span>
          </div>
          <span className="text-xl font-bold text-slate-100">
            {currentMass.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-400">mg</span>
          </span>
        </div>
      </div>

      {/* Observation Banner */}
      {effectiveResult && !isRunning && (
        <div className="w-full mt-3 p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-300 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
          <div>
            <strong className="text-slate-100 font-semibold">
              Trial Observation ({effectiveResult.severity} Rust):{' '}
            </strong>
            <span>{effectiveResult.observation}</span>
          </div>
        </div>
      )}
    </div>
  );
};
