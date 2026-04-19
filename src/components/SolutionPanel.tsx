/**
 * BEST PRACTICE: Display Component for Read-Only Content
 *
 * Shows the solution in a non-editable format.
 * Only rendered when user clicks "Show Solution".
 * Helps user see what they're aiming for.
 */


interface SolutionPanelProps {
  // The solution code to display
  solution: string
}

export default function SolutionPanel({ solution }: SolutionPanelProps) {
  return (
    <div className="flex flex-col">
      <label className="block text-sm font-bold text-gray-700 mb-2">Solution</label>
      {/*
        BEST PRACTICE: Read-only display for reference

        This shows the target solution so user can compare with their code.
        Using a div instead of textarea since it's not editable.
      */}
      <div className="w-full h-64 p-4 font-mono text-sm bg-gray-100 border-2 border-gray-300 rounded-lg overflow-y-auto">
        <code className="text-green-600 whitespace-pre-wrap">{solution}</code>
      </div>
    </div>
  )
}
