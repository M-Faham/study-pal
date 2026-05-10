import type { ILesson, IQuiz } from '../../types/tutorial'

export const httpStatusCodesLessons: ILesson[] = [
  {
    id: 1,
    type: 'lesson',
    title: 'Why Status Codes Matter',
    content: `
      <h2>What Are HTTP Status Codes?</h2>
      <p>Every HTTP response carries a 3-digit status code that tells the client exactly what happened on the server. They are the contract between your frontend and backend — reading them correctly lets you write precise error handling instead of generic "something went wrong" messages.</p>

      <h2>The 5 Ranges</h2>
      <table>
        <tr><th>Range</th><th>Category</th><th>Who is responsible?</th></tr>
        <tr><td><strong>1xx</strong></td><td>Informational</td><td>Protocol-level — rarely handled in app code</td></tr>
        <tr><td><strong>2xx</strong></td><td>Success</td><td>Everything went fine ✅</td></tr>
        <tr><td><strong>3xx</strong></td><td>Redirection</td><td>Client must do more work (follow a new URL)</td></tr>
        <tr><td><strong>4xx</strong></td><td>Client Error</td><td><strong>You</strong> sent a bad request ❌</td></tr>
        <tr><td><strong>5xx</strong></td><td>Server Error</td><td><strong>The server</strong> failed 🔥</td></tr>
      </table>

      <h2>The Golden Rule</h2>
      <p><strong>4xx = fix your request. 5xx = the server is broken.</strong> This matters for how you handle errors in your UI and what you tell the user.</p>

      <pre><code>// fetch does NOT throw on 4xx/5xx — you must check manually
const res = await fetch('/api/user')
if (!res.ok) {
  // res.status could be 401, 404, 500…
  throw new Error('Request failed: ' + res.status)
}

// Axios DOES throw automatically for 4xx and 5xx
try {
  const { data } = await axios.get('/api/user')
} catch (err) {
  if (axios.isAxiosError(err)) {
    console.log(err.response?.status)  // 401, 404, 500…
  }
}</code></pre>
    `,
  },
  {
    id: 2,
    type: 'lesson',
    title: '2xx — Success Codes',
    content: `
      <h2>2xx Success — The Happy Path</h2>
      <p>A 2xx code means the server received, understood, and processed the request. Don't assume everything returns 200 — choosing the right 2xx code makes your API self-documenting.</p>

      <table>
        <tr><th>Code</th><th>Name</th><th>When to use it</th></tr>
        <tr><td><strong>200</strong></td><td>OK</td><td>Standard success — GET, PUT, PATCH with a response body</td></tr>
        <tr><td><strong>201</strong></td><td>Created</td><td>POST that created a new resource — pair with a <code>Location</code> header pointing to the new URL</td></tr>
        <tr><td><strong>202</strong></td><td>Accepted</td><td>Request queued for async processing — result not ready yet</td></tr>
        <tr><td><strong>204</strong></td><td>No Content</td><td>Success but no response body — DELETE, or PUT/PATCH with no return value</td></tr>
        <tr><td><strong>206</strong></td><td>Partial Content</td><td>Range request response — video streaming, resumable file downloads</td></tr>
      </table>

      <pre><code>// 200 — standard GET response
GET /api/users/1
→ 200 { id: 1, name: 'Alice' }

// 201 — POST created a resource
POST /api/users  { name: 'Bob' }
→ 201 { id: 2, name: 'Bob' }
   Location: /api/users/2

// 204 — DELETE with no body
DELETE /api/users/1
→ 204  (no body — don't try to parse response.data)

// Frontend — redirect to new resource on 201
const response = await axios.post('/api/users', newUser)
if (response.status === 201) {
  navigate('/users/' + response.data.id)
}</code></pre>

      <p><strong>Common mistake:</strong> Trying to read <code>response.data</code> on a 204 response — there is no body. Always check the status before parsing.</p>
    `,
  },
  {
    id: 3,
    type: 'lesson',
    title: '3xx — Redirection Codes',
    content: `
      <h2>3xx Redirection — Follow the Trail</h2>
      <p>Redirection codes tell the client that the resource is somewhere else. Browsers and HTTP clients like Axios follow them automatically, but understanding the differences matters for SEO and API design.</p>

      <table>
        <tr><th>Code</th><th>Name</th><th>Key point</th></tr>
        <tr><td><strong>301</strong></td><td>Moved Permanently</td><td>URL changed forever — search engines transfer SEO ranking to new URL</td></tr>
        <tr><td><strong>302</strong></td><td>Found (Temporary)</td><td>Temporary redirect — search engines keep the original URL indexed</td></tr>
        <tr><td><strong>304</strong></td><td>Not Modified</td><td>Browser cache is still valid — server sends no body, browser uses cached version</td></tr>
        <tr><td><strong>307</strong></td><td>Temporary Redirect</td><td>Like 302 but the HTTP method must not change (POST stays POST)</td></tr>
        <tr><td><strong>308</strong></td><td>Permanent Redirect</td><td>Like 301 but the HTTP method must not change</td></tr>
      </table>

      <pre><code>// 301 vs 302 — SEO impact
301 /old-url → /new-url   // Google transfers page rank to /new-url
302 /old-url → /new-url   // Google keeps /old-url indexed

// 304 — conditional GET (browser caching)
GET /api/data
  If-None-Match: "abc123"   // ETag from previous response
→ 304 Not Modified          // no body, browser uses cached copy

// 307 vs 302 — method preservation
POST /api/checkout → 302 /api/v2/checkout
  // Some clients change POST to GET (wrong)

POST /api/checkout → 307 /api/v2/checkout
  // Clients MUST use POST again (correct)</code></pre>

      <p><strong>Note:</strong> As a frontend developer you rarely need to handle 3xx manually — Axios and the browser follow them automatically. The main reason to understand them is SEO and debugging redirect chains.</p>
    `,
  },
  {
    id: 4,
    type: 'lesson',
    title: '4xx — Client Error Codes',
    content: `
      <h2>4xx Client Errors — You Sent Something Wrong</h2>
      <p>4xx means the server understood the request but refuses to fulfil it because of a problem with what the client sent. These are the codes you'll handle most in frontend error handling.</p>

      <table>
        <tr><th>Code</th><th>Name</th><th>Meaning & frontend action</th></tr>
        <tr><td><strong>400</strong></td><td>Bad Request</td><td>Malformed JSON, missing required field, invalid value → show validation errors</td></tr>
        <tr><td><strong>401</strong></td><td>Unauthorized</td><td>"I don't know who you are" — no token or expired token → redirect to /login</td></tr>
        <tr><td><strong>403</strong></td><td>Forbidden</td><td>"I know who you are but you can't do this" — wrong role → show permission error</td></tr>
        <tr><td><strong>404</strong></td><td>Not Found</td><td>Resource doesn't exist → show empty state or navigate to 404 page</td></tr>
        <tr><td><strong>405</strong></td><td>Method Not Allowed</td><td>Wrong HTTP verb (e.g. GET on a POST-only endpoint)</td></tr>
        <tr><td><strong>409</strong></td><td>Conflict</td><td>Duplicate resource (email already exists) → show inline field error</td></tr>
        <tr><td><strong>410</strong></td><td>Gone</td><td>Resource existed but was permanently deleted — don't retry</td></tr>
        <tr><td><strong>422</strong></td><td>Unprocessable Entity</td><td>Request is syntactically valid but semantically wrong — validation errors from the server → map to form fields</td></tr>
        <tr><td><strong>429</strong></td><td>Too Many Requests</td><td>Rate limit hit → read <code>Retry-After</code> header, back off and retry</td></tr>
      </table>

      <h2>401 vs 403 — The Most Common Confusion</h2>
      <pre><code>// 401 Unauthorized — "who are you?"
// Token missing, expired, or invalid
→ Clear stored token, redirect to /login

// 403 Forbidden — "I know you but no"
// Valid token, but user lacks permission (e.g. non-admin accessing /admin)
→ Show "Access denied" message, do NOT redirect to login

// Angular interceptor example
if (status === 401) inject(Router).navigate(['/login'])
if (status === 403) this.toast.error('You do not have permission.')</code></pre>

      <h2>422 — Validation Errors</h2>
      <pre><code>// Server returns 422 with field-level errors
{
  "errors": {
    "email": "Email is already in use",
    "password": "Must be at least 8 characters"
  }
}

// Map to form fields (Angular Reactive Forms)
catchError((err: HttpErrorResponse) => {
  if (err.status === 422) {
    Object.entries(err.error.errors).forEach(([field, msg]) => {
      this.form.get(field)?.setErrors({ server: msg })
    })
    return EMPTY  // don't propagate — handled locally
  }
  return throwError(() => err)
})</code></pre>
    `,
  },
  {
    id: 5,
    type: 'lesson',
    title: '5xx — Server Error Codes',
    content: `
      <h2>5xx Server Errors — Not Your Fault</h2>
      <p>5xx means the server received the request but failed to fulfil it due to an error on its side. You can't fix these from the frontend — but you must handle them gracefully.</p>

      <table>
        <tr><th>Code</th><th>Name</th><th>Meaning & frontend action</th></tr>
        <tr><td><strong>500</strong></td><td>Internal Server Error</td><td>Generic crash — show "Something went wrong" + retry button, log to Sentry</td></tr>
        <tr><td><strong>501</strong></td><td>Not Implemented</td><td>Server doesn't support the method</td></tr>
        <tr><td><strong>502</strong></td><td>Bad Gateway</td><td>Upstream server returned invalid response — often happens during deploys</td></tr>
        <tr><td><strong>503</strong></td><td>Service Unavailable</td><td>Server is down or overloaded — show maintenance page if persistent</td></tr>
        <tr><td><strong>504</strong></td><td>Gateway Timeout</td><td>Upstream didn't respond in time — retry with exponential backoff</td></tr>
      </table>

      <pre><code>// Global interceptor — handle all 5xx the same way
axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status >= 500) {
      toast.error('Server error. Please try again.')
      Sentry.captureException(err)   // log for the backend team
    }
    return Promise.reject(err)
  }
)

// Retry on 5xx with exponential backoff
import axiosRetry from 'axios-retry'
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,   // 1s, 2s, 4s
  retryCondition: err => err.response?.status >= 500
})

// Angular — retry in the pipe
this.http.get('/api/data').pipe(
  retry({ count: 3, delay: (_, i) => timer(i * 1000) }),
  catchError(() => of(null))
)</code></pre>

      <p><strong>Rule of thumb:</strong> Never retry 4xx errors — they won't fix themselves. Retry 5xx and network errors with backoff — the server may have recovered.</p>
    `,
  },
  {
    id: 6,
    type: 'lesson',
    title: 'Error Handling Strategy — Putting It All Together',
    content: `
      <h2>The Two-Level Error Handling Pattern</h2>
      <p>Split error handling between a <strong>global interceptor</strong> (codes that always have the same response) and <strong>local component handlers</strong> (codes where the UX depends on context).</p>

      <table>
        <tr><th>Status</th><th>Where to handle</th><th>Why</th></tr>
        <tr><td>401</td><td>Global interceptor</td><td>Always means "go to login" — no component knows better</td></tr>
        <tr><td>403</td><td>Global interceptor</td><td>Always means "permission denied" toast</td></tr>
        <tr><td>429</td><td>Global interceptor</td><td>Always means "rate limited" — backoff logic is shared</td></tr>
        <tr><td>5xx</td><td>Global interceptor</td><td>Always means "server error" toast + Sentry log</td></tr>
        <tr><td>422</td><td>Component</td><td>Needs to map errors to specific form fields</td></tr>
        <tr><td>404</td><td>Component</td><td>Different pages show different empty states</td></tr>
        <tr><td>409</td><td>Component</td><td>Need to show specific inline conflict message</td></tr>
      </table>

      <pre><code>// ── Global interceptor ────────────────────────────────
// Angular functional interceptor
export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      switch (true) {
        case err.status === 401:
          inject(Router).navigate(['/login'])
          break
        case err.status === 403:
          inject(ToastService).error('Permission denied.')
          break
        case err.status === 429:
          inject(ToastService).warn('Too many requests — slow down.')
          break
        case err.status >= 500:
          inject(ToastService).error('Server error. Try again.')
          inject(MonitoringService).capture(err)
          break
      }
      return throwError(() => err)
    })
  )

// ── Component — handle 422 locally ────────────────────
this.authService.register(dto).pipe(
  catchError((err: HttpErrorResponse) => {
    if (err.status === 422) {
      // map server errors → form field errors
      for (const [field, msg] of Object.entries(err.error.errors)) {
        this.form.get(field)?.setErrors({ server: msg })
      }
      return EMPTY   // swallow — handled by form UI
    }
    return throwError(() => err)  // re-throw for global interceptor
  })
).subscribe(() => this.router.navigate(['/dashboard']))</code></pre>

      <h2>Quick Reference</h2>
      <table>
        <tr><th>Range</th><th>Retry?</th><th>User message</th></tr>
        <tr><td>2xx</td><td>—</td><td>Show the data</td></tr>
        <tr><td>400</td><td>No</td><td>Fix the form and resubmit</td></tr>
        <tr><td>401</td><td>No</td><td>Redirect to login</td></tr>
        <tr><td>403</td><td>No</td><td>"You don't have permission"</td></tr>
        <tr><td>404</td><td>No</td><td>Show empty state</td></tr>
        <tr><td>422</td><td>No</td><td>Show field-level errors</td></tr>
        <tr><td>429</td><td>Yes (after delay)</td><td>"Too many requests, please wait"</td></tr>
        <tr><td>5xx</td><td>Yes (with backoff)</td><td>"Something went wrong, try again"</td></tr>
      </table>
    `,
  },
]

