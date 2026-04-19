/**
 * BEST PRACTICE: Separating Data from Logic
 *
 * Webpack & Bundlers Tutorial Data
 * شرح مفصل عن webpack والأدوات المشابهة
 */

import { ILesson } from '../../types/tutorial'

/**
 * Webpack & Bundlers Tutorial - Lessons Only (No Quizzes)
 *
 * هذا التيوتوريال يركز على الشرح والفهم بدون أسئلة
 * كل درس يشرح مفهوم معين بشكل عملي
 */
export const webpackBundlersLessons: ILesson[] = [
  {
    id: 1,
    title: 'ما هو Webpack؟',
    type: 'lesson',
    content: `
      <h2 class="text-2xl font-bold mb-4">ما هو Webpack؟</h2>

      <p class="mb-4 text-lg font-semibold text-blue-600">Webpack هو أداة تحويل وتجميع (Bundler) للمشاريع الحديثة</p>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p class="font-bold mb-2">تعريف Webpack:</p>
        <p class="text-gray-700 mb-3">
          Webpack هو module bundler يأخذ جميع ملفات مشروعك (JavaScript, CSS, صور، إلخ)
          ويجمعها في ملف واحد أو عدة ملفات محسنة وجاهزة للإنتاج.
        </p>
      </div>

      <div class="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
        <p class="font-bold mb-3">لماذا نحتاج Webpack؟</p>
        <ul class="list-disc ml-5 space-y-2 text-gray-700">
          <li><strong>تجميع الملفات:</strong> يجمع عشرات الملفات في ملف واحد</li>
          <li><strong>تحسين الأداء:</strong> يقلل حجم الملفات (minification)</li>
          <li><strong>إدارة الاعتماديات:</strong> يتتبع تبعيات الملفات تلقائياً</li>
          <li><strong>تحويل الملفات:</strong> يحول TypeScript, SASS, JSX إلى JavaScript عادي</li>
          <li><strong>التطوير السريع:</strong> يعيد تحميل الصفحة تلقائياً عند التغيير</li>
        </ul>
      </div>

      <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
        <p class="font-bold mb-3">🔄 كيف يعمل Webpack؟</p>
        <div class="bg-white p-3 rounded border border-gray-300">
          <p class="font-mono text-sm text-gray-800 whitespace-pre">
import React from 'react'
import styles from './App.css'
import logo from './logo.png'

// Webpack ياخذ هذا الملف والملفات المرتبطة
// ويحسنهم ويجمعهم في ملف واحد
          </p>
        </div>
      </div>

      <div class="bg-orange-50 border-l-4 border-orange-500 p-4">
        <p class="font-bold mb-3">📊 العملية الأساسية:</p>
        <ol class="list-decimal ml-5 space-y-2 text-gray-700">
          <li><strong>Entry:</strong> نقطة البداية (عادة index.js)</li>
          <li><strong>Processing:</strong> معالجة الملفات والتبعيات</li>
          <li><strong>Output:</strong> إنتاج الملفات المحسنة</li>
          <li><strong>Bundle:</strong> تجميع كل شيء في bundle نهائي</li>
        </ol>
      </div>
    `,
  },
  {
    id: 2,
    title: 'مفاهيم أساسية في Webpack',
    type: 'lesson',
    content: `
      <h2 class="text-2xl font-bold mb-4">مفاهيم أساسية في Webpack</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p class="font-bold text-blue-900 mb-2">Entry Point</p>
          <p class="text-gray-700 text-sm">
            نقطة البداية للـ bundling. عادة تكون index.js أو main.js
          </p>
          <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs mt-2"><code>// webpack.config.js
entry: './src/index.js'</code></pre>
        </div>

        <div class="bg-green-50 border-l-4 border-green-500 p-4">
          <p class="font-bold text-green-900 mb-2">Output</p>
          <p class="text-gray-700 text-sm">
            مكان حفظ الملفات المحسنة. عادة مجلد dist
          </p>
          <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs mt-2"><code>output: {
  path: './dist',
  filename: 'bundle.js'
}</code></pre>
        </div>

        <div class="bg-purple-50 border-l-4 border-purple-500 p-4">
          <p class="font-bold text-purple-900 mb-2">Loaders</p>
          <p class="text-gray-700 text-sm">
            تحويل ملفات مختلفة (CSS, TypeScript, صور) إلى JavaScript
          </p>
          <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs mt-2"><code>module: {
  rules: [
    { test: /\.css$/, use: 'css-loader' }
  ]
}</code></pre>
        </div>

        <div class="bg-orange-50 border-l-4 border-orange-500 p-4">
          <p class="font-bold text-orange-900 mb-2">Plugins</p>
          <p class="text-gray-700 text-sm">
            توسيع قدرات Webpack (ضغط الملفات، إنشاء HTML، إلخ)
          </p>
          <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs mt-2"><code>plugins: [
  new HtmlPlugin(),
  new TerserPlugin()
]</code></pre>
        </div>
      </div>

      <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <p class="font-bold mb-3">⚙️ ملف webpack.config.js:</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto text-sm"><code>const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  // نقطة البداية
  entry: './src/index.js',

  // مكان الإخراج
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  // المعالجات (loaders)
  module: {
    rules: [
      // معالجة ملفات CSS
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },

      // معالجة ملفات TypeScript
      { test: /\.tsx?$/, use: 'ts-loader' },

      // معالجة الصور
      { test: /\.(png|jpg|gif)$/, use: 'file-loader' }
    ]
  },

  // المكونات الإضافية (plugins)
  plugins: [
    new HtmlPlugin({
      template: './src/index.html'
    })
  ],

  // وضع التطوير أو الإنتاج
  mode: 'development'
};</code></pre>
      </div>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <p class="font-bold mb-3">📝 ملخص المفاهيم:</p>
        <ul class="list-disc ml-5 space-y-2 text-gray-700">
          <li><strong>Entry:</strong> من أين نبدأ</li>
          <li><strong>Output:</strong> إلى أين نضع النتائج</li>
          <li><strong>Loaders:</strong> كيف نعالج الملفات المختلفة</li>
          <li><strong>Plugins:</strong> كيف نوسع الإمكانيات</li>
          <li><strong>Mode:</strong> وضع التطوير أم الإنتاج</li>
        </ul>
      </div>
    `,
  },
  {
    id: 3,
    title: 'أدوات بديلة لـ Webpack',
    type: 'lesson',
    content: `
      <h2 class="text-2xl font-bold mb-4">أدوات بديلة ومشابهة</h2>

      <p class="mb-4 text-gray-700">
        هناك عدة أدوات bundler أخرى توفر وظائف مشابهة أو أفضل من Webpack:
      </p>

      <div class="space-y-4 mb-6">
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p class="font-bold text-xl mb-2">⚡ Vite</p>
          <p class="text-gray-700 mb-2">
            أداة bundler حديثة وسريعة جداً. تستخدم ES modules وتوفر تجربة تطوير أفضل.
          </p>
          <p class="text-sm text-gray-600"><strong>المميزات:</strong></p>
          <ul class="list-disc ml-5 text-sm text-gray-700 mt-1">
            <li>أسرع بكثير من Webpack (HMR تقريباً فوري)</li>
            <li>تكوين أبسط</li>
            <li>دعم أصلي لـ TypeScript و JSX</li>
            <li>صغيرة الحجم وخفيفة</li>
          </ul>
          <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs mt-2"><code>// vite.config.js - أبسط بكثير!
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})</code></pre>
        </div>

        <div class="bg-green-50 border-l-4 border-green-500 p-4">
          <p class="font-bold text-xl mb-2">🎯 Parcel</p>
          <p class="text-gray-700 mb-2">
            أداة bundler "zero-config" لا تحتاج تكوين معقد. توفر تجربة سلسة للمبتدئين.
          </p>
          <p class="text-sm text-gray-600"><strong>المميزات:</strong></p>
          <ul class="list-disc ml-5 text-sm text-gray-700 mt-1">
            <li>بدون ملف تكوين (zero-config)</li>
            <li>سريعة وفعالة</li>
            <li>دعم تلقائي للعديد من أنواع الملفات</li>
            <li>مثالية للمشاريع الصغيرة والمتوسطة</li>
          </ul>
          <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs mt-2"><code>// لا تحتاج لملف تكوين!
// فقط أشر إلى entry point
parcel src/index.html</code></pre>
        </div>

        <div class="bg-purple-50 border-l-4 border-purple-500 p-4">
          <p class="font-bold text-xl mb-2">🦀 esbuild</p>
          <p class="text-gray-700 mb-2">
            أداة bundler مكتوبة بلغة Go. الأسرع من الناحية النظرية والعملية.
          </p>
          <p class="text-sm text-gray-600"><strong>المميزات:</strong></p>
          <ul class="list-disc ml-5 text-sm text-gray-700 mt-1">
            <li>أسرع bundler موجود (مكتوب بـ Go)</li>
            <li>ضغط وتحسين ممتاز</li>
            <li>API بسيطة</li>
            <li>تستخدمها أدوات أخرى داخلياً</li>
          </ul>
          <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs mt-2"><code>// API بسيطة جداً
import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'out.js',
})</code></pre>
        </div>

        <div class="bg-orange-50 border-l-4 border-orange-500 p-4">
          <p class="font-bold text-xl mb-2">📦 Rollup</p>
          <p class="text-gray-700 mb-2">
            أداة bundler تركز على المكتبات (libraries). جودة أفضل للـ tree-shaking.
          </p>
          <p class="text-sm text-gray-600"><strong>المميزات:</strong></p>
          <ul class="list-disc ml-5 text-sm text-gray-700 mt-1">
            <li>مثالية لبناء المكتبات</li>
            <li>tree-shaking ممتاز (إزالة الكود الغير المستخدم)</li>
            <li>دعم ESM بشكل أصلي</li>
            <li>صغيرة الحجم</li>
          </ul>
          <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs mt-2"><code>// rollup.config.js
export default {
  input: 'src/index.js',
  output: { file: 'dist/bundle.js', format: 'umd' },
  plugins: [ /* ... */ ]
}</code></pre>
        </div>

        <div class="bg-red-50 border-l-4 border-red-500 p-4">
          <p class="font-bold text-xl mb-2">🔗 Turbopack</p>
          <p class="text-gray-700 mb-2">
            أداة bundler جديدة من فريق Next.js. مكتوبة بـ Rust وتقدم أداء استثنائي.
          </p>
          <p class="text-sm text-gray-600"><strong>المميزات:</strong></p>
          <ul class="list-disc ml-5 text-sm text-gray-700 mt-1">
            <li>أداء استثنائي (مكتوبة بـ Rust)</li>
            <li>تجربة تطوير ممتازة</li>
            <li>مدمجة في Next.js</li>
            <li>الجيل الجديد من bundlers</li>
          </ul>
        </div>
      </div>

      <div class="bg-gray-50 border-l-4 border-gray-500 p-4">
        <p class="font-bold mb-3">📊 مقارنة سريعة:</p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-200">
              <tr>
                <th class="p-2 text-left">الأداة</th>
                <th class="p-2 text-left">السرعة</th>
                <th class="p-2 text-left">التكوين</th>
                <th class="p-2 text-left">الأفضل لـ</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="p-2 font-bold">Webpack</td>
                <td class="p-2">متوسط</td>
                <td class="p-2">معقد</td>
                <td class="p-2">تطبيقات كبيرة</td>
              </tr>
              <tr class="border-b">
                <td class="p-2 font-bold">Vite</td>
                <td class="p-2">سريع جداً</td>
                <td class="p-2">بسيط</td>
                <td class="p-2">React, Vue, Svelte</td>
              </tr>
              <tr class="border-b">
                <td class="p-2 font-bold">Parcel</td>
                <td class="p-2">سريع</td>
                <td class="p-2">صفر</td>
                <td class="p-2">مشاريع صغيرة</td>
              </tr>
              <tr class="border-b">
                <td class="p-2 font-bold">esbuild</td>
                <td class="p-2">الأسرع</td>
                <td class="p-2">بسيط</td>
                <td class="p-2">أدوات مخصصة</td>
              </tr>
              <tr class="border-b">
                <td class="p-2 font-bold">Rollup</td>
                <td class="p-2">سريع</td>
                <td class="p-2">متوسط</td>
                <td class="p-2">المكتبات</td>
              </tr>
              <tr>
                <td class="p-2 font-bold">Turbopack</td>
                <td class="p-2">الأسرع</td>
                <td class="p-2">بسيط</td>
                <td class="p-2">تطبيقات حديثة</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
  },
  {
    id: 4,
    title: 'كيف يعمل Bundling في التفاصيل',
    type: 'lesson',
    content: `
      <h2 class="text-2xl font-bold mb-4">كيف يعمل Bundling (التفاصيل الكاملة)</h2>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p class="font-bold mb-3">🔄 مراحل عملية Bundling:</p>
        <ol class="list-decimal ml-5 space-y-3 text-gray-700">
          <li>
            <strong>Parsing:</strong>
            <p class="text-sm mt-1">تحليل ملف البداية (entry point) وإيجاد جميع ال imports</p>
            <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs mt-1"><code>// يبحث عن:
import React from 'react'
import { Button } from './Button'
import styles from './App.css'</code></pre>
          </li>

          <li>
            <strong>Dependency Resolution:</strong>
            <p class="text-sm mt-1">البحث عن المسارات الفعلية والملفات المطلوبة</p>
            <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs mt-1"><code>// تحويل:
import { Button } from './Button'
// إلى المسار الفعلي:
/project/src/components/Button.js</code></pre>
          </li>

          <li>
            <strong>Loading & Transformation:</strong>
            <p class="text-sm mt-1">تحميل الملف واستخدام Loaders لتحويله</p>
            <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs mt-1"><code>// مثال:
// CSS Loader يحول:
import styles from './App.css'
// إلى JavaScript object:
{ color: '#fff', padding: '10px' }</code></pre>
          </li>

          <li>
            <strong>Bundling:</strong>
            <p class="text-sm mt-1">تجميع جميع الملفات في bundle واحد أو أكثر</p>
            <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs mt-1"><code>// النتيجة:
// bundle.js يحتوي على:
// - كل الـ JavaScript
// - كل ال CSS (في JS)
// - كل الصور والأصول</code></pre>
          </li>

          <li>
            <strong>Optimization:</strong>
            <p class="text-sm mt-1">تحسين وضغط الملفات النهائية</p>
            <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs mt-1"><code>// تقليل الحجم من:
app.js: 500 KB
// إلى:
app.min.js: 120 KB</code></pre>
          </li>
        </ol>
      </div>

      <div class="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
        <p class="font-bold mb-3">📁 مثال عملي للعملية:</p>

        <div class="bg-white p-3 rounded border border-gray-300 mb-3">
          <p class="font-bold text-sm mb-2">البنية الأصلية:</p>
          <pre class="text-xs text-gray-800"><code>src/
├── index.js (entry point)
├── App.js
├── Button.js
├── styles.css
└── logo.png</code></pre>
        </div>

        <div class="bg-white p-3 rounded border border-gray-300 mb-3">
          <p class="font-bold text-sm mb-2">ملف index.js:</p>
          <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs"><code>import React from 'react'
import App from './App'
import './styles.css'

ReactDOM.render(&lt;App /&gt;, document.getElementById('root'))</code></pre>
        </div>

        <div class="bg-white p-3 rounded border border-gray-300 mb-3">
          <p class="font-bold text-sm mb-2">ملف App.js:</p>
          <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs"><code>import React from 'react'
import Button from './Button'
import logo from './logo.png'

export default function App() {
  return &lt;Button icon={logo} /&gt;
}</code></pre>
        </div>

        <div class="bg-white p-3 rounded border border-gray-300">
          <p class="font-bold text-sm mb-2">النتيجة (bundle.js):</p>
          <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs"><code>// كل شيء مع بعض:
// - React
// - App component
// - Button component
// - CSS styles
// - logo (صورة مشفرة)
// - وكود webpack runtime

(function() {
  var modules = { ... }
  function require(id) { ... }
  return require('0')
})()
</code></pre>
        </div>
      </div>

      <div class="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
        <p class="font-bold mb-3">🎯 Tree Shaking (إزالة الكود الميت):</p>
        <p class="text-gray-700 mb-3">
          إذا لم تستخدم دالة معينة من مكتبة، Webpack قد يزيلها من البundle:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="bg-white p-3 rounded border border-gray-300">
            <p class="font-bold text-sm mb-2">❌ بدون Tree Shaking:</p>
            <pre class="bg-gray-800 text-red-400 p-2 rounded text-xs"><code>// تستورد الدالة
import { usedFunc, unusedFunc } from './lib'

// تستخدم واحدة فقط
usedFunc()

// الملف يحتوي على الاثنين!
// حجم البundle أكبر من اللازم</code></pre>
          </div>

          <div class="bg-white p-3 rounded border border-gray-300">
            <p class="font-bold text-sm mb-2">✅ مع Tree Shaking:</p>
            <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs"><code>// نفس الكود
import { usedFunc, unusedFunc } from './lib'
usedFunc()

// Webpack يزيل unusedFunc
// الملف أصغر!
// أداء أفضل</code></pre>
          </div>
        </div>
      </div>

      <div class="bg-green-50 border-l-4 border-green-500 p-4">
        <p class="font-bold mb-3">📊 مثال على النتائج:</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm"><code>$ webpack

asset bundle.js 162 KiB [compared for emit] (name: main)

Built in 2.5s

// الحجم النهائي صغير جداً لأن:
// - Webpack ضغط الكود
// - حذف imports غير المستخدمة
// - دمج جميع الملفات في bundle واحد
// - زحذف الوحدات المكررة</code></pre>
      </div>
    `,
  },
  {
    id: 5,
    title: 'الفرق بين Development و Production',
    type: 'lesson',
    content: `
      <h2 class="text-2xl font-bold mb-4">Development vs Production Build</h2>

      <p class="mb-4 text-gray-700">
        webpack له وضعان مختلفان: التطوير والإنتاج، كل منهما له أهداف مختلفة.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p class="font-bold text-xl mb-3">🔧 Development Mode</p>
          <p class="text-gray-700 mb-3 text-sm">
            وضع التطوير يركز على السرعة والتصحيح، وليس الحجم.
          </p>
          <ul class="list-disc ml-5 space-y-2 text-gray-700 text-sm">
            <li>ملفات بدون ضغط (كبيرة الحجم)</li>
            <li>Source maps كاملة (عرض الأكواد الأصلية)</li>
            <li>Hot Module Reloading (HMR)</li>
            <li>رسائل خطأ مفصلة</li>
            <li>لا يوجد ضغط أو تحسين</li>
          </ul>
          <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs mt-3"><code>// webpack.config.js
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    hot: true
  }
}</code></pre>
        </div>

        <div class="bg-green-50 border-l-4 border-green-500 p-4">
          <p class="font-bold text-xl mb-3">🚀 Production Mode</p>
          <p class="text-gray-700 mb-3 text-sm">
            وضع الإنتاج يركز على الأداء والحجم الصغير.
          </p>
          <ul class="list-disc ml-5 space-y-2 text-gray-700 text-sm">
            <li>ملفات مضغوطة (صغيرة جداً)</li>
            <li>Code minification</li>
            <li>Tree shaking</li>
            <li>قليل من source maps</li>
            <li>تحسينات شاملة</li>
          </ul>
          <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs mt-3"><code>// webpack.config.js
