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

// Highlights code inside <pre><code>...</code></pre> blocks.
// Runs only on the trusted HTML from our data files — never on user input.
// Tokenises a plain-text code string into colored HTML spans.
// Processes tokens left-to-right so replacements never overlap.
function tokenize(code: string): string {
  // Each rule: [regex, className]
  const rules: [RegExp, string][] = [
    [/\/\/[^\n]*/,                                                              'code-comment'],
    [/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/,                 'code-string'],
    [/\b(import|export|from|const|let|var|function|return|new|async|await|if|else|class|interface|type|extends|implements|of|in|for|while|true|false|null|undefined|void)\b/, 'code-keyword'],
    [/\b\d+\b/,                                                                 'code-number'],
  ]

  let result = ''
  let remaining = code

  while (remaining.length > 0) {
    let earliest: { index: number; match: string; cls: string } | null = null

    for (const [rx, cls] of rules) {
      const m = rx.exec(remaining)
      if (m && (earliest === null || m.index < earliest.index)) {
        earliest = { index: m.index, match: m[0], cls }
      }
    }

    if (!earliest) {
      result += escapeHtml(remaining)
      break
    }

    // Append plain text before the match
    result += escapeHtml(remaining.slice(0, earliest.index))
    // Append the colored span
    result += `<span class="${earliest.cls}">${escapeHtml(earliest.match)}</span>`
    remaining = remaining.slice(earliest.index + earliest.match.length)
  }

  return result
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Finds every <pre><code>…</code></pre> block, decodes its text, highlights it.
function highlightCode(html: string): string {
  return html.replace(
    /(<pre[^>]*>)<code[^>]*>([\s\S]*?)<\/code>(<\/pre>)/g,
    (_, open, encoded, close) => {
      // Decode HTML entities that the browser would normally handle
      const plain = encoded
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
      return open + '<code>' + tokenize(plain) + '</code>' + close
    }
  )
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
          className="lesson-content"
          dangerouslySetInnerHTML={{ __html: highlightCode(lesson.content) }}
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
