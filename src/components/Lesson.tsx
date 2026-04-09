/**
 * BEST PRACTICE: Presentation Component
 *
 * This component has a single responsibility: display lesson content.
 * It doesn't:
 * - Manage lesson state
 * - Track progress
 * - Know about other lessons
 *
 * All it needs is the lesson data and a callback for completion.
 *
 * This is an example of a "dumb" or "presentation" component.
 * It's easy to test, reuse, and understand.
 */

import { ILesson } from '../types/tutorial'

interface LessonProps {
  lesson: ILesson
  onComplete: () => void
}

/**
 * BEST PRACTICE: ⚠️ dangerouslySetInnerHTML Warning
 *
 * We use dangerouslySetInnerHTML here to render lesson HTML content.
 * This is ONLY safe because:
 * - Content is hardcoded in our data files (not user input)
 * - We control the content source
 *
 * NEVER use dangerouslySetInnerHTML with user-generated content!
 * If content comes from users/API:
 * - Sanitize with libraries like DOMPurify
 * - Use a markdown library with safe defaults
 * - Or store as plain text and render carefully
 *
 * For user content, safer approaches:
 * - Use markdown rendering libraries
 * - Sanitize HTML with DOMPurify
 * - Use a rich text editor with built-in XSS protection
 */
export default function Lesson({ lesson, onComplete }: LessonProps) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">📖 {lesson.title}</h2>
        {/*
          BEST PRACTICE: Isolated HTML rendering

          The prose class adds nice styling for article content.
          Content comes from trusted data file.
        */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      </div>

      {/*
        BEST PRACTICE: Clear CTA (Call To Action)

        Simple button that's clearly the next step.
        Uses semantic HTML (button, not link styled as button).
      */}
      <button
        onClick={onComplete}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition"
      >
        ✓ Mark as Complete & Continue
      </button>
    </div>
  )
}
