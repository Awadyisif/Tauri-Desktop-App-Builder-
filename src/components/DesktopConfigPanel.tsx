import React, { useState } from 'react';
import type { DesktopConfig, Language, ShaderParams } from '../types.ts';
import { translations } from '../translations.ts';
import {
  generateTauriConfig,
  generateCargoToml,
  generatePackageJson,
  generateMainRs,
  generateGuideHtml,
  generateStandaloneHtml,
} from '../utils/tauriConfig.ts';
import { createDesktopZip, downloadBlob } from '../utils/zipGenerator.ts';
import {
  Download,
  Copy,
  Check,
  FileCode,
  FolderTree,
  Sliders,
  Terminal,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';

interface DesktopConfigPanelProps {
  config: DesktopConfig;
  onUpdateConfig: (updated: Partial<DesktopConfig>) => void;
  shaderParams: ShaderParams;
  lang: Language;
}

type TabType = 'tauri' | 'package' | 'cargo' | 'main' | 'html' | 'commands' | 'settings';

export const DesktopConfigPanel: React.FC<DesktopConfigPanelProps> = ({
  config,
  onUpdateConfig,
  shaderParams,
  lang,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';
  const [activeTab, setActiveTab] = useState<TabType>('tauri');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const tauriJson = generateTauriConfig(config);
  const cargoToml = generateCargoToml(config);
  const packageJson = generatePackageJson(config);
  const mainRs = generateMainRs();
  const indexHtml = generateStandaloneHtml(config, shaderParams);

  const getCurrentFileContent = (): string => {
    switch (activeTab) {
      case 'tauri':
        return tauriJson;
      case 'package':
        return packageJson;
      case 'cargo':
        return cargoToml;
      case 'main':
        return mainRs;
      case 'html':
        return indexHtml;
      default:
        return '';
    }
  };

  const handleCopyCurrent = () => {
    const content = getCurrentFileContent();
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Download self HTML guide matching prompt
  const handleDownloadGuideHtml = () => {
    const htmlContent = generateGuideHtml(config);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    downloadBlob(blob, 'Nucleus_v40_Desktop_Guide.html');
  };

  // Download complete Tauri desktop package zip
  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zipBlob = await createDesktopZip(config, shaderParams);
      downloadBlob(zipBlob, 'nucleus-desktop-v40.zip');
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div
      className="h-full flex flex-col bg-[#0f0f17] border-l border-[#1f2438] text-gray-200 overflow-y-auto"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Top Banner & Quick Actions */}
      <div className="p-4 border-b border-[#1f2438] bg-[#12121a] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <h2 className="text-base font-bold text-white tracking-wide">
              {config.productName} v{config.version}
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              Tauri v1.5 + Rust
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 max-w-xl line-clamp-1">{t.guideIntro}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadGuideHtml}
            id="downloadSelf"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-cyan-400 text-black hover:bg-cyan-300 rounded shadow transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.downloadHtmlGuide}</span>
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#ff007f] text-white hover:bg-pink-600 disabled:opacity-50 rounded shadow transition cursor-pointer"
          >
            <Package className="w-3.5 h-3.5" />
            <span>{isZipping ? t.generating : t.downloadZipBundle}</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-1 px-4 pt-3 border-b border-[#1f2438] bg-[#0c0c13] overflow-x-auto text-xs font-mono">
        <button
          onClick={() => setActiveTab('tauri')}
          className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'tauri'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>tauri.conf.json</span>
        </button>

        <button
          onClick={() => setActiveTab('package')}
          className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'package'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>package.json</span>
        </button>

        <button
          onClick={() => setActiveTab('cargo')}
          className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'cargo'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Cargo.toml</span>
        </button>

        <button
          onClick={() => setActiveTab('main')}
          className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'main'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>main.rs</span>
        </button>

        <button
          onClick={() => setActiveTab('html')}
          className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'html'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>src/index.html</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'settings'
              ? 'border-pink-500 text-pink-300 bg-pink-950/30'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{t.configSettings}</span>
        </button>

        <button
          onClick={() => setActiveTab('commands')}
          className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'commands'
              ? 'border-pink-500 text-pink-300 bg-pink-950/30'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>{t.runCommands}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex-1">
        {/* Project Tree Overview */}
        <div className="mb-4 bg-[#12121a] border border-[#1f2438] rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
            <FolderTree className="w-4 h-4" />
            <span>{t.filesOverview}</span>
          </div>
          <pre
            className="text-xs font-mono text-cyan-300 bg-[#08080c] p-2.5 rounded border border-[#252538] overflow-x-auto"
            dir="ltr"
          >
{`nucleus-desktop/
├── package.json
├── src/
│   └── index.html       (ملف الواجهة والشيدر)
└── src-tauri/
    ├── tauri.conf.json  (إعدادات النافذة والتطبيق)
    ├── Cargo.toml       (اعتمادات النظام الخلفي Rust)
    └── src/
        └── main.rs      (نقطة بداية التطبيق)`}
          </pre>
        </div>

        {/* Code Views */}
        {['tauri', 'package', 'cargo', 'main', 'html'].includes(activeTab) && (
          <div className="bg-[#12121a] border border-[#1f2438] rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-[#1a1a26] border-b border-[#252538] flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-gray-200" dir="ltr">
                {activeTab === 'tauri' && 'src-tauri/tauri.conf.json'}
                {activeTab === 'package' && 'package.json'}
                {activeTab === 'cargo' && 'src-tauri/Cargo.toml'}
                {activeTab === 'main' && 'src-tauri/src/main.rs'}
                {activeTab === 'html' && 'src/index.html (Desktop Standalone Bundle)'}
              </span>

              <button
                onClick={handleCopyCurrent}
                className="flex items-center gap-1 text-xs font-mono px-2 py-1 bg-[#252538] hover:bg-[#32324a] text-cyan-300 rounded transition cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? t.copiedToClipboard : t.copyCode}</span>
              </button>
            </div>

            <pre
              className="p-4 bg-[#08080c] text-[#00ffcc] font-mono text-xs overflow-x-auto max-h-[480px] leading-relaxed selection:bg-cyan-900 selection:text-white"
              dir="ltr"
            >
              {getCurrentFileContent()}
            </pre>
          </div>
        )}

        {/* Interactive Desktop Configuration Editor */}
        {activeTab === 'settings' && (
          <div className="bg-[#12121a] border border-[#1f2438] rounded-lg p-4 space-y-4">
            <div className="border-b border-[#252538] pb-2">
              <h3 className="text-sm font-bold text-pink-400">{t.configSettings}</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {isRtl
                  ? 'قم بتخصيص إعدادات نافذة التطبيق والحزمة لتوليد ملفات tauri.conf.json تلقائياً'
                  : 'Customize native window and Tauri bundle properties with real-time sync'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">{t.productName}</label>
                <input
                  type="text"
                  value={config.productName}
                  onChange={(e) => onUpdateConfig({ productName: e.target.value })}
                  className="w-full bg-[#08080c] border border-[#252538] rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">{t.version}</label>
                <input
                  type="text"
                  value={config.version}
                  onChange={(e) => onUpdateConfig({ version: e.target.value })}
                  className="w-full bg-[#08080c] border border-[#252538] rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">{t.appIdentifier}</label>
                <input
                  type="text"
                  value={config.identifier}
                  onChange={(e) => onUpdateConfig({ identifier: e.target.value })}
                  className="w-full bg-[#08080c] border border-[#252538] rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">{t.authorName}</label>
                <input
                  type="text"
                  value={config.author}
                  onChange={(e) =>
                    onUpdateConfig({ author: e.target.value, copyright: `${e.target.value} © 2026` })
                  }
                  className="w-full bg-[#08080c] border border-[#252538] rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">{t.windowWidth}</label>
                <input
                  type="number"
                  value={config.width}
                  onChange={(e) => onUpdateConfig({ width: parseInt(e.target.value) || 1200 })}
                  className="w-full bg-[#08080c] border border-[#252538] rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">{t.windowHeight}</label>
                <input
                  type="number"
                  value={config.height}
                  onChange={(e) => onUpdateConfig({ height: parseInt(e.target.value) || 800 })}
                  className="w-full bg-[#08080c] border border-[#252538] rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <label className="flex items-center gap-2 p-2 bg-[#0c0c13] rounded border border-[#252538] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.resizable}
                  onChange={(e) => onUpdateConfig({ resizable: e.target.checked })}
                  className="rounded text-cyan-400 focus:ring-0"
                />
                <span className="text-xs text-gray-300">{t.resizable}</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-[#0c0c13] rounded border border-[#252538] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.fullscreen}
                  onChange={(e) => onUpdateConfig({ fullscreen: e.target.checked })}
                  className="rounded text-cyan-400 focus:ring-0"
                />
                <span className="text-xs text-gray-300">{t.fullscreen}</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-[#0c0c13] rounded border border-[#252538] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.decorations}
                  onChange={(e) => onUpdateConfig({ decorations: e.target.checked })}
                  className="rounded text-cyan-400 focus:ring-0"
                />
                <span className="text-xs text-gray-300">{t.decorations}</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-[#0c0c13] rounded border border-[#252538] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.transparent}
                  onChange={(e) => onUpdateConfig({ transparent: e.target.checked })}
                  className="rounded text-cyan-400 focus:ring-0"
                />
                <span className="text-xs text-gray-300">{t.transparent}</span>
              </label>
            </div>
          </div>
        )}

        {/* Terminal & Build Commands Guide */}
        {activeTab === 'commands' && (
          <div className="bg-[#12121a] border border-[#1f2438] rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-bold text-[#ff007f]">{t.runCommands}</h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">{t.rustPrereq}</p>
                <div className="flex items-center justify-between bg-[#08080c] p-2.5 rounded border border-[#252538]">
                  <code className="text-xs text-[#00ffcc] font-mono" dir="ltr">
                    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
                  </code>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText("curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh")
                    }
                    className="p-1 hover:text-cyan-300 text-gray-400 cursor-pointer"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">{t.devCmdDesc}</p>
                <div className="flex items-center justify-between bg-[#08080c] p-2.5 rounded border border-[#252538]">
                  <code className="text-xs text-[#00ffcc] font-mono" dir="ltr">
                    npm install && npm run dev
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText('npm install && npm run dev')}
                    className="p-1 hover:text-cyan-300 text-gray-400 cursor-pointer"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">{t.buildCmdDesc}</p>
                <div className="flex items-center justify-between bg-[#08080c] p-2.5 rounded border border-[#252538]">
                  <code className="text-xs text-[#00ffcc] font-mono" dir="ltr">
                    npm run build
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText('npm run build')}
                    className="p-1 hover:text-cyan-300 text-gray-400 cursor-pointer"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
