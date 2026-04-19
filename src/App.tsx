/**
 * App.tsx — Root application component
 *
 * BEST PRACTICE: Keep App.tsx thin.
 * It owns only the tutorial catalogue and the "which tutorial is selected" state.
 * All content lives in tutorial components; all layout lives in section data.
 */

import { useState } from 'react'

// ── Tutorial components ────────────────────────────────────────────────────
import HTMLAccessibilityTutorial from './tutorials/HTMLAccessibility'
import WebpackBundlersTutorial   from './tutorials/WebpackBundlers'
import ReactRouterTutorial       from './tutorials/ReactRouter'
import ReactLocalizationTutorial from './tutorials/ReactLocalization'
import ReactFormsTutorial        from './tutorials/ReactForms'
import ReactBestPracticesTutorial from './tutorials/ReactBestPractices'

// ── Types ──────────────────────────────────────────────────────────────────

interface TutorialMeta {
  id: string
  title: string
  description: string
  icon: string
}

interface Section {
  title: string
  tutorials: TutorialMeta[]
}

// ── Catalogue ──────────────────────────────────────────────────────────────

/**
 * BEST PRACTICE: Keep catalogue data outside the component.
 * It never changes, so there's no reason to recreate it on each render.
 */
const sections: Section[] = [
  {
    title: '⚛️ React',
    tutorials: [
      {
        id: 'react-router',
        icon: '🗺️',
        title: 'React Router',
        description: 'Client-side routing, dynamic params, nested layouts, guards and programmatic navigation.',
      },
      {
        id: 'react-localization',
        icon: '🌍',
        title: 'Localization (i18n)',
        description: 'Internationalise your app with react-i18next, plurals, RTL support and Intl formatting.',
      },
      {
        id: 'react-forms',
        icon: '📝',
        title: 'Forms',
        description: 'Controlled inputs, Zod validation, React Hook Form, async submission and UX patterns.',
      },
      {
        id: 'react-best-practices',
        icon: '⭐',
        title: 'Best Practices',
        description: 'Component design, state management, performance, custom hooks and error boundaries.',
      },
    ],
  },
  {
    title: '🌐 Web',
    tutorials: [
      {
        id: 'html-accessibility',
        icon: '♿',
        title: 'HTML Accessibility',
        description: 'Semantic HTML, ARIA attributes and accessible form patterns.',
      },
    ],
  },
  {
    title: '🛠️ Tooling',
    tutorials: [
      {
        id: 'webpack-bundlers',
        icon: '🔧',
        title: 'Webpack & Bundlers',
        description: 'Webpack core concepts, Vite, Parcel, esbuild, Rollup — how bundling really works.',
      },
    ],
  },
]

// ── Tutorial renderer ──────────────────────────────────────────────────────

/**
 * Maps a tutorial ID to its component.
 *
 * BEST PRACTICE: Use a lookup object instead of a long if/else chain.
 * Adding a new tutorial = one new line here + one new section entry above.
 */
const tutorialComponents: Record<string, React.ReactElement> = {
  'react-router':         <ReactRouterTutorial />,
  'react-localization':   <ReactLocalizationTutorial />,
  'react-forms':          <ReactFormsTutorial />,
  'react-best-practices': <ReactBestPracticesTutorial />,
  'html-accessibility':   <HTMLAccessibilityTutorial />,
  'webpack-bundlers':     <WebpackBundlersTutorial />,
}

// ── Component ─────────────────────────────────────────────────────────────

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const activeComponent = selectedId ? tutorialComponents[selectedId] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* ── Global header ── */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📚 StudyPal</h1>
            <p className="text-gray-500 text-sm mt-0.5">Interactive Learning Platform</p>
          </div>

          {/* Back button — only visible inside a tutorial */}
          {selectedId && (
            <button
              onClick={() => setSelectedId(null)}
              className="px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-800 transition"
            >
              ← All Tutorials
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">

        {/* ── Tutorial view ── */}
        {activeComponent ? (
          activeComponent
        ) : (

          /* ── Home — sections + cards ── */
          <div className="space-y-12">
            {sections.map(section => (
              <div key={section.title}>
                <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">
                  {section.title}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {section.tutorials.map(tutorial => (
                    <button
                      key={tutorial.id}
                      onClick={() => setSelectedId(tutorial.id)}
                      className="bg-white rounded-xl shadow-md p-6 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <span className="text-4xl">{tutorial.icon}</span>
                      <h3 className="text-lg font-bold text-gray-900 mt-3 mb-1">
                        {tutorial.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {tutorial.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
