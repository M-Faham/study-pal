import type { ILesson, IQuiz } from '../../types/tutorial'

export const reactAxiosLessons: ILesson[] = [
  {
    id: 1,
    type: 'lesson',
    title: 'Axios vs fetch — Why Axios?',
    content: `
      <h2>What Is Axios?</h2>
      <p>Axios is an HTTP client for the browser and Node.js built on top of XMLHttpRequest (browser) and the <code>http</code> module (Node). It wraps the raw request API in a clean, Promise-based interface.</p>

      <h2>Axios vs fetch — Side by Side</h2>
      <table>
        <tr>
          <th>Feature</th>
          <th>fetch</th>
          <th>Axios</th>
        </tr>
        <tr>
          <td>JSON auto-parse</td>
          <td>Manual (<code>.json()</code>)</td>
          <td>✅ Automatic</td>
        </tr>
        <tr>
          <td>Error on 4xx/5xx</td>
          <td>❌ No — must check <code>res.ok</code></td>
          <td>✅ Yes — throws automatically</td>
        </tr>
        <tr>
          <td>Request cancellation</td>
          <td>AbortController only</td>
          <td>✅ Built-in <code>CancelToken</code> / AbortController</td>
        </tr>
        <tr>
          <td>Interceptors</td>
          <td>❌ None</td>
          <td>✅ Request & response interceptors</td>
        </tr>
        <tr>
          <td>Upload progress</td>
          <td>❌ None</td>
          <td>✅ <code>onUploadProgress</code></td>
        </tr>
        <tr>
          <td>Timeout</td>
          <td>Manual with AbortController</td>
          <td>✅ <code>timeout</code> option</td>
        </tr>
        <tr>
          <td>Base URL</td>
          <td>Manual string concat</td>
          <td>✅ <code>baseURL</code> config</td>
        </tr>
      </table>

      <h2>Installation</h2>
      <pre><code>npm install axios</code></pre>

      <h2>The fetch Footgun — 404 Is Not an Error</h2>
      <pre><code>// fetch — 404 does NOT throw, you must check manually
const res = await fetch('/api/user')
if (!res.ok) throw new Error('Request failed: ' + res.status)
const data = await res.json()

// Axios — 4xx and 5xx throw automatically
const { data } = await axios.get('/api/user')  // throws on 404/500</code></pre>

      <p><strong>Best practice:</strong> Use Axios when you need interceptors, automatic error throwing, or upload progress. Use <code>fetch</code> for simple one-off requests where you want zero dependencies.</p>
    `,
  },
  {
    id: 2,
    type: 'lesson',
    title: 'Basic Requests — GET, POST, PUT, DELETE',
    content: `
      <h2>GET Request</h2>
      <pre><code>import axios from 'axios'

// Simple GET
const { data } = await axios.get('/api/users')

// With query params — axios serializes them automatically
const { data } = await axios.get('/api/users', {
  params: { page: 1, limit: 20, search: 'alice' }
})
// Sends: GET /api/users?page=1&limit=20&search=alice</code></pre>

      <h2>POST Request</h2>
      <pre><code>// Axios sets Content-Type: application/json automatically
const { data } = await axios.post('/api/users', {
  name: 'Alice',
  email: 'alice@example.com'
})

// With custom headers
const { data } = await axios.post('/api/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})</code></pre>

      <h2>PUT and PATCH</h2>
      <pre><code>// Full update
await axios.put('/api/users/1', { name: 'Alice Updated', email: 'alice@example.com' })

// Partial update — only send changed fields
await axios.patch('/api/users/1', { name: 'Alice Updated' })</code></pre>

      <h2>DELETE</h2>
      <pre><code>await axios.delete('/api/users/1')

// DELETE with body (less common but valid)
await axios.delete('/api/users', { data: { ids: [1, 2, 3] } })</code></pre>

      <h2>The Response Object</h2>
      <pre><code>const response = await axios.get('/api/users')

response.data    // parsed response body
response.status  // 200, 201, etc.
response.headers // response headers
response.config  // the config you sent</code></pre>

      <p><strong>Best practice:</strong> Destructure <code>{ data }</code> immediately — you almost never need the rest of the response object.</p>
    `,
  },
  {
    id: 3,
    type: 'lesson',
    title: 'Axios Instance & Base Configuration',
    content: `
      <h2>Why Create an Instance?</h2>
      <p>Instead of importing <code>axios</code> directly everywhere and repeating the base URL and headers, create a <strong>single configured instance</strong> and export it. Every request in your app uses the same base config.</p>

      <h2>Creating an Instance</h2>
      <pre><code>// src/lib/axios.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // e.g. https://api.example.com
  timeout: 10000,                          // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

export default api</code></pre>

      <h2>Using the Instance</h2>
      <pre><code>// src/services/userService.ts
import api from '../lib/axios'

export const userService = {
  getAll: ()           => api.get('/users'),
  getById: (id: number) => api.get('/users/' + id),
  create:  (data: unknown) => api.post('/users', data),
  update:  (id: number, data: unknown) => api.put('/users/' + id, data),
  remove:  (id: number) => api.delete('/users/' + id),
}</code></pre>

      <h2>Environment Variables</h2>
      <pre><code># .env.development
VITE_API_URL=http://localhost:3000/api

# .env.production
VITE_API_URL=https://api.myapp.com</code></pre>

      <p><strong>Best practice:</strong> Never hard-code URLs. Use environment variables and a single Axios instance. Changing the API base URL means editing one file — not hunting through your entire codebase.</p>

      <h2>TypeScript — Typed Responses</h2>
      <pre><code>interface User {
  id: number
  name: string
  email: string
}

// axios.get is generic — data is typed as User[]
const { data } = await api.get&lt;User[]&gt;('/users')
//    ^ data: User[]</code></pre>
    `,
  },
  {
    id: 4,
    type: 'lesson',
    title: 'Error Handling Best Practices',
    content: `
      <h2>Axios Error Shape</h2>
      <p>Axios wraps errors in an <code>AxiosError</code> object with a predictable structure. Always check <code>error.response</code> — if it exists, the server responded (4xx/5xx). If it doesn't, the request never reached the server.</p>
      <pre><code>import axios from 'axios'

try {
  const { data } = await api.get('/users')
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with 4xx or 5xx
      console.error('Status:', error.response.status)
      console.error('Body:',   error.response.data)
    } else if (error.request) {
      // Request was sent but no response received (network down, timeout)
      console.error('No response — network error or timeout')
    } else {
      // Error setting up the request
      console.error('Request setup error:', error.message)
    }
  }
}</code></pre>

      <h2>Centralised Error Handling With Interceptors</h2>
      <p>Instead of try/catch in every component, handle errors once in your Axios instance:</p>
      <pre><code>// src/lib/axios.ts
api.interceptors.response.use(
  response => response,  // pass through success
  error => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Token expired — redirect to login
        window.location.href = '/login'
      }
      if (error.response?.status === 403) {
        toast.error('You do not have permission to do that.')
      }
      if (error.response?.status >= 500) {
        toast.error('Server error. Please try again later.')
      }
    }
    return Promise.reject(error)  // still let callers catch if they want
  }
)</code></pre>

      <h2>Custom Error Class</h2>
      <pre><code>export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// In the interceptor:
const { status, data } = error.response
throw new ApiError(status, data?.message ?? 'Unknown error', data)</code></pre>

      <p><strong>Best practice:</strong> Use <code>axios.isAxiosError()</code> — never rely on <code>instanceof</code> checks with Axios errors across module boundaries.</p>
    `,
  },
  {
    id: 5,
    type: 'lesson',
    title: 'React Integration — useEffect, Custom Hook, Loading & Error State',
    content: `
      <h2>The Naive Approach and Its Problems</h2>
      <pre><code>// ❌ Problems: no loading state, no error handling, no cleanup
function UserList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios.get('/users').then(res => setUsers(res.data))
  }, [])
}</code></pre>

      <h2>The Correct Pattern</h2>
      <pre><code>function UserList() {
  const [users, setUsers]   = useState&lt;User[]&gt;([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState&lt;string | null&gt;(null)

  useEffect(() => {
    const controller = new AbortController()

    api.get&lt;User[]&gt;('/users', { signal: controller.signal })
      .then(({ data }) => setUsers(data))
      .catch(err => {
        if (!axios.isCancel(err)) setError('Failed to load users.')
      })
      .finally(() => setLoading(false))

    return () => controller.abort()  // cancel on unmount
  }, [])

  if (loading) return &lt;Spinner /&gt;
  if (error)   return &lt;ErrorMessage message={error} /&gt;
  return &lt;ul&gt;{users.map(u => &lt;li key={u.id}&gt;{u.name}&lt;/li&gt;)}&lt;/ul&gt;
}</code></pre>

      <h2>Extract Into a Custom Hook</h2>
      <pre><code>// hooks/useAxios.ts
function useAxios&lt;T&gt;(url: string) {
  const [data, setData]       = useState&lt;T | null&gt;(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState&lt;string | null&gt;(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    api.get&lt;T&gt;(url, { signal: controller.signal })
      .then(({ data }) => setData(data))
      .catch(err => { if (!axios.isCancel(err)) setError('Request failed') })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [url])

  return { data, loading, error }
}

// Usage — clean and reusable
function UserList() {
  const { data: users, loading, error } = useAxios&lt;User[]&gt;('/users')
  if (loading) return &lt;Spinner /&gt;
  if (error)   return &lt;p&gt;{error}&lt;/p&gt;
  return &lt;ul&gt;{users?.map(u => &lt;li key={u.id}&gt;{u.name}&lt;/li&gt;)}&lt;/ul&gt;
}</code></pre>

      <p><strong>Best practice:</strong> Always return a cleanup function from <code>useEffect</code> that aborts the request. Without this, if the component unmounts before the request completes, React will warn about setting state on an unmounted component — and you'll have a memory leak.</p>
    `,
  },
  {
    id: 6,
    type: 'lesson',
    title: 'Interceptors — Auth Tokens, Retry, Logging',
    content: `
      <h2>Request Interceptor — Attach Auth Token</h2>
      <p>Add the JWT token to every request automatically — no need to pass it manually each time.</p>
      <pre><code>// src/lib/axios.ts
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
})</code></pre>

      <h2>Response Interceptor — Token Refresh</h2>
      <p>The classic pattern: if a request returns 401, silently refresh the token and retry the original request.</p>
      <pre><code>let isRefreshing = false
let failedQueue: Array&lt;{ resolve: Function; reject: Function }&gt; = []

api.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        // Queue other requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          original.headers.Authorization = 'Bearer ' + token
          return api(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post('/auth/refresh', {
          refreshToken: localStorage.getItem('refreshToken')
        })
        const newToken = data.accessToken
        localStorage.setItem('token', newToken)

        // Retry all queued requests with new token
        failedQueue.forEach(p => p.resolve(newToken))
        failedQueue = []

        original.headers.Authorization = 'Bearer ' + newToken
        return api(original)
      } catch (refreshError) {
        failedQueue.forEach(p => p.reject(refreshError))
        failedQueue = []
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)</code></pre>

      <h2>Logging Interceptor</h2>
      <pre><code>// Only log in development
if (import.meta.env.DEV) {
  api.interceptors.request.use(config => {
    console.log('[API]', config.method?.toUpperCase(), config.url)
    return config
  })
  api.interceptors.response.use(
    res => { console.log('[API] OK', res.status, res.config.url); return res },
    err => { console.error('[API] ERR', err.response?.status, err.config?.url); return Promise.reject(err) }
  )
}</code></pre>
    `,
  },
  {
    id: 7,
    type: 'lesson',
    title: 'Advanced — Cancellation, Concurrent Requests, Upload Progress',
    content: `
      <h2>Request Cancellation</h2>
      <p>Cancel in-flight requests when the user navigates away or types a new search query.</p>
      <pre><code>// Modern way — AbortController (works with fetch too)
const controller = new AbortController()

api.get('/search', {
  params: { q: searchTerm },
  signal: controller.signal
})

// Cancel it:
controller.abort()

// In a search input hook:
useEffect(() => {
  const controller = new AbortController()

  api.get('/search', { params: { q }, signal: controller.signal })
    .then(({ data }) => setResults(data))
    .catch(err => { if (!axios.isCancel(err)) setError(true) })

  return () => controller.abort()  // abort previous request on each keystroke
}, [q])</code></pre>

      <h2>Concurrent Requests — axios.all / Promise.all</h2>
      <pre><code>// Fetch user + posts + settings in parallel
const [userRes, postsRes, settingsRes] = await Promise.all([
  api.get&lt;User&gt;('/user'),
  api.get&lt;Post[]&gt;('/posts'),
  api.get&lt;Settings&gt;('/settings'),
])

const user     = userRes.data
const posts    = postsRes.data
const settings = settingsRes.data</code></pre>

      <h2>File Upload With Progress</h2>
      <pre><code>function UploadButton() {
  const [progress, setProgress] = useState(0)

  async function handleUpload(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (event.total) {
          const pct = Math.round((event.loaded / event.total) * 100)
          setProgress(pct)
        }
      }
    })
  }

  return (
    &lt;div&gt;
      &lt;input type="file" onChange={e => handleUpload(e.target.files![0])} /&gt;
      &lt;div style={{ width: progress + '%' }} className="bg-blue-500 h-2" /&gt;
    &lt;/div&gt;
  )
}</code></pre>

      <h2>Retry With Exponential Backoff</h2>
      <pre><code>import axiosRetry from 'axios-retry'  // npm install axios-retry

axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,  // 1s, 2s, 4s
  retryCondition: error =>
    axiosRetry.isNetworkError(error) ||
    error.response?.status === 429  // rate limited
})</code></pre>
    `,
  },
  {
    id: 8,
    type: 'lesson',
    title: 'Advanced — Axios + React Query (TanStack Query)',
    content: `
      <h2>Why React Query + Axios?</h2>
      <p>React Query handles all the boilerplate you'd write manually: caching, background refetching, loading/error states, retries, pagination, and optimistic updates. Axios handles the HTTP layer. Together they're the industry standard.</p>

      <pre><code>npm install @tanstack/react-query axios</code></pre>

      <h2>Setup</h2>
      <pre><code>// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,  // 5 minutes — don't refetch if data is fresh
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  &lt;QueryClientProvider client={queryClient}&gt;
    &lt;App /&gt;
  &lt;/QueryClientProvider&gt;
)</code></pre>

      <h2>useQuery — Data Fetching</h2>
      <pre><code>import { useQuery } from '@tanstack/react-query'
import api from '../lib/axios'

function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],          // cache key — unique per query
    queryFn: () => api.get&lt;User[]&gt;('/users').then(r => r.data)
  })

  if (isLoading) return &lt;Spinner /&gt;
  if (error)     return &lt;p&gt;Error loading users&lt;/p&gt;
  return &lt;ul&gt;{users?.map(u =&gt; &lt;li key={u.id}&gt;{u.name}&lt;/li&gt;)}&lt;/ul&gt;
}</code></pre>

      <h2>useMutation — POST / PUT / DELETE</h2>
      <pre><code>import { useMutation, useQueryClient } from '@tanstack/react-query'

function CreateUserForm() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (newUser: NewUser) => api.post('/users', newUser),
    onSuccess: () => {
      // Invalidate the users list so it refetches with the new user
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  return (
    &lt;button
      onClick={() => mutation.mutate({ name: 'Alice', email: 'alice@example.com' })}
      disabled={mutation.isPending}
    &gt;
      {mutation.isPending ? 'Creating…' : 'Create User'}
    &lt;/button&gt;
  )
}</code></pre>

      <h2>Optimistic Updates</h2>
      <pre><code>const mutation = useMutation({
  mutationFn: (user: User) => api.put('/users/' + user.id, user),
  onMutate: async (updatedUser) => {
    // Cancel in-flight refetches
    await queryClient.cancelQueries({ queryKey: ['users'] })
    // Snapshot current data for rollback
    const previous = queryClient.getQueryData(['users'])
    // Optimistically update the cache immediately
    queryClient.setQueryData(['users'], (old: User[]) =>
      old.map(u => u.id === updatedUser.id ? updatedUser : u)
    )
    return { previous }
  },
  onError: (err, _, context) => {
    // Rollback on error
    queryClient.setQueryData(['users'], context?.previous)
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }
})</code></pre>

      <p><strong>Best practice:</strong> React Query + Axios is the production-grade setup. The custom <code>useAxios</code> hook is good for learning — but in real projects, reach for React Query.</p>
    `,
  },
]

