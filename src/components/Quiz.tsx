/**
 * BEST PRACTICE: Container/Presenter Pattern
 *
 * This component is now a "container" that:
 * - Manages quiz state (which question, selected answers, submission status)
 * - Orchestrates child components
 * - Handles business logic
 *
 * Child components (QuizQuestion, QuizResults) are "presenters" that:
 * - Receive data via props
 * - Emit events via callbacks
 * - Don't manage state
 * - Are reusable and testable
 *
 * This separation makes:
 * - Logic testable (mock child components)
 * - UI changes easy (only touch child components)
 * - State flow clear (top-down data, bottom-up events)
 */

import { useState } from 'react'
import { IQuiz } from '../types/tutorial'
import QuizQuestion from './QuizQuestion'
import QuizResults from './QuizResults'

interface QuizProps {
  quiz: IQuiz
  onComplete: () => void
}

/**
 * Quiz Container Component
 *
 * BEST PRACTICE: Explicit state variables with clear purposes
 *
 * Instead of one complex state object, use separate useState calls.
 * This makes each piece of state clear and independent:
 * - currentQuestion: which question are we on?
 * - selectedAnswers: what has the user selected?
 * - isSubmitted: has the user submitted their answer for grading?
 *
 * Trade-off: More useState calls, but clearer intent.
 * For very complex state (4+ related pieces), consider useReducer.
 */
export default function Quiz({ quiz, onComplete }: QuizProps) {
  // Which question are we currently showing (0-based index)
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)

  // Map of question index to selected option index
  // Example: { 0: 2, 1: 1, 3: 0 } = answered Q0 with option 2, Q1 with option 1, etc.
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})

  // Has the user clicked "Check Answer"?
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  // Derived values (calculate from state, don't store)
  const question = quiz.questions[currentQuestion]
  const selectedAnswer = selectedAnswers[currentQuestion]
  const allAnswered = quiz.questions.every((_, idx) => selectedAnswers[idx] !== undefined)
  const correctCount = quiz.questions.filter(
    (q, idx) => selectedAnswers[idx] === q.correct
  ).length

  // Determine if user has reached the end
  const isLastQuestion = currentQuestion === quiz.questions.length - 1
  const isQuizComplete = isSubmitted && isLastQuestion && allAnswered

  /**
   * BEST PRACTICE: Handler functions placed in component
   *
   * Keep event handlers close to the state they modify.
   * Use clear naming: handle[Action]
   */
  const handleSelectAnswer = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex,
    }))
  }

  const handleSubmitAnswer = () => {
    setIsSubmitted(true)
  }

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      // Move to next question and reset submission state
      setCurrentQuestion(currentQuestion + 1)
      setIsSubmitted(false)
    }
  }

  // Show results screen if quiz is complete
  if (isQuizComplete) {
    return (
      <QuizResults
        correctCount={correctCount}
        totalQuestions={quiz.questions.length}
        onContinue={onComplete}
      />
    )
  }

  // Show current question
  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="bg-gray-100 p-4 rounded">
        <p className="text-sm text-gray-600 font-bold mb-2">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </p>
        {/* Visual progress bar */}
        <div className="w-full bg-gray-300 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-6">🎯 {quiz.title}</h2>

      {/* Render the current question using QuizQuestion subcomponent */}
      <QuizQuestion
        question={question}
        selectedAnswer={selectedAnswer}
        isSubmitted={isSubmitted}
        onSelectAnswer={handleSelectAnswer}
      />

      {/* Action buttons */}
      <div className="flex gap-3">
        {!isSubmitted ? (
          /* Before submission: show "Check Answer" button */
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === undefined}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-lg transition disabled:cursor-not-allowed"
          >
            ✓ Check Answer
          </button>
        ) : (
          /* After submission: show "Next Question" button */
          <button
            onClick={handleNextQuestion}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            {isLastQuestion ? 'See Results' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  )
}
