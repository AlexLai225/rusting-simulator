import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Atom,
  Flame,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface ScientificTheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

type TabType = 'mechanism' | 'factors';

export const ScientificTheoryModal: React.FC<ScientificTheoryModalProps> = ({
  isOpen,
  onClose,
  lang = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('mechanism');
  const t = translations[lang];
  const isZh = lang === 'zh';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div
        id="theory-modal-card"
        className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-100"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                {t.theoryModalTitle}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t.theoryModalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label={t.closeGuide}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 pt-2 gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('mechanism')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'mechanism'
                ? 'border-cyan-400 text-cyan-300 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            {t.tabMechanism}
          </button>
          <button
            onClick={() => setActiveTab('factors')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'factors'
                ? 'border-cyan-400 text-cyan-300 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            {t.tabFactors}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed flex-1">
          {/* TAB 1: Mechanism of Rusting */}
          {activeTab === 'mechanism' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Definition Banner */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {isZh ? '課文重點：銹蝕的概念與必要條件' : 'Key Concept: Rusting & Essential Conditions'}
                </div>
                <p className="text-xs text-slate-300">
                  {isZh ? (
                    <>
                      <strong>金屬的腐蝕</strong>是指金屬與環境中的氧、水或其他物質反應，導致金屬逐漸受破壞。金屬腐蝕時，金屬表面的金屬原子會失去電子並轉化為金屬離子。
                    </>
                  ) : (
                    <>
                      <strong>Corrosion of metals</strong> refers to the reaction of metals with oxygen, water, or other substances in the environment, leading to the gradual deterioration of metals. When a metal corrodes, metal atoms at the surface lose electrons to become metal ions.
                    </>
                  )}
                </p>
                <p className="text-xs text-slate-300">
                  {isZh ? (
                    <>
                      <strong>鐵的腐蝕</strong>稱為<strong>銹蝕</strong>或生銹。
                    </>
                  ) : (
                    <>
                      <strong>Rusting</strong> refers specifically to the corrosion of <strong>iron</strong>.
                    </>
                  )}
                </p>
                <div className="mt-2 text-xs p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-200">
                  {isZh ? (
                    <>
                      <strong>銹蝕的必要條件：</strong>要使銹蝕發生，<strong>空氣 (氧)</strong> 和 <strong>水</strong> 必須同時存在。若欠缺其中一者 (例如使用無水氯化鈣乾燥劑除去濕氣，或把水煮沸並加油層防止空氣溶解)，則不會發生銹蝕。
                    </>
                  ) : (
                    <>
                      <strong>Essential Conditions:</strong> For rusting to occur, both <strong>air (oxygen)</strong> and <strong>water</strong> are needed. If either component is absent (e.g. anhydrous CaCl₂ removing moisture, or boiled distilled water under an oil layer), iron will not rust.
                    </>
                  )}
                </div>
              </div>

              {/* Step-by-Step Chemical Reactions */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  <Atom className="w-4 h-4 text-cyan-400" />
                  {isZh ? '鐵銹蝕時發生了甚麼？(化學反應歷程)' : 'What Happens When Iron Rusts? (Reaction Sequence)'}
                </h4>

                <div className="space-y-2 text-xs">
                  {/* Step 1 */}
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <span className="font-bold text-amber-300 mr-1.5">{isZh ? '步驟 1:' : '1.'}</span>
                      <span>
                        {isZh
                          ? '鐵銹蝕時，金屬表面有些鐵原子失去電子，生成鐵(II) 離子：'
                          : 'Some iron atoms on the metal surface lose electrons to form iron(II) ions:'}
                      </span>
                    </div>
                    <code className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 whitespace-nowrap">
                      Fe(s) ➔ Fe²⁺(aq) + 2e⁻
                    </code>
                  </div>

                  {/* Step 2 */}
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <span className="font-bold text-blue-300 mr-1.5">{isZh ? '步驟 2:' : '2.'}</span>
                      <span>
                        {isZh
                          ? '溶於水中的氧和水接收電子，生成氫氧離子：'
                          : 'The dissolved oxygen and water accept the electrons to form hydroxide ions:'}
                      </span>
                    </div>
                    <code className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 whitespace-nowrap">
                      O₂(g) + 2H₂O(l) + 4e⁻ ➔ 4OH⁻(aq)
                    </code>
                  </div>

                  {/* Step 3 */}
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <span className="font-bold text-emerald-300 mr-1.5">{isZh ? '步驟 3:' : '3.'}</span>
                      <span>
                        {isZh
                          ? '所生成的 Fe²⁺(aq) 離子和 OH⁻(aq) 離子在水膜結合，生成氫氧化鐵(II)：'
                          : 'The Fe²⁺(aq) and OH⁻(aq) ions formed combine in the water film, forming iron(II) hydroxide:'}
                      </span>
                    </div>
                    <code className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 whitespace-nowrap">
                      Fe²⁺(aq) + 2OH⁻(aq) ➔ Fe(OH)₂(s)
                    </code>
                  </div>

                  {/* Step 4 */}
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <span className="font-bold text-purple-300 mr-1.5">{isZh ? '步驟 4:' : '4.'}</span>
                      <span>
                        {isZh
                          ? '氫氧化鐵(II) 進一步與溶於水中的氧和水反應，生成氫氧化鐵(III)：'
                          : 'Iron(II) hydroxide further reacts with dissolved oxygen and water, forming iron(III) hydroxide:'}
                      </span>
                    </div>
                    <code className="font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 whitespace-nowrap">
                      4Fe(OH)₂(s) + O₂(g) + 2H₂O(l) ➔ 4Fe(OH)₃(s)
                    </code>
                  </div>

                  {/* Step 5 */}
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <span className="font-bold text-rose-300 mr-1.5">{isZh ? '步驟 5:' : '5.'}</span>
                      <span>
                        {isZh
                          ? '氫氧化鐵(III) 轉化成鐵銹 (一種紅棕色固體，即水合氧化鐵(III))：'
                          : 'Iron(III) hydroxide changes to rust, a reddish brown solid (hydrated iron(III) oxide):'}
                      </span>
                    </div>
                    <code className="font-mono text-rose-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 whitespace-nowrap">
                      Fe(OH)₃ ➔ Fe₂O₃·nH₂O(s)
                    </code>
                  </div>
                </div>

                {/* Overall Equation */}
                <div className="mt-3 p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-center space-y-1.5">
                  <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                    {isZh ? '鐵銹蝕的總反應方程式' : 'Overall Equation for Rusting of Iron'}
                  </div>
                  <div className="font-mono text-sm sm:text-base font-bold text-cyan-200">
                    4Fe(s) + 3O₂(g) + 2nH₂O(l) ➔ 2Fe₂O₃·nH₂O(s)
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isZh
                      ? '鐵銹其實是水合氧化鐵(III) (Fe₂O₃·nH₂O(s))，為紅棕色固體。在不同的條件下，鐵銹中水的量會不同，因此 n 是一個可變值。'
                      : 'Rust is hydrated iron(III) oxide (Fe₂O₃·nH₂O), a reddish brown solid. The amount of water in rust varies with conditions; hence, n is a variable number.'}
                  </p>
                </div>
              </div>

              {/* Physical Nature of Rust */}
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 space-y-1">
                <strong className="text-amber-300 block">
                  {isZh ? '鐵銹的結構與持續腐蝕特性：' : 'Structure & Continuous Deterioration:'}
                </strong>
                <p>
                  {isZh
                    ? '銹蝕時所生成的鐵銹只是鬆散地附在鐵的表面，這鐵銹很容易從鐵表面剝落。鐵銹剝落後，未銹蝕的鐵表面便再次暴露於空氣中，並與氧和水反應。因此，銹蝕會持續進行，直至鐵片完全腐蝕為止。'
                    : 'The rust formed is only loosely attached to the iron surface and falls off easily. When the fresh iron surface is re-exposed to air, it reacts again with oxygen and water. Thus, rusting continues until the iron piece corrodes completely.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Factors that Speed Up Rusting */}
          {activeTab === 'factors' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {isZh ? '加速銹蝕的因素' : 'Factors that Speed Up Rusting'}
                </div>
                <p className="text-xs text-slate-300">
                  {isZh
                    ? '根據香港中學文憑考試化學科課程，加速鐵銹蝕的因素包括以下五項：'
                    : 'According to the HKDSE Chemistry curriculum, five key factors accelerate the rate of rusting:'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* 1. High Temperature */}
                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                  <div className="font-bold text-rose-300 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-400" />
                    {isZh ? '1. 高溫 (實驗設定: 25°C, 35°C, 45°C)' : '1. High Temperature (Simulator: 25°C, 35°C, 45°C)'}
                  </div>
                  <p className="text-slate-300">
                    {isZh
                      ? '化學反應 (包括銹蝕) 的速率在升高溫度下必定增加。升高溫度提高反應物粒子的平均動能，粒子互相碰撞的頻率增加，且具備大於或等於活化能 (E ≥ Ea) 的有效碰撞比例顯著提升。例如汽車行駛時排氣管溫度很高，故汽車排氣管很容易銹蝕。'
                      : 'An increase in temperature always increases the rate of chemical reactions, including rusting. Particles have higher kinetic energy, leading to a greater collision frequency and a larger proportion of collisions exceeding the activation energy. For example, car exhaust pipes rust easily because they are hot when cars are running.'}
                  </p>
                </div>

                {/* 2. Presence of Acidic Substances */}
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Atom className="w-4 h-4 text-amber-400" />
                    {isZh ? '2. 酸性物質的存在 (實驗設定: pH 3, 7, 12)' : '2. Presence of Acidic Substances (Simulator: pH 3 vs 7 vs 12)'}
                  </div>
                  <p className="text-slate-300">
                    {isZh ? (
                      <>
                        酸能加快 Fe²⁺(aq) 的生成：
                        <code className="font-mono bg-slate-950 px-1 py-0.5 rounded text-amber-300 mx-1">
                          Fe(s) + 2H⁺(aq) ➔ Fe²⁺(aq) + H₂(g)
                        </code>
                        因此酸能加快鐵的銹蝕。在空氣污染嚴重的工業區，二氧化硫和氮氧化物溶於雨水生成酸雨，大幅加速銹蝕。相反，鹼性環境 (pH 12) 會在表面形成不溶性鈍化膜，顯著抑制銹蝕。
                      </>
                    ) : (
                      <>
                        Acids speed up the rusting of iron because they speed up the formation of Fe²⁺(aq):{' '}
                        <code className="font-mono bg-slate-950 px-1 py-0.5 rounded text-amber-300">
                          Fe(s) + 2H⁺(aq) ➔ Fe²⁺(aq) + H₂(g)
                        </code>
                        . In industrial areas, sulphur dioxide and nitrogen oxides dissolve in rainwater to produce acids, which accelerate rusting.
                      </>
                    )}
                  </p>
                </div>

                {/* 3. Presence of Soluble Ionic Compounds */}
                <div className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-500/30 space-y-1.5">
                  <div className="font-bold text-sky-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    {isZh ? '3. 水溶性離子化合物的存在 (例如 NaCl)' : '3. Presence of Soluble Ionic Compounds (e.g. NaCl)'}
                  </div>
                  <p className="text-slate-300">
                    {isZh
                      ? '水溶性離子化合物 (例如氯化鈉) 的存在亦能加快鐵的銹蝕，原因是溶於水中的離子的存在能大幅提升溶液的導電性，使生成離子與電子轉移的過程加快。近海邊的鐵製品銹蝕得較快，原因是表面水膜含有氯化鈉。'
                      : 'Soluble ionic compounds (such as sodium chloride) speed up the rusting of iron. The presence of dissolved ions greatly increases the electrical conductivity of the solution, speeding up the formation and migration of ions. Iron objects near the seashore rust much faster due to airborne salt spray.'}
                  </p>
                </div>

                {/* 4. Attachment of Less Reactive Metals */}
                <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1.5">
                  <div className="font-bold text-purple-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-purple-400" />
                    {isZh ? '4. 與活性較鐵為低的金屬連接' : '4. Attachment of Less Reactive Metals to Iron'}
                  </div>
                  <p className="text-slate-300">
                    {isZh
                      ? '把鐵與在活性序位置較低的金屬 (例如錫或銅) 連接時，鐵較容易失去電子，因此鐵銹蝕得較快。(相反，把鐵與活性較高的金屬如鋅或鎂連接時，可透過犧牲性保護防止銹蝕。)'
                      : 'When iron is attached to a metal lower in the reactivity series (such as tin or copper), rusting becomes faster. This is because the less reactive metal causes iron to lose electrons more readily. (Conversely, connecting to a more reactive metal like zinc or magnesium protects iron).'}
                  </p>
                </div>

                {/* 5. Scratched, Bent, or Sharp Area */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 sm:col-span-2 space-y-1">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    {isZh ? '5. 鐵製品受磨損、彎曲或尖銳的位置' : '5. Scratched, Bent, or Sharp Area of an Iron Object'}
                  </div>
                  <p className="text-slate-400">
                    {isZh
                      ? '受磨損或彎曲的鐵表面和鐵製品的尖銳位置都銹蝕得較快。以鐵釘為例，它的兩端較尖銳，這些位置較易積聚電荷，加速在這些位置 Fe²⁺(aq) 的生成，令銹蝕加快。'
                      : 'Rusting becomes faster where the iron surface is scratched or bent. Furthermore, rusting occurs faster at the sharp area of an iron object (e.g. the head and tip of an iron nail) because electric charge accumulates easily at sharp areas, speeding up the formation of Fe²⁺(aq).'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400">
            {t.sourceAttribution}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            {t.closeGuide}
          </button>
        </div>
      </div>
    </div>
  );
};
