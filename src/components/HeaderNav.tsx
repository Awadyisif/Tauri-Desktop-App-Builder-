import React from 'react';
import type { DesktopConfig, Language, ShaderParams, ViewMode } from '../types.ts';
import { translations } from '../translations.ts';
import { createDesktopZip, downloadBlob } from '../utils/zipGenerator.ts';
import { generateGuideHtml } from '../utils/tauriConfig.ts';
import {
  Sparkles,
  Layout,
  Maximize2,
  FileCode,
  Download,
  Languages,
  Package,
} from 'lucide-react';

interface HeaderNavProps {
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
  lang: Language;
  onToggleLang: () => void;
  config: DesktopConfig;
  shaderParams: ShaderParams;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  viewMode,
  onSetViewMode,
  lang,
  onToggleLang,
  config,
  shaderParams,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const handleDownloadHtml = () => {
    const htmlContent = generateGuideHtml(config);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    downloadBlob(blob, 'Nucleus_v40_Desktop_Guide.html');
  };

  const handleDownloadZip = async () => {
    try {
      const zipBlob = await createDesktopZip(config, shaderParams);
      downloadBlob(zipBlob, 'nucleus-desktop-v40.zip');
    } catch (e) {
      console.error('Error bundling zip:', e);
    }
  };

  return (
    <header
      className="h-14 bg-[#0a0a0f] border-b border-[#1f2438] px-4 flex items-center justify-between z-40 select-none"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Brand title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-fuchsia-500 to-pink-500 p-[1.5px] flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-[#0a0a0f] rounded-[7px] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-wide text-white">
              <span className="text-cyan-400">Nucleus</span> v{config.version}
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1f2438] text-gray-300">
              Synthetic Convergence
            </span>
          </div>
          <p className="text-[10px] text-gray-400 hidden md:block">
            {config.author} © 2026 • WebGL + Tauri Desktop App Suite
          </p>
        </div>
      </div>

      {/* View Mode Switcher */}
      <div className="flex items-center bg-[#12121a] p-1 rounded-lg border border-[#1f2438] text-xs font-medium">
        <button
          onClick={() => onSetViewMode('studio')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded transition cursor-pointer ${
            viewMode === 'studio'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
          title={t.studioMode}
        >
          <Layout className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t.studioMode}</span>
        </button>

        <button
          onClick={() => onSetViewMode('visualizer')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded transition cursor-pointer ${
            viewMode === 'visualizer'
              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
          title={t.visualizerMode}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t.visualizerMode}</span>
        </button>

        <button
          onClick={() => onSetViewMode('guide')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded transition cursor-pointer ${
            viewMode === 'guide'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
          title={t.guideMode}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t.guideMode}</span>
        </button>
      </div>

      {/* Right Controls: Quick Download & Language Switch */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleDownloadHtml}
          className="hidden lg:flex items-center gap-1 text-xs px-2.5 py-1.5 rounded bg-[#161622] hover:bg-[#202030] text-cyan-300 border border-cyan-500/30 transition cursor-pointer"
          title={t.downloadHtmlGuide}
        >
          <Download className="w-3.5 h-3.5" />
          <span>HTML</span>
        </button>

        <button
          onClick={handleDownloadZip}
          className="hidden sm:flex items-center gap-1 text-xs px-2.5 py-1.5 rounded bg-[#ff007f] hover:bg-pink-600 text-white font-medium transition cursor-pointer shadow-md"
          title={t.downloadZipBundle}
        >
          <Package className="w-3.5 h-3.5" />
          <span>ZIP</span>
        </button>

        {/* Language switch */}
        <button
          onClick={onToggleLang}
          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-[#12121a] hover:bg-[#1f2438] text-gray-300 border border-[#252538] transition cursor-pointer font-mono"
        >
          <Languages className="w-3.5 h-3.5 text-cyan-400" />
          <span>{lang === 'ar' ? 'EN' : 'العربية'}</span>
        </button>
      </div>
    </header>
  );
};
