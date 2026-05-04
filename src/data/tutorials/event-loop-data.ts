import type { ILesson, IQuiz } from '../../types/tutorial'

export const eventLoopLessons: ILesson[] = [
  {
    id: 1,
    type: 'lesson',
    title: 'What Is the JavaScript Event Loop?',
    content: `
      <h2>JavaScript Is Single-Threaded</h2>
      <p>JavaScript can only do <strong>one thing at a time</strong>. There is a single thread of execution — no parallel code runs simultaneously inside your JS engine.</p>
      <p>Yet we write async code every day: <code>setTimeout</code>, <code>fetch</code>, <code>addEventListener</code>. How does it work without blocking?</p>
      <h2>The Answer: The Event Loop</h2>
      <p>The <strong>event loop</strong> is a mechanism built into every JavaScript runtime (browser or Node.js). It coordinates four key areas:</p>
      <ul>
        <li><strong>Call Stack</strong> — where synchronous code runs, one frame at a time.</li>
        <li><strong>Web APIs / Node APIs</strong> — where async operations live while they wait (timers, network, I/O).</li>
        <li><strong>Microtask Queue</strong> — a high-priority queue for resolved Promises and <code>queueMicrotask()</code> callbacks.</li>
        <li><strong>Macrotask Queue (Task Queue)</strong> — a lower-priority queue for <code>setTimeout</code>, <code>setInterval</code>, I/O callbacks.</li>
      </ul>
      <h2>The Loop in One Sentence</h2>
      <p>After every <em>task</em> the call stack empties, the event loop drains the entire microtask queue, then picks the next macrotask — and repeats forever.</p>
      <pre><code>while (true) {
  runNextMacrotask()      // e.g. a setTimeout callback
  drainMicrotaskQueue()   // ALL pending microtasks, including new ones
  repaint()               // browser may repaint here
}</code></pre>
    `,
  },
  {
    id: 2,
    type: 'lesson',
    title: 'The Call Stack',
    content: `
      <h2>Stack Frames</h2>
      <p>Every time you call a function, a <strong>frame</strong> is pushed onto the call stack. When the function returns, the frame is popped off. JavaScript executes frames top-to-bottom.</p>
      <pre><code>function greet(name) {
  return "Hello, " + name
}

function main() {
  const msg = greet("World")
  console.log(msg)
}

main()
// Stack at peak: [ main → greet ]</code></pre>
      <h2>Stack Overflow</h2>
      <p>If functions keep calling each other without returning (e.g. infinite recursion), the stack grows until the runtime throws a <strong>RangeError: Maximum call stack size exceeded</strong>.</p>
      <h2>Blocking the Stack</h2>
      <p>Long synchronous work (heavy loops, huge JSON parsing) keeps the stack occupied. The event loop cannot process any callbacks while the stack is non-empty — this is why the UI freezes.</p>
      <pre><code>// BAD — blocks the browser for 3 seconds
function heavyWork() {
  const end = Date.now() + 3000
  while (Date.now() < end) {} // spins the CPU
}
heavyWork() // nothing else runs until this returns</code></pre>
      <p>Use Web Workers or chunked async work to avoid this.</p>
    `,
  },
  {
    id: 3,
    type: 'lesson',
    title: 'Macrotask Queue & Web APIs',
    content: `
      <h2>Offloading Work to the Browser</h2>
      <p>When you call <code>setTimeout(cb, 1000)</code>, the browser's timer API takes ownership of the callback. Your JS continues running. After 1 000 ms the browser pushes <code>cb</code> onto the <strong>macrotask queue</strong>.</p>
      <h2>What Goes in the Macrotask Queue?</h2>
      <ul>
        <li><code>setTimeout</code> / <code>setInterval</code> callbacks</li>
        <li><code>setImmediate</code> (Node.js)</li>
        <li>I/O callbacks (file reads, network in Node)</li>
        <li>UI rendering events (click, keydown, etc.)</li>
        <li><code>MessageChannel</code> port callbacks</li>
      </ul>
      <h2>One Macrotask Per Loop Tick</h2>
      <p>The event loop picks exactly <strong>one</strong> macrotask per iteration. That's why two <code>setTimeout(cb, 0)</code> calls never run in the same tick.</p>
      <pre><code>setTimeout(() => console.log("A"), 0)
setTimeout(() => console.log("B"), 0)
// Output: A  (tick 1)
//         B  (tick 2)</code></pre>
      <h2>Timer Delay Is a Minimum</h2>
      <p>A <code>setTimeout(cb, 0)</code> does NOT mean "run immediately". It means "run at least 0 ms from now, when the stack is clear and it's this task's turn". In practice the browser enforces a ~4 ms minimum for nested timers.</p>
    `,
  },
  {
    id: 4,
    type: 'lesson',
    title: 'Microtask Queue & Promises',
    content: `
      <h2>Microtasks Run Before the Next Macrotask</h2>
      <p>Microtasks have higher priority than macrotasks. After the call stack empties, the event loop drains <em>all</em> microtasks before picking the next macrotask.</p>
      <h2>What Creates Microtasks?</h2>
      <ul>
        <li><code>Promise.then</code> / <code>.catch</code> / <code>.finally</code> callbacks</li>
        <li><code>async/await</code> (continuation after <code>await</code> is a microtask)</li>
        <li><code>queueMicrotask()</code></li>
        <li><code>MutationObserver</code> callbacks (browser)</li>
      </ul>
      <h2>Classic Order Quiz</h2>
      <pre><code>console.log("1 — sync")

setTimeout(() => console.log("2 — macrotask"), 0)

Promise.resolve().then(() => console.log("3 — microtask"))

console.log("4 — sync")</code></pre>
      <p>Output order: <strong>1 → 4 → 3 → 2</strong></p>
      <ol>
        <li><code>1</code> and <code>4</code> are synchronous — run immediately on the stack.</li>
        <li><code>3</code> is a microtask — runs after the stack empties, before any macrotask.</li>
        <li><code>2</code> is a macrotask — runs in the next loop tick.</li>
      </ol>
      <h2>Starving the Event Loop</h2>
      <p>Because all microtasks run before the next macrotask, an infinite chain of microtasks will starve macrotasks (and block rendering):</p>
      <pre><code>function flood() {
  Promise.resolve().then(flood) // schedules itself as a microtask forever
}
flood() // browser tab freezes</code></pre>
    `,
  },
  {
    id: 5,
    type: 'lesson',
    title: 'async/await Under the Hood',
    content: `
      <h2>await Pauses the Function, Not the Thread</h2>
      <p><code>async/await</code> is syntax sugar over Promises. When the engine hits <code>await expr</code>, it:</p>
      <ol>
        <li>Evaluates <code>expr</code> (synchronously).</li>
        <li>Wraps the result in a Promise if needed.</li>
        <li>Pauses the <em>async function</em> and returns control to the caller.</li>
        <li>When the Promise settles, schedules the continuation as a <strong>microtask</strong>.</li>
      </ol>
      <pre><code>async function fetchUser() {
  console.log("A — before await")
  const data = await fetch("/api/user")  // pauses here
  console.log("C — after await")         // microtask continuation
}

fetchUser()
console.log("B — synchronous caller")
// Output: A → B → C</code></pre>
      <h2>await 0 — A Yield Trick</h2>
      <p>You can yield to the event loop from inside a long async task to let other microtasks (and eventually macrotasks) run:</p>
      <pre><code>async function chunkWork(items) {
  for (let i = 0; i < items.length; i++) {
    process(items[i])
    if (i % 100 === 0) await Promise.resolve() // yield every 100 items
  }
}</code></pre>
      <h2>Top-Level await</h2>
      <p>ES2022 modules support top-level <code>await</code>. The module is treated as a giant async function — nothing that depends on the module runs until it resolves.</p>
    `,
  },
]

