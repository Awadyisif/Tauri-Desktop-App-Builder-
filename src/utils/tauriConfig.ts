import type { DesktopConfig, ShaderParams } from '../types.ts';

export const defaultDesktopConfig: DesktopConfig = {
  productName: 'Nucleus Synthetic Convergence',
  version: '40.0.0',
  description: 'Interactive Fractal Feedback Loop & Synthetic Convergence Art Engine.',
  identifier: 'com.hnynyos.nucleus',
  author: 'Hnyn Yos',
  copyright: 'Hnyn Yos © 2026',
  category: 'Graphics',
  width: 1400,
  height: 900,
  resizable: true,
  fullscreen: false,
  decorations: true,
  transparent: false,
  csp: "default-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com;",
};

export function generateTauriConfig(config: DesktopConfig): string {
  const tauriObj = {
    $schema: 'https://schema.tauri.app/config/1',
    build: {
      beforeDevCommand: '',
      beforeBuildCommand: '',
      devPath: '../src',
      distDir: '../src',
    },
    package: {
      productName: config.productName,
      version: config.version,
    },
    tauri: {
      allowlist: {
        all: false,
        dialog: { open: true, save: true },
        fs: {
          all: true,
          scope: ['$RESOURCE/*', '$DOWNLOAD/*', '$DOCUMENT/*'],
        },
      },
      bundle: {
        active: true,
        category: config.category,
        copyright: config.copyright,
        identifier: config.identifier,
        longDescription: config.description,
        targets: 'all',
      },
      security: {
        csp: config.csp,
      },
      windows: [
        {
          fullscreen: config.fullscreen,
          height: Number(config.height),
          resizable: config.resizable,
          title: `Nucleus v${config.version} | ${config.productName}`,
          width: Number(config.width),
          decorations: config.decorations,
          transparent: config.transparent,
        },
      ],
    },
  };
  return JSON.stringify(tauriObj, null, 2);
}

export function generateCargoToml(config: DesktopConfig): string {
  const pkgName = config.productName
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/--+/g, '-')
    .slice(0, 32);

  return `[package]
name = "${pkgName || 'nucleus-desktop'}"
version = "${config.version}"
description = "${config.description}"
authors = ["${config.author}"]
edition = "2021"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tauri = { version = "1.5", features = ["dialog-all", "fs-all", "protocol"] }

[features]
default = ["custom-protocol"]
custom-protocol = ["tauri/custom-protocol"]
`;
}

export function generatePackageJson(config: DesktopConfig): string {
  const pkg = {
    name: config.productName.toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 32) || 'nucleus-desktop',
    private: true,
    version: config.version,
    description: config.description,
    scripts: {
      tauri: 'tauri',
      dev: 'tauri dev',
      build: 'tauri build',
    },
    devDependencies: {
      '@tauri-apps/cli': '^1.5.0',
    },
  };
  return JSON.stringify(pkg, null, 2);
}

export function generateMainRs(): string {
  return `#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
`;
}

