import { useState, useMemo } from 'react'
import type { IInterviewTopic } from './types'

type SelfScore = 'weak' | 'ok' | 'confident'

interface MockQuestion {
  topicTitle: string
  topicIcon: string
  question: string
  answer: string
}

interface Props {
  topics: IInterviewTopic[]
  onDone: () => void
}

export default function MockInterview({ topics, onDone }: Props) {
  // Build a flat pool of all spoken-answer questions
  const pool: MockQuestion[] = useMemo(() =>
    topics.map(t => ({
      topicTitle: t.title,
      topicIcon:  t.icon,
      question:   t.spokenAnswer.question,
      answer:     t.spokenAnswer.answer,
    })), [topics])

  // Shuffle once on mount
  const shuffled = useMemo(
    () => [...pool].sort(() => Math.random() - 0.5),
    [pool]
  )

  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [scores, setScores] = useState<SelfScore[]>([])

  const current = shuffled[index]
  const isLast = index === shuffled.length - 1

  function score(s: SelfScore) {
    const next = [...scores, s]
    setScores(next)
    if (isLast) {
      setIndex(shuffled.length)  // go to results
    } else {
      setIndex(i => i + 1)
      setRevealed(false)
    }
  }

  // Results screen
  if (index >= shuffled.length) {
    const counts = {
      weak:      scores.filter(s => s === 'weak').length,
      ok:        scores.filter(s => s === 'ok').length,
      confident: scores.filter(s => s === 'confident').length,
    }
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

          <p className="text-sm text-gray-400 mb-6">
            {counts.weak > 0
              ? `Review the topics you marked Weak — they'll show up in the Weak Spots filter.`
              : `Great session! Keep it up.`}
          </p>

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
          <p className="text-xs text-gray-400 mt-0.5">
            Question {index + 1} of {shuffled.length}
          </p>
        </div>
        <button onClick={onDone} className="text-xs text-gray-400 hover:text-gray-600 transition">
          ✕ Exit
        </button>
      </div>

      {/* Progress */}
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((index) / shuffled.length) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>{current.topicIcon}</span>
          <span>{current.topicTitle}</span>
        </div>

        <p className="text-xl font-bold text-gray-900 leading-snug">
          "{current.question}"
        </p>

        <p className="text-sm text-gray-400 italic">
          Take a moment to answer out loud, then reveal the model answer.
        </p>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="w-full py-3 rounded-xl border-2 border-dashed border-indigo-300 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
          >
            👁 Reveal Model Answer
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Model Answer</p>
              <p className="text-gray-700 text-sm leading-relaxed italic">"{current.answer}"</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">How did you do?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => score('weak')}
                  className="flex-1 py-3 rounded-xl bg-red-50 text-red-600 border border-red-200 font-semibold text-sm hover:bg-red-100 transition"
                >
                  😬 Weak
                </button>
                <button
                  onClick={() => score('ok')}
                  className="flex-1 py-3 rounded-xl bg-yellow-50 text-yellow-600 border border-yellow-200 font-semibold text-sm hover:bg-yellow-100 transition"
                >
                  🙂 OK
                </button>
                <button
                  onClick={() => score('confident')}
                  className="flex-1 py-3 rounded-xl bg-green-50 text-green-600 border border-green-200 font-semibold text-sm hover:bg-green-100 transition"
                >
                  💪 Confident
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
