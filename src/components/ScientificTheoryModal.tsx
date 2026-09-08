import React from 'react';
import { X, BookOpen, Atom, Flame, ShieldAlert, Sparkles } from 'lucide-react';

interface ScientificTheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScientificTheoryModal: React.FC<ScientificTheoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div
        id="theory-modal-card"
        className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-100"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Chemistry of Rusting & Scientific Investigation
              </h3>
              <p className="text-xs text-slate-400">
                Electrochemical mechanisms, variables, and kinetic principles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Overall Redox Reaction */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
            <h4 className="font-bold text-cyan-300 flex items-center gap-1.5 mb-1.5">
              <Atom className="w-4 h-4 text-cyan-400" />
              The Overall Electrochemical Reaction
            </h4>
            <div className="font-mono text-xs bg-slate-950 p-2.5 rounded-lg border border-cyan-500/20 text-cyan-300 font-semibold text-center my-2">
              4 Fe (s) + 3 O₂ (aq) + 6 H₂O (l) ➔ 4 Fe(OH)₃ (s) ➔ 2 Fe₂O₃·xH₂O (Rust)
            </div>
            <p className="text-xs text-slate-300">
              Rusting is a redox reaction where metallic iron is oxidized to iron(II) and iron(III) ions, and dissolved oxygen gas acts as the essential oxidizing agent.
            </p>
          </div>

          {/* Variables Breakdown */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-100 text-sm">
              Scientific Investigation Variables:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Independent 1: Temperature */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="font-bold text-rose-400 flex items-center gap-1.5 text-xs">
                  <Flame className="w-3.5 h-3.5" />
                  Independent: Temperature (25°C, 35°C, 45°C)
                </div>
                <p className="text-xs text-slate-400">
                  Higher thermal kinetic energy increases molecular collision frequency and reaction rate (Arrhenius relation: k = A·e^(-Ea/RT)).
                </p>
              </div>

              {/* Independent 2: pH */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="font-bold text-sky-400 flex items-center gap-1.5 text-xs">
                  <Atom className="w-3.5 h-3.5" />
                  Independent: Solution pH (3, 7, 12)
                </div>
                <p className="text-xs text-slate-400">
                  <strong className="text-amber-300">pH 3 (Acidic):</strong> Excess H⁺ ions accelerate electron transfer.<br />
                  <strong className="text-purple-300">pH 12 (Alkaline):</strong> High OH⁻ causes passivation with a protective Fe(OH)₂ layer.
                </p>
              </div>

              {/* Independent 3: Oxygen */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Independent: Oxygen (Present / Not)
                </div>
                <p className="text-xs text-slate-400">
                  Dissolved O₂ is the mandatory cathodic electron acceptor (O₂ + 2H₂O + 4e⁻ → 4OH⁻). Without it, iron cannot rust.
                </p>
              </div>

              {/* Dependent Variable */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="font-bold text-cyan-400 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  Dependent: Rate of Rusting (mg/day)
                </div>
                <p className="text-xs text-slate-400">
                  The primary quantitative metric measuring how much mass of iron is oxidized per day over a standardized 7-day trial period.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20"
          >
            Close Scientific Guide
          </button>
        </div>
      </div>
    </div>
  );
};