module.exports = {
  mode: 'production',
  devtool: false,
  optimization: {
    minimize: true
  }
}</code></pre>
        </div>
      </div>

      <div class="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
        <p class="font-bold mb-3">📊 المقارنة العملية:</p>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-purple-200">
              <tr>
                <th class="p-2 text-left">الخصية</th>
                <th class="p-2 text-left">Development</th>
                <th class="p-2 text-left">Production</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="p-2 font-bold">حجم Bundle</td>
                <td class="p-2">500 KB</td>
                <td class="p-2">120 KB (-76%)</td>
              </tr>
              <tr class="border-b">
                <td class="p-2 font-bold">Build Time</td>
                <td class="p-2">2 seconds</td>
                <td class="p-2">10 seconds</td>
              </tr>
              <tr class="border-b">
                <td class="p-2 font-bold">Source Maps</td>
                <td class="p-2">كاملة</td>
                <td class="p-2">منقطعة/قليلة</td>
              </tr>
              <tr class="border-b">
                <td class="p-2 font-bold">تصحيح الأخطاء</td>
                <td class="p-2">سهل جداً</td>
                <td class="p-2">صعب</td>
              </tr>
              <tr>
                <td class="p-2 font-bold">الأداء</td>
                <td class="p-2">متوسط</td>
                <td class="p-2">ممتاز</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-orange-50 border-l-4 border-orange-500 p-4">
        <p class="font-bold mb-3">🎯 مثال: أوامر npm.scripts</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm"><code>// package.json
{
  "scripts": {
    // Development - بناء سريع للتطوير
    "dev": "webpack serve --mode development",

    // Production - بناء محسن للنشر
    "build": "webpack --mode production"
  }
}

