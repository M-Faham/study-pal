import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: "api-integration",
  title: "API Integration Patterns",
  icon: "🔌",
  difficulty: "Core",
  targets: ['Angular', 'React', 'General'],
  keyPoints: [
    '2xx = success (200 OK, 201 Created, 204 No Content); 4xx = client error; 5xx = server error',
    '401 = not authenticated (redirect to login); 403 = authenticated but forbidden (wrong role)',
    '422 = validation error (show field errors locally); 429 = rate limited (backoff + retry)',
    'Axios interceptors handle 401/403/5xx globally — components handle 422 field errors locally',
    'Cancel in-flight requests on component unmount — AbortController / Axios CancelToken',
  ],
  cheatSheet: [
    {
      concept: 'HTTP Status Codes',
      explanation: `<p class="font-semibold text-gray-800 mb-1">The Five Ranges</p><p class="mb-3 text-gray-600"><strong>1xx</strong> informational, <strong>2xx</strong> success, <strong>3xx</strong> redirect, <strong>4xx</strong> client error, <strong>5xx</strong> server error.</p><p class="font-semibold text-gray-800 mb-1">Must-Know Codes</p><p class="text-gray-600"><strong>200</strong> OK, <strong>201</strong> Created (POST + Location header), <strong>204</strong> No Content (DELETE). <strong>401</strong> unauthenticated → login redirect, <strong>403</strong> forbidden → permission toast. <strong>422</strong> validation failed → form field errors, <strong>429</strong> rate limited → backoff. <strong>500/503</strong> server error → retry with backoff + Sentry log.</p>`,
      code: `// 2xx — Success
200 OK            // GET, PUT, PATCH — standard success
201 Created       // POST that creates a resource — return Location header
204 No Content    // DELETE — success, no body

// 3xx — Redirect (browser/Axios follow automatically)
301 Moved Permanently  // SEO: update indexed URL
302 Found              // Temporary redirect
304 Not Modified       // Browser uses cache — no body sent

// 4xx — Client mistakes (fix the request)
400 Bad Request        // Malformed JSON, missing required field
401 Unauthorized       // No/expired token → redirect to /login
403 Forbidden          // Valid token, wrong role/permissions
404 Not Found          // Resource doesn't exist → show empty state
409 Conflict           // Duplicate (email already exists)
422 Unprocessable      // Validation failed → show field errors
429 Too Many Requests  // Rate limit → retry after Retry-After header

// 5xx — Server failures (not your fault, handle gracefully)
500 Internal Server Error  // Generic crash → show retry button
502 Bad Gateway            // Upstream issue → often during deploys
503 Service Unavailable    // Down for maintenance
504 Gateway Timeout        // Upstream timeout → retry with backoff`,
    },
    {
      concept: 'Status-Based Error Handling Strategy',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Global Interceptor</p><p class="mb-3 text-gray-600">Handles codes that <strong>always produce the same UI response</strong>: <code>401</code> → redirect to login, <code>403</code> → permission denied toast, <code>5xx</code> → generic error toast + Sentry, <code>429</code> → rate limit toast.</p><p class="font-semibold text-gray-800 mb-1">Component-Level Handler</p><p class="text-gray-600">Handles codes where the <strong>UX depends on context</strong>: <code>422</code> → map field errors to the owning form, <code>404</code> → show inline empty state with a CTA, <code>409</code> → show the specific conflict message. Re-throw after handling so the interceptor can still observe.</p>`,
      code: `// Global interceptor — same response everywhere
interceptor: {
  401 → clear token, redirect to /login
  403 → toast "Permission denied"
  5xx → toast "Server error", log to Sentry
  429 → toast "Too many requests, try again in Xs"
}

// Component-level — context-specific UX
422 → map error.response.data.errors to form field messages
404 → show inline empty state with "Create one?" CTA
409 → show "This email is already in use" inline

// Angular HttpClient example
this.userService.create(dto).pipe(
  catchError((err: HttpErrorResponse) => {
    if (err.status === 422) {
      this.formErrors = err.error.errors  // field-level errors
      return EMPTY
    }
    return throwError(() => err)  // re-throw for global interceptor
  })
).subscribe(user => this.router.navigate(['/users', user.id]))`,
    },
    {
      concept: "Service Layer Pattern",
      explanation: `<p class="font-semibold text-gray-800 mb-1">The Pattern</p><p class="mb-3 text-gray-600">Never call HTTP directly from components. Wrap all API calls in a <strong>service class</strong> that hides the transport layer — components call the service method, the service calls HTTP.</p><p class="font-semibold text-gray-800 mb-1">Why It Matters</p><p class="text-gray-600">Decouples components from the URL structure, response shape, and transport. In tests, <strong>mock the service</strong> — no HTTP needed. If the API changes, update one service, not every component that uses it.</p>`,
      code: `@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = inject(HttpClient)
  private readonly base = '/api/products'

  getAll(params?: ProductParams) {
    return this.api.get<Product[]>(this.base, { params })
  }

  getById(id: number) {
    return this.api.get<Product>(this.base + '/' + id)
  }

  create(dto: CreateProductDto) {
    return this.api.post<Product>(this.base, dto)
  }
}`,
    },
    {
      concept: "REST vs GraphQL Trade-offs",
      explanation: `<p class="font-semibold text-gray-800 mb-1">REST</p><p class="mb-3 text-gray-600">Simple, <strong>HTTP-cache-friendly</strong>, and universally understood. Fixed response shapes — clients get all fields whether they need them or not. Right for simple CRUD and public APIs.</p><p class="font-semibold text-gray-800 mb-1">GraphQL</p><p class="text-gray-600">Client specifies <strong>exactly what fields it needs</strong> — eliminates over- and under-fetching. Powerful for complex data graphs and when multiple clients (web, mobile) have very different data requirements. More complexity upfront (schema, resolvers, tooling).</p>`,
      code: `// REST — fixed response shape
GET /users/1          → { id, name, email, role, createdAt, ... }
// Client gets everything whether it needs it or not

// GraphQL — client specifies exactly what it needs
query {
  user(id: 1) {
    name
    email
  }
}
// Response: { user: { name: "Alice", email: "alice@example.com" } }`,
    },
    {
      concept: "Optimistic Updates",
      explanation:
        "Update the UI immediately on user action without waiting for the server response. Roll back on error. Makes the app feel instant.",
      code: `// React Query optimistic update
const mutation = useMutation({
  mutationFn: (item: Item) => api.put('/items/' + item.id, item),
  onMutate: async (updatedItem) => {
    await queryClient.cancelQueries({ queryKey: ['items'] })
    const previous = queryClient.getQueryData(['items'])
    queryClient.setQueryData(['items'], (old: Item[]) =>
      old.map(i => i.id === updatedItem.id ? updatedItem : i)
    )
    return { previous }
  },
  onError: (_, __, ctx) => queryClient.setQueryData(['items'], ctx?.previous),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['items'] })
})`,
    },
    {
      concept: "Pagination Patterns",
      explanation:
        "Offset pagination is simple but slow on large datasets (database must scan). Cursor pagination is efficient and consistent — use it for infinite scroll or large datasets.",
      code: `// Offset — simple, has gaps if items are inserted/deleted
GET /items?page=3&limit=20

// Cursor — consistent, efficient for large sets
GET /items?cursor=eyJpZCI6MTAwfQ&limit=20
// Response: { items: [...], nextCursor: "eyJpZCI6MTIwfQ" }`,
    },
  ],
  spokenAnswer: {
    question:
      "How do you handle API error states in a large frontend application?",
    answer: `I handle errors at two levels: globally for things that are always the same, and locally for things that need specific UX. Globally, I put an HTTP interceptor on the Axios or Angular HttpClient instance that handles 401 — redirect to login — 403 — show a permission error — and 5xx server errors — show a generic toast notification. This covers the cases where the specific component doesn't need to do anything special. At the component level I handle errors that need specific UX: a form submission failure should highlight the fields, a product load failure should show a retry button inline rather than a toast. I always expose three states to the user: loading, error with a meaningful message and a retry option, and the happy path. I never silently swallow errors or show a blank screen. I also think about offline scenarios — if the user loses connection mid-workflow, the error should tell them what happened and what to do, not just "something went wrong."`,
  },
  traps: [
    {
      trap: "Making HTTP calls directly from components",
      correction:
        "Components that import HttpClient directly are tightly coupled to the API shape. Wrapping in a service lets you change the URL structure, add mock data for tests, or switch from REST to GraphQL in one place.",
    },
    {
      trap: "Swallowing errors silently in catch blocks",
      correction:
        "An empty catch block or one that only logs to console means the user sees a blank state or stale data with no feedback. Always either recover gracefully or propagate the error to a UI state the user can see and act on.",
    },
  ],
  quiz: [
    {
      id: 1,
      question:
        "Why should HTTP calls be made in a service rather than directly in a component?",
      options: [
        "Components cannot import HttpClient",
        "Services enable reuse, testability, and a single place to change API details",
        "HTTP calls in components cause memory leaks",
        "Services run in a separate thread",
      ],
      correct: 1,
      explanation:
        "A service wraps the HTTP call behind a stable method signature. Components call the service method — they are decoupled from the URL, transport, and response shape. Tests can mock the service without spinning up HTTP.",
    },
    {
      id: 2,
      question:
        "What is the main advantage of cursor-based pagination over offset-based pagination?",
      options: [
        "Cursor pagination is simpler to implement",
        "Cursor pagination is consistent even when items are inserted or deleted, and is efficient on large datasets",
        "Offset pagination cannot be used with SQL databases",
        "Cursor pagination returns more items per page",
      ],
      correct: 1,
      explanation:
        "Offset pagination skips N rows — if items are inserted before that offset, you see duplicates or miss items. Cursor pagination anchors to a specific item by ID or timestamp, making it consistent and efficient without large OFFSET scans.",
    },
  ],
}
