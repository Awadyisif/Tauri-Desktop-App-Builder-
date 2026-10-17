import React, { useState, useEffect } from 'react';
import type { Language, PaletteName, Preset, ShaderParams } from '../types.ts';
import { translations } from '../translations.ts';
import {
  ChevronDown,
  ChevronUp,
  Sliders,
  Palette,
  Activity,
  Zap,
} from 'lucide-react';

interface ControlDockProps {
  params: ShaderParams;
  onChangeParams: (updates: Partial<ShaderParams>) => void;
  lang: Language;
}

export const presetsList: Preset[] = [
  {
    id: 'synthetic',
    name: { ar: 'Synthetic Convergence (التقارب التوليدي)', en: 'Synthetic Convergence' },
    desc: {
      ar: 'التوازن النيوني الأيقوني بين أزرق السيان والماجنتا مع تكرارات متوازنة',
      en: 'Flagship cyan-magenta harmonic feedback with balanced folding geometry',
    },
    params: {
      iterations: 7,
      zoom: 1.0,
      warp: 1.0,
      speed: 0.8,
      palette: 'synthetic-cyan',
      feedbackDecay: 0.75,
      glowIntensity: 1.1,
      chromaticAberration: 0.6,
      pulseFreq: 1.2,
    },
  },
  {
    id: 'quantum',
    name: { ar: 'Quantum Lattice (الشبكة الكمومية)', en: 'Quantum Lattice' },
    desc: {
      ar: 'هندسة كوانتوم فائقة الكثافة والحدة بتدرجات الزمرد النيوني والتوهج البصري',
      en: 'High-density quantum matrix with emerald phosphor and refractive optics',
    },
    params: {
      iterations: 10,
      zoom: 1.4,
      warp: 1.6,
      speed: 0.5,
      palette: 'quantum-emerald',
      feedbackDecay: 0.85,
      glowIntensity: 1.3,
      chromaticAberration: 0.9,
      pulseFreq: 0.8,
    },
  },
  {
    id: 'bio',
    name: { ar: 'Bio-Singularity (التفرد الحيوي)', en: 'Bio-Singularity' },
    desc: {
      ar: 'تموجات عضوية حية بتغذية راجعة سريعة وإزاحات لونية ساطعة',
      en: 'Organic bioluminescent feedback waves with chromatic dispersion',
    },
    params: {
      iterations: 8,
      zoom: 1.2,
      warp: 2.2,
      speed: 1.2,
      palette: 'cyber-magenta',
      feedbackDecay: 0.9,
      glowIntensity: 1.4,
      chromaticAberration: 1.2,
      pulseFreq: 1.8,
    },
  },
  {
    id: 'void',
    name: { ar: 'Cybernetic Void (الفراغ السيبراني)', en: 'Cybernetic Void' },
    desc: {
      ar: 'أحادية اللون العميقة مع خطوط تفصيلية فائقة التباين والعمق',
      en: 'Deep obsidian monochrome with ultra-high contrast geometric vectors',
    },
    params: {
      iterations: 6,
      zoom: 0.9,
      warp: 0.6,
      speed: 0.4,
      palette: 'void-monochrome',
      feedbackDecay: 0.6,
      glowIntensity: 0.9,
      chromaticAberration: 0.3,
      pulseFreq: 0.6,
    },
  },
  {
    id: 'solar',
    name: { ar: 'Solar Flare (الوهج الشمسي)', en: 'Solar Flare' },
    desc: {
      ar: 'طاقة نارية ذهبية مع نبضات مكثفة وتراكيب هندسية معقدة',
      en: 'Golden thermionic plasma with intense cyclical bursts and solar harmonics',
    },
    params: {
      iterations: 9,
      zoom: 1.1,
      warp: 1.3,
      speed: 1.0,
      palette: 'solar-gold',
      feedbackDecay: 0.8,
      glowIntensity: 1.25,
      chromaticAberration: 0.7,
      pulseFreq: 1.4,
    },
  },
];