// استخدام:
npm run dev    // أثناء التطوير
npm run build  // قبل النشر في الإنتاج</code></pre>
      </div>
    `,
  },
  {
    id: 6,
    title: 'أفضل الممارسات والنصائح',
    type: 'lesson',
    content: `
      <h2 class="text-2xl font-bold mb-4">أفضل الممارسات والنصائح</h2>

      <div class="space-y-4">
        <div class="bg-green-50 border-l-4 border-green-500 p-4">
          <p class="font-bold text-lg mb-3">✅ 1. استخدم المسارات المطلقة</p>
          <p class="text-gray-700 mb-3">بدلاً من المسارات النسبية المعقدة:</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p class="font-bold text-sm mb-1">❌ خطأ:</p>
              <pre class="bg-gray-800 text-red-400 p-2 rounded text-xs"><code>import Button from '../../components/Button'</code></pre>
            </div>
            <div>
              <p class="font-bold text-sm mb-1">✅ صحيح:</p>
              <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs"><code>import Button from '@/components/Button'</code></pre>
            </div>
          </div>

          <p class="text-gray-700 text-sm mt-2">
            استخدم alias في webpack:
          </p>
          <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs mt-2"><code>// webpack.config.js
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src/')
  }
}</code></pre>
        </div>

        <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p class="font-bold text-lg mb-3">✅ 2. Code Splitting (تقسيم الكود)</p>
          <p class="text-gray-700 mb-3">
            بدلاً من bundle واحد كبير، قسمه إلى أجزاء:
          </p>
          <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>// webpack.config.js
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      // ملف منفصل للمكتبات الخارجية
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10
      },
      // ملف منفصل للكود المشترك
      common: {
        minChunks: 2,
        priority: 5
      }
    }
  }
}

