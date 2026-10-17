export type Language = 'ar' | 'en';

export type ViewMode = 'studio' | 'visualizer' | 'guide';

export interface DesktopConfig {
  productName: string;
  version: string;
  description: string;
  identifier: string;
  author: string;
  copyright: string;
  category: string;
  width: number;
  height: number;
  resizable: boolean;
  fullscreen: boolean;
  decorations: boolean;
  transparent: boolean;
  csp: string;
}

export type PaletteName = 'synthetic-cyan' | 'cyber-magenta' | 'quantum-emerald' | 'void-monochrome' | 'solar-gold';

export interface ShaderParams {
  iterations: number;
  zoom: number;
  warp: number;
  speed: number;
  palette: PaletteName;
  feedbackDecay: number;
  glowIntensity: number;
  chromaticAberration: number;
  pulseFreq: number;
  audioActive: boolean;
  audioIntensity: number;
}

export interface Preset {
  id: string;
  name: { ar: string; en: string };
  desc: { ar: string; en: string };
  params: Partial<ShaderParams>;
}
