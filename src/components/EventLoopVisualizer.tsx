import { useState, useEffect, useRef } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────

interface VisualizerStep {
  label: string
  callStack: string[]
  webApis: string[]
  microtasks: string[]
  macrotasks: string[]
  highlight: 'stack' | 'webapi' | 'micro' | 'macro' | 'loop' | null
  logOutput: string[]
}

// ── Demo scenarios ─────────────────────────────────────────────────────────

const SCENARIOS: { name: string; code: string; steps: VisualizerStep[] }[] = [
  {
    name: 'Promise vs setTimeout',
    code: `console.log("A")
setTimeout(() => console.log("B"), 0)
Promise.resolve().then(() => console.log("C"))
console.log("D")`,
    steps: [
      {
        label: 'Script starts — synchronous code runs',
        callStack: ['console.log("A")'],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        highlight: 'stack',
        logOutput: ['A'],
      },
      {
        label: 'setTimeout registers timer in Web APIs',
        callStack: ['setTimeout(cb, 0)'],
        webApis: ['Timer 0ms → cb_B'],
        microtasks: [],
        macrotasks: [],
        highlight: 'webapi',
        logOutput: ['A'],
      },
      {
        label: 'Promise.resolve() schedules microtask',
        callStack: ['Promise.resolve().then(cb_C)'],
        webApis: ['Timer 0ms → cb_B'],
        microtasks: ['cb_C'],
        macrotasks: [],
        highlight: 'micro',
        logOutput: ['A'],
      },
      {
        label: 'console.log("D") runs synchronously',
        callStack: ['console.log("D")'],
        webApis: [],
        microtasks: ['cb_C'],
        macrotasks: [],
        highlight: 'stack',
        logOutput: ['A', 'D'],
      },
      {
        label: 'Stack empty — timer fires, macrotask queued',
        callStack: [],
        webApis: [],
        microtasks: ['cb_C'],
        macrotasks: ['cb_B'],
        highlight: 'loop',
        logOutput: ['A', 'D'],
      },
      {
        label: 'Event loop drains microtask queue first',
        callStack: ['cb_C → console.log("C")'],
        webApis: [],
        microtasks: [],
        macrotasks: ['cb_B'],
        highlight: 'micro',
        logOutput: ['A', 'D', 'C'],
      },
      {
        label: 'Microtasks empty — pick next macrotask',
        callStack: ['cb_B → console.log("B")'],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        highlight: 'macro',
        logOutput: ['A', 'D', 'C', 'B'],
      },
      {
        label: 'All done! Final output: A → D → C → B',
        callStack: [],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        highlight: null,
        logOutput: ['A', 'D', 'C', 'B'],
      },
    ],
  },
  {
    name: 'async/await flow',
    code: `async function run() {
  console.log("A")
  await Promise.resolve()
  console.log("C")
}
run()
console.log("B")`,
    steps: [
      {
        label: 'run() is called — enters async function',
        callStack: ['run()', 'console.log("A")'],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        highlight: 'stack',
        logOutput: ['A'],
      },
      {
        label: '"await" suspends run() — schedules continuation as microtask',
        callStack: ['run() ← suspended at await'],
        webApis: [],
        microtasks: ['run() continuation'],
        macrotasks: [],
        highlight: 'micro',
        logOutput: ['A'],
      },
      {
        label: 'Caller continues synchronously: console.log("B")',
        callStack: ['console.log("B")'],
        webApis: [],
        microtasks: ['run() continuation'],
        macrotasks: [],
        highlight: 'stack',
        logOutput: ['A', 'B'],
      },
      {
        label: 'Stack empty — event loop runs microtask: run() resumes',
        callStack: ['run() (resumed)', 'console.log("C")'],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        highlight: 'micro',
        logOutput: ['A', 'B', 'C'],
      },
      {
        label: 'Done! Output: A → B → C',
        callStack: [],
        webApis: [],
        microtasks: [],
        macrotasks: [],
        highlight: null,
        logOutput: ['A', 'B', 'C'],
      },
    ],
  },
]

// ── Sub-components ─────────────────────────────────────────────────────────