export const ControlDock: React.FC<ControlDockProps> = ({
  params,
  onChangeParams,
  lang,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'params' | 'presets' | 'audio'>('params');

  // Toggle with keyboard shortcut 'H'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'h' || e.key === 'H' || e.key === 'ا') {
        setIsCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const palettes: { id: PaletteName; label: string; color: string }[] = [
    { id: 'synthetic-cyan', label: 'Synthetic Cyan', color: 'from-cyan-500 to-fuchsia-500' },
    { id: 'cyber-magenta', label: 'Cyber Magenta', color: 'from-pink-500 to-purple-600' },
    { id: 'quantum-emerald', label: 'Quantum Emerald', color: 'from-emerald-400 to-teal-700' },
    { id: 'void-monochrome', label: 'Void Monochrome', color: 'from-gray-300 to-gray-800' },
    { id: 'solar-gold', label: 'Solar Gold', color: 'from-amber-400 to-orange-600' },
  ];

  return (
    <div
      className={`fixed bottom-3 left-1/2 -translate-x-1/2 z-30 transition-transform duration-300 ease-out select-none ${
        isCollapsed ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'
      }`}
      style={{ width: 'min(940px, 94vw)' }}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Collapse Toggle Handle */}
      <div className="flex justify-center -mb-px">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-4 py-1 bg-[#12121a] hover:bg-[#1a1a26] text-cyan-400 border-t border-x border-[#1f2438] rounded-t-lg text-xs font-mono transition cursor-pointer shadow-lg"
          title="Toggle Dock (H)"
        >
          {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{isCollapsed ? t.showControls : t.hideControls}</span>
          <span className="text-[10px] text-gray-500 bg-gray-900 px-1 rounded ml-1 border border-gray-800">
            [H]
          </span>
        </button>
      </div>

      {/* Main Dock Container */}
      <div className="bg-[#12121a] border border-[#1f2438] rounded-xl shadow-2xl p-3 backdrop-blur-none text-gray-200">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#1f2438] pb-2 mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('params')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                activeTab === 'params'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{t.shaderControls}</span>
            </button>

            <button
              onClick={() => setActiveTab('presets')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{t.presets}</span>
            </button>

            <button
              onClick={() => setActiveTab('audio')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                activeTab === 'audio'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{t.audioMotion}</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-gray-400 hidden sm:block">
            {t.interactiveHint}
          </div>
        </div>

        {/* Tab 1: Shader Sliders */}
        {activeTab === 'params' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
            {/* Iterations */}
            <div className="space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>{isRtl ? 'التكرار' : 'Iter'}</span>
                <span className="font-mono text-cyan-400">{params.iterations}</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="1"
                value={params.iterations}
                onChange={(e) => onChangeParams({ iterations: parseInt(e.target.value) })}
                className="w-full accent-cyan-400 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Zoom */}
            <div className="space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>{isRtl ? 'العمق' : 'Zoom'}</span>
                <span className="font-mono text-cyan-400">{params.zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="3.5"
                step="0.1"
                value={params.zoom}
                onChange={(e) => onChangeParams({ zoom: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Warp */}
            <div className="space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>{isRtl ? 'الانحناء' : 'Warp'}</span>
                <span className="font-mono text-cyan-400">{params.warp.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={params.warp}
                onChange={(e) => onChangeParams({ warp: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Speed */}
            <div className="space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>{isRtl ? 'السرعة' : 'Speed'}</span>
                <span className="font-mono text-cyan-400">{params.speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.5"
                step="0.1"
                value={params.speed}
                onChange={(e) => onChangeParams({ speed: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Glow */}
            <div className="space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>{isRtl ? 'التوهج' : 'Glow'}</span>
                <span className="font-mono text-cyan-400">{params.glowIntensity.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="2.2"
                step="0.1"
                value={params.glowIntensity}
                onChange={(e) => onChangeParams({ glowIntensity: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Chromatic Aberration */}
            <div className="space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>{isRtl ? 'التشتت' : 'RGB Split'}</span>
                <span className="font-mono text-cyan-400">{params.chromaticAberration.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.1"
                value={params.chromaticAberration}
                onChange={(e) => onChangeParams({ chromaticAberration: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Presets & Palettes */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            {/* Palette Swatches */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-pink-400" />
                {t.palette}:
              </span>
              {palettes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onChangeParams({ palette: p.id })}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition cursor-pointer border ${
                    params.palette === p.id
                      ? 'border-cyan-400 bg-cyan-950/60 text-white'
                      : 'border-transparent text-gray-400 hover:text-white bg-black/40'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${p.color}`} />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Presets List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              {presetsList.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onChangeParams(preset.params)}
                  className="p-2.5 rounded-lg bg-[#0c0c13] hover:bg-[#181824] border border-[#1f2438] hover:border-pink-500/50 text-left transition cursor-pointer flex flex-col justify-between"
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                    <span>{preset.name[lang]}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2">{preset.desc[lang]}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Audio & Motion */}
        {activeTab === 'audio' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-center">
            <div className="flex items-center gap-2 bg-[#0c0c13] p-2.5 rounded border border-[#1f2438]">
              <input
                type="checkbox"
                id="audioActive"
                checked={params.audioActive}
                onChange={(e) => onChangeParams({ audioActive: e.target.checked })}
                className="rounded text-emerald-400 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="audioActive" className="cursor-pointer text-gray-300">
                {t.audioReactivity}
              </label>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>{t.audioPulse}</span>
                <span className="font-mono text-emerald-400">{params.pulseFreq.toFixed(1)} Hz</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={params.pulseFreq}
                onChange={(e) => onChangeParams({ pulseFreq: parseFloat(e.target.value) })}
                className="w-full accent-emerald-400 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>{t.audioIntensity}</span>
                <span className="font-mono text-emerald-400">{(params.audioIntensity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={params.audioIntensity}
                onChange={(e) => onChangeParams({ audioIntensity: parseFloat(e.target.value) })}
                className="w-full accent-emerald-400 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