export const reactAxiosQuizzes: IQuiz[] = [
  {
    id: 100,
    type: 'quiz',
    title: 'Axios Best Practices Quiz',
    afterLesson: 8,
    questions: [
      {
        id: 1,
        question: 'A fetch() call returns a 404 response. What happens?',
        options: [
          'fetch() throws an error automatically',
          'The promise rejects with an AxiosError',
          'The promise resolves — you must check res.ok manually',
          'fetch() retries the request 3 times',
        ],
        correct: 2,
        explanation: 'fetch() only rejects on network errors. A 404 or 500 response resolves the promise — you must check res.ok or res.status yourself. Axios throws automatically for 4xx/5xx.',
      },
      {
        id: 2,
        question: 'What is the main benefit of creating an axios.create() instance?',
        options: [
          'It makes requests faster by reusing TCP connections',
          'It lets you set baseURL, timeout, and headers once for all requests',
          'It enables automatic JSON serialization',
          'It adds TypeScript support',
        ],
        correct: 1,
        explanation: 'axios.create() lets you configure baseURL, headers, timeout, and other defaults once. All requests using that instance inherit those settings — no repetition.',
      },
      {
        id: 3,
        question: 'Why should you return a cleanup function from useEffect that aborts an Axios request?',
        options: [
          'To improve request performance',
          'To prevent setting state on an unmounted component',
          'Because Axios requires it for POST requests',
          'To enable request caching',
        ],
        correct: 1,
        explanation: 'If the component unmounts before the request completes (e.g. user navigates away), the callback would try to call setState on an unmounted component. Aborting via AbortController prevents this warning and the memory leak.',
      },
      {
        id: 4,
        question: 'In an Axios error handler, error.response is undefined. What does this mean?',
        options: [
          'The server returned a 404',
          'The request was cancelled',
          'The request never reached the server (network error or timeout)',
          'The response body was empty',
        ],
        correct: 2,
        explanation: 'error.response exists only when the server responded. If it is undefined, the request never got a response — the network was down, the server timed out, or DNS failed.',
      },
      {
        id: 5,
        question: 'Where is the correct place to attach an Authorization header to every request?',
        options: [
          'Inside every component that makes a request',
          'In a request interceptor on the Axios instance',
          'In the .env file',
          'In the response interceptor',
        ],
        correct: 1,
        explanation: 'A request interceptor runs before every request is sent. It is the single place to attach auth tokens — no duplication across components.',
      },
      {
        id: 6,
        question: 'What is axios.isAxiosError(error) used for?',
        options: [
          'To check if the response status is 200',
          'To cancel an in-flight request',
          'To safely narrow the type of a caught error to AxiosError',
          'To check if a request has been retried',
        ],
        correct: 2,
        explanation: 'axios.isAxiosError() is a type guard that narrows the caught error to AxiosError, giving you safe access to error.response, error.request, and error.config.',
      },
      {
        id: 7,
        question: 'You use useQuery from React Query with a queryKey of ["users"]. After creating a new user with useMutation, how do you update the list?',
        options: [
          'Call window.location.reload()',
          'Manually update every component that shows users',
          'Call queryClient.invalidateQueries({ queryKey: ["users"] })',
          'React Query updates automatically without any action',
        ],
        correct: 2,
        explanation: 'invalidateQueries marks the cached data for that key as stale and triggers a background refetch. This is the idiomatic React Query way to sync the UI after a mutation.',
      },
      {
        id: 8,
        question: 'What does staleTime: 1000 * 60 * 5 mean in React Query config?',
        options: [
          'Requests timeout after 5 minutes',
          'Data is considered fresh for 5 minutes — no refetch within that window',
          'The cache is cleared after 5 minutes',
          'Queries retry every 5 minutes',
        ],
        correct: 1,
        explanation: 'staleTime controls how long fetched data is considered "fresh". During that window, React Query will serve the cached data without making a new request — even if the component remounts.',
      },
    ],
  },
]