function Box({
  title,
  items,
  color,
  active,
}: {
  title: string
  items: string[]
  color: string
  active: boolean
}) {
  return (
    <div
      className={`rounded-xl border-2 p-3 transition-all duration-300 ${
        active ? `${color} shadow-lg scale-105` : 'border-gray-200 bg-gray-50'
      }`}
    >
      <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${active ? 'text-white' : 'text-gray-500'}`}>
        {title}
      </p>
      <div className="space-y-1 min-h-[48px]">
        {items.length === 0 ? (
          <p className={`text-xs italic ${active ? 'text-white/70' : 'text-gray-400'}`}>(empty)</p>
        ) : (
          items.map((item, i) => (
            <div
              key={i}
              className={`text-xs rounded px-2 py-1 font-mono ${
                active ? 'bg-white/20 text-white' : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function LogOutput({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [lines])
  return (
    <div ref={ref} className="bg-gray-900 rounded-xl p-3 h-24 overflow-y-auto font-mono text-sm">
      {lines.length === 0 ? (
        <span className="text-gray-500 text-xs">// console output appears here</span>
      ) : (
        lines.map((line, i) => (
          <div key={i} className="text-green-400">
            &gt; {line}
          </div>
        ))
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function EventLoopVisualizer() {
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  const [playing, setPlaying] = useState(false)

  const scenario = SCENARIOS[scenarioIdx]
  const step = scenario.steps[stepIdx]
  const isLast = stepIdx === scenario.steps.length - 1

  // Auto-play
  useEffect(() => {
    if (!playing) return
    if (isLast) { setPlaying(false); return }
    const t = setTimeout(() => setStepIdx(i => i + 1), 1400)
    return () => clearTimeout(t)
  }, [playing, stepIdx, isLast])

  function reset() {
    setStepIdx(0)
    setPlaying(false)
  }

  function switchScenario(idx: number) {
    setScenarioIdx(idx)
    setStepIdx(0)
    setPlaying(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-md p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-bold text-gray-800 text-sm">🎬 Interactive Event Loop Visualizer</h3>
        <div className="flex gap-2">
          {SCENARIOS.map((s, i) => (
            <button
              key={i}
              onClick={() => switchScenario(i)}
              className={`text-xs px-3 py-1 rounded-full border transition ${
                scenarioIdx === i
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-300 text-gray-600 hover:border-indigo-400'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Code snippet */}
      <pre className="bg-gray-900 text-green-300 text-xs rounded-xl p-3 overflow-x-auto font-mono leading-relaxed">
        {scenario.code}
      </pre>

      {/* Step label */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 text-sm text-indigo-800 font-medium min-h-[40px]">
        Step {stepIdx + 1}/{scenario.steps.length}: {step.label}
      </div>

      {/* Visualization grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Box
          title="Call Stack"
          items={step.callStack}
          color="border-blue-500 bg-blue-500"
          active={step.highlight === 'stack'}
        />
        <Box
          title="Web APIs"
          items={step.webApis}
          color="border-purple-500 bg-purple-500"
          active={step.highlight === 'webapi'}
        />
        <Box
          title="Microtask Queue"
          items={step.microtasks}
          color="border-emerald-500 bg-emerald-500"
          active={step.highlight === 'micro'}
        />
        <Box
          title="Macrotask Queue"
          items={step.macrotasks}
          color="border-orange-500 bg-orange-500"
          active={step.highlight === 'macro'}
        />
      </div>

      {/* Event loop indicator */}
      <div
        className={`flex items-center gap-2 text-xs font-semibold rounded-lg px-3 py-2 transition-all duration-300 ${
          step.highlight === 'loop'
            ? 'bg-yellow-100 border border-yellow-400 text-yellow-800'
            : 'bg-gray-100 text-gray-400'
        }`}
      >
        <span className={`text-lg ${step.highlight === 'loop' ? 'animate-spin' : ''}`}>🔄</span>
        Event Loop tick — stack empty, checking queues…
      </div>

      {/* Console output */}
      <div>
        <p className="text-xs text-gray-500 mb-1 font-medium">Console Output</p>
        <LogOutput lines={step.logOutput} />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          ↺ Reset
        </button>
        <button
          disabled={stepIdx === 0}
          onClick={() => setStepIdx(i => i - 1)}
          className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
        >
          ← Prev
        </button>
        <button
          disabled={isLast}
          onClick={() => setStepIdx(i => i + 1)}
          className="px-3 py-1.5 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40"
        >
          Next →
        </button>
        <button
          onClick={() => { if (isLast) reset(); setPlaying(p => !p) }}
          className={`px-3 py-1.5 text-xs rounded-lg text-white transition ${
            playing ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {playing ? '⏸ Pause' : isLast ? '↺ Replay' : '▶ Auto-play'}
        </button>
        <span className="ml-auto text-xs text-gray-400">
          {stepIdx + 1} / {scenario.steps.length}
        </span>
      </div>
    </div>
  )
}
