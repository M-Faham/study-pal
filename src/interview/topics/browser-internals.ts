import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: "browser-internals",
  title: "Browser Internals",
  icon: "🌐",
  difficulty: "Tricky",
  targets: ['General'],
  cheatSheet: [
    {
      concept: "Critical Rendering Path",
      explanation:
        "HTML → DOM → CSSOM → Render Tree → Layout → Paint → Composite. JavaScript blocks parsing unless async or defer. CSS blocks rendering.",
      code: `<!-- Blocking — parser stops until script downloads + executes -->
<script src="app.js"></script>

<!-- async — downloads in parallel, executes immediately when ready -->
<script async src="analytics.js"></script>

<!-- defer — downloads in parallel, executes after HTML is parsed -->
<script defer src="app.js"></script>
<!-- defer scripts execute in document order — prefer for app bundles -->`,
    },
    {
      concept: "Reflow vs Repaint",
      explanation:
        "Reflow (layout): geometry changed — browser recalculates positions of all affected elements. Repaint: visual change only (colour, opacity). Reflow is expensive — it cascades. Composite-only changes (transform, opacity) are cheapest.",
      code: `// ❌ Triggers reflow — reading layout forces flush
element.style.width = '100px'
const height = element.offsetHeight  // forces synchronous layout
element.style.height = height + 'px'  // another reflow

// ✅ Batch reads then writes — one reflow
const height = element.offsetHeight   // read
requestAnimationFrame(() => {
  element.style.width = '100px'       // write in next frame
  element.style.height = height + 'px'
})`,
    },
    {
      concept: "Web Storage — localStorage vs sessionStorage vs Cookies",
      explanation:
        "localStorage: persists until cleared, ~5MB. sessionStorage: cleared on tab close, ~5MB. Cookie: sent with every HTTP request, 4KB limit, can be httpOnly and Secure.",
      code: `localStorage.setItem('theme', 'dark')    // persists forever
sessionStorage.setItem('draft', json)   // cleared on tab close
// Cookies — set by server for httpOnly, or by JS for regular
document.cookie = 'pref=dark; path=/; max-age=31536000'`,
    },
    {
      concept: "requestAnimationFrame",
      explanation:
        "Schedules a callback before the next browser paint — ~60 times per second. Use it for animations and DOM updates to stay in sync with the display refresh rate.",
      code: `// Animation loop — smooth 60fps
function animate(timestamp: number) {
  element.style.transform = 'translateX(' + (timestamp / 10 % 300) + 'px)'
  requestAnimationFrame(animate)
}
requestAnimationFrame(animate)`,
    },
  ],
  spokenAnswer: {
    question:
      "Explain the browser's critical rendering path and how you optimise it.",
    answer: `When the browser receives HTML it starts parsing and builds the DOM. When it encounters CSS it fetches it and builds the CSSOM — rendering is blocked until the CSSOM is complete, which is why you put stylesheets in the head. When it hits a script tag without async or defer, parsing stops, the script is fetched and executed, then parsing continues — which is why you historically put scripts at the bottom of body. With defer, scripts download in parallel and execute after HTML is parsed. With async, they execute immediately when downloaded regardless of parsing state. Once the DOM and CSSOM are ready, the browser creates the render tree, does layout — calculating every element's geometry — then paints pixels, then composites layers. The optimisations I apply are: use defer for app bundles, avoid synchronous JavaScript that blocks parsing, batch DOM reads and writes to prevent layout thrashing, and prefer CSS transforms and opacity for animations because they're handled by the compositor and don't trigger layout or paint.`,
  },
  traps: [
    {
      trap: "Reading layout properties (offsetHeight, getBoundingClientRect) immediately after writing styles",
      correction:
        'Reading a layout property after a style change forces the browser to synchronously flush all pending styles and recalculate layout — "layout thrashing". Batch reads first, then writes, or use requestAnimationFrame to defer writes.',
    },
    {
      trap: "Using CSS top/left for animations instead of transform",
      correction:
        "Animating top or left triggers layout and paint on every frame — expensive. transform: translate() is handled by the GPU compositor and doesn't trigger layout or paint. Always prefer transform and opacity for smooth animations.",
    },
  ],
  quiz: [
    {
      id: 1,
      question:
        "What is the difference between async and defer on a script tag?",
      options: [
        "async downloads in parallel and executes after HTML is parsed; defer executes immediately when downloaded",
        "defer downloads in parallel and executes after HTML is parsed in order; async executes immediately when downloaded",
        "They are identical — both defer execution until the DOM is ready",
        "async is for external scripts; defer is for inline scripts",
      ],
      correct: 1,
      explanation:
        "defer: downloads in parallel, executes after HTML parsing is complete, in document order — safe for app bundles. async: downloads in parallel, executes immediately when ready regardless of parse state — for independent scripts like analytics.",
    },
    {
      id: 2,
      question:
        "Why is animating transform: translateX() better than animating left?",
      options: [
        "transform is supported in more browsers",
        "transform is handled by the GPU compositor — no layout or paint triggered; left triggers full reflow on every frame",
        "left does not work with requestAnimationFrame",
        "transform uses less memory",
      ],
      correct: 1,
      explanation:
        "Changing left triggers layout (reflow) and paint on every animation frame — expensive. transform and opacity are promoted to their own compositor layer and animated on the GPU without touching layout or paint — smooth 60fps.",
    },
  ],
}
