import { useEffect, useState } from 'react'

import SearchBar from './components/SearchBar'
import { allInterviewTopics } from './interview/index'
import InterviewPrep from './interview/InterviewPrep'
import { useStreakStore } from './interview/useStreakStore'
import EventLoopTutorial from './tutorials/EventLoop'
import HTMLAccessibilityTutorial from './tutorials/HTMLAccessibility'
import ReactAxiosTutorial from './tutorials/ReactAxios'
import ReactBestPracticesTutorial from './tutorials/ReactBestPractices'
import ReactFormsTutorial from './tutorials/ReactForms'
import ReactHooksTutorial from './tutorials/ReactHooks'
import ReactLocalizationTutorial from './tutorials/ReactLocalization'
import ReactRouterTutorial from './tutorials/ReactRouter'
import RxJSTutorial from './tutorials/RxJS'
import WebpackBundlersTutorial from './tutorials/WebpackBundlers'

// ── Types ──────────────────────────────────────────────────────────────────

interface TutorialMeta {
  id: string
  title: string
  description: string
  icon: string
}

interface Section {
  title: string
  color: string   // Tailwind border-l color class
  tutorials: TutorialMeta[]
}

type AppMode = 'learn' | 'interview'

interface RouteState {
  mode: AppMode
  id: string | null
}

// ── Catalogue ──────────────────────────────────────────────────────────────

const sections: Section[] = [
  {
    title: '⚛️ React',
    color: 'border-cyan-400',
    tutorials: [
      { id: 'react-router',         icon: '🗺️', title: 'React Router',      description: 'Client-side routing, dynamic params, nested layouts, guards and programmatic navigation.' },
      { id: 'react-localization',   icon: '🌍', title: 'Localization (i18n)', description: 'Internationalise your app with react-i18next, plurals, RTL support and Intl formatting.' },
      { id: 'react-forms',          icon: '📝', title: 'Forms',               description: 'Controlled inputs, Zod validation, React Hook Form, async submission and UX patterns.' },
      { id: 'react-hooks',          icon: '🪝', title: 'React Hooks',         description: 'useState, useEffect, useContext, useReducer, useMemo, useCallback, useRef, useLayoutEffect — with interview Q&A.' },
      { id: 'react-axios',          icon: '🌐', title: 'Axios',               description: 'Axios instance, interceptors, error handling, cancellation, upload progress and React Query integration.' },
      { id: 'react-best-practices', icon: '⭐', title: 'Best Practices',      description: 'Component design, state management, performance, custom hooks and error boundaries.' },
    ],
  },
  {
    title: '🅰️ Angular',
    color: 'border-red-400',
    tutorials: [
      { id: 'rxjs', icon: '🔀', title: 'RxJS', description: 'Observables, Subjects, switchMap, mergeMap, combineLatest, error handling and Angular-specific patterns.' },
    ],
  },
  {
    title: '🧠 JavaScript',
    color: 'border-yellow-400',
    tutorials: [
      { id: 'event-loop', icon: '⚙️', title: 'Event Loop', description: 'Call stack, Web APIs, microtask & macrotask queues, async/await internals — visualized step by step.' },
    ],
  },
  {
    title: '🌐 Web',
    color: 'border-green-400',
    tutorials: [
      { id: 'html-accessibility', icon: '♿', title: 'HTML Accessibility', description: 'Semantic HTML, ARIA attributes and accessible form patterns.' },
    ],
  },
  {
    title: '🛠️ Tooling',
    color: 'border-slate-400',
    tutorials: [
      { id: 'webpack-bundlers', icon: '🔧', title: 'Webpack & Bundlers', description: 'Webpack core concepts, Vite, Parcel, esbuild, Rollup — how bundling really works.' },
    ],
  },
]

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

// Which tutorial IDs have a matching interview topic cross-link
const tutorialsWithInterviewLink = new Set(
  allInterviewTopics
    .filter(t => t.relatedTutorialId)
    .map(t => t.relatedTutorialId!)
)

// ── Routing helpers ────────────────────────────────────────────────────────

