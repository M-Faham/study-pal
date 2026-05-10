import { useState, useEffect } from 'react'
import type { IInterviewTopic, TopicProgress } from './types'

// ── Syntax highlighter ────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function tokenize(code: string): string {
  const rules: [RegExp, string][] = [
    [/\/\/[^\n]*/,                                                              'code-comment'],
    [/#[^\n]*/,                                                                 'code-comment'],
    [/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/,                 'code-string'],
    [/\b(import|export|from|const|let|var|function|return|new|async|await|if|else|class|interface|type|extends|implements|of|in|for|while|true|false|null|undefined|void|public|private|readonly)\b/, 'code-keyword'],
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
    if (!earliest) { result += escapeHtml(remaining); break }
    result += escapeHtml(remaining.slice(0, earliest.index))
    result += `<span class="${earliest.cls}">${escapeHtml(earliest.match)}</span>`
    remaining = remaining.slice(earliest.index + earliest.match.length)
  }
  return result
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="lesson-content bg-gray-900 rounded-xl p-4 overflow-x-auto text-sm leading-relaxed mt-3">
      <code className="text-green-300" dangerouslySetInnerHTML={{ __html: tokenize(code) }} />
    </pre>
  )
}

function CheatSheet({ topic, onOpenTutorial }: { topic: IInterviewTopic; onOpenTutorial?: (id: string) => void }) {
  return (
    <div className="space-y-5 animate-fade-up">
      {topic.cheatSheet.map((item, i) => (
        <div key={i} className="border-l-2 border-indigo-300 bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">{item.concept}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{item.explanation}</p>
          {item.code && <CodeBlock code={item.code} />}
        </div>
      ))}

      {topic.relatedTutorialId && onOpenTutorial && (
        <button
          onClick={() => onOpenTutorial(topic.relatedTutorialId!)}
          className="w-full bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-left hover:bg-indigo-100 transition group"
        >
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-0.5">Full Tutorial</p>
          <p className="text-sm font-semibold text-indigo-700 group-hover:text-indigo-800">
            📖 Go to the full lesson on this topic →
          </p>
        </button>
      )}
    </div>
  )
}

