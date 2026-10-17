import JSZip from 'jszip';
import type { DesktopConfig, ShaderParams } from '../types.ts';
import {
  generateTauriConfig,
  generateCargoToml,
  generatePackageJson,
  generateMainRs,
  generateStandaloneHtml,
  generateGuideHtml,
} from './tauriConfig.ts';

export async function createDesktopZip(config: DesktopConfig, params: ShaderParams): Promise<Blob> {
  const zip = new JSZip();
  const root = zip.folder('nucleus-desktop');
  if (!root) throw new Error('Failed to create zip root directory');

  // Root files
  root.file('package.json', generatePackageJson(config));
  root.file(
    'README.md',
    `# ${config.productName} v${config.version}
${config.description}

Developed by: ${config.author}
License: Copyright ${config.copyright}

## Getting Started

1. Ensure Node.js and Rust are installed.
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Run development desktop app:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Build release executable:
   \`\`\`bash
   npm run build
   \`\`\`
`
  );

  // Guide documentation
  root.file('Nucleus_Desktop_Guide.html', generateGuideHtml(config));

  // src directory
  const srcFolder = root.folder('src');
  if (srcFolder) {
    srcFolder.file('index.html', generateStandaloneHtml(config, params));
  }

  // src-tauri directory
  const tauriFolder = root.folder('src-tauri');
  if (tauriFolder) {
    tauriFolder.file('tauri.conf.json', generateTauriConfig(config));
    tauriFolder.file('Cargo.toml', generateCargoToml(config));

    const rustSrcFolder = tauriFolder.folder('src');
    if (rustSrcFolder) {
      rustSrcFolder.file('main.rs', generateMainRs());
    }
  }

  return await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
