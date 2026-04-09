/**
 * BEST PRACTICE: Container Component for Code Challenges
 *
 * This component:
 * - Manages challenge state (code, hints, submission)
 * - Orchestrates child components
 * - Validates user's code against solution
 *
 * Child components are pure presenters:
 * - CodeEditor: textarea for editing
 * - HintPanel: displays hints
 * - SolutionPanel: shows target solution
 */

import { useState } from 'react'
import { ICodeChallenge } from '../types/tutorial'
import CodeEditor from './CodeEditor'
import HintPanel from './HintPanel'
import SolutionPanel from './SolutionPanel'

interface CodeChallengeProps {
  challenge: ICodeChallenge
  onComplete: () => void
}

/**
 * BEST PRACTICE: Pure function to normalize code
 *
 * Extract logic that doesn't depend on component state into pure functions.
 * Benefits:
 * - Easy to test (no mocking needed)
 * - No side effects
 * - Reusable in other components
 *
 * This function compares code in a whitespace-insensitive way,
 * so spacing and formatting differences don't matter.
 */
const normalizeCode = (code: string): string => {
  return code.trim().replace(/\s+/g, ' ').replace(/>\s+</g, '><').toLowerCase()
}

/**
 * Code Challenge Component
 *
 * BEST PRACTICE: Clear state organization
 *
 * Each useState represents one piece of user interaction:
 * - userCode: what the user typed
 * - showSolution: should we display the solution?
 * - submitted: has user clicked "Check Solution"?
 * - currentHint: which hint is displayed?
 */
export default function CodeChallenge({ challenge, onComplete }: CodeChallengeProps) {
  const [userCode, setUserCode] = useState<string>(challenge.startCode)
  const [showSolution, setShowSolution] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [currentHint, setCurrentHint] = useState<number>(0)

  // Derive whether code matches solution
  // BEST PRACTICE: Don't store derived values, calculate them
  const isSolved = normalizeCode(userCode) === normalizeCode(challenge.solution)

  // Event handlers
  const handleCodeChange = (newCode: string) => {
    setUserCode(newCode)
  }

  const handleCheckSolution = () => {
    setSubmitted(true)
  }

  const handleShowSolution = () => {
    setShowSolution(true)
  }

  const handleReset = () => {
    setUserCode(challenge.startCode)
    setShowSolution(false)
    setSubmitted(false)
    setCurrentHint(0)
  }

  const handleShowNextHint = () => {
    if (currentHint < challenge.hints.length - 1) {
      setCurrentHint(currentHint + 1)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title and description */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">💻 {challenge.title}</h2>
        <p className="text-gray-700 text-lg">{challenge.description}</p>
      </div>

      {/* Code editor and solution side by side */}
      {/*
        BEST PRACTICE: Responsive layout

        On mobile (grid-cols-1): stack vertically
        On desktop (lg:grid-cols-2): display side by side

        This lets users see both their code and solution at once on large screens.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CodeEditor code={userCode} onCodeChange={handleCodeChange} />
        {showSolution && <SolutionPanel solution={challenge.solution} />}
      </div>

      {/* Hints section */}
      {challenge.hints.length > 0 && (
        <HintPanel
          hints={challenge.hints}
          currentHintIndex={currentHint}
          onShowNextHint={handleShowNextHint}
        />
      )}

      {/* Feedback message after submission */}
      {submitted && (
        <div
          className={`p-4 rounded-lg ${
            isSolved ? 'bg-green-50 border-l-4 border-green-500' : 'bg-blue-50 border-l-4 border-blue-500'
          }`}
        >
          {isSolved ? (
            <p className="text-green-700 font-bold">✓ Perfect! Your solution is correct!</p>
          ) : (
            <p className="text-blue-700 font-bold">
              Keep trying! You're getting closer. Check the hints or solution for guidance.
            </p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCheckSolution}
          className="flex-1 min-w-48 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
        >
          ✓ Check Solution
        </button>

        {!showSolution && (
          <button
            onClick={handleShowSolution}
            className="flex-1 min-w-48 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            Show Solution
          </button>
        )}

        <button
          onClick={handleReset}
          className="flex-1 min-w-48 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition"
        >
          Reset
        </button>
      </div>

      {/* Only show continue button after solving */}
      {submitted && isSolved && (
        <button
          onClick={onComplete}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition"
        >
          ✓ Continue to Next Section
        </button>
      )}
    </div>
  )
}
