/**
 * React Localization (i18n) Crash Course - Lesson Data
 *
 * WHAT YOU'LL LEARN:
 * - What i18n and l10n mean
 * - Setting up react-i18next (the industry standard)
 * - Translating strings, interpolation, plurals
 * - Switching language at runtime
 * - Formatting dates, numbers and currencies per locale
 */

import { ILesson } from '../../types/tutorial'

export const reactLocalizationLessons: ILesson[] = [
  {
    id: 1,
    type: 'lesson',
    title: "i18n vs l10n — What's the Difference?",
    content: `
      <h2 class="text-2xl font-bold mb-4">i18n vs l10n — What's the Difference?</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p class="font-bold text-lg mb-2">i18n — Internationalization</p>
          <p class="text-gray-700 text-sm">
            Making your app <em>capable</em> of supporting multiple languages and regions.
            The "18" stands for the 18 letters between i and n in "internationalization".
          </p>
          <p class="text-gray-600 text-sm mt-2">Examples: extracting strings, using a translation library, supporting RTL layouts.</p>
        </div>
        <div class="bg-green-50 border-l-4 border-green-500 p-4">
          <p class="font-bold text-lg mb-2">l10n — Localization</p>
          <p class="text-gray-700 text-sm">
            The actual work of <em>adapting</em> content for a specific locale.
            "10" = letters between l and n in "localization".
          </p>
          <p class="text-gray-600 text-sm mt-2">Examples: translating strings to Arabic, formatting 1000 as ١٬٠٠٠, showing dates as DD/MM/YYYY.</p>
        </div>
      </div>

      <div class="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
        <p class="font-bold mb-2">A "locale" is a language + region code</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
          <div class="bg-white p-2 rounded border text-center text-sm"><code>en-US</code><br/><span class="text-gray-500 text-xs">English (US)</span></div>
          <div class="bg-white p-2 rounded border text-center text-sm"><code>ar-EG</code><br/><span class="text-gray-500 text-xs">Arabic (Egypt)</span></div>
          <div class="bg-white p-2 rounded border text-center text-sm"><code>fr-FR</code><br/><span class="text-gray-500 text-xs">French (France)</span></div>
          <div class="bg-white p-2 rounded border text-center text-sm"><code>de-DE</code><br/><span class="text-gray-500 text-xs">German (Germany)</span></div>
        </div>
      </div>

      <div class="bg-orange-50 border-l-4 border-orange-500 p-4">
        <p class="font-bold mb-2">Why not just write all text in the JSX?</p>
        <pre class="bg-gray-800 text-red-400 p-3 rounded text-sm"><code>// ❌ Hard-coded English — impossible to translate
&lt;h1&gt;Welcome back, Ahmed!&lt;/h1&gt;
&lt;p&gt;You have 3 new messages.&lt;/p&gt;</code></pre>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm mt-2"><code>// ✅ Translation key — works in any language
&lt;h1&gt;{t('welcome', { name: 'Ahmed' })}&lt;/h1&gt;
&lt;p&gt;{t('messages', { count: 3 })}&lt;/p&gt;</code></pre>
      </div>
    `,
  },
  {
    id: 2,
    type: 'lesson',
    title: 'Setting Up react-i18next',
    content: `
      <h2 class="text-2xl font-bold mb-4">Setting Up react-i18next</h2>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p class="font-bold mb-2">Install</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>npm install i18next react-i18next</code></pre>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">1. Create translation files</p>
        <p class="text-gray-600 text-sm mb-2">One JSON file per language — keys are the same across all files.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p class="text-sm font-bold mb-1">public/locales/en/translation.json</p>
            <pre class="bg-gray-800 text-green-400 p-3 rounded text-xs"><code>{
  "welcome": "Welcome, {{name}}!",
  "messages_one": "{{count}} new message",
  "messages_other": "{{count}} new messages",
  "nav": {
    "home": "Home",
    "about": "About"
  }
}</code></pre>
          </div>
          <div>
            <p class="text-sm font-bold mb-1">public/locales/ar/translation.json</p>
            <pre class="bg-gray-800 text-green-400 p-3 rounded text-xs"><code>{
  "welcome": "أهلاً، {{name}}!",
  "messages_one": "رسالة جديدة",
  "messages_other": "{{count}} رسائل جديدة",
  "nav": {
    "home": "الرئيسية",
    "about": "من نحن"
  }
}</code></pre>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">2. Configure i18n (i18n.ts)</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

/**
 * BEST PRACTICE: Separate i18n config into its own file.
 * Import this file once in main.tsx — never in components.
 *
 * - HttpBackend loads translation JSON files on demand (lazy loading)
 * - LanguageDetector reads the browser/OS language automatically
 */
i18n
  .use(HttpBackend)          // load files from /public/locales/
  .use(LanguageDetector)     // auto-detect browser language
  .use(initReactI18next)     // bind to React
  .init({
    fallbackLng: 'en',       // use English if translation missing
    debug: false,
    interpolation: {
      escapeValue: false,    // React already escapes HTML
    },
  })

export default i18n</code></pre>
      </div>

      <div class="bg-green-50 border-l-4 border-green-500 p-4">
        <p class="font-bold mb-2">3. Import config in main.tsx</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>import './i18n'  // must be imported before &lt;App /&gt;
import App from './App'
// ...ReactDOM.createRoot(...).render(&lt;App /&gt;)</code></pre>
      </div>
    `,
  },
  {
    id: 3,
    type: 'lesson',
    title: 'Using Translations in Components',
    content: `
      <h2 class="text-2xl font-bold mb-4">Using Translations in Components</h2>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p class="font-bold mb-2">The useTranslation hook</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>import { useTranslation } from 'react-i18next'

export default function Header() {
  /**
   * t() — translate a key to the current language string
   * i18n — the i18n instance (for switching language, etc.)
   *
   * BEST PRACTICE: You can scope to a namespace:
   * const { t } = useTranslation('navigation')
   * This loads only navigation.json instead of the whole file.
   */
  const { t } = useTranslation()

  return (
    &lt;header&gt;
      &lt;h1&gt;{t('nav.home')}&lt;/h1&gt;
    &lt;/header&gt;
  )
}</code></pre>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">Interpolation — inserting variables</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>// Translation file:
// "welcome": "Welcome, {{name}}!"

const { t } = useTranslation()

// Pass variables as an object
&lt;p&gt;{t('welcome', { name: 'Ahmed' })}&lt;/p&gt;
// Renders: "Welcome, Ahmed!"  (en)
// Renders: "أهلاً، Ahmed!"    (ar)</code></pre>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">Pluralization — different text for counts</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>// Translation file:
// "messages_one":   "{{count}} new message"
// "messages_other": "{{count}} new messages"
//
// i18next picks the right key based on {count} automatically

&lt;p&gt;{t('messages', { count: 1 })}&lt;/p&gt;  // "1 new message"
&lt;p&gt;{t('messages', { count: 5 })}&lt;/p&gt;  // "5 new messages"</code></pre>
      </div>

      <div class="bg-green-50 border-l-4 border-green-500 p-4">
        <p class="font-bold mb-2">Trans component — for strings with JSX inside</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>import { Trans } from 'react-i18next'

// Translation: "Read the &lt;1&gt;docs&lt;/1&gt; for more info."
&lt;Trans i18nKey="readDocs"&gt;
  Read the &lt;a href="/docs"&gt;docs&lt;/a&gt; for more info.
&lt;/Trans&gt;</code></pre>
        <p class="text-gray-600 text-sm mt-2">Use Trans when a translated string needs real HTML elements inside it.</p>
      </div>
    `,
  },
  {
    id: 4,
    type: 'lesson',
    title: 'Switching Language & RTL Support',
    content: `
      <h2 class="text-2xl font-bold mb-4">Switching Language & RTL Support</h2>

      <div class="mb-4">
        <p class="font-bold mb-2">Switching language at runtime</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)

    /**
     * BEST PRACTICE: Update &lt;html dir&gt; and &lt;html lang&gt; for accessibility
     * and RTL (Right-To-Left) layout support.
     * Arabic, Hebrew, Persian are RTL languages.
     */
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }

  return (
    &lt;div className="flex gap-2"&gt;
      &lt;button onClick={() => changeLanguage('en')}&gt;English&lt;/button&gt;
      &lt;button onClick={() => changeLanguage('ar')}&gt;عربي&lt;/button&gt;
    &lt;/div&gt;
  )
}</code></pre>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p class="font-bold mb-3">Tailwind RTL — logical CSS properties</p>
        <p class="text-gray-700 text-sm mb-3">
          With Tailwind v3+, use <em>logical</em> classes that flip automatically based on document direction:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p class="text-sm font-bold text-red-700 mb-1">❌ Physical (breaks in RTL)</p>
            <pre class="bg-gray-800 text-red-400 p-2 rounded text-xs"><code>className="ml-4 pl-3 text-left"</code></pre>
          </div>
          <div>
            <p class="text-sm font-bold text-green-700 mb-1">✅ Logical (works in both)</p>
            <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs"><code>className="ms-4 ps-3 text-start"</code></pre>
          </div>
        </div>
        <p class="text-gray-600 text-xs mt-2">ms = margin-start, ps = padding-start, text-start = text-left in LTR, text-right in RTL</p>
      </div>

      <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
        <p class="font-bold mb-2">Persisting the chosen language</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>// i18next-browser-languagedetector handles this automatically.
// It saves the chosen language to localStorage under key "i18nextLng".
// On the next visit, it reads it and restores the preference.

// You can also save it manually:
localStorage.setItem('lang', 'ar')</code></pre>
      </div>

      <div class="bg-purple-50 border-l-4 border-purple-500 p-4">
        <p class="font-bold mb-2">Detecting current language in components</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>const { i18n } = useTranslation()

const isRTL = i18n.dir() === 'rtl'  // true when Arabic, Hebrew, etc.
const lang  = i18n.language          // "en", "ar", "fr" …</code></pre>
      </div>
    `,
  },
  {
    id: 5,
    type: 'lesson',
    title: 'Formatting Dates, Numbers & Currencies',
    content: `
      <h2 class="text-2xl font-bold mb-4">Formatting Dates, Numbers & Currencies</h2>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p class="font-bold mb-2">The built-in Intl API</p>
        <p class="text-gray-700 text-sm mb-2">
          The browser's <code class="bg-gray-200 px-1">Intl</code> object handles locale-aware
          formatting for free — no extra library needed.
        </p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>// Number formatting
new Intl.NumberFormat('en-US').format(1234567)  // "1,234,567"
new Intl.NumberFormat('ar-EG').format(1234567)  // "١٬٢٣٤٬٥٦٧"
new Intl.NumberFormat('de-DE').format(1234567)  // "1.234.567"

// Currency formatting
new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD'
}).format(99.99)  // "$99.99"

new Intl.NumberFormat('ar-EG', {
  style: 'currency', currency: 'EGP'
}).format(99.99)  // "٩٩٫٩٩ ج.م."

// Date formatting
new Intl.DateTimeFormat('en-US').format(new Date())  // "4/19/2026"
new Intl.DateTimeFormat('ar-EG').format(new Date())  // "١٩/٤/٢٠٢٦"
new Intl.DateTimeFormat('de-DE').format(new Date())  // "19.4.2026"</code></pre>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">BEST PRACTICE: Custom formatting hook</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>import { useTranslation } from 'react-i18next'

/**
 * Centralizing formatters in one hook means:
 * - Consistent formatting across the whole app
 * - Easy to change the locale in one place
 * - No raw Intl scattered throughout components
 */
export function useFormatters() {
  const { i18n } = useTranslation()
  const locale = i18n.language

  const formatNumber = (n: number) =>
    new Intl.NumberFormat(locale).format(n)

  const formatCurrency = (n: number, currency = 'USD') =>
    new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n)

  const formatDate = (date: Date, opts?: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, opts).format(date)

  return { formatNumber, formatCurrency, formatDate }
}

// Usage
function PriceTag({ price }: { price: number }) {
  const { formatCurrency } = useFormatters()
  return &lt;span&gt;{formatCurrency(price)}&lt;/span&gt;
}</code></pre>
      </div>

      <div class="bg-green-50 border-l-4 border-green-500 p-4">
        <p class="font-bold mb-2">Relative time — "3 hours ago"</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

rtf.format(-3, 'hour')   // "3 hours ago"
rtf.format(1,  'day')    // "tomorrow"
rtf.format(-7, 'day')    // "last week"

// Arabic
const rtfAr = new Intl.RelativeTimeFormat('ar')
rtfAr.format(-3, 'hour') // "قبل ٣ ساعات"</code></pre>
      </div>
    `,
  },
]
