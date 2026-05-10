import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: 'angular-common',
  title: 'Common Interview Questions',
  icon: '💬',
  difficulty: 'Core',
  targets: ['Angular', 'General'],
  cheatSheet: [
    {
      concept: 'What is ESLint?',
      explanation: 'A static analysis tool for JavaScript/TypeScript that catches errors, enforces style rules, and highlights bad patterns before runtime. Angular projects use @angular-eslint. Rules can be errors (fail CI) or warnings.',
      code: `// .eslintrc.json
{
  "extends": ["@angular-eslint/recommended"],
  "rules": {
    "@angular-eslint/no-empty-lifecycle-method": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { "allow": ["error"] }]
  }
}

// Run
ng lint          // Angular CLI
npx eslint src   // direct`,
    },
    {
      concept: 'i18n vs l10n',
      explanation: 'i18n (internationalization): designing the app to support multiple languages/regions — 18 letters between i and n. l10n (localization): the actual translation and adaptation for a specific locale. You internationalize once, localize for each target market.',
      code: `// Angular i18n — mark strings for translation
<h1 i18n="@@welcomeTitle">Welcome</h1>

// Extract messages
ng extract-i18n --output-path src/locale

// Build for specific locale
ng build --localize
ng build --configuration=fr  // French locale

// react-i18next
const { t } = useTranslation()
<h1>{t('welcome.title')}</h1>`,
    },
    {
      concept: 'Application Optimization — Minify & Compress',
      explanation: 'Minification: remove whitespace, rename variables to short names — done by the build tool (Webpack/esbuild). Compression: gzip or Brotli encoding at the server/CDN level — reduces transfer size by 60–80%. Tree-shaking: dead code elimination at build time.',
      code: `// Angular production build — all optimizations on by default
ng build  // production by default in Angular 17+
// Output: minified JS, optimized images, tree-shaken

// Verify bundle sizes
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json

// Server — enable Brotli compression
// nginx
gzip on;
brotli on;
brotli_comp_level 6;`,
    },
    {
      concept: 'Debugging a Slow Angular Application',
      explanation: 'Profile with Angular DevTools (Chrome extension) to see change detection frequency and component render times. Look for: method calls in templates, missing trackBy, missing OnPush, large lists without virtual scroll.',
      code: `// Step 1 — enable Angular DevTools profiler
// Chrome → Angular tab → Start recording → interact → Stop

// Step 2 — find expensive expressions (method in template)
// ❌ Runs every CD cycle
{{ getFilteredItems() }}

// ✅ Pre-computed
readonly filteredItems = computed(() => ...)  // Signal
// or
get filteredItems() { return this._filtered } // update in ngOnChanges

// Step 3 — check for missing OnPush
// Step 4 — check large lists for trackBy and virtual scroll
// Step 5 — run outside Zone for animation-heavy code
this.ngZone.runOutsideAngular(() => startHeavyAnimation())`,
    },
  ],
  spokenAnswer: {
    question: 'How would you debug a slow Angular application?',
    answer: `I start by measuring, not guessing. The Angular DevTools Chrome extension has a profiler that shows you exactly which components are being checked during change detection and how long each takes. I record a session while the app feels slow, then look for hotspots — components that check frequently or take a long time. The most common culprits are: method calls in the template, which run on every change detection cycle; missing trackBy on large ngFor lists, which destroys and recreates DOM nodes unnecessarily; components that should have OnPush change detection but are still using Default; and large lists that should be using CDK virtual scrolling instead of rendering all items. Once I've identified the bottleneck I fix one thing at a time and re-profile to confirm improvement. Another quick check is the Network tab — if the app is slow on first load, it's usually bundle size, and I'd run webpack-bundle-analyzer to see what's taking up space. If it's slow after interactions, it's almost always change detection.`,
  },
  traps: [
    {
      trap: 'Confusing i18n (engineering effort) with l10n (translation effort)',
      correction: 'i18n means writing the app so it CAN support multiple languages — no hardcoded strings, proper date/number formatting with Intl. l10n is the actual work of translating strings into French, Arabic, etc. A well-internationalized app can be localized with no code changes.',
    },
    {
      trap: 'Relying only on ng build for performance without checking actual bundle sizes',
      correction: 'ng build optimises and minifies but doesn\'t tell you if a large third-party library snuck in. Always run webpack-bundle-analyzer or use Angular\'s --stats-json output to verify bundle composition. Set size budgets in angular.json to fail the build on bloat.',
    },
  ],
  quiz: [
    {
      id: 1,
      question: 'What does "i18n" stand for and what does it mean in practice?',
      options: [
        'Internet 18 nodes — a network protocol',
        'Internationalization (18 letters between i and n) — designing an app to support multiple languages without code changes per language',
        'Index-18-namespace — a CSS naming convention',
        'The Angular translation module name',
      ],
      correct: 1,
      explanation: 'i18n is a numeronym for "internationalization" (18 letters between the first i and last n). It means architecting the app to support multiple locales — externalized strings, Intl formatting, RTL support — so that localization (actual translation) requires no code changes.',
    },
    {
      id: 2,
      question: 'What is the first step when debugging a slow Angular application?',
      options: [
        'Add OnPush to every component immediately',
        'Rewrite the app with signals',
        'Profile with Angular DevTools to identify which components are slow and why',
        'Switch to a smaller framework',
      ],
      correct: 2,
      explanation: 'Profile first — measure don\'t guess. Angular DevTools shows change detection frequency and per-component render time. Without data you risk optimising the wrong thing. Only fix what the profiler identifies as slow.',
    },
  ],
}
