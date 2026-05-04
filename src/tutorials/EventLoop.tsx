import { useState } from 'react'
import type { ITutorialStep } from '../types/tutorial'
import { eventLoopLessons, eventLoopQuizzes } from '../data/tutorials/event-loop-data'
import Lesson from '../components/Lesson'
import Quiz from '../components/Quiz'
import EventLoopVisualizer from '../components/EventLoopVisualizer'

// Merge and sort all steps by id so lessons come before the quiz
const steps: ITutorialStep[] = [
  ...eventLoopLessons,
  ...eventLoopQuizzes,
].sort((a, b) => a.id - b.id)

const TOTAL = steps.length

export default function EventLoopTutorial() {
  const [current, setCurrent] = useState(0)

  const step = steps[current]
  const isFirst = current === 0
  const isLast = current === TOTAL - 1

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-4xl">⚙️</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">JavaScript Event Loop — Crash Course</h1>
            <p className="text-gray-500 text-sm">Call stack, Web APIs, microtasks, macrotasks and async/await internals.</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium">Progress</span>
          <span className="text-xs text-gray-500">{current + 1} / {TOTAL}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / TOTAL) * 100}%` }}
          />
        </div>
        {/* Dot indicators */}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              title={s.title}
              className={`w-3 h-3 rounded-full transition-all ${
                i === current
                  ? 'bg-indigo-600 scale-125'
                  : i < current
                  ? 'bg-indigo-300'
                  : 'bg-gray-200'
              } ${s.type === 'quiz' ? 'ring-2 ring-offset-1 ring-orange-400' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Visualizer — always visible for context */}
      <EventLoopVisualizer />

      {/* Step content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {step.type === 'lesson' && <Lesson lesson={step} />}
        {step.type === 'quiz' && (
          <div className="p-6">
            <Quiz quiz={step} onComplete={() => setCurrent(c => Math.min(c + 1, TOTAL - 1))} />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pb-8">
        <button
          disabled={isFirst}
          onClick={() => setCurrent(c => c - 1)}
          className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 transition"
        >
          ← Previous
        </button>

        {isLast ? (
          <div className="px-6 py-2.5 rounded-xl bg-green-100 text-green-800 text-sm font-semibold">
            🎉 Tutorial complete!
          </div>
        ) : (
          <button
            onClick={() => setCurrent(c => c + 1)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
