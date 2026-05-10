import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: "rendering-lifecycle",
  title: "Rendering Lifecycle",
  icon: "🔄",
  difficulty: "Core",
  targets: ['Angular', 'React'],
  keyPoints: [
    'React: render → reconcile (diffing) → commit (DOM update)',
    'Angular: change detection → view update → DOM patch',
    'useEffect runs after paint; useLayoutEffect runs before paint',
    'Key prop tells React which list items changed — use stable IDs not index',
    'Batched state updates in React 18 — fewer re-renders',
  ],
  cheatSheet: [
    {
      concept: "React Render Cycle",
      explanation:
        "render → reconcile (Virtual DOM diff) → commit (apply DOM mutations). React only updates what changed. A component re-renders when its state or props change, or its parent re-renders.",
      code: `// Render phase — pure, can be interrupted (Concurrent Mode)
function Component({ name }) {
  return <div>{name}</div>  // describes UI, does not touch DOM
}

// Commit phase — synchronous, touches the real DOM
// After commit: useLayoutEffect fires, then useEffect fires`,
    },
    {
      concept: "Angular Change Detection Cycle",
      explanation:
        "Zone.js patches async APIs. After any async event (click, HTTP, timer), Angular runs change detection from root to leaves — checking every Default component. OnPush components are skipped unless triggered.",
      code: `// Zone.js intercepts this and triggers Angular CD automatically
document.getElementById('btn').addEventListener('click', () => {
  this.count++  // Angular detects this change via Zone
})

// Running outside Zone — no automatic CD trigger
this.ngZone.runOutsideAngular(() => {
  // Heavy animation — don't want CD on every frame
  requestAnimationFrame(loop)
})
// When you need to update the view:
this.ngZone.run(() => this.count++)`,
    },
    {
      concept: "React Reconciliation — Keys",
      explanation:
        "React uses keys to match elements between renders. A stable key (like item.id) lets React reuse the DOM node. An index as key causes incorrect reuse when list order changes.",
      code: `// ❌ Index as key — broken when list is sorted or filtered
{items.map((item, i) => <Item key={i} item={item} />)}

// ✅ Stable unique key — React correctly reuses DOM nodes
{items.map(item => <Item key={item.id} item={item} />)}`,
    },
    {
      concept: "React Strict Mode Double Invocation",
      explanation:
        "In development, React 18 renders components twice and runs effects twice to surface bugs from non-idempotent renders and missing cleanup. This is intentional and only in dev mode.",
      code: `// In development — this fires twice per mount:
useEffect(() => {
  const sub = subscribe()
  return () => sub.unsubscribe()  // must be correct to survive double-invoke
}, [])

// If your effect breaks on double-run: you have a missing cleanup`,
    },
  ],
  spokenAnswer: {
    question:
      "How does Angular's change detection work and what triggers it?",
    answer: `Angular uses Zone.js to monkey-patch all async APIs — setTimeout, fetch, DOM events, Promises. After any of these complete, Zone.js notifies Angular, which runs change detection from the root component down through the entire component tree, checking each component's template expressions against the previous values. With the default strategy, every component is checked every time, which is safe but can be slow for large trees. With OnPush, Angular skips a component unless one of its @Input references changed, an event fired inside it, or an Observable via the async pipe emitted. So OnPush is an optimisation that reduces the number of checks per cycle. Zone.js is also why you sometimes need ngZone.runOutsideAngular — for high-frequency events like scroll or animation where you don't want Angular running change detection on every frame. You do the work outside the zone, and when you have a result to show, you re-enter the zone to update the view.`,
  },
  traps: [
    {
      trap: "Using array index as key in React lists",
      correction:
        "When a list is sorted, filtered, or has items inserted/removed, using index as key causes React to match the wrong elements — leading to incorrect DOM reuse, broken animations, and state appearing in the wrong component. Use a stable unique identifier.",
    },
    {
      trap: "Running expensive operations inside the Angular template (method calls)",
      correction:
        "Template expressions are evaluated on every change detection cycle. A method call like getFilteredItems() runs potentially hundreds of times per second. Pre-compute in ngOnChanges, use a pure pipe, or memoize with a selector.",
    },
  ],
  quiz: [
    {
      id: 1,
      question: "What triggers Angular's change detection by default?",
      options: [
        "Only @Input property changes",
        "Only explicit calls to detectChanges()",
        "Any async event (click, HTTP, timer) because Zone.js patches async APIs and notifies Angular",
        "Only Observable emissions through the async pipe",
      ],
      correct: 2,
      explanation:
        "Zone.js patches all async APIs. When any async operation completes — a click handler, HTTP response, setTimeout — Zone.js notifies Angular, which runs change detection from root to leaves.",
    },
    {
      id: 2,
      question: "Why is using list index as key in React a problem?",
      options: [
        "Indexes are numbers — React requires string keys",
        "Indexes change when items are added, removed, or reordered — causing React to reuse DOM nodes for the wrong items",
        "React only supports UUID string keys",
        "Index keys prevent React from rendering lists",
      ],
      correct: 1,
      explanation:
        "Keys are React's way of matching elements between renders. If index 0 had item A and after a deletion index 0 now has item B, React thinks it's the same element and reuses the DOM node — causing incorrect state, broken animations, and visual bugs.",
    },
  ],
}
