/**
 * App.tsx — Root application component
 *
 * BEST PRACTICE: Keep App.tsx thin.
 * It owns only the tutorial catalogue and the "which tutorial is selected" state.
 * All content lives in tutorial components; all layout lives in section data.
 */

import { useState, useEffect } from 'react'

// ── Tutorial components ────────────────────────────────────────────────────
import HTMLAccessibilityTutorial from './tutorials/HTMLAccessibility'
import WebpackBundlersTutorial   from './tutorials/WebpackBundlers'
import ReactRouterTutorial       from './tutorials/ReactRouter'
import ReactLocalizationTutorial from './tutorials/ReactLocalization'
import ReactFormsTutorial        from './tutorials/ReactForms'
import ReactBestPracticesTutorial from './tutorials/ReactBestPractices'
import EventLoopTutorial          from './tutorials/EventLoop'
import RxJSTutorial               from './tutorials/RxJS'
import ReactAxiosTutorial         from './tutorials/ReactAxios'
import ReactHooksTutorial         from './tutorials/ReactHooks'
import InterviewPrep              from './interview/InterviewPrep'

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
        id: 'react-hooks',
        icon: '🪝',
        title: 'React Hooks',
        description: 'useState, useEffect, useContext, useReducer, useMemo, useCallback, useRef, useLayoutEffect — with interview Q&A.',
      },
      {
        id: 'react-axios',
        icon: '🌐',
        title: 'Axios',
        description: 'Axios instance, interceptors, error handling, cancellation, upload progress and React Query integration.',
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
    title: '🅰️ Angular',
    tutorials: [
      {
        id: 'rxjs',
        icon: '🔀',
        title: 'RxJS',
        description: 'Observables, Subjects, switchMap, mergeMap, combineLatest, error handling and Angular-specific patterns.',
      },
    ],
  },
  {
    title: '🧠 JavaScript',
    tutorials: [
      {
        id: 'event-loop',
        icon: '⚙️',
        title: 'Event Loop',
        description: 'Call stack, Web APIs, microtask & macrotask queues, async/await internals — visualized step by step.',
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
  'react-hooks':          <ReactHooksTutorial />,
  'react-axios':          <ReactAxiosTutorial />,
  'event-loop':           <EventLoopTutorial />,
  'rxjs':                 <RxJSTutorial />,
}

// ── Top-level mode ─────────────────────────────────────────────────────────

type AppMode = 'learn' | 'interview'

// ── Component ─────────────────────────────────────────────────────────────

// ── Hash-based routing helpers ─────────────────────────────────────────────
// URL scheme:
//   #learn              → Learn home
//   #learn/react-hooks  → specific tutorial
//   #interview          → Interview Prep home
//   #interview/rxjs     → specific interview topic

interface RouteState {
  mode: AppMode
  id: string | null   // tutorial or interview topic id
}

function parseHash(hash: string): RouteState {
  const parts = hash.replace(/^#/, '').split('/')
  const mode: AppMode = parts[0] === 'interview' ? 'interview' : 'learn'
  const id = parts[1] ?? null
  return { mode, id }
}

function buildHash(mode: AppMode, id: string | null): string {
  return id ? `#${mode}/${id}` : `#${mode}`
}

// ── Component ─────────────────────────────────────────────────────────────

export default function App() {
  const [mode, setMode] = useState<AppMode>('learn')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  function applyRoute({ mode: m, id }: RouteState) {
    setMode(m)
    setSelectedId(id)
  }

  function navigate(m: AppMode, id: string | null, replace = false) {
    const hash = buildHash(m, id)
    const state: RouteState = { mode: m, id }
    if (replace) history.replaceState(state, '', hash)
    else         history.pushState(state, '', hash)
    applyRoute(state)
  }

  function switchMode(m: AppMode)       { navigate(m, null) }
  function openTutorial(id: string)     { navigate('learn', id) }
  function openInterviewTopic(id: string) { navigate('interview', id) }
  function goHome()                     { navigate(mode, null) }

  useEffect(() => {
    // On first load, parse the hash to restore state
    const initial = parseHash(location.hash || '#learn')
    navigate(initial.mode, initial.id, true)

    function onPopState(e: PopStateEvent) {
      const s = e.state as RouteState | null
      applyRoute(s ?? { mode: 'learn', id: null })
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const activeComponent = selectedId && mode === 'learn'
    ? tutorialComponents[selectedId] ?? null
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* ── Global header ── */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📚 StudyPal</h1>
            <p className="text-gray-500 text-xs mt-0.5">Interactive Learning Platform</p>
          </div>

          {/* Mode switcher — hidden when inside a tutorial */}
          {!selectedId && (
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => switchMode('learn')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  mode === 'learn'
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📖 Learn
              </button>
              <button
                onClick={() => switchMode('interview')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  mode === 'interview'
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🎯 Interview Prep
              </button>
            </div>
          )}

          {selectedId && (
            <button
              onClick={goHome}
              className="px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-800 transition"
            >
              ← {mode === 'interview' ? 'All Topics' : 'All Tutorials'}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">

        {/* ── Interview Prep mode ── */}
        {mode === 'interview' && (
          <InterviewPrep
            selectedTopicId={selectedId}
            onSelectTopic={openInterviewTopic}
            onBack={goHome}
          />
        )}

        {/* ── Learn mode ── */}
        {mode === 'learn' && (
          activeComponent ? (
            activeComponent
          ) : (
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
                        onClick={() => openTutorial(tutorial.id)}
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
          )
        )}
      </main>
    </div>
  )
}
