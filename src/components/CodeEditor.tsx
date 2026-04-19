/**
 * BEST PRACTICE: Single Responsibility Component
 *
 * This component has ONE job: Display a code editor (textarea with code)
 * and handle user input.
 *
 * It doesn't know about:
 * - Solution validation
 * - Hints
 * - Submission state
 *
 * This makes it reusable for any code editing scenario.
 */


interface CodeEditorProps {
  // The current code the user has written
  code: string
  // Callback when user changes code
  onCodeChange: (newCode: string) => void
  // Is the user allowed to edit? (false during solution display, etc)
  readOnly?: boolean
}

export default function CodeEditor({ code, onCodeChange, readOnly = false }: CodeEditorProps) {
  return (
    <div className="flex flex-col">
      <label className="block text-sm font-bold text-gray-700 mb-2">Your Code</label>
      {/*
        BEST PRACTICE: Controlled component

        The textarea's value comes from props (code), not internal state.
        When user types, we call the callback (onCodeChange).
        Parent maintains the truth of what code looks like.

        This pattern (controlled component) makes it easy for parent to:
        - Save code to localStorage
        - Compare with solution
        - Undo/redo changes
        - Sync across multiple components
      */}
      <textarea
        value={code}
        onChange={e => onCodeChange(e.target.value)}
        readOnly={readOnly}
        className="w-full h-64 p-4 font-mono text-sm border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        placeholder="Write your HTML here..."
      />
    </div>
  )
}
