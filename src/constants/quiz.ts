/**
 * BEST PRACTICE: Magic Numbers to Named Constants
 *
 * Instead of hardcoding values like 80, 0.5, etc. throughout your code,
 * extract them to a constants file. This makes it easy to:
 * - Adjust values globally (e.g., change passing grade from 80 to 70)
 * - Understand what numbers mean (80 = PASSING_PERCENTAGE is clear)
 * - Avoid copy-paste errors (use the constant, not the number)
 *
 * Constants should be UPPERCASE_WITH_UNDERSCORES by convention.
 */

/**
 * Percentage score required to pass a quiz
 * Used to show positive feedback when user scores above this threshold
 */
export const PASSING_PERCENTAGE = 80

/**
 * Minimum quiz questions for a meaningful assessment
 * Use this to validate quiz data before rendering
 */
export const MIN_QUIZ_QUESTIONS = 1

/**
 * CSS classes and styling constants
 *
 * BEST PRACTICE: Extracting repeated strings
 * If you use the same Tailwind classes in multiple components,
 * consider extracting them here. This prevents typos and makes
 * design changes easier (change once, update everywhere).
 */
export const QUIZ_STYLES = {
  // Button styles
  buttonPrimary: 'flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-lg transition disabled:cursor-not-allowed',
  buttonSuccess: 'w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition',

  // Answer option styles
  optionBase: 'w-full p-4 text-left border-2 rounded-lg transition font-semibold',
  optionUnselected: 'border-gray-300 bg-white text-gray-900 hover:border-blue-300 cursor-pointer',
  optionSelected: 'border-blue-500 bg-blue-50 text-gray-900',
  optionCorrect: 'border-green-500 bg-green-50 text-gray-900',
  optionIncorrect: 'border-red-500 bg-red-50 text-gray-900',

  // Result box styles
  resultCorrect: 'p-4 rounded-lg mb-6 bg-green-50 border-l-4 border-green-500',
  resultIncorrect: 'p-4 rounded-lg mb-6 bg-red-50 border-l-4 border-red-500',
} as const

/**
 * Label text and copy
 *
 * BEST PRACTICE: Extracting strings to constants
 * - Makes it easy to maintain copy/text changes
 * - Facilitates internationalization (i18n) later
 * - Prevents typos in UI text
 */
export const QUIZ_LABELS = {
  checkAnswer: 'Check Answer',
  nextQuestion: 'Next Question',
  seeResults: 'See Results',
  quizComplete: 'Quiz Complete!',
  correct: '✓ Correct!',
  incorrect: '✗ Incorrect',
  continueButton: '✓ Continue to Next Section',
} as const

/**
 * Quiz state constants
 *
 * BEST PRACTICE: Defining state machine values
 * These ensure consistent status values across the app
 */
export const QUIZ_STATUS = {
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
} as const
