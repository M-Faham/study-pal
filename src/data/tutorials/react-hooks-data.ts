import type { ILesson, IQuiz } from '../../types/tutorial'

export const reactHooksLessons: ILesson[] = [
  {
    id: 1,
    type: 'lesson',
    title: 'useState — State in Function Components',
    content: `
      <h2>What It Does</h2>
      <p>Stores a value that, when changed, causes the component to re-render. It's the most fundamental hook.</p>
      <pre><code>const [value, setValue] = useState(initialValue)</code></pre>

      <h2>Examples</h2>
      <pre><code>const [count, setCount] = useState(0)
const [user, setUser]   = useState&lt;User | null&gt;(null)
const [open, setOpen]   = useState(false)

// Update
setCount(5)                        // set directly
setCount(prev => prev + 1)         // functional update — use when new value depends on old</code></pre>

      <h2>Functional Update — When and Why</h2>
      <pre><code>// ❌ Stale closure — if setCount called twice in one event, both read count=0
setCount(count + 1)
setCount(count + 1)  // result: 1, not 2

// ✅ Functional update — always gets latest value
setCount(prev => prev + 1)
setCount(prev => prev + 1)  // result: 2</code></pre>

      <h2>Object State — Always Spread</h2>
      <pre><code>const [form, setForm] = useState({ name: '', email: '' })

// ❌ Mutating state directly — React won't re-render
form.name = 'Alice'

// ✅ Return new object
setForm(prev => ({ ...prev, name: 'Alice' }))</code></pre>

      <h2>Lazy Initializer</h2>
      <p>If computing the initial value is expensive, pass a function — it runs only once on mount.</p>
      <pre><code>// ❌ Runs expensive() on every render, only uses result on first
const [data, setData] = useState(expensive())

// ✅ Runs expensive() once on mount only
const [data, setData] = useState(() => expensive())</code></pre>

      <h2>Interview Questions</h2>
      <h3>Q: What is the difference between setState(value) and setState(prev => value)?</h3>
      <p>The functional form receives the <strong>guaranteed latest state</strong> as an argument. Use it whenever the new value depends on the old value — especially inside async callbacks or when calling setState multiple times in the same event handler, because the direct form can read a stale closure value.</p>

      <h3>Q: Does useState re-render if you set the same value?</h3>
      <p>No. React uses <code>Object.is</code> comparison. If the new value is the same as the current, React bails out and skips the re-render. This is why mutating an object in place and calling <code>setState(obj)</code> with the same reference does NOT trigger a re-render.</p>

      <h3>Q: Can you store derived data in useState?</h3>
      <p>You shouldn't. Derived values (things you can compute from existing state/props) should be calculated inline or with <code>useMemo</code> — not stored in separate state. Storing derived state leads to sync bugs where the two values drift apart.</p>
    `,
  },
  {
    id: 2,
    type: 'lesson',
    title: 'useEffect — Side Effects & Lifecycle',
    content: `
      <h2>What It Does</h2>
      <p>Runs a side effect after render. Side effects include: data fetching, subscriptions, timers, direct DOM manipulation, and anything that talks to the outside world.</p>
      <pre><code>useEffect(() => {
  // effect code — runs after render
  return () => {
    // cleanup — runs before next effect OR on unmount
  }
}, [dependencies])</code></pre>

      <h2>Dependency Array Rules</h2>
      <table>
        <tr><th>Array</th><th>When effect runs</th></tr>
        <tr><td>Omitted</td><td>After every render</td></tr>
        <tr><td><code>[]</code> empty</td><td>Once on mount only</td></tr>
        <tr><td><code>[a, b]</code></td><td>On mount + when a or b change</td></tr>
      </table>

      <h2>Common Pattern — Data Fetching</h2>
      <pre><code>useEffect(() => {
  const controller = new AbortController()

  fetch('/api/users', { signal: controller.signal })
    .then(r => r.json())
    .then(setUsers)
    .catch(err => { if (err.name !== 'AbortError') setError(err) })

  return () => controller.abort()  // cancel on unmount or re-run
}, [])  // empty array = run once on mount</code></pre>

      <h2>Cleanup — Timers & Subscriptions</h2>
      <pre><code>useEffect(() => {
  const id = setInterval(() => setTick(t => t + 1), 1000)
  return () => clearInterval(id)  // must clean up or interval leaks
}, [])

useEffect(() => {
  const sub = eventBus.subscribe('update', handler)
  return () => sub.unsubscribe()
}, [])</code></pre>

      <h2>Interview Questions</h2>
      <h3>Q: What happens if you omit the dependency array vs pass []?</h3>
      <p>Omitting runs the effect after <strong>every</strong> render — usually a bug. Passing <code>[]</code> runs it once on mount, equivalent to <code>componentDidMount</code>. Always include every reactive value the effect uses in the array.</p>

      <h3>Q: Why does React run effects twice in development?</h3>
      <p>In React 18 Strict Mode, React intentionally mounts → unmounts → remounts every component to help you find missing cleanup functions. This only happens in development. If your effect breaks on double-run, you have a missing cleanup.</p>

      <h3>Q: Can you use async directly in useEffect?</h3>
      <p>No. <code>useEffect</code> must return either nothing or a cleanup function — an async function returns a Promise, which React ignores but it causes bugs. The fix is to define an async function inside the effect and call it:</p>
      <pre><code>useEffect(() => {
  async function load() {
    const data = await fetchData()
    setData(data)
  }
  load()
}, [])</code></pre>

      <h3>Q: What is the stale closure problem?</h3>
      <p>When a dependency is missing from the array, the effect captures the value from the first render and never sees updates. The linter rule <code>react-hooks/exhaustive-deps</code> catches this automatically — never suppress it without understanding why.</p>
    `,
  },
  {
    id: 3,
    type: 'lesson',
    title: 'useContext — Shared State Without Prop Drilling',
    content: `
      <h2>What It Does</h2>
      <p>Reads a value from the nearest matching <code>Provider</code> above it in the tree. When the context value changes, all consumers re-render.</p>

      <h2>Full Pattern</h2>
      <pre><code>// 1. Create context with a default value
const ThemeContext = createContext&lt;'light' | 'dark'&gt;('light')

// 2. Provide value at the top of the tree
function App() {
  const [theme, setTheme] = useState&lt;'light' | 'dark'&gt;('light')
  return (
    &lt;ThemeContext.Provider value={theme}&gt;
      &lt;Layout /&gt;
    &lt;/ThemeContext.Provider&gt;
  )
}

// 3. Consume anywhere in the subtree
function Button() {
  const theme = useContext(ThemeContext)
  return &lt;button className={theme}&gt;Click me&lt;/button&gt;
}</code></pre>

      <h2>Best Practice — Custom Hook Wrapper</h2>
      <pre><code>// Wrap in a custom hook so consumers get a clear error if used outside Provider
function useTheme() {
  const ctx = useContext(ThemeContext)
  if (ctx === undefined) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}

// Usage
const theme = useTheme()  // clean, with error protection</code></pre>

      <h2>Context + Reducer Pattern (Poor Man's Redux)</h2>
      <pre><code>const StoreContext = createContext(null)

function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    &lt;StoreContext.Provider value={{ state, dispatch }}&gt;
      {children}
    &lt;/StoreContext.Provider&gt;
  )
}

function useStore() { return useContext(StoreContext) }</code></pre>

      <h2>Interview Questions</h2>
      <h3>Q: What is prop drilling and how does useContext solve it?</h3>
      <p>Prop drilling is passing a prop through many intermediate components that don't use it, just to reach a deeply nested child. <code>useContext</code> lets any component in the subtree read the value directly without intermediate components needing to forward it.</p>

      <h3>Q: When should you NOT use useContext for state?</h3>
      <p>Context is not optimised for high-frequency updates. Every consumer re-renders when the context value changes — even if they only use part of it. For frequently updating global state (e.g. a live counter, cursor position), use a dedicated library like Zustand or Jotai that has fine-grained subscriptions.</p>

      <h3>Q: What is the difference between Context and Redux?</h3>
      <p>Context is a React built-in for passing values down the tree — it has no built-in performance optimisation, middleware, or devtools. Redux (or Zustand/Jotai) are state management libraries with selective re-rendering, time-travel debugging, and middleware support. Use Context for low-frequency global values (theme, locale, auth user). Use a library for complex, high-frequency shared state.</p>
    `,
  },
  {
    id: 4,
    type: 'lesson',
    title: 'useReducer — Complex State Logic',
    content: `
      <h2>What It Does</h2>
      <p>An alternative to <code>useState</code> for complex state with multiple sub-values or state transitions that depend on the previous state. Follows the Redux pattern: <strong>state + action → new state</strong>.</p>
      <pre><code>const [state, dispatch] = useReducer(reducer, initialState)</code></pre>

      <h2>Counter Example</h2>
      <pre><code>type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'reset' }

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'increment': return state + 1
    case 'decrement': return state - 1
    case 'reset':     return 0
    default:          return state
  }
}

function Counter() {
  const [count, dispatch] = useReducer(reducer, 0)
  return (
    &lt;div&gt;
      &lt;p&gt;{count}&lt;/p&gt;
      &lt;button onClick={() => dispatch({ type: 'increment' })}&gt;+&lt;/button&gt;
      &lt;button onClick={() => dispatch({ type: 'decrement' })}&gt;-&lt;/button&gt;
      &lt;button onClick={() => dispatch({ type: 'reset' })}&gt;Reset&lt;/button&gt;
    &lt;/div&gt;
  )
}</code></pre>

      <h2>Form State — Where useReducer Shines</h2>
      <pre><code>type FormState = { name: string; email: string; loading: boolean; error: string | null }
type FormAction =
  | { type: 'setField'; field: keyof FormState; value: string }
  | { type: 'submit' }
  | { type: 'success' }
  | { type: 'error'; message: string }

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'setField':  return { ...state, [action.field]: action.value }
    case 'submit':    return { ...state, loading: true, error: null }
    case 'success':   return { ...state, loading: false }
    case 'error':     return { ...state, loading: false, error: action.message }
    default:          return state
  }
}</code></pre>

      <h2>Interview Questions</h2>
      <h3>Q: When should you use useReducer instead of useState?</h3>
      <p>Use <code>useReducer</code> when: (1) state has multiple sub-values that change together, (2) the next state depends on the previous in complex ways, (3) you have many related state transitions (like a form with loading/error/success), or (4) you want to centralise state logic and make it testable as a pure function.</p>

      <h3>Q: What is the key advantage of a reducer being a pure function?</h3>
      <p>Pure functions are trivial to unit test — you just call <code>reducer(state, action)</code> and assert on the returned value. No React, no DOM, no mocking needed. This makes complex state logic easy to verify.</p>

      <h3>Q: Can you combine useReducer with useContext?</h3>
      <p>Yes — this is the standard pattern for lightweight global state without Redux. Put <code>useReducer</code> at the top-level component, then pass both <code>state</code> and <code>dispatch</code> through context. Children can read state and dispatch actions without prop drilling.</p>
    `,
  },
  {
    id: 5,
    type: 'lesson',
    title: 'useMemo — Memoize Expensive Calculations',
    content: `
      <h2>What It Does</h2>
      <p>Caches the result of an expensive calculation between renders. Only recomputes when the dependencies change.</p>
      <pre><code>const memoizedValue = useMemo(() => expensiveCalculation(a, b), [a, b])</code></pre>

      <h2>When to Use It</h2>
      <pre><code>// ✅ Good use — genuinely expensive computation
const sortedList = useMemo(
  () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items]
)

// ✅ Good use — stable reference for a child that uses React.memo
const config = useMemo(() => ({ theme: 'dark', lang: 'en' }), [])

// ❌ Bad use — simple computation, useMemo adds overhead for no gain
const double = useMemo(() => count * 2, [count])
// Just write: const double = count * 2</code></pre>

      <h2>useMemo vs useEffect for Derived State</h2>
      <pre><code>// ❌ Don't use useEffect to derive state — causes extra render
useEffect(() => {
  setFiltered(items.filter(i => i.active))
}, [items])

// ✅ Use useMemo — computes synchronously during render, no extra render
const filtered = useMemo(
  () => items.filter(i => i.active),
  [items]
)</code></pre>

      <h2>Interview Questions</h2>
      <h3>Q: What is the difference between useMemo and useCallback?</h3>
      <p><code>useMemo</code> memoizes a <strong>computed value</strong>: <code>useMemo(() => compute(), [deps])</code>. <code>useCallback</code> memoizes a <strong>function reference</strong>: <code>useCallback(() => doSomething(), [deps])</code>. <code>useCallback(fn, deps)</code> is equivalent to <code>useMemo(() => fn, deps)</code>.</p>

      <h3>Q: Should you wrap every calculation in useMemo?</h3>
      <p>No. <code>useMemo</code> itself has overhead — it stores the cached value and compares dependencies on every render. For cheap calculations (arithmetic, simple filters on small arrays), it costs more than it saves. Only reach for it when you can measure a performance problem, or when you need a stable object/array reference to prevent unnecessary child re-renders.</p>

      <h3>Q: Does useMemo guarantee the value won't be recomputed?</h3>
      <p>No. React may discard the cached value in certain situations (e.g. low memory, Concurrent Mode). <code>useMemo</code> is a performance hint, not a semantic guarantee. Never use it for side effects or for correctness — only for performance.</p>
    `,
  },
  {
    id: 6,
    type: 'lesson',
    title: 'useCallback — Stable Function References',
    content: `
      <h2>What It Does</h2>
      <p>Returns a memoized version of a callback function. The function is only recreated when its dependencies change. Primarily used to prevent child component re-renders.</p>
      <pre><code>const stableHandler = useCallback(() => {
  doSomething(a, b)
}, [a, b])</code></pre>

      <h2>Why Functions Matter for Re-renders</h2>
      <pre><code>// Every render creates a NEW function reference
function Parent() {
  // ❌ handleClick is a new function object on every render
  const handleClick = () => console.log('clicked')

  // Child re-renders on every Parent render even if nothing changed
  return &lt;Child onClick={handleClick} /&gt;
}

// ✅ With useCallback — same reference as long as deps don't change
function Parent() {
  const handleClick = useCallback(() => console.log('clicked'), [])
  return &lt;Child onClick={handleClick} /&gt;  // Child only re-renders when handleClick changes
}</code></pre>

      <h2>The Full Pattern — useCallback + React.memo</h2>
      <pre><code>// Child wrapped in React.memo — only re-renders if props change
const ExpensiveList = React.memo(({ items, onDelete }) => {
  return items.map(item =&gt; (
    &lt;div key={item.id}&gt;
      {item.name}
      &lt;button onClick={() => onDelete(item.id)}&gt;Delete&lt;/button&gt;
    &lt;/div&gt;
  ))
})

// Parent uses useCallback to keep onDelete reference stable
function Parent() {
  const [items, setItems] = useState(initialItems)

  const handleDelete = useCallback((id: number) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])  // setItems is stable — safe to omit from deps

  return &lt;ExpensiveList items={items} onDelete={handleDelete} /&gt;
}</code></pre>

      <h2>Interview Questions</h2>
      <h3>Q: Does useCallback improve performance on its own?</h3>
      <p>No. <code>useCallback</code> only helps when the child receiving the function either (a) is wrapped in <code>React.memo</code>, or (b) uses the function as a dependency in its own <code>useEffect</code>/<code>useMemo</code>. Without one of those conditions, the stable reference makes no difference — the child re-renders anyway.</p>

      <h3>Q: What is the relationship between useCallback and React.memo?</h3>
      <p>They work together. <code>React.memo</code> skips re-rendering a child if its props haven't changed. But if a parent passes a function prop without <code>useCallback</code>, a new function object is created every render — failing the prop equality check and defeating <code>React.memo</code>. <code>useCallback</code> keeps the reference stable so <code>React.memo</code> can do its job.</p>

      <h3>Q: When should you NOT use useCallback?</h3>
      <p>When the child isn't memoized, when the function is simple, or when you're doing premature optimisation. Overusing <code>useCallback</code> makes code harder to read and adds memory overhead for storing the cached function and its dependency array. Profile first, optimise second.</p>
    `,
  },
  {
    id: 7,
    type: 'lesson',
    title: 'useRef — Mutable Values & DOM Access',
    content: `
      <h2>What It Does</h2>
      <p><code>useRef</code> returns a mutable object <code>{ current: value }</code>. Unlike state, changing <code>ref.current</code> does <strong>NOT</strong> trigger a re-render. It persists for the full component lifetime.</p>

      <h2>Two Main Uses</h2>
      <h3>1. Direct DOM Access</h3>
      <pre><code>function AutoFocusInput() {
  const inputRef = useRef&lt;HTMLInputElement&gt;(null)

  useEffect(() => {
    inputRef.current?.focus()  // focus on mount
  }, [])

  return &lt;input ref={inputRef} /&gt;
}</code></pre>

      <h3>2. Mutable Value That Doesn't Cause Re-renders</h3>
      <pre><code>// Store previous value
function usePrevious&lt;T&gt;(value: T) {
  const ref = useRef&lt;T&gt;(value)
  useEffect(() => { ref.current = value })  // update after render
  return ref.current  // returns the PREVIOUS value
}

// Store interval/timer ID
function Timer() {
  const intervalRef = useRef&lt;ReturnType&lt;typeof setInterval&gt;&gt;()

  function start() {
    intervalRef.current = setInterval(() => setTick(t => t + 1), 1000)
  }
  function stop() {
    clearInterval(intervalRef.current)
  }
}

// Track whether component is mounted (avoid setState after unmount)
const isMounted = useRef(true)
useEffect(() => {
  return () => { isMounted.current = false }
}, [])
// Later: if (isMounted.current) setState(...)</code></pre>

      <h2>Interview Questions</h2>
      <h3>Q: What is the difference between useRef and useState?</h3>
      <p>Both persist values across renders. The key difference: changing <code>ref.current</code> does <strong>not</strong> trigger a re-render. Use <code>useRef</code> when you need to store a value that the UI does not depend on (timers, previous values, DOM nodes). Use <code>useState</code> when the value should be reflected in the UI.</p>

      <h3>Q: Why shouldn't you read or write ref.current during rendering?</h3>
      <p>Refs are a side-channel outside React's rendering model. Reading a ref during render can give you a stale or inconsistent value (especially in Concurrent Mode where renders can be interrupted and retried). Only access <code>ref.current</code> inside event handlers or <code>useEffect</code>.</p>

      <h3>Q: What is forwardRef and when do you need it?</h3>
      <p>By default, you can't pass a <code>ref</code> to a function component — React doesn't forward it to the DOM element automatically. <code>React.forwardRef</code> lets a parent attach a ref to a DOM node inside a child component. Common for reusable input/button components in design systems.</p>
      <pre><code>const FancyInput = React.forwardRef&lt;HTMLInputElement&gt;((props, ref) => (
  &lt;input ref={ref} className="fancy" {...props} /&gt;
))

// Parent
const inputRef = useRef&lt;HTMLInputElement&gt;(null)
&lt;FancyInput ref={inputRef} /&gt;</code></pre>
    `,
  },
  {
    id: 8,
    type: 'lesson',
    title: 'useLayoutEffect — Synchronous DOM Measurements',
    content: `
      <h2>What It Does</h2>
      <p>Identical API to <code>useEffect</code>, but fires <strong>synchronously after DOM mutations and before the browser paints</strong>. This lets you read layout (dimensions, positions) and make DOM changes before the user sees anything.</p>

      <pre><code>useLayoutEffect(() => {
  // runs synchronously after DOM update, before paint
  const { height } = ref.current.getBoundingClientRect()
  setHeight(height)
}, [content])</code></pre>

      <h2>useEffect vs useLayoutEffect Timeline</h2>
      <table>
        <tr><th>Hook</th><th>When it runs</th><th>Blocks paint?</th></tr>
        <tr><td>useEffect</td><td>After paint (asynchronous)</td><td>No</td></tr>
        <tr><td>useLayoutEffect</td><td>After DOM update, before paint (synchronous)</td><td>Yes</td></tr>
      </table>

      <h2>When to Use useLayoutEffect</h2>
      <pre><code>// Measuring DOM elements — tooltip positioning
function Tooltip({ target, text }) {
  const tooltipRef = useRef(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useLayoutEffect(() => {
    // Read DOM position synchronously — before user sees the tooltip
    const rect = target.current.getBoundingClientRect()
    setPos({ top: rect.bottom, left: rect.left })
  }, [target])

  return &lt;div ref={tooltipRef} style={pos}&gt;{text}&lt;/div&gt;
}

// Preventing flash — reading scroll position before paint
useLayoutEffect(() => {
  window.scrollTo(0, savedScrollPos)
}, [])</code></pre>

      <h2>Interview Questions</h2>
      <h3>Q: When should you use useLayoutEffect over useEffect?</h3>
      <p>Only when you need to <strong>read or mutate the DOM before the browser paints</strong> — e.g. measuring element dimensions, positioning tooltips/popovers, or preventing a visual flash. For everything else use <code>useEffect</code>. <code>useLayoutEffect</code> blocks paint so it can hurt performance if overused.</p>

      <h3>Q: What happens if you use useLayoutEffect in a Server-Side Rendered app?</h3>
      <p>React will warn that <code>useLayoutEffect</code> does nothing on the server (there's no DOM). The fix is to use <code>useEffect</code> for most things, or conditionally switch to <code>useEffect</code> when running on the server. Libraries like Next.js sometimes provide an <code>useIsomorphicLayoutEffect</code> utility that uses <code>useLayoutEffect</code> in the browser and <code>useEffect</code> on the server.</p>

      <h3>Q: Can useLayoutEffect cause performance problems?</h3>
      <p>Yes. Because it's synchronous and blocks the browser from painting, any slow code inside it will delay the first visible frame — making the UI feel janky. Keep it minimal: measure, set state, exit. Never do data fetching or heavy computation inside <code>useLayoutEffect</code>.</p>
    `,
  },
]