function parseHash(hash: string): RouteState {
  const parts = hash.replace(/^#/, '').split('/')
  const mode: AppMode = parts[0] === 'interview' ? 'interview' : 'learn'
  return { mode, id: parts[1] ?? null }
}

function buildHash(mode: AppMode, id: string | null): string {
  return id ? `#${mode}/${id}` : `#${mode}`
}

// ── Streak widget ──────────────────────────────────────────────────────────

function StreakWidget() {
  const { streak, todayCount, dailyGoal, cycleGoal } = useStreakStore()
  const pct = Math.min((todayCount / dailyGoal) * 100, 100)
  return (
    <button
      onClick={cycleGoal}
      title={`Today: ${todayCount}/${dailyGoal} — click to change goal`}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
    >
      <span className="text-sm">🔥</span>
      <span className="text-sm font-bold text-white">{streak}</span>
      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-400 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-slate-400">{todayCount}/{dailyGoal}</span>
    </button>
  )
}

// ── App ────────────────────────────────────────────────────────────────────

export default function App() {
  const [mode, setMode]         = useState<AppMode>('learn')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [learnSearch, setLearnSearch] = useState('')

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

  function switchMode(m: AppMode)            { navigate(m, null) }
  function openTutorial(id: string)          { navigate('learn', id) }
  function openInterviewTopic(id: string)    { navigate('interview', id) }
  function goHome()                          { navigate(mode, null) }

  useEffect(() => {
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

  // Filtered learn sections
  const q = learnSearch.toLowerCase().trim()
  const filteredSections = q
    ? sections.map(s => ({
        ...s,
        tutorials: s.tutorials.filter(t =>
          (t.title + ' ' + t.description).toLowerCase().includes(q)
        ),
      })).filter(s => s.tutorials.length > 0)
    : sections

  return (
    <div className="min-h-screen bg-slate-800">

      {/* ── Header ── */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              📚 StudyPal
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">Interactive Learning Platform</p>
          </div>

          <div className="flex items-center gap-3">
            <StreakWidget />

            {!selectedId && (
              <div className="flex bg-slate-800 rounded-xl p-1 gap-1">
                <button
                  onClick={() => switchMode('learn')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    mode === 'learn'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📖 Learn
                </button>
                <button
                  onClick={() => switchMode('interview')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    mode === 'interview'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🎯 Interview Prep
                </button>
              </div>
            )}

            {selectedId && (
              <button
                onClick={goHome}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white border border-slate-700 rounded-lg transition"
              >
                ← {mode === 'interview' ? 'All Topics' : 'All Tutorials'}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Interview Prep mode ── */}
        {mode === 'interview' && (
          <InterviewPrep
            selectedTopicId={selectedId}
            onSelectTopic={openInterviewTopic}
            onBack={goHome}
            onOpenTutorial={openTutorial}
          />
        )}

        {/* ── Learn mode ── */}
        {mode === 'learn' && (
          activeComponent ? (
            activeComponent
          ) : (
            <div className="space-y-10">
              {/* Search */}
              <div className="max-w-md">
                <SearchBar
                  value={learnSearch}
                  onChange={setLearnSearch}
                  placeholder="Search tutorials…"
                />
              </div>

              {filteredSections.map(section => (
                <div key={section.title}>
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                    {section.title}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.tutorials.map(tutorial => (
                      <button
                        key={tutorial.id}
                        onClick={() => openTutorial(tutorial.id)}
                        className={`bg-white rounded-xl shadow-sm p-5 text-left border-l-4 ${section.color} hover:shadow-lg hover:-translate-y-1 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 group animate-fade-up`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-3xl group-hover:scale-110 transition-transform">
                            {tutorial.icon}
                          </span>
                          {tutorialsWithInterviewLink.has(tutorial.id) && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 font-medium">
                              🎯 Interview Q
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">
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

              {filteredSections.length === 0 && (
                <p className="text-slate-500 text-sm">No tutorials match "{learnSearch}".</p>
              )}
            </div>
          )
        )}
      </main>
    </div>
  )
}
