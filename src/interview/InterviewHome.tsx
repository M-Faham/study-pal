import { useState } from 'react'
import type { IInterviewTopic, InterviewTarget, TopicProgress, InterviewStore } from './types'
import SearchBar from '../components/SearchBar'

// ── Constants ──────────────────────────────────────────────────────────────

const TARGETS: InterviewTarget[] = ['Angular', 'React', 'TypeScript', 'General']

const TARGET_STYLE: Record<InterviewTarget, string> = {
  Angular:    'bg-red-900/40 text-red-300 border-red-800',
  React:      'bg-cyan-900/40 text-cyan-300 border-cyan-800',
  TypeScript: 'bg-blue-900/40 text-blue-300 border-blue-800',
  General:    'bg-slate-700 text-slate-300 border-slate-600',
}

const TARGET_ACTIVE: Record<InterviewTarget, string> = {
  Angular:    'bg-red-500 text-white border-red-500',
  React:      'bg-cyan-500 text-white border-cyan-500',
  TypeScript: 'bg-blue-500 text-white border-blue-500',
  General:    'bg-slate-500 text-white border-slate-500',
}

const TARGET_CARD_STYLE: Record<InterviewTarget, string> = {
  Angular:    'bg-red-50 text-red-700 border-red-200',
  React:      'bg-cyan-50 text-cyan-700 border-cyan-200',
  TypeScript: 'bg-blue-50 text-blue-700 border-blue-200',
  General:    'bg-gray-100 text-gray-600 border-gray-200',
}

const DIFFICULTY_STYLE: Record<string, string> = {
  Core:         'bg-blue-100 text-blue-700',
  Tricky:       'bg-orange-100 text-orange-700',
  Architecture: 'bg-purple-100 text-purple-700',
}

const PROGRESS_STYLE: Record<TopicProgress, string> = {
  'not-started': 'text-slate-500',
  'reviewed':    'text-yellow-400',
  'confident':   'text-green-400',
}

const PROGRESS_DOT: Record<TopicProgress, string> = {
  'not-started': '○',
  'reviewed':    '◑',
  'confident':   '●',
}

// ── Sidebar topic item ────────────────────────────────────────────────────

