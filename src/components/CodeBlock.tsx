import { useState, useEffect } from 'react'
import { createHighlighter, type Highlighter } from 'shiki'

// Singleton — one highlighter instance shared across all CodeBlock renders
let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['one-dark-pro'],
      langs: ['typescript', 'javascript', 'html', 'css', 'scss', 'bash', 'json'],
    })
  }
  return highlighterPromise
}

// Detect language from content heuristics
function detectLang(code: string): string {
  if (/<[a-z][\s\S]*>/i.test(code) && !code.trimStart().startsWith('//')) return 'html'
  if (/\$[\w-]+\s*{|@mixin|@include/.test(code)) return 'scss'
  if (/^\s*{[\s\S]*}$/m.test(code) && code.includes('"')) return 'json'
  if (/\bbash\b|^\$\s/m.test(code)) return 'bash'
  return 'typescript'
}

interface Props {
  code: string
  lang?: string
}

export default function CodeBlock({ code, lang }: Props) {
  const [html, setHtml] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    getHighlighter().then(hl => {
      if (cancelled) return
      const resolved = lang ?? detectLang(code)
      const out = hl.codeToHtml(code, {
        lang: resolved,
        theme: 'one-dark-pro',
      })
      setHtml(out)
    })
    return () => { cancelled = true }
  }, [code, lang])

  if (!html) {
    // Unstyled fallback while Shiki loads (first render only)
    return (
      <pre className="bg-gray-900 rounded-xl p-4 overflow-x-auto text-sm leading-relaxed mt-3 text-green-300">
        <code>{code}</code>
      </pre>
    )
  }

  return (
    <div
      className="mt-3 rounded-xl overflow-hidden text-sm [&>pre]:p-4 [&>pre]:overflow-x-auto [&>pre]:leading-relaxed [&>pre]:m-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