export const eventLoopQuizzes: IQuiz[] = [
  {
    id: 100,
    type: 'quiz',
    title: 'Event Loop Quiz',
    afterLesson: 5,
    questions: [
      {
        id: 1,
        question: 'What is the output order of the following code?\n\nconsole.log("A")\nsetTimeout(() => console.log("B"), 0)\nPromise.resolve().then(() => console.log("C"))\nconsole.log("D")',
        options: ['A D B C', 'A D C B', 'A B C D', 'A C D B'],
        correct: 1,
        explanation: 'A and D are synchronous (run immediately). C is a microtask (runs after stack clears, before macrotasks). B is a macrotask (runs last in the next tick).',
      },
      {
        id: 2,
        question: 'Which queue has higher priority in the event loop?',
        options: ['Macrotask queue', 'Microtask queue', 'They are equal', 'Depends on the browser'],
        correct: 1,
        explanation: 'Microtasks always run before the next macrotask. After each macrotask, the entire microtask queue is drained before moving on.',
      },
      {
        id: 3,
        question: 'Which of these creates a MACROTASK?',
        options: ['Promise.resolve().then()', 'queueMicrotask()', 'setTimeout(cb, 0)', 'async/await continuation'],
        correct: 2,
        explanation: 'setTimeout schedules a macrotask. Promise.then, queueMicrotask, and async/await continuations all create microtasks.',
      },
      {
        id: 4,
        question: 'What happens when the call stack is NOT empty?',
        options: [
          'The event loop can still process microtasks',
          'The event loop waits — no callbacks can run',
          'Macrotasks run but microtasks wait',
          'The browser spawns a new thread',
        ],
        correct: 1,
        explanation: 'The event loop only picks up tasks when the call stack is completely empty. While synchronous code runs, nothing else can execute.',
      },
      {
        id: 5,
        question: 'An infinite chain of Promise.resolve().then() will:',
        options: [
          'Alternate with macrotasks fairly',
          'Throw a stack overflow error',
          'Starve macrotasks and block rendering',
          'Be automatically throttled by the browser',
        ],
        correct: 2,
        explanation: 'Because all microtasks run before the next macrotask, an infinite microtask chain never lets any macrotask (including rendering) run — effectively freezing the tab.',
      },
      {
        id: 6,
        question: 'When does the continuation after "await" run?',
        options: [
          'Immediately, synchronously, on the same stack frame',
          'As a macrotask in the next event loop tick',
          'As a microtask after the current call stack empties',
          'In a Web Worker thread',
        ],
        correct: 2,
        explanation: 'await pauses the async function and schedules its continuation as a microtask when the awaited Promise resolves. It does NOT block the thread.',
      },
    ],
  },
]
