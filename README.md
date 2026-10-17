# Nucleus v40.0 | Synthetic Convergence
### محرك التظليل الفراكتالي التفاعلي ودليل بناء تطبيق سطح المكتب المستقل (Tauri + Rust)
*Interactive Fractal Feedback Loop & Synthetic Convergence Art Engine*

**حقوق النشر والملكية الفكرية:** Hnyn Yos © 2026  
**التقنيات المستخدمة:** WebGL / Three.js / GLSL Shaders • Tauri v1.5 • Rust 2021 • React 19 • TypeScript • Tailwind CSS

---

## 📖 نظرة عامة (Overview)

**Nucleus v40.0** هو نظام بصري وحسابي متقدم يجمع بين فن التوليد الرياضي الفراكتالي المباشر عبر بطاقة الرسوميات (GPU-accelerated Raymarching Feedback Loop) وأطر عمل التطبيقات الأصلية فائقة الأداء لتحويل هذا المحرك إلى تطبيق سطح مكتب مستقل، فائق الخفة، وخالٍ من الاعتماديات الثقيلة باستخدام **Tauri** و **Rust**.

النظام يقدم:
- **محرك تظليل فراكتالي فوري (GLSL / Three.js)**: محاكاة فضاء طي هندسي متكرر (Folded Space & Spherical Inversion) مع تشتت لوني (Chromatic Aberration) وتغذية راجعة حركية.
- **تفاعل صوتي سيبراني (Procedural Cyber Audio)**: توليد نبضات إيقاعية وترددات تحت-صوتية (Sub-bass Synthesizer) متزامنة مع نبضات الفراكتال.
- **استوديو توليد وتكوين حزم سطح المكتب (Tauri Builder)**: توليد ملفات الإعداد الكاملة وتصدير حزم المشروع بضغطة زر واحدة بصيغة `.zip` أو ملف توثيق `HTML` مستقل.

---

## 📁 هيكل مجلدات المشروع (Directory Structure)

```text
nucleus-desktop/
├── README.md               # ملف الوصف والتوثيق الهندسي الشامل
├── package.json            # أوامر التشغيل واعتمادات أدوات Tauri CLI
├── src/
│   └── index.html          # ملف واجهة المستخدم ومحرك شيدر الويب المستقل
└── src-tauri/
    ├── tauri.conf.json     # ملف إعدادات نافذة التطبيق وأذونات الأمان (CSP)
    ├── Cargo.toml          # اعتمادات ومكتبات الواجهة الخلفية لنظام Rust
    └── src/
        └── main.rs         # نقطة البداية البرمجية واستدعاء محرك Tauri
```

---

## ⚙️ تفاصيل الملفات الهندسية (Core Engineering Files)

### 1. `src-tauri/tauri.conf.json`
يتحكم في سلوك النافذة الأصلية والأمان على نظام التشغيل:
- **الأبعاد الافتراضية:** 1400 × 900 بكسل مع قابلية تغيير الحجم (Resizable).
- **سياسة أمان المحتوى (CSP):** مقيدة وآمنة مع السماح بتشغيل الشيدرات التفاعلية.
- **نظام الأذونات (Allowlist):** تقييد صلاحيات الوصول لنظام الملفات ومربعات الحوار للأمان القصوى.

### 2. `src-tauri/Cargo.toml`
يحدد اعتماديات لغة Rust:
- `tauri v1.5`: المحرك الأساسي لإنشاء النوافذ وتوصيل الـ Webview بالنظام.
- `serde` & `serde_json`: معالجة البيانات والتهيئة بصيغة JSON بسرعة فائقة.

### 3. `src-tauri/src/main.rs`
نقطة الدخول لنظام سطح المكتب، تحتوي على تعليمة `#![cfg_attr(..., windows_subsystem = "windows")]` لمنع ظهور شاشة الطرفية السوداء (Console Window) في بيئة الإنتاج على أنظمة Windows.

### 4. `package.json`
يحتوي على أوامر الاختصار لتطوير وبناء الحزم:
- `npm run dev`: تشغيل بيئة التطوير المباشرة.
- `npm run build`: تصدير الحزم التنفيذية للمنصة الحالية.

---

## 🚀 دليل التثبيت والتشغيل (Quickstart & Building)

### المتطلبات الأساسية (Prerequisites)
1. **Node.js**: الإصدار 18 أو أحدث مع مدير الحزم `npm`.
2. **Rust & Cargo**: لتثبيت أدوات Rust الرسمية:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```
3. **حزم النظام الإضافية (لمستخدمي Linux):**
   ```bash
   sudo apt-get install libwebkit2gtk-4.0-dev build-essential curl wget file libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
   ```

### خطوات التشغيل والتطوير (Development)
```bash
# 1. تثبيت الاعتماديات
npm install

# 2. تشغيل التطبيق في وضع سطح المكتب التفاعلي
npm run dev
```

### بناء الحزمة التنفيذية النهائية (Production Build)
```bash
npm run build
```
سيتم إنشاء الملف التنفيذي المستقل تلقائياً داخل المجلد:
`src-tauri/target/release/bundle/`
- **Windows:** ملفات تثبيت `.msi` أو تنفيذ مباشر `.exe`.
- **macOS:** حزم تطبيقات `.dmg` أو `.app` تدعم معالجات Apple Silicon و Intel.
- **Linux:** حزم `.deb` أو `.AppImage`.

---

## 🎨 معايير التظليل الفراكتالي (Fractal Shader Engine)

| المعيار | النطاق | الوصف |
| :--- | :--- | :--- |
| **التكرار (Iterations)** | 3 - 12 | يتحكم في عمق ودقة تفاصيل طي الفراكتال |
| **العمق (Zoom)** | 0.3 - 3.5 | مستوى الاقتراب من مركز التقارب التوليدي |
| **انحناء الفضاء (Warp)** | 0.1 - 3.0 | معامل التشويه والتموج الهندسي الحركي |
| **السرعة (Speed)** | 0.1 - 2.5 | معدل التدفق الزمني وتغير الإحداثيات |
| **التوهج (Glow)** | 0.3 - 2.2 | كثافة الإشعاع النيوني والسطوع البصري |
| **التشتت اللوني (RGB Split)** | 0.0 - 2.0 | معامل إزاحة قنوات الألوان الثلاثية |

---

## 📜 الترخيص وحقوق الملكية (License)
جميع الحقوق محفوظة للمطور **Hnyn Yos © 2026**.  
*Interactive Fractal Feedback Loop & Synthetic Convergence Art Engine.*
