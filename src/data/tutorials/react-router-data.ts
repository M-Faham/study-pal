/**
 * React Router Crash Course - Lesson Data
 *
 * WHAT YOU'LL LEARN:
 * - What client-side routing is and why it exists
 * - Setting up React Router v6
 * - Nested routes, dynamic params, layouts
 * - Programmatic navigation and guards
 *
 * These are lessons only (ILesson[]) — pure content, zero logic.
 * The tutorial component handles all rendering and state.
 */

import { ILesson } from '../../types/tutorial'

export const reactRouterLessons: ILesson[] = [
  {
    id: 1,
    type: 'lesson',
    title: 'What is Client-Side Routing?',
    content: `
      <h2 class="text-2xl font-bold mb-4">What is Client-Side Routing?</h2>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p class="font-bold mb-2">The Problem Without a Router</p>
        <p class="text-gray-700">
          In a traditional website, every URL change triggers a full page reload from the server.
          In a React SPA (Single Page Application) there is only <em>one</em> HTML file — so
          navigating to <code class="bg-gray-200 px-1">/settings</code> would give a 404 unless
          the browser never actually hits the server for it.
        </p>
      </div>

      <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
        <p class="font-bold mb-2">The Solution: Client-Side Routing</p>
        <p class="text-gray-700 mb-2">
          React Router intercepts URL changes in the browser and renders the correct
          component — without ever leaving the page. The network stays quiet;
          only JavaScript runs.
        </p>
        <ul class="list-disc ml-5 space-y-1 text-gray-700 text-sm">
          <li>Instant navigation (no server round-trip)</li>
          <li>Shared state and layout between pages</li>
          <li>Animations and transitions between views</li>
          <li>Deep linking still works (users can bookmark /profile/42)</li>
        </ul>
      </div>

      <div class="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
        <p class="font-bold mb-2">Two Routing Strategies</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          <div class="bg-white p-3 rounded border">
            <p class="font-bold text-sm mb-1">Hash Routing</p>
            <code class="text-xs bg-gray-100 px-1">myapp.com/#/settings</code>
            <p class="text-xs text-gray-600 mt-1">Uses the URL hash. Works without server config but looks ugly.</p>
          </div>
          <div class="bg-white p-3 rounded border">
            <p class="font-bold text-sm mb-1">Browser (History) Routing ✅ preferred</p>
            <code class="text-xs bg-gray-100 px-1">myapp.com/settings</code>
            <p class="text-xs text-gray-600 mt-1">Uses the History API. Clean URLs — requires server to always serve index.html.</p>
          </div>
        </div>
      </div>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <p class="font-bold mb-2">React Router v6 — the Standard</p>
        <p class="text-gray-700 text-sm mb-2">The most popular routing library for React. Install it once per project:</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>npm install react-router-dom</code></pre>
      </div>
    `,
  },
  {
    id: 2,
    type: 'lesson',
    title: 'Setting Up Routes',
    content: `
      <h2 class="text-2xl font-bold mb-4">Setting Up Routes</h2>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p class="font-bold mb-3">The three building blocks</p>
        <ul class="list-disc ml-5 space-y-2 text-gray-700 text-sm">
          <li><code class="bg-gray-200 px-1">&lt;BrowserRouter&gt;</code> — wraps your whole app, enables routing</li>
          <li><code class="bg-gray-200 px-1">&lt;Routes&gt;</code> — container that picks the first matching route</li>
          <li><code class="bg-gray-200 px-1">&lt;Route&gt;</code> — maps a URL path to a component</li>
        </ul>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">main.tsx — wrap the app once</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  &lt;BrowserRouter&gt;
    &lt;App /&gt;
  &lt;/BrowserRouter&gt;
)</code></pre>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">App.tsx — define your routes</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>import { Routes, Route } from 'react-router-dom'
import Home     from './pages/Home'
import About    from './pages/About'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    &lt;Routes&gt;
      {/* exact match — '/' */}
      &lt;Route path="/" element={&lt;Home /&gt;} /&gt;

      {/* any visit to /about renders &lt;About&gt; */}
      &lt;Route path="/about" element={&lt;About /&gt;} /&gt;

      {/* catch-all — must be last */}
      &lt;Route path="*" element={&lt;NotFound /&gt;} /&gt;
    &lt;/Routes&gt;
  )
}</code></pre>
      </div>

      <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
        <p class="font-bold mb-2">Linking between pages — never use &lt;a&gt;</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>import { Link, NavLink } from 'react-router-dom'

// Link — basic navigation (no page reload)
&lt;Link to="/about"&gt;About&lt;/Link&gt;

// NavLink — same but adds an "active" class when the URL matches
&lt;NavLink
  to="/about"
  className={({ isActive }) => isActive ? 'font-bold text-blue-600' : ''}
&gt;
  About
&lt;/NavLink&gt;</code></pre>
        <p class="text-gray-600 text-sm mt-2">
          Using a plain <code class="bg-gray-200 px-1">&lt;a href="/about"&gt;</code> causes a full
          page reload and destroys React state. Always use <strong>Link</strong>.
        </p>
      </div>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <p class="font-bold mb-2">⚠️ Order matters — most specific first</p>
        <pre class="bg-gray-800 text-yellow-300 p-3 rounded text-sm"><code>// ✅ Correct order
&lt;Route path="/users/new"  element={&lt;NewUser /&gt;} /&gt;
&lt;Route path="/users/:id"  element={&lt;UserDetail /&gt;} /&gt;
&lt;Route path="/users"      element={&lt;UserList /&gt;} /&gt;</code></pre>
      </div>
    `,
  },
  {
    id: 3,
    type: 'lesson',
    title: 'Dynamic Routes & URL Params',
    content: `
      <h2 class="text-2xl font-bold mb-4">Dynamic Routes & URL Params</h2>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p class="font-bold mb-2">What is a dynamic segment?</p>
        <p class="text-gray-700 text-sm mb-2">
          A colon prefix <code class="bg-gray-200 px-1">:param</code> marks a segment as dynamic.
          React Router captures whatever is in that position of the URL and makes it available as a parameter.
        </p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>// This route matches /users/1, /users/42, /users/ahmed …
&lt;Route path="/users/:userId" element={&lt;UserDetail /&gt;} /&gt;</code></pre>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">Reading params with useParams()</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>import { useParams } from 'react-router-dom'

/**
 * BEST PRACTICE: Type your params
 * useParams returns Record&lt;string, string | undefined&gt; by default.
 * Casting to a specific type avoids accessing undefined fields.
 */
interface UserParams {
  userId: string
}

export default function UserDetail() {
  const { userId } = useParams&lt;UserParams&gt;()

  // userId is the raw string from the URL, e.g. "42"
  const id = Number(userId)

  return &lt;p&gt;Showing user #{id}&lt;/p&gt;
}</code></pre>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">Reading query strings with useSearchParams()</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>// URL: /products?category=shoes&sort=price

import { useSearchParams } from 'react-router-dom'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Read values
  const category = searchParams.get('category') // "shoes"
  const sort     = searchParams.get('sort')     // "price"

  // Update without navigation
  const handleSort = (newSort: string) => {
    setSearchParams({ category: category ?? '', sort: newSort })
  }

  return &lt;button onClick={() => handleSort('name')}&gt;Sort by name&lt;/button&gt;
}</code></pre>
      </div>

      <div class="bg-green-50 border-l-4 border-green-500 p-4">
        <p class="font-bold mb-2">Multiple dynamic segments</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>// Route
&lt;Route path="/courses/:courseId/lessons/:lessonId" element={&lt;Lesson /&gt;} /&gt;

// Component
const { courseId, lessonId } = useParams()</code></pre>
      </div>
    `,
  },
  {
    id: 4,
    type: 'lesson',
    title: 'Nested Routes & Layouts',
    content: `
      <h2 class="text-2xl font-bold mb-4">Nested Routes & Layouts</h2>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p class="font-bold mb-2">Why nest routes?</p>
        <p class="text-gray-700 text-sm">
          Many pages share a common shell — sidebar, navbar, breadcrumbs.
          Instead of repeating that shell in every component, you create a
          <strong>layout route</strong> that renders it once and uses
          <code class="bg-gray-200 px-1">&lt;Outlet /&gt;</code> as a slot for child content.
        </p>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">Step 1 — the layout component</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>import { Outlet, NavLink } from 'react-router-dom'

/**
 * DashboardLayout renders around every /dashboard/* route.
 * &lt;Outlet /&gt; is where the matched child route appears.
 */
export default function DashboardLayout() {
  return (
    &lt;div className="flex"&gt;
      &lt;aside className="w-64 bg-gray-800 text-white p-4"&gt;
        &lt;NavLink to="overview"&gt;Overview&lt;/NavLink&gt;
        &lt;NavLink to="settings"&gt;Settings&lt;/NavLink&gt;
      &lt;/aside&gt;

      &lt;main className="flex-1 p-8"&gt;
        {/* child route renders here */}
        &lt;Outlet /&gt;
      &lt;/main&gt;
    &lt;/div&gt;
  )
}</code></pre>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">Step 2 — nest routes in App.tsx</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>&lt;Routes&gt;
  &lt;Route path="/" element={&lt;Home /&gt;} /&gt;

  {/* parent route — renders DashboardLayout */}
  &lt;Route path="/dashboard" element={&lt;DashboardLayout /&gt;}&gt;

    {/* index = renders at /dashboard exactly */}
    &lt;Route index element={&lt;Overview /&gt;} /&gt;

    {/* renders at /dashboard/settings */}
    &lt;Route path="settings" element={&lt;Settings /&gt;} /&gt;

    {/* renders at /dashboard/users/42 */}
    &lt;Route path="users/:id" element={&lt;UserDetail /&gt;} /&gt;
  &lt;/Route&gt;
&lt;/Routes&gt;</code></pre>
      </div>

      <div class="bg-green-50 border-l-4 border-green-500 p-4">
        <p class="font-bold mb-2">Index routes</p>
        <p class="text-gray-700 text-sm">
          An <code class="bg-gray-200 px-1">index</code> route renders when the parent path
          matches exactly. Think of it as the "default child":
        </p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm mt-2"><code>// /dashboard → Overview
// /dashboard/settings → Settings
&lt;Route path="/dashboard" element={&lt;DashboardLayout /&gt;}&gt;
  &lt;Route index element={&lt;Overview /&gt;} /&gt;
  &lt;Route path="settings" element={&lt;Settings /&gt;} /&gt;
&lt;/Route&gt;</code></pre>
      </div>
    `,
  },
  {
    id: 5,
    type: 'lesson',
    title: 'Programmatic Navigation & Route Guards',
    content: `
      <h2 class="text-2xl font-bold mb-4">Programmatic Navigation & Route Guards</h2>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p class="font-bold mb-2">useNavigate — navigate from code</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>import { useNavigate } from 'react-router-dom'

export default function LoginForm() {
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(credentials)

    // Go to dashboard after login
    navigate('/dashboard')

    // Go back one page
    navigate(-1)

    // Replace current history entry (no back button)
    navigate('/home', { replace: true })

    // Pass state to the next page
    navigate('/checkout', { state: { fromCart: true } })
  }
}</code></pre>
      </div>

      <div class="mb-4">
        <p class="font-bold mb-2">Route Guards — protecting private pages</p>
        <p class="text-gray-700 text-sm mb-3">
          A "guard" is a component that checks a condition and either renders its children
          or redirects. This is the React Router v6 pattern — there is no built-in guard,
          you build it yourself with <code class="bg-gray-200 px-1">&lt;Navigate /&gt;</code>.
        </p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto"><code>import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * BEST PRACTICE: A guard is just a component.
 * It reads auth state, redirects if not logged in,
 * otherwise renders child routes via &lt;Outlet /&gt;.
 */
function RequireAuth() {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    // Redirect to /login; save where user tried to go
    return &lt;Navigate to="/login" replace /&gt;
  }

  return &lt;Outlet /&gt;  // render the protected child
}

// Usage in App.tsx
&lt;Routes&gt;
  &lt;Route path="/login" element={&lt;Login /&gt;} /&gt;

  {/* Wrap private routes inside the guard */}
  &lt;Route element={&lt;RequireAuth /&gt;}&gt;
    &lt;Route path="/dashboard" element={&lt;Dashboard /&gt;} /&gt;
    &lt;Route path="/profile"   element={&lt;Profile /&gt;} /&gt;
  &lt;/Route&gt;
&lt;/Routes&gt;</code></pre>
      </div>

      <div class="bg-green-50 border-l-4 border-green-500 p-4">
        <p class="font-bold mb-2">Reading location state in the destination</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>import { useLocation } from 'react-router-dom'

function Checkout() {
  const location = useLocation()
  const { fromCart } = location.state as { fromCart: boolean }

  return fromCart ? &lt;p&gt;Coming from cart!&lt;/p&gt; : null
}</code></pre>
      </div>
    `,
  },
]
