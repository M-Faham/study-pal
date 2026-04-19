/**
 * BEST PRACTICE: Single Responsibility Principle (SRP)
 *
 * This component has ONE job: Display a single quiz question and its options.
 * It doesn't:
 * - Manage overall quiz state
 * - Track correct/incorrect counts
 * - Know about quiz completion
 *
 * Splitting large components into smaller ones makes them:
 * - Easier to test (fewer props, simpler logic)
 * - Easier to reuse (each question looks/behaves the same)
 * - Easier to understand (clear responsibility)
 * - Easier to maintain (changes don't cascade)
 */

import { IQuizQuestion } from '../types/tutorial'

interface QuizQuestionProps {
  // The question to display
  question: IQuizQuestion
  // Index of currently selected answer (-1 if none)
  selectedAnswer: number | undefined
  // Have we submitted an answer for grading?
  isSubmitted: boolean
  // Callback when user selects an option
  onSelectAnswer: (optionIndex: number) => void
}

/**
 * Displays a single quiz question with multiple choice options
 *
 * BEST PRACTICE: Component receives what it needs as props
 * - No useState for managing question state
 * - No API calls within component
 * - All data flows in through props (top-down data flow)
 * - All changes flow out through callbacks (bottom-up events)
 *
 * This pattern (controlled component) makes it easy for parent
 * to manage state for all questions consistently.
 */
export default function QuizQuestion({
  question,
  selectedAnswer,
  isSubmitted,
  onSelectAnswer,
}: QuizQuestionProps) {
  /**
   * BEST PRACTICE: Derived state instead of stored state
   *
   * Instead of storing "isAnswered" in state, we derive it from props:
   * const isAnswered = selectedAnswer !== undefined
   *
   * Why? Eliminates synchronization bugs where state gets out of sync
   * with reality. The truth is in the parent component's state.
   */
  const isAnswered = selectedAnswer !== undefined
  const isCorrect = selectedAnswer === question.correct

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900">{question.question}</h3>

      {/*
        BEST PRACTICE: Map over arrays to render lists

        Using .map() is the React way to render lists. It ensures:
        - Each item gets a unique key
        - Items can be added/removed/reordered easily
        - React can efficiently update the DOM

        Key strategy:
        - Use 'index' as key only when list is stable (never reordered)
        - Since quiz options don't change, index is safe here
      */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          // Determine which style to apply based on state
          const isSelectedOption = selectedAnswer === index
          const isCorrectOption = index === question.correct

          // Build className conditionally
          // BEST PRACTICE: Use a helper function or const for complex classNames
          let buttonClass =
            'w-full p-4 text-left border-2 rounded-lg transition font-semibold '

          if (!isSubmitted) {
            // Before submission: show selected vs unselected
            buttonClass += isSelectedOption
              ? 'border-blue-500 bg-blue-50 text-gray-900 cursor-pointer'
              : 'border-gray-300 bg-white text-gray-900 hover:border-blue-300 cursor-pointer'
          } else {
            // After submission: show correct/incorrect/unmarked
            if (isCorrectOption) {
              buttonClass += 'border-green-500 bg-green-50 text-gray-900'
            } else if (isSelectedOption && !isCorrect) {
              buttonClass += 'border-red-500 bg-red-50 text-gray-900'
            } else {
              buttonClass += 'border-gray-300 bg-white text-gray-900'
            }
          }

          return (
            <button
              key={index}
              onClick={() => onSelectAnswer(index)}
              disabled={isSubmitted}
              className={buttonClass}
            >
              <div className="flex items-center gap-3">
                {/* Show A, B, C, D for each option */}
                <span className="text-lg font-bold">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span>{option}</span>

                {/* Show checkmark/X after submission */}
                {isSubmitted && isCorrectOption && (
                  <span className="ml-auto text-green-600 text-lg">✓</span>
                )}
                {isSubmitted && isSelectedOption && !isCorrect && (
                  <span className="ml-auto text-red-600 text-lg">✗</span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Show explanation after submission */}
      {isSubmitted && (
        <div
          className={`p-4 rounded-lg ${
            isCorrect
              ? 'bg-green-50 border-l-4 border-green-500'
              : 'bg-red-50 border-l-4 border-red-500'
          }`}
        >
          <p className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          <p className="text-gray-700 mt-1">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