function SidebarItem({
  topic, progress, score, active, onClick,
}: {
  topic: IInterviewTopic
  progress: TopicProgress
  score: number | null
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 transition ${
        active ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'
      }`}
    >
      <span className="text-lg shrink-0">{topic.icon}</span>
      <span className="flex-1 text-sm font-medium leading-tight truncate">{topic.title}</span>
      <span className={`text-xs shrink-0 ${active ? 'text-indigo-200' : PROGRESS_STYLE[progress]}`}>
        {PROGRESS_DOT[progress]}
        {score !== null && <span className="ml-1">{score}%</span>}
      </span>
    </button>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

interface Props {
  topics: IInterviewTopic[]
  store: InterviewStore
  onSelect: (id: string) => void
  onMockInterview: () => void
  onLiveCoding: () => void
  selectedTopicId: string | null
}

export default function InterviewHome({ topics, store, onSelect, onMockInterview, onLiveCoding, selectedTopicId }: Props) {
  const [activeTargets, setActiveTargets] = useState<Set<InterviewTarget>>(new Set())
  const [weakOnly, setWeakOnly]           = useState(false)
  const [sidebarOpen, setSidebarOpen]     = useState(false)
  const [search, setSearch]               = useState('')

  function toggleTarget(t: InterviewTarget) {
    setActiveTargets(prev => {
      const next = new Set(prev)
      next.has(t) ? next.delete(t) : next.add(t)
      return next
    })
  }

  const q = search.toLowerCase().trim()

  const filtered = topics.filter(t => {
    if (activeTargets.size > 0 && !t.targets.some(tg => activeTargets.has(tg))) return false
    if (weakOnly) {
      const s = store[t.id]
      if (s && s.lastScore !== null && s.lastScore >= 80) return false
    }
    if (q) {
      const haystack = [t.title, ...t.cheatSheet.map(c => c.concept)].join(' ').toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })

  const totalConfident = topics.filter(t => store[t.id]?.progress === 'confident').length

  const sections: Record<string, IInterviewTopic[]> = {}
  filtered.forEach(t => {
    const section = t.targets.includes('Angular') ? '🅰️ Angular'
      : t.targets.includes('React') ? '⚛️ React'
      : t.targets.includes('TypeScript') ? '🔷 TypeScript'
      : '🌐 General'
    if (!sections[section]) sections[section] = []
    sections[section].push(t)
  })

  const sidebar = (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Search */}
      <div className="p-3 border-b border-slate-800">
        <SearchBar value={search} onChange={setSearch} placeholder="Search topics…" />
      </div>

      {/* Filters */}
      <div className="p-3 border-b border-slate-800">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Focus on</p>
        <div className="flex flex-wrap gap-1.5">
          {TARGETS.map(t => (
            <button
              key={t}
              onClick={() => toggleTarget(t)}
              className={`text-xs px-2 py-1 rounded-full border font-medium transition ${
                activeTargets.has(t) ? TARGET_ACTIVE[t] : TARGET_STYLE[t]
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={() => setWeakOnly(w => !w)}
          className={`mt-2 w-full text-xs px-2 py-1.5 rounded-lg border font-medium transition ${
            weakOnly ? 'bg-red-500 text-white border-red-500' : 'border-slate-700 text-slate-400 hover:border-red-500'
          }`}
        >
          🔥 {weakOnly ? 'Showing weak spots' : 'Show weak spots only'}
        </button>
      </div>

      {/* Progress summary */}
      <div className="px-3 py-2.5 border-b border-slate-800">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Confident</span>
          <span>{totalConfident}/{topics.length}</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all"
            style={{ width: `${(totalConfident / topics.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Topic list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">No topics match your filters.</p>
        ) : (
          Object.entries(sections).map(([section, sTopics]) => (
            <div key={section}>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-1">{section}</p>
              <div className="space-y-0.5">
                {sTopics.map(t => {
                  const state = store[t.id]
                  return (
                    <SidebarItem
                      key={t.id}
                      topic={t}
                      progress={state?.progress ?? 'not-started'}
                      score={state?.lastScore ?? null}
                      active={t.id === selectedTopicId}
                      onClick={() => { onSelect(t.id); setSidebarOpen(false) }}
                    />
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  return (
    <div className="flex gap-0 -mx-4 md:mx-0">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-slate-900 rounded-2xl overflow-hidden h-[calc(100vh-140px)] sticky top-6">
        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-white text-sm">🎯 Interview Prep</h2>
          <div className="flex gap-1.5">
            <button
              onClick={onLiveCoding}
              className="text-xs px-2 py-1 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition"
            >
              💻 Code
            </button>
            <button
              onClick={onMockInterview}
              className="text-xs px-2 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              🎲 Mock
            </button>
          </div>
        </div>
        {sidebar}
      </aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 flex flex-col shadow-xl">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <h2 className="font-bold text-white text-sm">🎯 Interview Prep</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 text-lg">✕</button>
            </div>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 px-4 md:px-0 md:pl-6">

        {/* Mobile top bar */}
        <div className="flex items-center gap-3 mb-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-700 shadow-sm"
          >
            ☰ Topics
          </button>
          <button
            onClick={onLiveCoding}
            className="px-3 py-2 bg-slate-700 text-white rounded-lg text-sm font-medium"
          >
            💻 Live Coding
          </button>
          <button
            onClick={onMockInterview}
            className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium"
          >
            🎲 Mock
          </button>
        </div>

        {/* Home grid */}
        {!selectedTopicId && (
          <div className="space-y-8 animate-fade-up">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h1 className="text-xl font-bold text-gray-900 mb-1">Pick a topic to study</h1>
              <p className="text-sm text-gray-500">
                Cheat sheet · model answer · traps · quiz · flashcards — for every topic.
              </p>
            </div>

            {Object.entries(sections).map(([section, sTopics]) => (
              <div key={section}>
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{section}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sTopics.map(t => {
                    const state    = store[t.id]
                    const progress = state?.progress ?? 'not-started'
                    const score    = state?.lastScore ?? null
                    return (
                      <button
                        key={t.id}
                        onClick={() => onSelect(t.id)}
                        className="bg-white rounded-xl shadow-sm p-4 text-left border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all group animate-fade-up"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-2xl group-hover:scale-110 transition-transform">{t.icon}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_STYLE[t.difficulty]}`}>
                            {t.difficulty}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-800 text-sm mb-2">{t.title}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1 flex-wrap">
                            {t.targets.map(tg => (
                              <span key={tg} className={`text-xs px-1.5 py-0.5 rounded border ${TARGET_CARD_STYLE[tg]}`}>{tg}</span>
                            ))}
                          </div>
                          <span className={`text-xs font-semibold ${PROGRESS_STYLE[progress]}`}>
                            {PROGRESS_DOT[progress]} {score !== null ? score + '%' : ''}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