export function generateGuideHtml(config: DesktopConfig): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nucleus v${config.version} | Desktop App Configuration & Guide</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a0f; color: #e0e0e0; margin: 0; padding: 40px; line-height: 1.6; }
        .container { max-width: 900px; margin: auto; background: #12121a; padding: 35px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); border: 1px solid #1f1f2e; }
        h1 { color: #00f0ff; font-size: 26px; border-bottom: 2px solid #00f0ff; padding-bottom: 12px; margin-top: 0; }
        h2 { color: #ff007f; font-size: 20px; margin-top: 32px; }
        p, li { font-size: 15px; color: #b0b0c0; }
        pre { background: #08080c; color: #00ffcc; padding: 18px; border-radius: 8px; overflow-x: auto; border: 1px solid #252538; font-family: 'Courier New', Courier, monospace; font-size: 13px; direction: ltr; text-align: left; }
        .file-title { background: #1a1a26; padding: 10px 18px; font-weight: bold; color: #fff; border-radius: 6px 6px 0 0; margin-top: 24px; border: 1px solid #252538; border-bottom: none; font-family: monospace; direction: ltr; text-align: left; }
        .file-title + pre { border-radius: 0 0 6px 6px; margin-top: 0; }
        .download-btn { display: inline-block; background: #00f0ff; color: #000; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 20px; transition: 0.3s; }
        .download-btn:hover { background: #00b3cc; }
        .badge { background: rgba(0, 240, 255, 0.15); color: #00f0ff; padding: 4px 10px; border-radius: 4px; border: 1px solid #00f0ff; font-size: 12px; margin-right: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Nucleus v${config.version} | ${config.productName} <span class="badge">Tauri v1.5 + Rust</span></h1>
        <p>هذا الملف يجمع كافة الإعدادات والملفات الهندسية المطلوبة لتحويل نظام التظليل الفراكتالي (WebGL/Three.js) إلى تطبيق سطح مكتب مستقل باستخدام إطار العمل <strong>Tauri</strong>.</p>
        
        <a href="#" class="download-btn" id="downloadSelf">تحميل هذا الدليل كملف HTML</a>

        <h2>1. هيكل مجلدات المشروع</h2>
        <pre>nucleus-desktop/
├── package.json
├── src/
│   └── index.html       (ملف الواجهة والشيدر)
└── src-tauri/
    ├── tauri.conf.json  (إعدادات النافذة والتطبيق)
    ├── Cargo.toml       (اعتمادات النظام الخلفي Rust)
    └── src/
        └── main.rs      (نقطة بداية التطبيق)</pre>

        <div class="file-title">src-tauri/tauri.conf.json</div>
        <pre>${generateTauriConfig(config)}</pre>

        <div class="file-title">package.json</div>
        <pre>${generatePackageJson(config)}</pre>

        <div class="file-title">src-tauri/Cargo.toml</div>
        <pre>${generateCargoToml(config)}</pre>

        <div class="file-title">src-tauri/src/main.rs</div>
        <pre>${generateMainRs()}</pre>

        <h2>أوامر التشغيل والبناء النهائية</h2>
        <p>لتشغيل التطبيق ومعاينته حياً على جهازك:</p>
        <pre>npm run dev</pre>
        <p>لبناء الحزمة التنفيذية النهائية المستقلة (.exe أو التثبيت الخاص بنظامك):</p>
        <pre>npm run build</pre>
    </div>

    <script>
        document.getElementById('downloadSelf').addEventListener('click', function(e) {
            e.preventDefault();
            const htmlContent = document.documentElement.outerHTML;
            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Nucleus_v40_Desktop_Guide.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    </script>
</body>
</html>`;
}

export function generateStandaloneHtml(config: DesktopConfig, params: ShaderParams): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.productName} v${config.version}</title>
    <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #000; }
        canvas { width: 100%; height: 100%; display: block; }
        #overlay {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(10, 10, 20, 0.85);
            border: 1px solid #00f0ff;
            color: #00f0ff;
            padding: 8px 18px;
            border-radius: 20px;
            font-family: monospace;
            font-size: 13px;
            pointer-events: none;
            letter-spacing: 1px;
            box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
        }
    </style>
</head>
<body>
    <canvas id="c"></canvas>
    <div id="overlay">${config.productName} • v${config.version} [DESKTOP NATIVE]</div>
    <script>
        const canvas = document.getElementById('c');
        const gl = canvas.getContext('webgl');
        if (!gl) { alert('WebGL not supported'); }

        const vs = \`
            attribute vec2 p;
            void main() {
                gl_Position = vec4(p, 0.0, 1.0);
            }
        \`;

        const fs = \`
            precision highp float;
            uniform vec2 u_res;
            uniform float u_time;
            uniform float u_warp;
            uniform float u_zoom;
            uniform float u_glow;

            void main() {
                vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
                float t = u_time * 0.4;
                vec2 z = uv * (3.0 / max(0.2, u_zoom));
                
                float r = 0.0;
                float g = 0.0;
                float b = 0.0;

                for (int i = 0; i < 7; i++) {
                    float fi = float(i);
                    z = abs(z) / dot(z, z) - vec2(0.5 + 0.1 * sin(t + fi * u_warp), 0.5 + 0.1 * cos(t * 0.8 + fi));
                    float d = length(z);
                    r += 0.08 / (0.1 + d * 0.7) * abs(sin(t * 0.5 + fi * 0.4));
                    g += 0.05 / (0.1 + d * 0.7) * abs(cos(t * 0.3 + fi * 0.7));
                    b += 0.12 / (0.1 + d * 0.7) * abs(sin(t * 0.7 + fi));
                }

                vec3 col = vec3(r, g, b) * u_glow;
                gl_FragColor = vec4(col, 1.0);
            }
        \`;

        function createShader(gl, type, source) {
            const s = gl.createShader(type);
            gl.shaderSource(s, source);
            gl.compileShader(s);
            return s;
        }

        const prog = gl.createProgram();
        gl.attachShader(prog, createShader(gl, gl.VERTEX_SHADER, vs));
        gl.attachShader(prog, createShader(gl, gl.FRAGMENT_SHADER, fs));
        gl.linkProgram(prog);
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

        const posAttr = gl.getAttribLocation(prog, 'p');
        gl.enableVertexAttribArray(posAttr);
        gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

        const uRes = gl.getUniformLocation(prog, 'u_res');
        const uTime = gl.getUniformLocation(prog, 'u_time');
        const uWarp = gl.getUniformLocation(prog, 'u_warp');
        const uZoom = gl.getUniformLocation(prog, 'u_zoom');
        const uGlow = gl.getUniformLocation(prog, 'u_glow');

        let start = performance.now();
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
        window.addEventListener('resize', resize);
        resize();

        function render() {
            const time = (performance.now() - start) * 0.001 * ${params.speed.toFixed(2)};
            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.uniform1f(uTime, time);
            gl.uniform1f(uWarp, ${params.warp.toFixed(2)});
            gl.uniform1f(uZoom, ${params.zoom.toFixed(2)});
            gl.uniform1f(uGlow, ${params.glowIntensity.toFixed(2)});
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            requestAnimationFrame(render);
        }
        render();
    </script>
</body>
</html>`;
}
