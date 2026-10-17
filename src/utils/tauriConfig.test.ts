import test from 'node:test';
import assert from 'node:assert/strict';
import {
  defaultDesktopConfig,
  generateTauriConfig,
  generateCargoToml,
  generatePackageJson,
  generateMainRs,
  generateGuideHtml,
} from './tauriConfig.ts';

test('generateTauriConfig produces valid JSON matching Tauri v1 schema', () => {
  const jsonStr = generateTauriConfig(defaultDesktopConfig);
  const parsed = JSON.parse(jsonStr);

  assert.equal(parsed.package.productName, 'Nucleus Synthetic Convergence');
  assert.equal(parsed.package.version, '40.0.0');
  assert.equal(parsed.tauri.bundle.identifier, 'com.hnynyos.nucleus');
  assert.equal(parsed.tauri.windows[0].width, 1400);
  assert.equal(parsed.tauri.windows[0].height, 900);
  assert.equal(parsed.tauri.windows[0].fullscreen, false);
});

test('generateCargoToml formats Rust package dependencies', () => {
  const toml = generateCargoToml(defaultDesktopConfig);
  assert.ok(toml.includes('name = "nucleus-synthetic-convergence"'));
  assert.ok(toml.includes('version = "40.0.0"'));
  assert.ok(toml.includes('tauri = { version = "1.5"'));
  assert.ok(toml.includes('authors = ["Hnyn Yos"]'));
});

test('generatePackageJson produces valid package manifest', () => {
  const pkgStr = generatePackageJson(defaultDesktopConfig);
  const pkg = JSON.parse(pkgStr);
  assert.equal(pkg.version, '40.0.0');
  assert.equal(pkg.scripts.dev, 'tauri dev');
  assert.equal(pkg.scripts.build, 'tauri build');
  assert.ok(pkg.devDependencies['@tauri-apps/cli']);
});

test('generateMainRs includes Windows subsystem and builder initialization', () => {
  const rs = generateMainRs();
  assert.ok(rs.includes('windows_subsystem = "windows"'));
  assert.ok(rs.includes('tauri::Builder::default()'));
});

test('generateGuideHtml includes download self trigger and file blocks', () => {
  const html = generateGuideHtml(defaultDesktopConfig);
  assert.ok(html.includes('id="downloadSelf"'));
  assert.ok(html.includes('src-tauri/tauri.conf.json'));
  assert.ok(html.includes('src-tauri/Cargo.toml'));
  assert.ok(html.includes('npm run dev'));
  assert.ok(html.includes('npm run build'));
});