// النتيجة:
// - vendors.js (React, lodash, إلخ)
// - app.js (كودك)
// - common.js (كود مشترك)</code></pre>
          <p class="text-gray-700 text-sm mt-2">
            المميزة: إذا غيرت كودك، vendors.js يبقى مخزن مؤقتاً ويحمل أسرع
          </p>
        </div>

        <div class="bg-purple-50 border-l-4 border-purple-500 p-4">
          <p class="font-bold text-lg mb-3">✅ 3. Lazy Loading للمكونات</p>
          <p class="text-gray-700 mb-3">
            حمل المكونات فقط عند الحاجة:
          </p>
          <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>// بدون lazy loading:
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
// الاثنين يحملان في البداية!

// مع lazy loading:
const Dashboard = React.lazy(() =>
  import('./pages/Dashboard')
)
const Settings = React.lazy(() =>
  import('./pages/Settings')
)

// الآن كل صفحة تحمل عند فتحها فقط!
// البحجم الأولي أصغر
// الأداء أفضل</code></pre>
        </div>

        <div class="bg-orange-50 border-l-4 border-orange-500 p-4">
          <p class="font-bold text-lg mb-3">✅ 4. استخدم Source Maps في الإنتاج</p>
          <p class="text-gray-700 mb-3">
            لتصحيح الأخطاء التي تحدث في الإنتاج:
          </p>
          <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>// webpack.config.js
