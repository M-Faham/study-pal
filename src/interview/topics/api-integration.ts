import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: "api-integration",
  title: "API Integration Patterns",
  icon: "🔌",
  difficulty: "Core",
  targets: ['Angular', 'React', 'General'],
  keyPoints: [
    'Always handle loading, error, and empty states',
    'Axios interceptors for global auth headers + 401 redirect',
    'Cancel in-flight requests on component unmount — AbortController',
    'React Query / TanStack Query manages cache, deduplication, background refetch',
    'Optimistic updates: update UI immediately, rollback on error',
  ],
  cheatSheet: [
    {
      concept: "Service Layer Pattern",
      explanation:
        "Never call HTTP directly from components. Wrap all API calls in a service class that hides the transport layer. Components call the service; the service calls HTTP.",
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
      explanation:
        "REST is simple, cacheable, and well-understood. GraphQL eliminates over/under-fetching and is powerful for complex data graphs. Choose REST for simple CRUD; consider GraphQL when clients have wildly different data needs.",
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
