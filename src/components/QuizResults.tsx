/**
 * BEST PRACTICE: Single Responsibility Principle
 *
 * This component displays the quiz results/summary after all questions answered.
 * Separated from the question display logic for clarity and reusability.
 *
 * This demonstrates how splitting a large component (old Quiz.tsx) into
 * smaller focused components makes each one easier to understand and test.
 */

import React from 'react'
import { PASSING_PERCENTAGE, QUIZ_LABELS } from '../constants/quiz'

interface QuizResultsProps {
  // Number of questions answered correctly
  correctCount: number
  // Total number of questions
  totalQuestions: number
  // Callback when user clicks continue
  onContinue: () => void
}

/**
 * BEST PRACTICE: Calculate derived values
 *
 * Calculate percentage from props instead of passing it as a prop.
 * This follows DRY (Don't Repeat Yourself) - single source of truth.
 *
 * Guidelines:
 * - If B can be calculated from A, don't pass B separately
 * - Calculate it in the component that needs it
 * - Keep props minimal (only raw data)
 */
export default function QuizResults({ correctCount, totalQuestions, onContinue }: QuizResultsProps) {
  // Derive percentage from props
  const percentage = Math.round((correctCount / totalQuestions) * 100)
  const isPassing = percentage >= PASSING_PERCENTAGE

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">🎯 Quiz Complete!</h2>

      {/*
        BEST PRACTICE: Visual feedback based on performance

        Use color coding and emojis to provide immediate feedback:
        - Green = success (above passing threshold)
        - Shows encouraging message
        - Makes user feel good about progress
      */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <p className="text-lg font-bold mb-2">Your Score</p>
        <p className="text-4xl font-bold text-blue-600 mb-2">
          {correctCount}/{totalQuestions}
        </p>
        <p className="text-2xl font-bold mb-3">{percentage}%</p>

        {/*
          BEST PRACTICE: Conditional rendering

          Show different messages based on performance.
          This is motivating and helps users understand their level.

          Using ternary operator for simple conditions is fine,
          but use extracted components for complex conditionals.
        */}
        <p className={`text-lg font-semibold ${isPassing ? 'text-green-700' : 'text-blue-700'}`}>
          {isPassing
            ? '🌟 Great job! You understand this topic well.'
            : '📚 Good effort! Review the lessons for more practice.'}
        </p>
      </div>

      {/*
        BEST PRACTICE: Simple, clear CTAs (Call To Action)

        One primary button that continues the learning journey.
        No distractions, clear next step.
      */}
      <button
        onClick={onContinue}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition"
      >
        {QUIZ_LABELS.continueButton}
      </button>
    </div>
  )
}