devtool: process.env.NODE_ENV === 'production'
  ? 'source-map' // في الإنتاج، قليل
  : 'eval-source-map' // في التطوير، كامل

// Source maps الخارجية لا تحمل بـ default
// المستخدمون لن يعرفوا بها</code></pre>
        </div>

        <div class="bg-red-50 border-l-4 border-red-500 p-4">
          <p class="font-bold text-lg mb-3">✅ 5. مراقبة حجم البundle</p>
          <p class="text-gray-700 mb-3">
            استخدم أداة لمراقبة حجم الملفات:
          </p>
          <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>// webpack-bundle-analyzer
const BundleAnalyzer = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

plugins: [
  new BundleAnalyzer()
]

// يفتح رسم بياني تفاعلي يوضح:
// - حجم كل مكتبة
// - أكبر الملفات
// - الملفات المكررة</code></pre>
        </div>

        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p class="font-bold text-lg mb-3">✅ 6. استخدم Caching</p>
          <p class="text-gray-700 mb-3">
            استفد من تخزين المتصفح المؤقت:
          </p>
          <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>// webpack.config.js
output: {
  filename: '[name].[contenthash].js',
  // يضيف hash للملف بناءً على محتوياته
  // إذا تغير المحتوى، الـ hash يتغير
  // إذا لم يتغير، المتصفح يحمله من الـ cache
}

