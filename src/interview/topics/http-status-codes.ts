import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: 'http-status-codes',
  title: 'HTTP Status Codes',
  icon: '📡',
  difficulty: 'Core',
  targets: ['General', 'Angular', 'React'],
  keyPoints: [
    '2xx = success: 200 OK, 201 Created, 204 No Content (no body)',
    '401 = not authenticated (redirect to login); 403 = authenticated but forbidden (wrong role)',
    '422 = validation errors → map to form fields locally; never retry',
    '429 = rate limited → read Retry-After header and back off',
    '5xx = server failure → retry with backoff, show generic error, log to monitoring',
  ],
  cheatSheet: [
    {
      concept: '2xx — Success',
      explanation: '200 OK: standard success for GET/PUT/PATCH. 201 Created: POST that made a new resource — pair with Location header. 204 No Content: success with no body — DELETE or silent updates. 202 Accepted: async job queued, result not ready yet.',
      code: `200 OK            // GET /users/1        → { id, name }
201 Created       // POST /users         → { id, name } + Location: /users/2
204 No Content    // DELETE /users/1     → (no body)
202 Accepted      // POST /jobs/export   → { jobId: 'abc' } (poll for result)`,
    },
    {
      concept: '3xx — Redirection',
      explanation: 'Clients follow these automatically. 301 = permanent move (SEO ranking transfers to new URL). 302 = temporary (SEO keeps original URL). 304 = not modified, use cache. 307/308 preserve HTTP method on redirect.',
      code: `301 Moved Permanently   // SEO: transfers page rank to new URL
302 Found               // SEO: keeps original URL indexed
304 Not Modified        // Browser uses cached response — no body sent
307 Temporary Redirect  // Temp redirect, method preserved (POST stays POST)
308 Permanent Redirect  // Perm redirect, method preserved`,
    },
    {
      concept: '4xx — Client Errors',
      explanation: 'The client sent a bad request. Never retry 4xx automatically — the same request will fail again. Show the user what went wrong and how to fix it.',
      code: `400 Bad Request        // Malformed JSON, missing field → show validation error
401 Unauthorized       // No/expired token → redirect to /login
403 Forbidden          // Valid token, wrong role → "Permission denied" toast
404 Not Found          // Resource missing → show empty state
409 Conflict           // Duplicate (email exists) → inline field error
422 Unprocessable      // Validation failed → map errors to form fields
429 Too Many Requests  // Rate limited → retry after Retry-After header`,
    },
    {
      concept: '5xx — Server Errors',
      explanation: 'The server failed — not the client\'s fault. Show a friendly error and retry with exponential backoff. Log to monitoring so the backend team knows.',
      code: `500 Internal Server Error  // Generic crash → toast + Sentry log
502 Bad Gateway            // Upstream issue → often during deploys
503 Service Unavailable    // Down/overloaded → maintenance page if persistent
504 Gateway Timeout        // Upstream timeout → retry with backoff

// Retry strategy
retry({ count: 3, delay: (_, i) => timer(i * 1000) })  // 1s, 2s, 4s`,
    },
    {
      concept: '401 vs 403 — The Classic Trap',
      explanation: '401 Unauthorized = "I don\'t know who you are" — authentication is missing or invalid. Action: clear token, redirect to login. 403 Forbidden = "I know who you are but you can\'t do this" — authorization failed. Action: show permission error, do NOT redirect to login.',
      code: `// 401 — unauthenticated
GET /api/profile  (no token or expired token)
→ 401 { message: 'Token expired' }
// Frontend: clear token, navigate('/login')

// 403 — authenticated but wrong role
GET /api/admin/users  (valid token, user is not admin)
→ 403 { message: 'Insufficient permissions' }
// Frontend: toast('You do not have permission') — stay on page`,
    },
    {
      concept: 'Error Handling Strategy',
      explanation: 'Split between global interceptor (codes that always mean the same thing) and local component handlers (codes where the UI response depends on context).',
      code: `// Global interceptor handles:
401 → redirect to /login
403 → permission denied toast
429 → rate limit toast
5xx → generic error toast + Sentry

// Component handles:
422 → map field errors to form controls
404 → show inline empty state
409 → show specific conflict message (e.g. "Email already exists")

// Re-throw after local handling so interceptor also sees it if needed
catchError(err => {
  if (err.status === 422) {
    this.mapErrors(err.error.errors)
    return EMPTY   // handled — stop propagation
  }
  return throwError(() => err)  // let interceptor handle the rest
})`,
    },
  ],
  spokenAnswer: {
    question: 'Walk me through the HTTP status code ranges and how you handle errors from each in a frontend application.',
    answer: 'I think of them in three practical groups. 2xx is the happy path — 200 for reads, 201 when something was created with a Location header, 204 for deletes with no body. 4xx means the client did something wrong — I split handling between a global interceptor and the component. The interceptor handles codes that always mean the same thing: 401 clears the token and redirects to login, 403 shows a permission denied toast, 429 shows a rate limit message. But 422 validation errors I handle locally in the component that owns the form, mapping the server errors to specific form fields. 5xx means the server failed and I can\'t do much about it — I show a generic "something went wrong" message, log to Sentry so the backend team sees it, and retry with exponential backoff for 503 and 504. The trap I always flag in reviews is confusing 401 and 403: 401 means "I don\'t know who you are" — missing or expired token. 403 means "I know who you are but you can\'t do this" — wrong role. Redirecting to login on a 403 is a UX bug.',
    followUp: 'What is the difference between 422 Unprocessable Entity and 400 Bad Request?',
  },
  traps: [
    {
      trap: 'Redirecting to /login on a 403 Forbidden response',
      correction: '403 means the user is authenticated but lacks permission. Redirecting to login is confusing — they just logged in. Show an "Access denied" message instead. Only 401 should trigger a login redirect.',
    },
    {
      trap: 'Retrying 4xx errors automatically',
      correction: '4xx errors are caused by the client\'s request — retrying the same request will always fail. Only retry 5xx and network errors where the server may have recovered. Retrying a 429 without waiting for the Retry-After header will make rate limiting worse.',
    },
    {
      trap: 'Using 200 OK for all successful responses regardless of what happened',
      correction: 'A POST that creates a resource should return 201 Created, not 200. A DELETE should return 204 No Content. Correct codes let the client know what action was performed without parsing the body.',
    },
  ],
  quiz: [
    {
      id: 1,
      question: 'A user with a valid JWT token tries to access /api/admin. They are not an admin. What status code should the server return?',
      options: ['401 Unauthorized', '400 Bad Request', '403 Forbidden', '404 Not Found'],
      correct: 2,
      explanation: '403 Forbidden: the user is authenticated (valid token) but does not have the required role. 401 is for missing or invalid authentication — sending it here would incorrectly trigger a login redirect.',
    },
    {
      id: 2,
      question: 'Your POST /api/users request succeeds and creates a new user. Which is the most correct status code to return?',
      options: ['200 OK', '201 Created', '204 No Content', '202 Accepted'],
      correct: 1,
      explanation: '201 Created is the semantically correct code for a POST that results in a new resource. Pair it with a Location header pointing to the new resource URL.',
    },
    {
      id: 3,
      question: 'You receive a 429 Too Many Requests response. What should your frontend do?',
      options: [
        'Stop all requests permanently',
        'Redirect to the login page',
        'Read the Retry-After header and retry the request after that delay',
        'Show a 404 page',
      ],
      correct: 2,
      explanation: '429 means you\'ve hit the rate limit. The server typically includes a Retry-After header indicating how many seconds to wait. Retrying immediately will just get another 429.',
    },
    {
      id: 4,
      question: 'Which status codes should be retried automatically, and which should not?',
      options: [
        'All errors should be retried 3 times',
        '4xx should be retried; 5xx should not',
        '5xx and network errors should be retried with backoff; 4xx should never be retried',
        'Only 500 should be retried',
      ],
      correct: 2,
      explanation: '4xx errors are caused by the request itself — retrying the same bad request will fail again. 5xx errors are server failures that may resolve — retry with exponential backoff. Network errors (no response) should also be retried.',
    },
  ],
}
