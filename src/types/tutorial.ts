/**
 * BEST PRACTICE: Centralized Type Definitions
 *
 * All tutorial-related types are defined in one place. This prevents:
 * - Type duplication across files
 * - Inconsistent type definitions
 * - Breaking changes when updating types
 *
 * When multiple components use the same type, define it once here
 * and import it everywhere. This is the single source of truth.
 */

/**
 * Represents a single lesson in a tutorial
 *
 * BEST PRACTICE: Clear, descriptive property names
 * - Each field has a clear purpose
 * - Type annotations prevent runtime errors
 * - 'type' literal ensures we can distinguish lesson from other content types
 */
export interface ILesson {
  id: number
  title: string
  content: string // HTML content - sanitize before rendering!
  type: 'lesson'
}

/**
 * Represents a single question in a quiz
 *
 * BEST PRACTICE: Single Responsibility
 * - This interface only represents quiz data, not UI state
 * - State (selectedAnswer, isAnswered) is managed separately in components
 * - Keep data models pure and focused
 */
export interface IQuizQuestion {
  id: number
  question: string
  options: string[]
  correct: number // Index of correct option (0-based)
  explanation: string
}

/**
 * Represents a complete quiz
 *
 * BEST PRACTICE: Discriminated Unions (type: 'quiz')
 * - Using 'type' field allows TypeScript to distinguish between
 *   different content types (lesson, quiz, challenge)
 * - This enables type-safe pattern matching in switch/if statements
 */
export interface IQuiz {
  id: number
  title: string
  afterLesson: number // Show this quiz after completing lesson N
  type: 'quiz'
  questions: IQuizQuestion[]
}

/**
 * Represents a code challenge
 *
 * BEST PRACTICE: Including helpful metadata
 * - 'hints' array helps students progressively learn
 * - 'startCode' and 'solution' support different learning styles
 * - All data is needed for the full challenge experience
 */
export interface ICodeChallenge {
  id: number
  title: string
  afterLesson: number
  type: 'challenge'
  description: string
  startCode: string
  solution: string
  hints: string[]
}

/**
 * Union type for all content types
 *
 * BEST PRACTICE: Discriminated Union Types
 * - Allows functions to accept any content type
 * - TypeScript can narrow type based on 'type' field
 * - Example: if (item.type === 'quiz') { /* TypeScript knows it's IQuiz */ }
 */
export type ITutorialStep = ILesson | IQuiz | ICodeChallenge

/**
 * Quiz state management
 *
 * BEST PRACTICE: Separate data from UI state
 * - IQuiz is immutable data from server/file
 * - IQuizState represents current user interaction state
 * - Never mutate IQuiz; only update IQuizState
 */
export interface IQuizState {
  currentQuestion: number
  selectedAnswers: Record<number, number> // { questionIndex: selectedOptionIndex }
  status: 'in-progress' | 'completed'
}

/**
 * Code challenge state
 *
 * BEST PRACTICE: Explicit state management
 * - 'submitted' tracks if user has checked their answer
 * - 'currentHint' tracks hint progression
 * - All UI state in one place makes it easier to reason about
 */
export interface ICodeChallengeState {
  userCode: string
  showSolution: boolean
  submitted: boolean
  currentHint: number
}

/**
 * Tutorial content container
 *
 * BEST PRACTICE: Organize related data together
 * - Grouping lessons, quizzes, challenges together
 * - Makes it easy to load all tutorial content at once
 * - Facilitates caching and optimization
 */
export interface ITutorialContent {
  id: string
  title: string
  description: string
  lessons: ILesson[]
  quizzes: IQuiz[]
  challenges: ICodeChallenge[]
}
