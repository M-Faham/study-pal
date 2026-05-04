import { useState } from 'react'
import type { ILesson, IQuiz, ITutorialStep } from '../types/tutorial'
import Lesson from './Lesson'
import Quiz from './Quiz'

interface LessonsAndQuizTutorialProps {
  title: string
  subtitle: string
  icon: string
  lessons: ILesson[]
  quizzes: IQuiz[]
}

export default function LessonsAndQuizTutorial({
  title,
  subtitle,
  icon,
  lessons,
  quizzes,
}: LessonsAndQuizTutorialProps) {
  const steps: ITutorialStep[] = [...lessons, ...quizzes].sort((a, b) => a.id - b.id)
  const total = steps.length

  const [current, setCurrent] = useState(0)

  const step = steps[current]
  const isFirst = current === 0
  const isLast = current === total - 1
  const progress = Math.round(((current + 1) / total) * 100)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{icon} {title}</h1>
        <p className="text-gray-500 mb-4">{subtitle}</p>

        {/* Progress bar */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
            <span>Progress: {progress}%</span>
            <span>{current + 1} / {total} steps</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Dot indicators */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {steps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                title={s.title}
                className={[
                  'w-3 h-3 rounded-full transition-all',
                  s.type === 'quiz' ? 'ring-2 ring-offset-1 ring-orange-400' : '',
                  idx === current
                    ? 'bg-blue-600 scale-125'
                    : idx < current
                    ? 'bg-green-400'
                    : 'bg-gray-300 hover:bg-gray-400',
                ].join(' ')}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            🟠 = quiz &nbsp;·&nbsp; Click a dot to jump to any step
          </p>
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 pt-5 pb-1 flex items-center gap-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            step.type === 'quiz'
              ? 'bg-orange-100 text-orange-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {step.type === 'quiz'
              ? `Quiz — ${steps.filter(s => s.type === 'lesson' && steps.indexOf(s) < current).length + lessons.length} lessons done`
              : `Lesson ${current + 1} of ${lessons.length}`
            }
          </span>
        </div>

        {step.type === 'lesson' && (
          <div className="p-8">
            <Lesson lesson={step} onComplete={() => !isLast && setCurrent(c => c + 1)} />
          </div>
        )}
        {step.type === 'quiz' && (
          <div className="p-8">
            <Quiz quiz={step} onComplete={() => !isLast && setCurrent(c => c + 1)} />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-8">
        <button
          onClick={() => setCurrent(c => c - 1)}
          disabled={isFirst}
          className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-40"
        >
          ← Previous
        </button>

        {isLast ? (
          <div className="px-6 py-2 bg-green-100 text-green-800 rounded-lg font-semibold text-sm">
            🎉 Course complete! Good luck tomorrow.
          </div>
        ) : (
          <button
            onClick={() => setCurrent(c => c + 1)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