function SpokenAnswer({ topic }: { topic: IInterviewTopic }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="space-y-4 animate-fade-up">
      {/* Key points */}
      {topic.keyPoints.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Key points to hit</p>
          <ul className="space-y-1.5">
            {topic.keyPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-indigo-400 font-bold shrink-0 mt-0.5">✓</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl p-5">
        <p className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-2">Interview Question</p>
        <p className="text-gray-800 font-semibold text-lg leading-snug">"{topic.spokenAnswer.question}"</p>
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-indigo-300 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
        >
          👁 Reveal Model Answer
        </button>
      ) : (
        <div className="space-y-3">
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Model Answer — natural spoken English</p>
            <p className="text-gray-700 leading-relaxed italic">"{topic.spokenAnswer.answer}"</p>
          </div>

          {topic.spokenAnswer.followUp && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">🔄 Likely Follow-up</p>
              <p className="text-sm font-semibold text-gray-800">"{topic.spokenAnswer.followUp}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Traps({ topic }: { topic: IInterviewTopic }) {
  return (
    <div className="space-y-4 animate-fade-up">
      <p className="text-sm text-gray-500">Things that catch juniors pretending to be seniors:</p>
      {topic.traps.map((trap, i) => (
        <div key={i} className="rounded-2xl overflow-hidden border border-red-100">
          <div className="bg-red-50 px-5 py-3">
            <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-1">❌ Common Trap</p>
            <p className="text-gray-800 font-medium">{trap.trap}</p>
          </div>
          <div className="bg-green-50 px-5 py-3 border-t border-gray-100">
            <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-1">✅ Correct Approach</p>
            <p className="text-gray-700 text-sm leading-relaxed">{trap.correction}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function QuizSection({
  topic,
  onComplete,
}: {
  topic: IInterviewTopic
  onComplete: (score: number) => void
}) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [done, setDone] = useState(false)

  const q = topic.quiz[current]
  const isLast = current === topic.quiz.length - 1

  function handleNext() {
    if (isLast) {
      const correct = topic.quiz.filter((q, i) => selected[i] === q.correct).length
      const score = Math.round((correct / topic.quiz.length) * 100)
      setDone(true)
      onComplete(score)
    } else {
      setCurrent(c => c + 1)
      setSubmitted(false)
    }
  }

  function reset() {
    setCurrent(0)
    setSelected({})
    setSubmitted(false)
    setDone(false)
  }

  if (done) {
    const correct = topic.quiz.filter((q, i) => selected[i] === q.correct).length
    const score = Math.round((correct / topic.quiz.length) * 100)
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center space-y-4 animate-fade-up">
        <p className="text-5xl">{score >= 80 ? '🎉' : '📖'}</p>
        <p className="text-2xl font-bold text-gray-900">{score}%</p>
        <p className="text-gray-500">{correct} / {topic.quiz.length} correct</p>
        <p className={`font-semibold ${score >= 80 ? 'text-green-600' : 'text-orange-500'}`}>
          {score >= 80 ? 'Confident!' : 'Review the cheat sheet and try again.'}
        </p>
        <button onClick={reset} className="mt-4 px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">
          Retry Quiz
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Question {current + 1} / {topic.quiz.length}</span>
        <div className="flex gap-1">
          {topic.quiz.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${
              i < current ? 'bg-indigo-400' : i === current ? 'bg-indigo-600 scale-125' : 'bg-gray-300'
            }`} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <p className="text-gray-900 font-semibold text-base leading-snug whitespace-pre-line">{q.question}</p>

        <div className="space-y-2">
          {q.options.map((opt, i) => {
            let style = 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300'
            if (submitted) {
              if (i === q.correct) style = 'border-green-500 bg-green-50 text-green-800'
              else if (selected[current] === i) style = 'border-red-400 bg-red-50 text-red-700'
              else style = 'border-gray-100 bg-gray-50 text-gray-400'
            } else if (selected[current] === i) {
              style = 'border-indigo-500 bg-indigo-50 text-indigo-800'
            }
            return (
              <button
                key={i}
                disabled={submitted}
                onClick={() => setSelected(prev => ({ ...prev, [current]: i }))}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition active:scale-[0.98] ${style}`}
              >
                {opt}
              </button>
            )
          })}
        </div>

        {submitted && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-semibold mb-1">Explanation</p>
            <p>{q.explanation}</p>
          </div>
        )}

        <div className="flex gap-3">
          {!submitted ? (
            <button
              disabled={selected[current] === undefined}
              onClick={() => setSubmitted(true)}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-40 hover:bg-indigo-700 transition"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              {isLast ? 'See Results' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function FlashcardSection({
  topic,
  onComplete,
}: {
  topic: IInterviewTopic
  onComplete: (score: number) => void
}) {
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [selected, setSelected] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [done, setDone] = useState(false)

  const q = topic.quiz[index]
  const isLast = index === topic.quiz.length - 1

  function handleNext() {
    if (isLast) {
      const correct = topic.quiz.filter((q, i) => selected[i] === q.correct).length
      const score = Math.round((correct / topic.quiz.length) * 100)
      setDone(true)
      onComplete(score)
    } else {
      setIndex(i => i + 1)
      setRevealed(false)
      setSubmitted(false)
    }
  }

  function reset() {
    setIndex(0)
    setRevealed(false)
    setSelected({})
    setSubmitted(false)
    setDone(false)
  }

  if (done) {
    const correct = topic.quiz.filter((q, i) => selected[i] === q.correct).length
    const score = Math.round((correct / topic.quiz.length) * 100)
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center space-y-4 animate-fade-up">
        <p className="text-5xl">{score >= 80 ? '🎉' : '📖'}</p>
        <p className="text-2xl font-bold text-gray-900">{score}%</p>
        <p className="text-gray-500">{correct} / {topic.quiz.length} correct</p>
        <p className={`font-semibold ${score >= 80 ? 'text-green-600' : 'text-orange-500'}`}>
          {score >= 80 ? 'Great recall!' : 'Keep practising — try the Cheat Sheet first.'}
        </p>
        <button onClick={reset} className="mt-4 px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">
          Retry Flashcards
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Card {index + 1} / {topic.quiz.length}</span>
        <div className="flex gap-1">
          {topic.quiz.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${
              i < index ? 'bg-indigo-400' : i === index ? 'bg-indigo-600 scale-125' : 'bg-gray-200'
            }`} />
          ))}
        </div>
      </div>

      {/* Card face — question only */}
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50 border border-slate-200 rounded-2xl p-8 text-center min-h-[160px] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-900 font-semibold text-lg leading-snug">{q.question}</p>
        {!revealed && (
          <button
            onClick={() => setRevealed(true)}
            className="mt-2 px-6 py-2 rounded-xl border-2 border-dashed border-indigo-300 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition"
          >
            Reveal Options
          </button>
        )}
      </div>

      {/* Options — shown after reveal */}
      {revealed && (
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            let style = 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300'
            if (submitted) {
              if (i === q.correct) style = 'border-green-500 bg-green-50 text-green-800'
              else if (selected[index] === i) style = 'border-red-400 bg-red-50 text-red-700'
              else style = 'border-gray-100 bg-gray-50 text-gray-400'
            } else if (selected[index] === i) {
              style = 'border-indigo-500 bg-indigo-50 text-indigo-800'
            }
            return (
              <button
                key={i}
                disabled={submitted}
                onClick={() => setSelected(prev => ({ ...prev, [index]: i }))}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition active:scale-[0.98] ${style}`}
              >
                {opt}
              </button>
            )
          })}
        </div>
      )}

      {submitted && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">Explanation</p>
          <p>{q.explanation}</p>
        </div>
      )}

      {revealed && (
        <div className="flex gap-3">
          {!submitted ? (
            <button
              disabled={selected[index] === undefined}
              onClick={() => setSubmitted(true)}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-40 hover:bg-indigo-700 transition"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              {isLast ? 'See Results' : 'Next Card →'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

type Tab = 'cheatsheet' | 'spoken' | 'traps' | 'quiz' | 'flashcard'

const TABS: { id: Tab; label: string }[] = [
  { id: 'cheatsheet', label: '📋 Cheat Sheet' },
  { id: 'spoken',     label: '🗣 Say It' },
  { id: 'traps',      label: '⚠️ Traps' },
  { id: 'quiz',       label: '🎯 Quiz' },
  { id: 'flashcard',  label: '🃏 Flash' },
]

const DIFFICULTY_STYLE: Record<string, string> = {
  Core:         'bg-blue-100 text-blue-700',
  Tricky:       'bg-orange-100 text-orange-700',
  Architecture: 'bg-purple-100 text-purple-700',
}

interface Props {
  topic: IInterviewTopic
  progress: TopicProgress
  onSetProgress: (p: TopicProgress) => void
  onQuizComplete: (score: number) => void
  onBack: () => void
  onOpenTutorial?: (id: string) => void
}

export default function InterviewTopicView({
  topic, progress, onSetProgress, onQuizComplete, onBack, onOpenTutorial
}: Props) {
  const [tab, setTab] = useState<Tab>('cheatsheet')

  // Reset tab when topic changes
  useEffect(() => { setTab('cheatsheet') }, [topic.id])

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-10">

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-start gap-4">
          <span className="text-4xl">{topic.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">{topic.title}</h1>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_STYLE[topic.difficulty]}`}>
                {topic.difficulty}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {topic.cheatSheet.length} concepts · {topic.quiz.length} quiz questions
            </p>
          </div>
        </div>

        {/* Self-mark progress */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <span className="text-xs text-gray-400 self-center mr-1">Mark as:</span>
          {([
            ['not-started', '⬜ Not started'],
            ['reviewed',    '🟡 Reviewed'],
            ['confident',   '🟢 Confident'],
          ] as [TopicProgress, string][]).map(([p, label]) => (
            <button
              key={p}
              onClick={() => onSetProgress(p)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium ${
                progress === p
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Pill tabs */}
      <div className="bg-slate-100 rounded-2xl p-1 flex gap-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
              tab === t.id
                ? 'bg-white shadow-sm text-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {tab === 'cheatsheet' && <CheatSheet topic={topic} onOpenTutorial={onOpenTutorial} />}
        {tab === 'spoken'     && <SpokenAnswer topic={topic} />}
        {tab === 'traps'      && <Traps topic={topic} />}
        {tab === 'quiz'       && <QuizSection topic={topic} onComplete={onQuizComplete} />}
        {tab === 'flashcard'  && <FlashcardSection topic={topic} onComplete={onQuizComplete} />}
      </div>

      <button
        onClick={onBack}
        className="text-sm text-slate-400 hover:text-slate-600 transition"
      >
        ← Back to topics
      </button>
    </div>
  )
}
