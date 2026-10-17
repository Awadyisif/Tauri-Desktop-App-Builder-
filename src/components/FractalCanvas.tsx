import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ShaderParams } from '../types.ts';
import { Camera, Volume2, VolumeX, Maximize2, RefreshCw } from 'lucide-react';

interface FractalCanvasProps {
  params: ShaderParams;
  onSnapshot?: (dataUrl: string) => void;
  className?: string;
  isRtl?: boolean;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_iterations;
  uniform float u_zoom;
  uniform float u_warp;
  uniform int u_palette;
  uniform float u_feedback;
  uniform float u_glow;
  uniform float u_chromatic;
  uniform vec2 u_mouse;
  uniform float u_audio_pulse;

  // Rotation matrix helper
  mat2 rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
  }

  // Palette generator based on cosine gradients (Inigo Quilez)
  vec3 getPalette(float t, int p) {
    vec3 a, b, c, d;
    if (p == 0) {
      // Synthetic Convergence: Cyan & Neon Magenta
      a = vec3(0.12, 0.08, 0.25);
      b = vec3(0.5, 0.45, 0.65);
      c = vec3(1.0, 1.0, 1.0);
      d = vec3(0.0, 0.33, 0.67);
    } else if (p == 1) {
      // Cyber Magenta & Hot Pink
      a = vec3(0.2, 0.02, 0.18);
      b = vec3(0.7, 0.2, 0.6);
      c = vec3(1.2, 0.8, 1.0);
      d = vec3(0.3, 0.1, 0.4);
    } else if (p == 2) {
      // Quantum Emerald
      a = vec3(0.02, 0.2, 0.12);
      b = vec3(0.3, 0.7, 0.5);
      c = vec3(0.8, 1.2, 0.9);
      d = vec3(0.1, 0.5, 0.3);
    } else if (p == 3) {
      // Void Monochrome
      a = vec3(0.1, 0.1, 0.12);
      b = vec3(0.4, 0.4, 0.45);
      c = vec3(0.8, 0.8, 0.85);
      d = vec3(0.0, 0.0, 0.0);
    } else {
      // Solar Gold
      a = vec3(0.25, 0.15, 0.05);
      b = vec3(0.7, 0.5, 0.2);
      c = vec3(1.0, 0.9, 0.4);
      d = vec3(0.1, 0.2, 0.3);
    }
    return a + b * cos(6.28318 * (c * t + d));
  }

  // Fractal folding formula
  float fractal(vec2 p, float time, float pulse) {
    vec2 z = p * (2.8 / max(0.1, u_zoom));
    z *= rot(time * 0.08 + u_mouse.x * 2.0);
    
    float acc = 0.0;
    float maxIter = clamp(u_iterations, 3.0, 12.0);

    for (int i = 0; i < 12; i++) {
      if (float(i) >= maxIter) break;
      float fi = float(i);
      
      // Box fold
      z = abs(z) - vec2(0.45 + 0.1 * sin(time * 0.4 + fi * u_warp), 0.45 + 0.1 * cos(time * 0.35 + fi));
      
      // Sphere inversion
      float r2 = dot(z, z);
      z = z / clamp(r2, 0.15, 1.5) * (1.2 + 0.05 * sin(fi + time * 0.5));
      
      // Dynamic warp rotation
      z *= rot(0.35 + fi * 0.15 * u_warp + pulse * 0.08);

      float d = length(z);
      acc += (0.12 / (0.15 + d * 0.8)) * exp(-fi * 0.18 * (1.0 - u_feedback * 0.5));
    }
    return acc;
  }

  void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time;
    float pulse = u_audio_pulse;

    // Chromatic aberration splits
    float ca = u_chromatic * 0.015;
    
    vec2 uvR = st + vec2(ca, 0.0);
    vec2 uvG = st;
    vec2 uvB = st - vec2(ca, 0.0);

    float fR = fractal(uvR, t, pulse);
    float fG = fractal(uvG, t * 1.01, pulse);
    float fB = fractal(uvB, t * 0.99, pulse);

    vec3 colR = getPalette(fR * 0.2 + t * 0.05, u_palette);
    vec3 colG = getPalette(fG * 0.2 + t * 0.05 + 0.1, u_palette);
    vec3 colB = getPalette(fB * 0.2 + t * 0.05 + 0.2, u_palette);

    vec3 finalColor = vec3(colR.r, colG.g, colB.b) * (fG * 0.8) * u_glow;
    
    // Core cybernetic highlight ring
    float centerDist = length(st);
    float ring = smoothstep(0.02, 0.0, abs(centerDist - (0.35 + 0.05 * sin(t * 2.0 + pulse))));
    finalColor += vec3(0.0, 0.9, 1.0) * ring * (0.4 + pulse * 0.6);

    // Vignette
    finalColor *= smoothstep(1.4, 0.4, centerDist);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const FractalCanvas: React.FC<FractalCanvasProps> = ({
  params,
  onSnapshot,
  className = '',
  isRtl = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const paramsRef = useRef<ShaderParams>(params);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Web Audio Synth state
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioPulseRef = useRef<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);

  // Keep paramsRef in sync without tearing down the WebGL scene
  useEffect(() => {
    paramsRef.current = params;
    if (materialRef.current) {
      const paletteIdx =
        params.palette === 'synthetic-cyan'
          ? 0
          : params.palette === 'cyber-magenta'
          ? 1
          : params.palette === 'quantum-emerald'
          ? 2
          : params.palette === 'void-monochrome'
          ? 3
          : 4;

      materialRef.current.uniforms.u_iterations.value = params.iterations;
      materialRef.current.uniforms.u_zoom.value = params.zoom;
      materialRef.current.uniforms.u_warp.value = params.warp;
      materialRef.current.uniforms.u_palette.value = paletteIdx;
      materialRef.current.uniforms.u_feedback.value = params.feedbackDecay;
      materialRef.current.uniforms.u_glow.value = params.glowIntensity;
      materialRef.current.uniforms.u_chromatic.value = params.chromaticAberration;
    }
  }, [params]);

  // Audio Synth Engine
  const toggleAudioSynth = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }

    if (isPlayingAudio) {
      if (audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
      setIsPlayingAudio(false);
    } else {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      startProceduralAudioDrone();
      setIsPlayingAudio(true);
    }
  };

  const startProceduralAudioDrone = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    // Sub-bass oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, ctx.currentTime); // 55Hz (A1 cyber tone)

    // Filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    // Rhythmic pulse generator
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(paramsRef.current.pulseFreq, ctx.currentTime);
    lfoGain.gain.setValueAtTime(140, ctx.currentTime);

    lfo.connect(filter.frequency);
    lfo.start();
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isHeadless,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true, // for crystal clear snapshots
    });
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Palette mapping
    const paletteIdx =
      paramsRef.current.palette === 'synthetic-cyan'
        ? 0
        : paramsRef.current.palette === 'cyber-magenta'
        ? 1
        : paramsRef.current.palette === 'quantum-emerald'
        ? 2
        : paramsRef.current.palette === 'void-monochrome'
        ? 3
        : 4;

    // Uniforms
    const uniforms = {
      u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      u_time: { value: 0.0 },
      u_iterations: { value: paramsRef.current.iterations },
      u_zoom: { value: paramsRef.current.zoom },
      u_warp: { value: paramsRef.current.warp },
      u_palette: { value: paletteIdx },
      u_feedback: { value: paramsRef.current.feedbackDecay },
      u_glow: { value: paramsRef.current.glowIntensity },
      u_chromatic: { value: paramsRef.current.chromaticAberration },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_audio_pulse: { value: 0.0 },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });
    materialRef.current = material;

    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      rendererRef.current.setSize(width, height);
      uniforms.u_resolution.value.set(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Clock
    const clock = new THREE.Clock();
    let accumulatedTime = 0;

    // Animation Render Loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const speed = paramsRef.current.speed;
      accumulatedTime += delta * speed;

      uniforms.u_time.value = accumulatedTime;

      // Simulated or active audio pulse
      if (paramsRef.current.audioActive || isPlayingAudio) {
        const pulse =
          (Math.sin(accumulatedTime * paramsRef.current.pulseFreq * 2.0) * 0.5 + 0.5) *
          paramsRef.current.audioIntensity;
        audioPulseRef.current = THREE.MathUtils.damp(audioPulseRef.current, pulse, 12, delta);
      } else {
        audioPulseRef.current = THREE.MathUtils.damp(audioPulseRef.current, 0, 8, delta);
      }
      uniforms.u_audio_pulse.value = audioPulseRef.current;

      // Smooth mouse damping
      uniforms.u_mouse.value.lerp(mouseRef.current, 0.06);

      renderer.render(scene, camera);
    };

    animate();

    // Mouse and Wheel Interactions
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = (e.clientX - lastMousePosRef.current.x) * 0.005;
      const dy = (e.clientY - lastMousePosRef.current.y) * 0.005;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      mouseRef.current.x += dx;
      mouseRef.current.y += dy;
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(dom)) container.removeChild(dom);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleCaptureSnapshot = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    if (onSnapshot) {
      onSnapshot(dataUrl);
    } else {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Nucleus_v40_${Date.now()}.png`;
      a.click();
    }
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2200);
  };

  const resetView = () => {
    mouseRef.current.set(0, 0);
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none bg-black ${className}`}
      data-testid="fractal-canvas-container"
    >
      {/* ThreeJS Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Viewport HUD Actions */}
      <div
        className={`absolute top-4 ${
          isRtl ? 'left-4' : 'right-4'
        } z-20 flex items-center gap-2 bg-black/60 border border-cyan-500/30 rounded-lg p-1.5 shadow-xl`}
      >
        <button
          onClick={handleCaptureSnapshot}
          title={isRtl ? 'التقاط صورة فنية' : 'Capture Snapshot'}
          className="p-2 text-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/60 rounded transition cursor-pointer flex items-center gap-1.5 text-xs font-mono"
        >
          <Camera className="w-4 h-4" />
          <span className="hidden sm:inline">{isRtl ? 'لقطة فنية' : 'Snapshot'}</span>
        </button>

        <button
          onClick={toggleAudioSynth}
          title={
            isPlayingAudio
              ? isRtl
                ? 'إيقاف النبض الصوتي'
                : 'Mute Cyber Audio'
              : isRtl
              ? 'تشغيل النبض الصوتي السيبراني'
              : 'Enable Cyber Audio'
          }
          className={`p-2 rounded transition cursor-pointer flex items-center gap-1.5 text-xs font-mono ${
            isPlayingAudio
              ? 'text-pink-400 bg-pink-950/50 border border-pink-500/40'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
          }`}
        >
          {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">
            {isPlayingAudio ? (isRtl ? 'النبض نشط' : 'Audio ON') : (isRtl ? 'صوت' : 'Audio')}
          </span>
        </button>

        <button
          onClick={resetView}
          title={isRtl ? 'إعادة ضبط المنظور' : 'Reset View'}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/60 rounded transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Clean Static Status Watermark (Zero pulsating dots as per ThreeJS guide) */}
      <div
        className={`absolute bottom-3 ${
          isRtl ? 'right-4' : 'left-4'
        } z-10 pointer-events-none flex items-center gap-2`}
      >
        <span className="text-[11px] font-mono tracking-wider text-cyan-400/80 bg-black/60 px-2 py-0.5 rounded border border-cyan-500/20">
          NUCLEUS v40.0 • SYNTHETIC CONVERGENCE
        </span>
        <span className="text-[10px] font-mono text-gray-500 hidden md:inline">
          GLSL RAYMARCH FEEDBACK LOOP
        </span>
      </div>

      {/* Toast feedback on snapshot */}
      {copiedNote && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-cyan-950 text-cyan-300 border border-cyan-400 px-4 py-2 rounded shadow-2xl text-xs font-mono flex items-center gap-2 animate-bounce">
          <span>✓ {isRtl ? 'تم حفظ اللقطة الفنية بنجاح!' : 'Art Snapshot downloaded!'}</span>
        </div>
      )}
    </div>
  );
};
