/**
 * LessonsOnlyTutorial — Reusable shell for lesson-only tutorials
 *
 * BEST PRACTICE: Don't repeat yourself (DRY).
 *
 * All four React crash courses (Router, i18n, Forms, Best Practices)
 * have identical navigation/progress logic and only differ in their
 * title, subtitle, and lesson data.
 *
 * Instead of copy-pasting a tutorial component four times, we pass
 * those differences as props and reuse one component.
 *
 * Props flow: parent passes data → this component renders it.
 * No fetching, no routing — pure presentation + local state.
 */

import { useState } from 'react'
import { ILesson } from '../types/tutorial'
import Lesson from './Lesson'

interface LessonsOnlyTutorialProps {
  /** Large title shown at the top */
  title: string
  /** Short description below the title */
  subtitle: string
  /** Emoji icon shown before the title */
  icon: string
  /** The ordered list of lessons to step through */
  lessons: ILesson[]
}

export default function LessonsOnlyTutorial({
  title,
  subtitle,
  icon,
  lessons,
}: LessonsOnlyTutorialProps) {
  // Which lesson the user is currently viewing (0-based)
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  // Track which lesson IDs the user has completed
  // Using a Set because we only care about presence, not order
  const [completed, setCompleted] = useState<Set<number>>(new Set())

  const currentLesson = lessons[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === lessons.length - 1

  // Progress is the fraction of lessons completed — derived, not stored
  const progress = Math.round((completed.size / lessons.length) * 100)
  const allDone = completed.size === lessons.length

  const handleComplete = () => {
    // Mark this lesson complete and advance
    setCompleted(prev => new Set([...prev, currentLesson.id]))
    if (!isLast) setCurrentIndex(i => i + 1)
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setCompleted(new Set())
  }

  return (
    <div className="space-y-6">

      {/* ── Header ───────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">
          {icon} {title}
        </h1>
        <p className="text-gray-500 mb-4">{subtitle}</p>

        {/* Progress bar */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
            <span>Progress: {progress}%</span>
            <span>{completed.size} / {lessons.length} lessons</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Lesson dot indicators */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {lessons.map((lesson, idx) => (
              <button
                key={lesson.id}
                onClick={() => setCurrentIndex(idx)}
                title={lesson.title}
                className={[
                  'w-3 h-3 rounded-full transition-all',
                  idx === currentIndex
                    ? 'bg-blue-600 ring-2 ring-blue-300 scale-125'
                    : completed.has(lesson.id)
                    ? 'bg-green-500'
                    : 'bg-gray-300 hover:bg-gray-400',
                ].join(' ')}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Lesson content ───────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow p-8">

        {/* Lesson number badge */}
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
            Lesson {currentIndex + 1} of {lessons.length}
          </span>
          {completed.has(currentLesson.id) && (
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
              ✓ Completed
            </span>
          )}
        </div>

        <Lesson lesson={currentLesson} onComplete={handleComplete} />
      </div>

      {/* ── Navigation ───────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => setCurrentIndex(i => i - 1)}
          disabled={isFirst}
          className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Reset progress
        </button>

        <button
          onClick={() => setCurrentIndex(i => i + 1)}
          disabled={isLast}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      {/* ── Completion banner ────────────────────────────────── */}
      {allDone && (
        <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-lg">
          <p className="text-green-800 font-bold text-lg">
            🎉 You've completed all lessons!
          </p>
          <p className="text-green-700 text-sm mt-1">
            Feel free to go back and review any lesson using the dots above.
          </p>
        </div>
      )}
    </div>
  )
}