export const reactHooksQuizzes: IQuiz[] = [
  {
    id: 100,
    type: 'quiz',
    title: 'React Hooks Interview Quiz',
    afterLesson: 8,
    questions: [
      {
        id: 1,
        question: 'You call setCount(count + 1) twice in the same click handler. The count only increases by 1. Why?',
        options: [
          'React batches state updates and ignores duplicates',
          'Both calls read the same stale count value from the closure',
          'useState only allows one update per event',
          'You need to use useReducer for multiple increments',
        ],
        correct: 1,
        explanation: 'Both calls capture the same count value from the closure. The fix is the functional form: setCount(prev => prev + 1) twice, which correctly results in +2 because each call receives the latest state.',
      },
      {
        id: 2,
        question: 'What is the correct way to run code only once when a component mounts?',
        options: [
          'useEffect(() => { ... }) — no array',
          'useEffect(() => { ... }, undefined)',
          'useEffect(() => { ... }, [])',
          'useLayoutEffect(() => { ... })',
        ],
        correct: 2,
        explanation: 'An empty dependency array [] means "no dependencies" — the effect runs once after the first render and never again. Omitting the array runs it after every render.',
      },
      {
        id: 3,
        question: 'Why does React run useEffect twice on mount in development?',
        options: [
          'It is a bug in React 18',
          'Strict Mode intentionally mounts/unmounts/remounts to detect missing cleanup',
          'useEffect always runs twice for performance reasons',
          'It only runs twice if you have two Provider components',
        ],
        correct: 1,
        explanation: 'React 18 Strict Mode double-invokes effects to help you find missing cleanup functions. If your effect breaks on the second run, you have a bug — a well-written effect should be safe to run multiple times.',
      },
      {
        id: 4,
        question: 'useCallback on its own (without React.memo on the child) will:',
        options: [
          'Always prevent the child from re-rendering',
          'Improve performance by reducing function creation overhead',
          'Have no effect on child re-renders — child still re-renders every time',
          'Throw a warning in development',
        ],
        correct: 2,
        explanation: 'useCallback keeps the function reference stable, but if the child is not wrapped in React.memo (or does not use the function as a useEffect dependency), it re-renders anyway. The two must be used together.',
      },
      {
        id: 5,
        question: 'What is the key difference between useRef and useState?',
        options: [
          'useRef can only store DOM elements',
          'useState is synchronous, useRef is asynchronous',
          'Changing ref.current does not trigger a re-render; changing state does',
          'useRef values reset on every render',
        ],
        correct: 2,
        explanation: 'useRef returns a mutable object whose .current property can be changed freely without causing a re-render. Use it for values the UI does not depend on: timers, previous values, DOM nodes.',
      },
      {
        id: 6,
        question: 'When should you use useReducer instead of useState?',
        options: [
          'Always — useReducer is the modern replacement for useState',
          'When state has multiple related sub-values or complex transitions that depend on previous state',
          'Only when using Redux alongside React',
          'When you need to share state across components',
        ],
        correct: 1,
        explanation: 'useReducer is preferred when state logic is complex: multiple related fields (e.g. a form), or transitions that depend on the previous state. For simple independent values, useState is simpler and sufficient.',
      },
      {
        id: 7,
        question: 'You have an expensive sort running on every render. Which hook prevents it from recomputing unless the data changes?',
        options: [
          'useCallback',
          'useRef',
          'useMemo',
          'useEffect',
        ],
        correct: 2,
        explanation: 'useMemo(() => [...data].sort(...), [data]) caches the sorted result and only recomputes when data changes. useCallback memoizes functions, not values. useEffect runs after render and would cause an extra re-render.',
      },
      {
        id: 8,
        question: 'What is the main reason to use useLayoutEffect instead of useEffect?',
        options: [
          'It is faster than useEffect',
          'You need to read or mutate the DOM before the browser paints to avoid visual flicker',
          'It works on the server; useEffect does not',
          'It runs before state updates are committed',
        ],
        correct: 1,
        explanation: 'useLayoutEffect fires synchronously after DOM mutations but before the browser paints. This is the only time you need it — measuring element dimensions, positioning tooltips, or preventing a flash. For everything else, prefer useEffect.',
      },
      {
        id: 9,
        question: 'What problem does useContext solve?',
        options: [
          'State that needs to persist after the component unmounts',
          'Passing values through many intermediate components (prop drilling)',
          'Sharing state between completely separate React trees',
          'Replacing all useState calls with a global store',
        ],
        correct: 1,
        explanation: 'useContext lets any component in a subtree read a value from a Provider above it — without every intermediate component needing to accept and pass that prop down manually.',
      },
      {
        id: 10,
        question: 'Why should you NOT write async directly as the useEffect callback?',
        options: [
          'async functions are not allowed inside React components',
          'async functions return a Promise, but useEffect expects a cleanup function or undefined',
          'React does not support Promises',
          'It causes an infinite loop',
        ],
        correct: 1,
        explanation: 'useEffect must return either nothing or a cleanup function. An async function always returns a Promise, which React does not treat as a cleanup function. Define an inner async function and call it instead.',
      },
    ],
  },
]
