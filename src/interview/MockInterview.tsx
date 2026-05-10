import { useState, useMemo, useEffect } from 'react'
import type { IInterviewTopic } from './types'

type SelfScore = 'weak' | 'ok' | 'confident'

interface MockQuestion {
  topicId:    string
  topicTitle: string
  topicIcon:  string
  question:   string
  answer:     string
  followUp?:  string
}

interface Props {
  topics:         IInterviewTopic[]
  onDone:         () => void
  onSelectTopic?: (id: string) => void
}

// ── Countdown ring ────────────────────────────────────────────────────────────

function CountdownRing({ seconds, total }: { seconds: number; total: number }) {
  const r = 26
  const circumference = 2 * Math.PI * r
  const progress = seconds / total
  const color = seconds > total * 0.5 ? '#22c55e' : seconds > total * 0.2 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="64" height="64" className="-rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <circle
          cx="32" cy="32" r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
        />
      </svg>
      <span className="text-sm font-bold text-slate-600 -mt-12 relative z-10">{seconds}s</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const TIMER_SECONDS = 120

export default function MockInterview({ topics, onDone, onSelectTopic }: Props) {
  const pool: MockQuestion[] = useMemo(() =>
    topics.map(t => ({
      topicId:    t.id,
      topicTitle: t.title,
      topicIcon:  t.icon,
      question:   t.spokenAnswer.question,
      answer:     t.spokenAnswer.answer,
      followUp:   t.spokenAnswer.followUp,
    })), [topics])

  const shuffled = useMemo(() => [...pool].sort(() => Math.random() - 0.5), [pool])

  const [index, setIndex]               = useState(0)
  const [revealed, setRevealed]         = useState(false)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [pendingScore, setPendingScore] = useState<SelfScore | null>(null)
  const [scores, setScores]             = useState<SelfScore[]>([])
  const [timeLeft, setTimeLeft]         = useState(TIMER_SECONDS)

  const current = shuffled[index]
  const isLast  = index === shuffled.length - 1

  // Countdown timer — resets on each new question, stops when revealed
  useEffect(() => {
    if (revealed) return
    if (timeLeft <= 0) { setRevealed(true); return }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, revealed])

  function reveal() {
    setRevealed(true)
  }

  function score(s: SelfScore) {
    if (!showFollowUp && current.followUp) {
      // Show the follow-up before recording the score
      setPendingScore(s)
      setShowFollowUp(true)
      return
    }
    advance(s)
  }

  function advance(s: SelfScore) {
    const next = [...scores, s]
    setScores(next)
    if (isLast) {
      setIndex(shuffled.length)
    } else {
      setIndex(i => i + 1)
      setRevealed(false)
      setShowFollowUp(false)
      setPendingScore(null)
      setTimeLeft(TIMER_SECONDS)
    }
  }

  // Results screen
  if (index >= shuffled.length) {
    const counts = {
      weak:      scores.filter(s => s === 'weak').length,
      ok:        scores.filter(s => s === 'ok').length,
      confident: scores.filter(s => s === 'confident').length,
    }
    const weakTopics = shuffled
      .filter((_, i) => scores[i] === 'weak')
      .map(q => ({ id: q.topicId, title: q.topicTitle, icon: q.topicIcon }))

    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-10">
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 text-center">
          <p className="text-5xl mb-4">🏁</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mock Interview Done!</h2>
          <p className="text-gray-500 mb-6">{shuffled.length} questions completed</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-red-500">{counts.weak}</p>
              <p className="text-xs text-red-400 mt-1 font-medium">Weak</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-yellow-500">{counts.ok}</p>
              <p className="text-xs text-yellow-500 mt-1 font-medium">OK</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-green-500">{counts.confident}</p>
              <p className="text-xs text-green-500 mt-1 font-medium">Confident</p>
            </div>
          </div>

          {weakTopics.length > 0 ? (
            <div className="mb-6 text-left">
              <p className="text-sm font-semibold text-gray-700 mb-3">📚 Review these weak spots:</p>
              <div className="space-y-2">
                {weakTopics.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { onDone(); onSelectTopic?.(t.id) }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-left hover:bg-red-100 transition"
                  >
                    <span>{t.icon}</span>
                    <span className="text-sm font-semibold text-red-700">{t.title}</span>
                    <span className="ml-auto text-xs text-red-400">Study →</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-6">Great session! Keep it up.</p>
          )}

          <button
            onClick={onDone}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Back to Topics
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-900">🎲 Mock Interview</h2>
          <p className="text-xs text-gray-400 mt-0.5">Question {index + 1} of {shuffled.length}</p>
        </div>
        <button onClick={onDone} className="text-xs text-gray-400 hover:text-gray-600 transition">✕ Exit</button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${(index / shuffled.length) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>{current.topicIcon}</span>
          <span>{current.topicTitle}</span>
        </div>

        <p className="text-xl font-bold text-gray-900 leading-snug">"{current.question}"</p>

        {!revealed && (
          <div className="flex flex-col items-center gap-3 py-2">
            <CountdownRing seconds={timeLeft} total={TIMER_SECONDS} />
            <p className="text-sm text-gray-400 italic">Answer out loud, then reveal.</p>
            <button
              onClick={reveal}
              className="w-full py-3 rounded-xl border-2 border-dashed border-indigo-300 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
            >
              👁 Reveal Model Answer
            </button>
          </div>
        )}

        {revealed && !showFollowUp && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Model Answer</p>
              <p className="text-gray-700 text-sm leading-relaxed italic">"{current.answer}"</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">How did you do?</p>
              <div className="flex gap-3">
                <button onClick={() => score('weak')}      className="flex-1 py-3 rounded-xl bg-red-50 text-red-600 border border-red-200 font-semibold text-sm hover:bg-red-100 transition">😬 Weak</button>
                <button onClick={() => score('ok')}        className="flex-1 py-3 rounded-xl bg-yellow-50 text-yellow-600 border border-yellow-200 font-semibold text-sm hover:bg-yellow-100 transition">🙂 OK</button>
                <button onClick={() => score('confident')} className="flex-1 py-3 rounded-xl bg-green-50 text-green-600 border border-green-200 font-semibold text-sm hover:bg-green-100 transition">💪 Confident</button>
              </div>
            </div>
          </div>
        )}

        {revealed && showFollowUp && current.followUp && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">🔄 Follow-up Question</p>
              <p className="text-base font-semibold text-gray-900">"{current.followUp}"</p>
            </div>
            <p className="text-sm text-gray-400 italic">Take a moment to think, then continue.</p>
            <button
              onClick={() => advance(pendingScore ?? 'ok')}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
