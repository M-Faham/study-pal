/**
 * BEST PRACTICE: Orchestration Component
 *
 * This component manages the tutorial flow:
 * - Tracks current lesson/quiz/challenge
 * - Tracks completion progress
 * - Orchestrates content display
 *
 * The actual content (lessons, quizzes, challenges) is imported
 * from data files, not defined here.
 *
 * Benefits:
 * - Component logic is separate from content
 * - Easy to add new tutorials (just create new data files)
 * - Easy to update content (doesn't require code changes)
 * - Component stays focused on orchestration
 */

import { useState } from 'react'
import CodeChallenge from '../components/CodeChallenge'
import Lesson from '../components/Lesson'
import Quiz from '../components/Quiz'
import {
  htmlAccessibilityLessons,
  htmlAccessibilityQuizzes,
  htmlAccessibilityChallenges,
} from '../data/tutorials/html-accessibility-data'
import { ITutorialStep } from '../types/tutorial'

/**
 * BEST PRACTICE: Merging data arrays in execution order
 *
 * allSteps combines lessons, quizzes, and challenges in the order
 * they should appear (interleaved based on 'afterLesson' field).
 *
 * This makes it easy to:
 * - Step through content sequentially
 * - Track progress with a single index
 * - Know what to display at any point in the tutorial
 */
export default function HTMLAccessibilityTutorial() {
  // Track which step user is on (0 = first lesson, etc)
  const [currentStep, setCurrentStep] = useState<number>(0)

  // Track which items user has completed
  // Using Sets because we only care about IDs, not order
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set())
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<number>>(new Set())
  const [completedChallenges, setCompletedChallenges] = useState<Set<number>>(new Set())

  /**
   * BEST PRACTICE: Organizing content in execution order
   *
   * Merge all steps and sort by ID to create a linear path through tutorial.
   * User goes 1 -> 2 -> 3 -> 4 instead of jumping around.
   *
   * This approach scales well:
   * - Adding new content just adds items to the array
   * - Navigation logic doesn't change
   */
  const allSteps: ITutorialStep[] = [
    ...htmlAccessibilityLessons,
    ...htmlAccessibilityQuizzes,
    ...htmlAccessibilityChallenges,
  ].sort((a, b) => a.id - b.id)

  // Get current step
  const currentItem = allSteps[currentStep]

  // Calculate progress (percent of items completed)
  const completedCount = completedLessons.size + completedQuizzes.size + completedChallenges.size
  const progress = Math.round((completedCount / allSteps.length) * 100)

  /**
   * BEST PRACTICE: Callback functions for child components
   *
   * When a child completes, mark it as done and move to next step.
   * Centralized logic makes it easy to add analytics, persistence, etc.
   */
  const handleLessonComplete = () => {
    setCompletedLessons(prev => new Set([...prev, currentItem.id]))
    goToNext()
  }

  const handleQuizComplete = () => {
    setCompletedQuizzes(prev => new Set([...prev, currentItem.id]))
    goToNext()
  }

  const handleChallengeComplete = () => {
    setCompletedChallenges(prev => new Set([...prev, currentItem.id]))
    goToNext()
  }

  // Navigation functions
  const goToNext = () => {
    if (currentStep < allSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="space-y-6">
      {/* Tutorial header with progress */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">HTML Accessibility Tutorial</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-700">Progress: {progress}%</span>
          </div>
          {/* Visual progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Step {currentStep + 1} of {allSteps.length}
          </p>
        </div>
      </div>

      {/* Main content area - render appropriate component based on type */}
      <div className="bg-white rounded-lg shadow p-8">
        {/*
          BEST PRACTICE: Type-safe rendering with discriminated unions

          TypeScript narrows the type automatically based on the 'type' field.
          So after checking type === 'lesson', TypeScript knows it's ILesson.
        */}
        {currentItem.type === 'lesson' && (
          <Lesson lesson={currentItem} onComplete={handleLessonComplete} />
        )}

        {currentItem.type === 'quiz' && (
          <Quiz quiz={currentItem} onComplete={handleQuizComplete} />
        )}

        {currentItem.type === 'challenge' && (
          <CodeChallenge challenge={currentItem} onComplete={handleChallengeComplete} />
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between gap-4">
        <button
          onClick={goToPrevious}
          disabled={currentStep === 0}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        <button
          onClick={goToNext}
          disabled={currentStep === allSteps.length - 1}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Skip →
        </button>
      </div>
    </div>
  )
}