// النتائج:
// app.a1b2c3d4.js (hash أول)
// app.e5f6g7h8.js (hash جديد بعد التعديل)</code></pre>
        </div>

        <div class="bg-green-50 border-l-4 border-green-500 p-4">
          <p class="font-bold text-lg mb-3">✅ 7. مراقب الحجم في CI/CD</p>
          <p class="text-gray-700 mb-3">
            تحقق من حجم البundle في كل commit:
          </p>
          <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>// GitHub Actions مثال
- name: Check bundle size
  run: |
    npm run build
    SIZE=$(wc -c &lt; dist/app.js)
    if [ $SIZE -gt 150000 ]; then
      echo "Bundle too large!"
      exit 1
    fi

// يوقف البناء إذا تجاوز الحجم الحد الأقصى</code></pre>
        </div>
      </div>

      <div class="bg-gray-50 border-l-4 border-gray-500 p-4 mt-4">
        <p class="font-bold mb-3">📝 ملخص النصائح:</p>
        <ul class="list-disc ml-5 space-y-1 text-gray-700 text-sm">
          <li>استخدم aliases للمسارات</li>
          <li>قسم الكود (code splitting)</li>
          <li>حمل المكونات عند الحاجة (lazy loading)</li>
          <li>راقب حجم البundle</li>
          <li>استخدم caching للأداء</li>
          <li>تعقب حجم الملفات في CI/CD</li>
          <li>قلل عدد المكتبات الخارجية</li>
        </ul>
      </div>
    `,
  },
]
