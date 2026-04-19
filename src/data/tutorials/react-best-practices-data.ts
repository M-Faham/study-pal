/**
 * React Best Practices — Lesson Data
 *
 * WHAT YOU'LL LEARN:
 * - Component design rules (size, naming, colocation)
 * - State management choices and when to use each
 * - Performance optimisation (memo, useMemo, useCallback, lazy)
 * - Custom hooks — extracting and reusing logic
 * - Error boundaries and suspense
 */

import { ILesson } from '../../types/tutorial'

export const reactBestPracticesLessons: ILesson[] = [
  {
    id: 1,
    type: 'lesson',
    title: 'Component Design Rules',
    content: `
      <h2 class="text-2xl font-bold mb-4">Component Design Rules</h2>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p class="font-bold mb-3">Rule 1 — One component, one job</p>
        <p class="text-gray-700 text-sm mb-2">
          If you need "and" to describe what a component does, it should probably be two components.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p class="text-xs font-bold text-red-700 mb-1">❌ Too much</p>
            <pre class="bg-gray-800 text-red-400 p-2 rounded text-xs"><code>// Fetches data AND formats it
// AND renders a table AND handles pagination
function UserTableWithPagination() { ... }</code></pre>
          </div>
          <div>
            <p class="text-xs font-bold text-green-700 mb-1">✅ Focused</p>
            <pre class="bg-gray-800 text-green-400 p-2 rounded text-xs"><code>function useUsers() { /* fetch */ }
function UserTable({ users }) { /* render */ }
function Pagination({ page, total }) { /* nav */ }</code></pre>
          </div>
        </div>
      </div>

      <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
        <p class="font-bold mb-3">Rule 2 — Keep components small (&lt; 150 lines)</p>
        <p class="text-gray-700 text-sm">
          If a component grows past ~150 lines, look for pieces to extract.
          Smaller components are easier to test, reuse, and understand at a glance.
        </p>
      </div>

      <div class="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
        <p class="font-bold mb-3">Rule 3 — Naming conventions</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>// Components — PascalCase
function UserCard() {}
function NavigationMenu() {}

// Hooks — camelCase, prefix with "use"
function useUserData() {}
function useDebounce() {}

// Event handlers — prefix with "handle"
const handleSubmit = () => {}
const handleKeyDown = () => {}

// Booleans — prefix with "is", "has", "can", "should"
const isLoading = true
const hasError = false
const canEdit = user.role === 'admin'</code></pre>
      </div>

      <div class="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
        <p class="font-bold mb-3">Rule 4 — Colocation (put code near where it's used)</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>// ❌ Global utils file with everything
// src/utils.ts — 500 lines of unrelated helpers

// ✅ Colocate helpers with the component that uses them
// src/components/UserCard/
//   UserCard.tsx         ← component
//   UserCard.utils.ts    ← helpers only UserCard uses
//   UserCard.test.tsx    ← tests
//   index.ts             ← re-export</code></pre>
        <p class="text-gray-600 text-sm mt-2">When you delete a component, you delete its helpers too — no dead code left behind.</p>
      </div>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <p class="font-bold mb-3">Rule 5 — Props should be minimal and intentional</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>// ❌ Prop drilling everything
function Page({ user, theme, locale, permissions, onUpdate }) {}

// ✅ Pass what the component actually needs
function UserBadge({ name, avatarUrl }: { name: string; avatarUrl: string }) {}

// ✅ For deeply shared state, use Context or a state manager
const { theme } = useTheme()
const { locale } = useLocale()</code></pre>
      </div>
    `,
  },
  {
    id: 2,
    type: 'lesson',
    title: 'State Management — Choosing the Right Tool',
    content: `
      <h2 class="text-2xl font-bold mb-4">State Management — Choosing the Right Tool</h2>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p class="font-bold mb-3">Decision tree — which tool to use?</p>
        <ol class="list-decimal ml-5 space-y-2 text-gray-700 text-sm">
          <li><strong>Is the state local to one component?</strong> → <code class="bg-gray-200 px-1">useState</code></li>
          <li><strong>Is the state logic complex?</strong> → <code class="bg-gray-200 px-1">useReducer</code></li>
          <li><strong>Does it need to be shared across the tree without drilling?</strong> → <code class="bg-gray-200 px-1">Context + useReducer</code></li>
          <li><strong>Is it server data (fetching, caching)?</strong> → <code class="bg-gray-200 px-1">TanStack Query</code></li>
          <li><strong>Is it large-scale global state?</strong> → <code class="bg-gray-200 px-1">Zustand</code> or <code class="bg-gray-200 px-1">Redux Toolkit</code></li>
        </ol>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">Context — sharing state without prop drilling</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>/**
 * BEST PRACTICE: Always wrap Context + Provider + custom hook together.
 * The hook enforces that the context is used inside its provider.
 */
interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext&lt;ThemeContextValue | null&gt;(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState&lt;'light' | 'dark'&gt;('light')
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    &lt;ThemeContext.Provider value={{ theme, toggleTheme }}&gt;
      {children}
    &lt;/ThemeContext.Provider&gt;
  )
}

// Custom hook — throws a clear error if used outside provider
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

// Consumer — no prop drilling needed
function DarkModeButton() {
  const { theme, toggleTheme } = useTheme()
  return &lt;button onClick={toggleTheme}&gt;{theme}&lt;/button&gt;
}</code></pre>
      </div>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <p class="font-bold mb-2">⚠️ Context re-renders every consumer on every change</p>
        <p class="text-gray-700 text-sm">
          Split frequently-changing values into their own contexts, or use
          <code class="bg-gray-200 px-1">useMemo</code> on the value object to prevent
          unnecessary re-renders.
        </p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm mt-2"><code>// ✅ Memoize context value
const value = useMemo(
  () => ({ theme, toggleTheme }),
  [theme]   // only re-creates when theme changes
)

&lt;ThemeContext.Provider value={value}&gt;</code></pre>
      </div>
    `,
  },
  {
    id: 3,
    type: 'lesson',
    title: 'Performance — memo, useMemo, useCallback',
    content: `
      <h2 class="text-2xl font-bold mb-4">Performance — memo, useMemo, useCallback</h2>

      <div class="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
        <p class="font-bold mb-2">⚠️ Golden rule — don't optimise early</p>
        <p class="text-gray-700 text-sm">
          React is fast by default. Only reach for these tools after measuring a real
          performance problem. Premature memoisation adds complexity and can even slow
          things down due to comparison overhead.
        </p>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">React.memo — skip re-rendering a component</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>/**
 * React.memo wraps a component and skips re-rendering
 * if props haven't changed (shallow comparison).
 *
 * USE WHEN:
 * - Component renders often
 * - Props rarely change
 * - Rendering is expensive (large lists, heavy calculations)
 */
const ExpensiveChart = React.memo(function ExpensiveChart({
  data,
}: {
  data: number[]
}) {
  // Only re-renders when 'data' reference changes
  return &lt;canvas /&gt;
})

// Parent
function Dashboard() {
  const [count, setCount] = useState(0)
  const chartData = [1, 2, 3]  // ⚠️ new reference every render!

  // ExpensiveChart still re-renders because chartData is a new array each time.
  // Fix: move chartData outside the component, or use useMemo.
  return &lt;ExpensiveChart data={chartData} /&gt;
}</code></pre>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">useMemo — cache an expensive computed value</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>/**
 * useMemo returns a cached value.
 * The function only re-runs when dependencies change.
 *
 * USE WHEN: a calculation is slow (sorting 10k items, complex math)
 */
const sortedUsers = useMemo(
  () => [...users].sort((a, b) => a.name.localeCompare(b.name)),
  [users]  // only re-sort when users array changes
)

// Also use to stabilise object/array references for React.memo children:
const chartData = useMemo(() => [1, 2, 3], [])  // same reference every render</code></pre>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">useCallback — cache a function reference</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>/**
 * useCallback returns a cached function.
 * Without it, a new function is created on every render,
 * breaking React.memo on child components that receive it.
 *
 * USE WHEN: passing callbacks to memoised child components
 */
const handleDelete = useCallback(
  (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id))
  },
  []  // no deps — function never changes
)

// Now React.memo(UserRow) won't re-render when parent re-renders
&lt;UserRow user={user} onDelete={handleDelete} /&gt;</code></pre>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
        <p class="font-bold mb-2">Lazy loading — code splitting at the component level</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>import { lazy, Suspense } from 'react'

// The bundle for HeavyDashboard is only downloaded when the route is visited
const HeavyDashboard = lazy(() => import('./pages/HeavyDashboard'))

function App() {
  return (
    &lt;Suspense fallback={&lt;p&gt;Loading…&lt;/p&gt;}&gt;
      &lt;Routes&gt;
        &lt;Route path="/dashboard" element={&lt;HeavyDashboard /&gt;} /&gt;
      &lt;/Routes&gt;
    &lt;/Suspense&gt;
  )
}</code></pre>
      </div>
    `,
  },
  {
    id: 4,
    type: 'lesson',
    title: 'Custom Hooks — Extracting & Reusing Logic',
    content: `
      <h2 class="text-2xl font-bold mb-4">Custom Hooks — Extracting & Reusing Logic</h2>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p class="font-bold mb-2">What is a custom hook?</p>
        <p class="text-gray-700 text-sm">
          A custom hook is a regular JavaScript function whose name starts with <code class="bg-gray-200 px-1">use</code>
          and that can call other hooks inside. It lets you extract stateful logic from components
          and share it across multiple components without duplication.
        </p>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">Example 1 — useFetch (data fetching)</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>/**
 * BEST PRACTICE: A custom hook returns a plain object.
 * Destructure only what you need at the call site.
 * This makes it easy to add new return values without breaking callers.
 */
interface FetchState&lt;T&gt; {
  data: T | null
  loading: boolean
  error: string | null
}

function useFetch&lt;T&gt;(url: string): FetchState&lt;T&gt; {
  const [data,    setData]    = useState&lt;T | null&gt;(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState&lt;string | null&gt;(null)

  useEffect(() => {
    let cancelled = false   // prevent state update after unmount

    setLoading(true)
    fetch(url)
      .then(r => r.json())
      .then(json => { if (!cancelled) setData(json) })
      .catch(e  => { if (!cancelled) setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }  // cleanup
  }, [url])

  return { data, loading, error }
}

// Usage — clean component, no fetch logic inside
function UserProfile({ id }: { id: number }) {
  const { data, loading, error } = useFetch&lt;User&gt;(\`/api/users/\${id}\`)

  if (loading) return &lt;p&gt;Loading…&lt;/p&gt;
  if (error)   return &lt;p className="text-red-600"&gt;{error}&lt;/p&gt;
  return &lt;p&gt;{data?.name}&lt;/p&gt;
}</code></pre>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">Example 2 — useDebounce (delay expensive operations)</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>/**
 * Returns a value that only updates after the user stops typing.
 * Prevents an API call on every single keystroke.
 */
function useDebounce&lt;T&gt;(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)  // cancel on next keystroke
  }, [value, delay])

  return debounced
}

// Usage
function SearchBox() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 400)

  useEffect(() => {
    if (debouncedQuery) searchAPI(debouncedQuery)
  }, [debouncedQuery])  // only fires 400ms after user stops typing

  return &lt;input value={query} onChange={e => setQuery(e.target.value)} /&gt;
}</code></pre>
      </div>

      <div class="bg-green-50 border-l-4 border-green-500 p-4">
        <p class="font-bold mb-2">Example 3 — useLocalStorage</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>function useLocalStorage&lt;T&gt;(key: string, initial: T) {
  const [value, setValue] = useState&lt;T&gt;(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initial
  })

  const set = (newValue: T) => {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }

  return [value, set] as const  // same API as useState
}

// Works exactly like useState but persists across page loads
const [theme, setTheme] = useLocalStorage('theme', 'light')</code></pre>
      </div>
    `,
  },
  {
    id: 5,
    type: 'lesson',
    title: 'Error Boundaries & Suspense',
    content: `
      <h2 class="text-2xl font-bold mb-4">Error Boundaries & Suspense</h2>

      <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <p class="font-bold mb-2">The problem — unhandled render errors crash the whole app</p>
        <p class="text-gray-700 text-sm">
          If any component throws during rendering, React unmounts the entire tree — the user
          sees a blank page. Error Boundaries catch these errors and show a fallback UI instead.
        </p>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">Error Boundary component</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>import { Component, ReactNode } from 'react'

interface Props   { children: ReactNode; fallback?: ReactNode }
interface State   { hasError: boolean; error: Error | null }

/**
 * Error Boundaries must be CLASS components — there is no hook equivalent yet.
 * BEST PRACTICE: Use a library like 'react-error-boundary' instead of writing this manually.
 */
class ErrorBoundary extends Component&lt;Props, State&gt; {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to your error tracking service (Sentry, Datadog, etc.)
    console.error('Caught by ErrorBoundary:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        &lt;div className="p-4 bg-red-50 text-red-700 rounded"&gt;
          &lt;p className="font-bold"&gt;Something went wrong.&lt;/p&gt;
          &lt;button onClick={() => this.setState({ hasError: false, error: null })}&gt;
            Try again
          &lt;/button&gt;
        &lt;/div&gt;
      )
    }
    return this.props.children
  }
}

// BEST PRACTICE: Wrap feature areas, not individual components
&lt;ErrorBoundary fallback={&lt;p&gt;Chart failed to load.&lt;/p&gt;}&gt;
  &lt;HeavyChart /&gt;
&lt;/ErrorBoundary&gt;</code></pre>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">react-error-boundary — library alternative (recommended)</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>npm install react-error-boundary

import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    &lt;div&gt;
      &lt;p&gt;Error: {error.message}&lt;/p&gt;
      &lt;button onClick={resetErrorBoundary}&gt;Try again&lt;/button&gt;
    &lt;/div&gt;
  )
}

&lt;ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => refetch()}&gt;
  &lt;UserProfile /&gt;
&lt;/ErrorBoundary&gt;</code></pre>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
        <p class="font-bold mb-2">Suspense — show a fallback while lazy components load</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>/**
 * Suspense works with:
 * - React.lazy (code splitting)
 * - Data libraries that support it (TanStack Query v5, Relay)
 *
 * BEST PRACTICE: Combine with ErrorBoundary — Suspense handles loading,
 * ErrorBoundary handles failures.
 */
&lt;ErrorBoundary fallback={&lt;p&gt;Failed to load page.&lt;/p&gt;}&gt;
  &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
    &lt;Route path="/dashboard" element={&lt;LazyDashboard /&gt;} /&gt;
  &lt;/Suspense&gt;
&lt;/ErrorBoundary&gt;</code></pre>
      </div>
    `,
  },
]
