/**
 * BEST PRACTICE: Display Component
 *
 * Shows hints and manages hint navigation.
 * Doesn't know about code, solutions, or submission.
 * Pure presentation logic.
 */

import React from 'react'

interface HintPanelProps {
  // Array of hints to show
  hints: string[]
  // Which hint is currently displayed (0-based)
  currentHintIndex: number
  // Callback when user wants next hint
  onShowNextHint: () => void
}

export default function HintPanel({
  hints,
  currentHintIndex,
  onShowNextHint,
}: HintPanelProps) {
  // Don't render if no hints available
  if (hints.length === 0) {
    return null
  }

  const hasMoreHints = currentHintIndex < hints.length - 1

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
      <p className="font-bold text-yellow-900 mb-2">
        💡 Hint {currentHintIndex + 1} of {hints.length}:
      </p>
      <p className="text-yellow-800 mb-3">{hints[currentHintIndex]}</p>

      {/*
        BEST PRACTICE: Progressive disclosure

        Show hints one at a time. User must click to see more.
        This encourages thinking before looking at answers.
      */}
      {hasMoreHints && (
        <button
          onClick={onShowNextHint}
          className="text-sm text-yellow-600 hover:text-yellow-800 font-bold"
        >
          Show Next Hint →
        </button>
      )}
    </div>
  )
}
