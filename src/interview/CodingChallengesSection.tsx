import { useState } from 'react'
import { codingChallenges } from './coding-challenges'
import type { ICodingChallenge, ChallengeCategory, ChallengeDifficulty } from './coding-challenges'
import CodeBlock from '../components/CodeBlock'

// ── Constants ────────────────────────────────────────────────────────────────

const DIFFICULTY_STYLE: Record<ChallengeDifficulty, string> = {
  Easy:   'bg-green-100 text-green-700',
  Medium: 'bg-orange-100 text-orange-700',
  Hard:   'bg-red-100 text-red-700',
}

const CATEGORY_STYLE: Record<ChallengeCategory, string> = {
  Angular:    'bg-red-900/40 text-red-300 border-red-800',
  JavaScript: 'bg-yellow-900/40 text-yellow-300 border-yellow-800',
}

const CATEGORY_ACTIVE: Record<ChallengeCategory, string> = {
  Angular:    'bg-red-500 text-white border-red-500',
  JavaScript: 'bg-yellow-500 text-white border-yellow-500',
}

// ── Sidebar item ─────────────────────────────────────────────────────────────

function ChallengeItem({
  challenge, active, onClick,
}: {
  challenge: ICodingChallenge
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg transition ${
        active ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <span className="text-sm font-medium leading-tight truncate">{challenge.title}</span>
        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded shrink-0 ${
          active ? 'bg-white/20 text-white' : DIFFICULTY_STYLE[challenge.difficulty]
        }`}>
          {challenge.difficulty}
        </span>
      </div>
      <span className={`text-xs px-1.5 py-0.5 rounded border ${
        active ? 'bg-white/10 text-indigo-200 border-white/20' : CATEGORY_STYLE[challenge.category]
      }`}>
        {challenge.category}
      </span>
    </button>
  )
}

// ── Challenge detail ─────────────────────────────────────────────────────────

function ChallengeDetail({ challenge }: { challenge: ICodingChallenge }) {
  const [showSolution, setShowSolution] = useState(false)

  return (
    <div className="space-y-5 animate-fade-up" key={challenge.id}>

      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-lg font-bold text-gray-900">{challenge.title}</h2>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_STYLE[challenge.difficulty]}`}>
              {challenge.difficulty}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded border ${CATEGORY_STYLE[challenge.category]}`}>
              {challenge.category}
            </span>
          </div>
        </div>

        {/* Prompt */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">🎤 The Question</p>
          <p className="text-gray-700 text-sm leading-relaxed">{challenge.prompt}</p>
        </div>
      </div>

      {/* Approach */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">🧠 How to Approach It</p>
        <div
          className="text-sm leading-relaxed text-gray-600 space-y-1"
          dangerouslySetInnerHTML={{ __html: challenge.approach }}
        />
      </div>

      {/* Solution */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-green-600 uppercase tracking-widest">✅ Final Solution</p>
          <button
            onClick={() => setShowSolution(s => !s)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
              showSolution
                ? 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {showSolution ? 'Hide Solution' : 'Reveal Solution'}
          </button>
        </div>

        {!showSolution && (
          <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300 text-center">
            <p className="text-sm text-slate-400">Try working through the approach above first.</p>
            <p className="text-xs text-slate-400 mt-1">Click "Reveal Solution" when you're ready.</p>
          </div>
        )}

        {showSolution && <CodeBlock code={challenge.solution} />}
      </div>
    </div>
  )
}

// ── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center animate-fade-up">
      <p className="text-3xl mb-3">💻</p>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Live Coding Challenges</h2>
      <p className="text-sm text-gray-500 max-w-sm mx-auto">
        Each challenge includes the interviewer's question, a step-by-step approach to think through out loud, and the final clean solution.
      </p>
      <p className="text-xs text-gray-400 mt-3">Pick a challenge from the sidebar to begin.</p>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

const CATEGORIES: ChallengeCategory[] = ['Angular', 'JavaScript']

export default function CodingChallengesSection() {
  const [selectedId, setSelectedId]         = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<ChallengeCategory | null>(null)
  const [sidebarOpen, setSidebarOpen]       = useState(false)

  const filtered = activeCategory
    ? codingChallenges.filter(c => c.category === activeCategory)
    : codingChallenges

  const selected = selectedId ? codingChallenges.find(c => c.id === selectedId) ?? null : null

  const angularChallenges    = filtered.filter(c => c.category === 'Angular')
  const javascriptChallenges = filtered.filter(c => c.category === 'JavaScript')

  const sidebar = (
    <div className="flex flex-col h-full bg-slate-900">

      {/* Category filter */}
      <div className="p-3 border-b border-slate-800">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</p>
        <div className="flex gap-1.5">
          <button
            onClick={() => setActiveCategory(null)}
            className={`text-xs px-2.5 py-1 rounded-full border font-medium transition ${
              activeCategory === null
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-slate-600 text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(c => c === cat ? null : cat)}
              className={`text-xs px-2.5 py-1 rounded-full border font-medium transition ${
                activeCategory === cat ? CATEGORY_ACTIVE[cat] : CATEGORY_STYLE[cat]
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {angularChallenges.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-1">🅰️ Angular</p>
            <div className="space-y-0.5">
              {angularChallenges.map(c => (
                <ChallengeItem
                  key={c.id}
                  challenge={c}
                  active={c.id === selectedId}
                  onClick={() => { setSelectedId(c.id); setSidebarOpen(false) }}
                />
              ))}
            </div>
          </div>
        )}

        {javascriptChallenges.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-1">⚡ JavaScript</p>
            <div className="space-y-0.5">
              {javascriptChallenges.map(c => (
                <ChallengeItem
                  key={c.id}
                  challenge={c}
                  active={c.id === selectedId}
                  onClick={() => { setSelectedId(c.id); setSidebarOpen(false) }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex gap-0 -mx-4 md:mx-0">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-slate-900 rounded-2xl overflow-hidden h-[calc(100vh-140px)] sticky top-6">
        <div className="p-3 border-b border-slate-800">
          <h2 className="font-bold text-white text-sm">💻 Live Coding</h2>
          <p className="text-xs text-slate-500 mt-0.5">{codingChallenges.length} challenges</p>
        </div>
        {sidebar}
      </aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 flex flex-col shadow-xl">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <h2 className="font-bold text-white text-sm">💻 Live Coding</h2>
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
            ☰ Challenges
          </button>
        </div>

        {selected ? <ChallengeDetail challenge={selected} /> : <EmptyState />}
      </div>
    </div>
  )
}