export const httpStatusCodesQuizzes: IQuiz[] = [
  {
    id: 100,
    type: 'quiz',
    title: 'HTTP Status Codes Quiz',
    afterLesson: 6,
    questions: [
      {
        id: 1,
        question: 'A user submits a form to create an account. The server successfully creates it. Which status code should the API return?',
        options: ['200 OK', '201 Created', '204 No Content', '202 Accepted'],
        correct: 1,
        explanation: '201 Created is the correct code when a POST request results in a new resource. It should be paired with a Location header pointing to the new resource URL.',
      },
      {
        id: 2,
        question: 'A user with a valid session tries to access the /admin page. They are not an admin. What status code should the server return?',
        options: ['401 Unauthorized', '403 Forbidden', '404 Not Found', '400 Bad Request'],
        correct: 1,
        explanation: '403 Forbidden means "I know who you are but you cannot do this." 401 means "I don\'t know who you are" — it\'s for missing or invalid authentication, not insufficient permissions.',
      },
      {
        id: 3,
        question: 'Your app calls DELETE /api/posts/5. The server deletes the post successfully. What status code is most appropriate?',
        options: ['200 OK', '201 Created', '204 No Content', '404 Not Found'],
        correct: 2,
        explanation: '204 No Content is the standard for successful DELETE — the operation succeeded and there is no response body to return.',
      },
      {
        id: 4,
        question: 'An API returns 422 with a body containing field-level validation errors. Where should you handle this in a frontend app?',
        options: [
          'In the global HTTP interceptor',
          'In the component that owns the form, mapping errors to fields',
          'By redirecting to an error page',
          'By retrying the request automatically',
        ],
        correct: 1,
        explanation: '422 errors carry field-specific messages that need to be shown next to the relevant form input. The component that owns the form is the right place. The global interceptor should pass 422 through (not swallow it) so components can react.',
      },
      {
        id: 5,
        question: 'You receive a 503 Service Unavailable error. What is the correct frontend strategy?',
        options: [
          'Show "fix your form and try again"',
          'Clear the user\'s token and redirect to login',
          'Show a generic error message and retry with exponential backoff',
          'Never retry 5xx errors',
        ],
        correct: 2,
        explanation: '503 is a server-side failure — the server is down or overloaded. The correct approach is a user-friendly error message and an automatic retry strategy with backoff (e.g. 1s, 2s, 4s). Never retry 4xx — those won\'t fix themselves.',
      },
      {
        id: 6,
        question: 'What is the difference between 301 and 302 redirects from an SEO perspective?',
        options: [
          'There is no difference — both transfer page rank',
          '301 is permanent — search engines transfer ranking to the new URL. 302 is temporary — search engines keep the original URL',
          '302 is permanent; 301 is temporary',
          'Only 301 is followed automatically by browsers',
        ],
        correct: 1,
        explanation: '301 signals a permanent move — search engines update their index to the new URL and transfer ranking signals. 302 is temporary — search engines keep the original URL indexed and do not transfer ranking.',
      },
    ],
  },
]
