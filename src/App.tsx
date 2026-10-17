import React, { useState } from 'react';
import type { DesktopConfig, Language, ShaderParams, ViewMode } from './types.ts';
import { defaultDesktopConfig } from './utils/tauriConfig.ts';
import { HeaderNav } from './components/HeaderNav.tsx';
import { FractalCanvas } from './components/FractalCanvas.tsx';
import { DesktopConfigPanel } from './components/DesktopConfigPanel.tsx';
import { ControlDock, presetsList } from './components/ControlDock.tsx';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [viewMode, setViewMode] = useState<ViewMode>('studio');

  const [desktopConfig, setDesktopConfig] = useState<DesktopConfig>(defaultDesktopConfig);

  const [shaderParams, setShaderParams] = useState<ShaderParams>({
    iterations: 7,
    zoom: 1.0,
    warp: 1.0,
    speed: 0.8,
    palette: 'synthetic-cyan',
    feedbackDecay: 0.75,
    glowIntensity: 1.1,
    chromaticAberration: 0.6,
    pulseFreq: 1.2,
    audioActive: false,
    audioIntensity: 0.8,
  });

  const handleUpdateConfig = (updates: Partial<DesktopConfig>) => {
    setDesktopConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleChangeParams = (updates: Partial<ShaderParams>) => {
    setShaderParams((prev) => ({ ...prev, ...updates }));
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  return (
    <div
      className="w-screen h-screen flex flex-col bg-[#07070b] text-gray-200 overflow-hidden font-sans select-none"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Header Bar */}
      <HeaderNav
        viewMode={viewMode}
        onSetViewMode={setViewMode}
        lang={lang}
        onToggleLang={handleToggleLang}
        config={desktopConfig}
        shaderParams={shaderParams}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 relative overflow-hidden flex">
        {/* View Mode: Studio (Split View) */}
        {viewMode === 'studio' && (
          <div className="w-full h-full flex flex-col lg:flex-row overflow-hidden">
            {/* Visualizer Side */}
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#1f2438]">
              <FractalCanvas
                params={shaderParams}
                className="w-full h-full"
                isRtl={lang === 'ar'}
              />
            </div>

            {/* Desktop Configuration & Tauri Files Side */}
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full overflow-y-auto">
              <DesktopConfigPanel
                config={desktopConfig}
                onUpdateConfig={handleUpdateConfig}
                shaderParams={shaderParams}
                lang={lang}
              />
            </div>

            {/* Collapsible Control Dock pinned bottom-center */}
            <ControlDock
              params={shaderParams}
              onChangeParams={handleChangeParams}
              lang={lang}
            />
          </div>
        )}

        {/* View Mode: Fullscreen Visualizer (Zen Mode) */}
        {viewMode === 'visualizer' && (
          <div className="w-full h-full relative overflow-hidden">
            <FractalCanvas
              params={shaderParams}
              className="w-full h-full"
              isRtl={lang === 'ar'}
            />
            {/* Collapsible Control Dock */}
            <ControlDock
              params={shaderParams}
              onChangeParams={handleChangeParams}
              lang={lang}
            />
          </div>
        )}

        {/* View Mode: Desktop Guide & Builder Only */}
        {viewMode === 'guide' && (
          <div className="w-full h-full overflow-y-auto">
            <DesktopConfigPanel
              config={desktopConfig}
              onUpdateConfig={handleUpdateConfig}
              shaderParams={shaderParams}
              lang={lang}
            />
          </div>
        )}
      </main>
    </div>
  );
}
