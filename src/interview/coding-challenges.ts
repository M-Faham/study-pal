export type ChallengeDifficulty = 'Easy' | 'Medium' | 'Hard'
export type ChallengeCategory = 'Angular' | 'JavaScript'

export interface ICodingChallenge {
  id: string
  title: string
  category: ChallengeCategory
  difficulty: ChallengeDifficulty
  prompt: string          // what the interviewer says
  approach: string        // HTML — how to think through it out loud
  solution: string        // final clean code
}

export const codingChallenges: ICodingChallenge[] = [

  // ─── Angular ────────────────────────────────────────────────────────────────

  {
    id: 'debounced-search',
    title: 'Debounced Search with API',
    category: 'Angular',
    difficulty: 'Medium',
    prompt: `Build a search input that calls an API as the user types, but only fires after the user has stopped typing for 300ms. Cancel any in-flight request if a new search starts before it completes.`,
    approach: `<p class="font-semibold text-gray-800 mb-1">Step 1 — Identify the stream</p>
<p class="mb-3 text-gray-600">The raw input event is a stream of keystrokes. We never want to call the API on every single keystroke — we want to wait for a pause. That's <code>debounceTime</code>.</p>
<p class="font-semibold text-gray-800 mb-1">Step 2 — Skip redundant calls</p>
<p class="mb-3 text-gray-600">If the user types "ang", backspaces to "an", then re-types "ang", the value is the same. Use <code>distinctUntilChanged</code> to skip the API call if the value hasn't actually changed.</p>
<p class="font-semibold text-gray-800 mb-1">Step 3 — Cancel in-flight requests</p>
<p class="mb-3 text-gray-600"><code>switchMap</code> is the key operator here. When a new search term arrives, it automatically cancels the previous inner Observable (the HTTP request) and starts a new one. Never use <code>mergeMap</code> for search — responses can arrive out of order.</p>
<p class="font-semibold text-gray-800 mb-1">Step 4 — Cleanup</p>
<p class="text-gray-600">Wire everything in <code>ngOnInit</code> and use <code>takeUntilDestroyed()</code> or the <code>async</code> pipe to auto-unsubscribe on component destroy.</p>`,
    solution: `// search.component.ts
@Component({
  template: \`
    <input [formControl]="searchCtrl" placeholder="Search..." />
    <ul>
      <li *ngFor="let r of results">{{ r.name }}</li>
    </ul>
  \`
})
export class SearchComponent implements OnInit {
  searchCtrl = new FormControl('')
  results: any[] = []

  private http = inject(HttpClient)
  private destroyRef = inject(DestroyRef)

  ngOnInit() {
    this.searchCtrl.valueChanges.pipe(
      debounceTime(300),           // wait for 300ms pause
      distinctUntilChanged(),      // skip if value didn't change
      switchMap(query =>           // cancel previous, start new
        query
          ? this.http.get<any[]>(\`/api/search?q=\${query}\`).pipe(
              catchError(() => of([]))  // swallow errors gracefully
            )
          : of([])                 // empty query → clear results
      ),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(results => this.results = results)
  }
}`,
  },

  {
    id: 'auth-interceptor',
    title: 'HTTP Auth Interceptor + Token Refresh',
    category: 'Angular',
    difficulty: 'Hard',
    prompt: `Write an Angular HTTP interceptor that attaches a JWT to every request. If a request returns 401, refresh the token silently and retry the original request. All other requests that arrive during the refresh should wait for it to complete, not each trigger their own refresh.`,
    approach: `<p class="font-semibold text-gray-800 mb-1">Step 1 — Attach the token</p>
<p class="mb-3 text-gray-600">Clone the request (requests are immutable) and add the <code>Authorization: Bearer</code> header. Return <code>next.handle(cloned)</code>.</p>
<p class="font-semibold text-gray-800 mb-1">Step 2 — Catch 401s</p>
<p class="mb-3 text-gray-600">Use <code>catchError</code> on the inner observable. If the status is 401 and we haven't already tried refreshing (prevent infinite loops), trigger the refresh flow.</p>
<p class="font-semibold text-gray-800 mb-1">Step 3 — Prevent multiple refresh calls</p>
<p class="mb-3 text-gray-600">Use a <code>BehaviorSubject</code> as a lock. When refreshing is in progress, other 401s should <code>filter</code> out the null state and wait until the new token arrives, then retry. This is the "refresh queue" pattern — <code>switchMap</code> on the token subject.</p>
<p class="font-semibold text-gray-800 mb-1">Step 4 — Retry the original request</p>
<p class="text-gray-600">After the refresh resolves, re-clone the original request with the new token and pass it through <code>next.handle()</code> again.</p>`,
    solution: `// auth.interceptor.ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService)
  private isRefreshing = false
  private refreshToken$ = new BehaviorSubject<string | null>(null)

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken()
    const authed = token ? this.addToken(req, token) : req

    return next.handle(authed).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status !== 401) return throwError(() => err)
        return this.handle401(req, next)
      })
    )
  }

  private addToken(req: HttpRequest<any>, token: string) {
    return req.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } })
  }

  private handle401(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true
      this.refreshToken$.next(null)   // signal: refresh in progress

      return this.authService.refresh().pipe(
        switchMap(token => {
          this.isRefreshing = false
          this.refreshToken$.next(token)  // broadcast new token
          return next.handle(this.addToken(req, token))
        }),
        catchError(err => {
          this.isRefreshing = false
          this.authService.logout()
          return throwError(() => err)
        })
      )
    }

    // Refresh already in progress — wait for it
    return this.refreshToken$.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next.handle(this.addToken(req, token!)))
    )
  }
}`,
  },

  {
    id: 'reactive-form-validation',
    title: 'Reactive Form with Custom Async Validator',
    category: 'Angular',
    difficulty: 'Medium',
    prompt: `Build a registration form with email and password fields. The email field should check availability against an API endpoint asynchronously. The form should show field-level errors and disable the submit button while pending or invalid.`,
    approach: `<p class="font-semibold text-gray-800 mb-1">Step 1 — Build the form group</p>
<p class="mb-3 text-gray-600">Use <code>FormBuilder</code> with sync validators first: <code>Validators.required</code> and <code>Validators.email</code> on email, <code>Validators.minLength(8)</code> on password.</p>
<p class="font-semibold text-gray-800 mb-1">Step 2 — Write the async validator</p>
<p class="mb-3 text-gray-600">An async validator is a function that returns <code>Observable&lt;ValidationErrors | null&gt;</code>. Debounce inside the validator with <code>debounceTime</code> to avoid calling the API on every keystroke. Return <code>null</code> for valid, an error object for invalid.</p>
<p class="font-semibold text-gray-800 mb-1">Step 3 — Show pending state</p>
<p class="mb-3 text-gray-600">While the async validator is running, the control's status is <code>'PENDING'</code>. Use this to show a spinner next to the email field.</p>
<p class="font-semibold text-gray-800 mb-1">Step 4 — Disable submit</p>
<p class="text-gray-600">Bind <code>[disabled]="form.invalid || form.pending"</code> to the submit button. Never rely on only one condition.</p>`,
    solution: `// registration.component.ts
@Component({
  template: \`
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div>
        <input formControlName="email" placeholder="Email" />
        <span *ngIf="email.pending">Checking…</span>
        <span *ngIf="email.errors?.['emailTaken']">Email already in use</span>
        <span *ngIf="email.errors?.['email'] && email.touched">Invalid email</span>
      </div>
      <div>
        <input type="password" formControlName="password" />
        <span *ngIf="password.errors?.['minlength'] && password.touched">
          Min 8 characters
        </span>
      </div>
      <button type="submit" [disabled]="form.invalid || form.pending">Register</button>
    </form>
  \`
})
export class RegistrationComponent {
  private fb = inject(FormBuilder)
  private http = inject(HttpClient)

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email],
                   [this.emailAvailable.bind(this)]],  // async validator
    password: ['', [Validators.required, Validators.minLength(8)]],
  })

  get email()    { return this.form.controls.email }
  get password() { return this.form.controls.password }

  // Async validator — checks email availability
  emailAvailable(ctrl: AbstractControl): Observable<ValidationErrors | null> {
    return timer(300).pipe(   // debounce — wait 300ms before calling API
      switchMap(() =>
        this.http.get<{ available: boolean }>(\`/api/email-check?email=\${ctrl.value}\`)
      ),
      map(res => res.available ? null : { emailTaken: true }),
      catchError(() => of(null))  // on error, don't block the user
    )
  }

  submit() {
    if (this.form.valid) console.log(this.form.value)
  }
}`,
  },

  {
    id: 'optimistic-update',
    title: 'Optimistic UI Update with Rollback',
    category: 'Angular',
    difficulty: 'Hard',
    prompt: `You have a todo list. When the user toggles a todo as complete, update the UI immediately without waiting for the server. If the server call fails, roll back to the previous state and show an error toast.`,
    approach: `<p class="font-semibold text-gray-800 mb-1">Step 1 — Store previous state</p>
<p class="mb-3 text-gray-600">Before making the API call, snapshot the current list. This is your rollback target.</p>
<p class="font-semibold text-gray-800 mb-1">Step 2 — Update UI immediately</p>
<p class="mb-3 text-gray-600">Apply the change to your local state (signal, BehaviorSubject, or NgRx store) before the HTTP call fires. The user sees instant feedback.</p>
<p class="font-semibold text-gray-800 mb-1">Step 3 — Handle failure</p>
<p class="mb-3 text-gray-600">In the <code>catchError</code> block, restore the previous state and show a toast. The user sees the item flick back — that's intentional and communicates the failure clearly.</p>
<p class="font-semibold text-gray-800 mb-1">Step 4 — Handle success</p>
<p class="text-gray-600">On success you can either trust the optimistic update (do nothing) or reconcile with the server response to pick up any server-generated fields.</p>`,
    solution: `// todos.component.ts
@Component({
  template: \`
    <li *ngFor="let todo of todos()">
      <input type="checkbox" [checked]="todo.done"
             (change)="toggle(todo)" />
      {{ todo.title }}
    </li>
  \`
})
export class TodosComponent {
  todos = signal<Todo[]>([])

  private http    = inject(HttpClient)
  private toastSvc = inject(ToastService)

  toggle(todo: Todo) {
    const prev = this.todos()            // ① snapshot previous state

    // ② optimistic update — UI changes instantly
    this.todos.update(list =>
      list.map(t => t.id === todo.id ? { ...t, done: !t.done } : t)
    )

    // ③ fire API call
    this.http.patch(\`/api/todos/\${todo.id}\`, { done: !todo.done }).pipe(
      catchError(err => {
        this.todos.set(prev)             // ④ rollback on failure
        this.toastSvc.error('Failed to update. Please try again.')
        return EMPTY
      })
    ).subscribe()
  }
}`,
  },

  {
    id: 'permission-directive',
    title: 'Permission-Based Structural Directive',
    category: 'Angular',
    difficulty: 'Medium',
    prompt: `Write an Angular structural directive called *appHasPermission that accepts a permission string. It should show the host element only if the current user has that permission, and remove it from the DOM otherwise.`,
    approach: `<p class="font-semibold text-gray-800 mb-1">Step 1 — Structural vs attribute directive</p>
<p class="mb-3 text-gray-600">This needs to add/remove the element from the DOM — that's a structural directive. It needs <code>TemplateRef</code> and <code>ViewContainerRef</code> injected, not <code>ElementRef</code>.</p>
<p class="font-semibold text-gray-800 mb-1">Step 2 — Inject the permission service</p>
<p class="mb-3 text-gray-600">Inject your <code>AuthService</code> to check if the current user has the required permission. React to auth state changes so the DOM updates if the user's role changes mid-session.</p>
<p class="font-semibold text-gray-800 mb-1">Step 3 — Use createEmbeddedView / clear</p>
<p class="mb-3 text-gray-600"><code>vcr.createEmbeddedView(templateRef)</code> renders the element. <code>vcr.clear()</code> removes it. These are the structural directive primitives — what <code>*ngIf</code> uses internally.</p>`,
    solution: `// has-permission.directive.ts
@Directive({ selector: '[appHasPermission]', standalone: true })
export class HasPermissionDirective implements OnInit {
  @Input('appHasPermission') permission!: string

  private tpl  = inject(TemplateRef<any>)
  private vcr  = inject(ViewContainerRef)
  private auth = inject(AuthService)

  ngOnInit() {
    this.auth.currentUser$.pipe(
      takeUntilDestroyed()
    ).subscribe(user => {
      this.vcr.clear()
      if (user?.permissions.includes(this.permission)) {
        this.vcr.createEmbeddedView(this.tpl)
      }
    })
  }
}

// Usage in template
// <button *appHasPermission="'admin:delete'">Delete</button>`,
  },

  {
    id: 'infinite-scroll',
    title: 'Infinite Scroll with RxJS',
    category: 'Angular',
    difficulty: 'Medium',
    prompt: `Implement an infinite scroll list. Load the first page on init. When the user scrolls near the bottom of the list, load the next page and append results. Show a loading indicator while fetching.`,
    approach: `<p class="font-semibold text-gray-800 mb-1">Step 1 — Track the scroll event</p>
<p class="mb-3 text-gray-600">Use <code>fromEvent(window, 'scroll')</code> and check if <code>window.innerHeight + scrollY >= document.body.offsetHeight - threshold</code>. Throttle with <code>throttleTime</code> to avoid firing on every pixel.</p>
<p class="font-semibold text-gray-800 mb-1">Step 2 — Page cursor</p>
<p class="mb-3 text-gray-600">Keep a <code>page</code> signal or variable. Each scroll trigger increments it. Use <code>exhaustMap</code> — if a request is already in flight, ignore new scroll events until it completes. This prevents duplicate page loads.</p>
<p class="font-semibold text-gray-800 mb-1">Step 3 — Append, don't replace</p>
<p class="mb-3 text-gray-600">On each response, <em>append</em> to the existing list — don't overwrite it. Manage a <code>hasMore</code> flag to stop triggering when the API says there are no more pages.</p>`,
    solution: `// infinite-list.component.ts
@Component({
  template: \`
    <ul>
      <li *ngFor="let item of items()">{{ item.name }}</li>
    </ul>
    <div *ngIf="loading()">Loading…</div>
    <div *ngIf="!hasMore()">No more results</div>
  \`
})
export class InfiniteListComponent implements OnInit, OnDestroy {
  items   = signal<Item[]>([])
  loading = signal(false)
  hasMore = signal(true)

  private page = 0
  private http = inject(HttpClient)
  private scroll$ = fromEvent(window, 'scroll').pipe(
    throttleTime(200),
    filter(() =>
      this.hasMore() && !this.loading() &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200
    )
  )

  private sub!: Subscription

  ngOnInit() {
    this.loadPage()   // initial load

    this.sub = this.scroll$.pipe(
      exhaustMap(() => this.fetchPage())  // ignore scroll while loading
    ).subscribe(items => this.appendItems(items))
  }

  private loadPage() {
    this.fetchPage().subscribe(items => this.appendItems(items))
  }

  private fetchPage(): Observable<Item[]> {
    this.loading.set(true)
    return this.http.get<{ items: Item[]; hasMore: boolean }>(
      \`/api/items?page=\${this.page}\`
    ).pipe(
      tap(res => {
        this.page++
        this.hasMore.set(res.hasMore)
        this.loading.set(false)
      }),
      map(res => res.items),
      catchError(() => { this.loading.set(false); return of([]) })
    )
  }

  private appendItems(items: Item[]) {
    this.items.update(prev => [...prev, ...items])
  }

  ngOnDestroy() { this.sub.unsubscribe() }
}`,
  },

  // ─── JavaScript ─────────────────────────────────────────────────────────────

  {
    id: 'debounce-from-scratch',
    title: 'Implement debounce() from Scratch',
    category: 'JavaScript',
    difficulty: 'Medium',
    prompt: `Implement a debounce function. It should accept a function and a delay in milliseconds, and return a new function that only calls the original after the delay has passed since the last invocation. Each new call resets the timer.`,
    approach: `<p class="font-semibold text-gray-800 mb-1">Step 1 — The closure</p>
<p class="mb-3 text-gray-600">debounce returns a new function — so we need a closure to keep a <code>timer</code> reference alive between calls. The returned function is what the caller actually invokes.</p>
<p class="font-semibold text-gray-800 mb-1">Step 2 — Reset on every call</p>
<p class="mb-3 text-gray-600">Every time the returned function is called, clear the existing timer with <code>clearTimeout</code>, then set a new one. If it keeps being called, the timeout never fires.</p>
<p class="font-semibold text-gray-800 mb-1">Step 3 — Preserve this and arguments</p>
<p class="mb-3 text-gray-600">Use a regular function (not arrow) for the returned wrapper so callers can bind <code>this</code>. Pass <code>arguments</code> through to the original function. Or use rest params for a cleaner modern version.</p>`,
    solution: `// Basic debounce
function debounce(fn, delay) {
  let timer = null

  return function(...args) {
    clearTimeout(timer)                      // reset every call
    timer = setTimeout(() => {
      fn.apply(this, args)                   // call original with correct this
    }, delay)
  }
}

// Usage
const search = debounce((query) => {
  console.log('Searching for:', query)
}, 300)

input.addEventListener('input', e => search(e.target.value))

// With leading edge option (fires immediately on first call, then debounces)
function debounce(fn, delay, { leading = false } = {}) {
  let timer = null
  let leadingCalled = false

  return function(...args) {
    if (leading && !leadingCalled) {
      fn.apply(this, args)
      leadingCalled = true
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (!leading) fn.apply(this, args)
      leadingCalled = false
    }, delay)
  }
}`,
  },

  {
    id: 'memoize',
    title: 'Implement memoize() from Scratch',
    category: 'JavaScript',
    difficulty: 'Medium',
    prompt: `Implement a memoize function that caches the results of a function call. The same arguments should return the cached result without re-running the function. Assume arguments are primitives for the basic version, then extend it for object arguments.`,
    approach: `<p class="font-semibold text-gray-800 mb-1">Step 1 — The cache</p>
<p class="mb-3 text-gray-600">Use a <code>Map</code> (not a plain object) as the cache — Map handles any key type including numbers and symbols without coercion issues. Store it in a closure so it persists across calls.</p>
<p class="font-semibold text-gray-800 mb-1">Step 2 — The cache key</p>
<p class="mb-3 text-gray-600">For primitive arguments, join them with a separator: <code>JSON.stringify(args)</code> is the safest default — it handles multiple args and avoids the "1,2" vs "12" collision. For object arguments you'd need a WeakMap or a deep-equality check.</p>
<p class="font-semibold text-gray-800 mb-1">Step 3 — Cache hit vs miss</p>
<p class="text-gray-600">Check <code>cache.has(key)</code> before calling the function. On a miss, compute the result, store it, then return it. On a hit, return the cached value directly.</p>`,
    solution: `// Basic memoize — primitive args
function memoize(fn) {
  const cache = new Map()

  return function(...args) {
    const key = JSON.stringify(args)    // stable key for any primitive args

    if (cache.has(key)) {
      return cache.get(key)            // cache hit
    }

    const result = fn.apply(this, args)
    cache.set(key, result)             // cache miss — store and return
    return result
  }
}

// Usage
const expensiveCalc = memoize((n) => {
  console.log('computing...')
  return n * n
})

expensiveCalc(4)  // computing... → 16
expensiveCalc(4)  // (no log) → 16  (cached)
expensiveCalc(5)  // computing... → 25

// With cache invalidation / max size
function memoize(fn, maxSize = 100) {
  const cache = new Map()

  return function(...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)

    if (cache.size >= maxSize) {
      // evict oldest entry (Map preserves insertion order)
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }

    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}`,
  },

  {
    id: 'flatten-array',
    title: 'Flatten a Nested Array',
    category: 'JavaScript',
    difficulty: 'Easy',
    prompt: `Write a function that flattens an arbitrarily nested array. Then implement it without using Array.flat() — using recursion, then using a stack-based iterative approach.`,
    approach: `<p class="font-semibold text-gray-800 mb-1">Step 1 — Native solution first</p>
<p class="mb-3 text-gray-600">Always mention the built-in: <code>arr.flat(Infinity)</code>. The interviewer likely wants the custom implementation, but demonstrating awareness of the native API shows experience.</p>
<p class="font-semibold text-gray-800 mb-1">Step 2 — Recursive approach</p>
<p class="mb-3 text-gray-600">Iterate the array. If an item is itself an array, recurse and spread the result into the accumulator. If not, push directly. Simple and readable, but risks stack overflow on extremely deep nesting.</p>
<p class="font-semibold text-gray-800 mb-1">Step 3 — Iterative with a stack</p>
<p class="text-gray-600">Use a stack (array with push/pop). Pop items off. If an item is an array, spread its contents back onto the stack. Otherwise, push it to the result. This is O(n) and stack-safe for any depth.</p>`,
    solution: `// ① Native
[1, [2, [3, [4]]]].flat(Infinity)   // [1, 2, 3, 4]

// ② Recursive
function flattenRecursive(arr) {
  return arr.reduce((acc, item) =>
    Array.isArray(item)
      ? acc.concat(flattenRecursive(item))  // recurse into nested arrays
      : [...acc, item],                      // push primitives directly
    []
  )
}

// ③ Iterative with stack — stack-safe for any depth
function flattenIterative(arr) {
  const stack = [...arr]
  const result = []

  while (stack.length) {
    const item = stack.pop()
    if (Array.isArray(item)) {
      stack.push(...item)   // unpack array back onto stack
    } else {
      result.unshift(item)  // use unshift to preserve order (pop reverses)
    }
  }

  return result
}

// Note: iterative pop()+unshift() preserves order but is O(n²).
// Better: push to result then reverse at end
function flattenFast(arr) {
  const stack = [...arr]
  const result = []
  while (stack.length) {
    const item = stack.pop()
    Array.isArray(item) ? stack.push(...item) : result.push(item)
  }
  return result.reverse()
}

flattenFast([1, [2, [3, [4]]]])  // [1, 2, 3, 4]`,
  },

  {
    id: 'promise-retry',
    title: 'Promise Retry with Exponential Backoff',
    category: 'JavaScript',
    difficulty: 'Hard',
    prompt: `Write a retry() utility that takes an async function and a max retry count. It should call the function, and if it rejects, retry up to maxRetries times with exponential backoff (1s, 2s, 4s…). If all retries fail, reject with the last error.`,
    approach: `<p class="font-semibold text-gray-800 mb-1">Step 1 — Recursive vs loop</p>
<p class="mb-3 text-gray-600">Both work. A recursive approach is elegant — each failure calls retry with attempt + 1. A loop with async/await is more readable to most engineers. Pick the one you can explain clearly.</p>
<p class="font-semibold text-gray-800 mb-1">Step 2 — The delay</p>
<p class="mb-3 text-gray-600">Exponential backoff: <code>delay = baseDelay * 2 ** attempt</code>. Wrap <code>setTimeout</code> in a Promise to make it awaitable: <code>new Promise(resolve => setTimeout(resolve, delay))</code>.</p>
<p class="font-semibold text-gray-800 mb-1">Step 3 — Propagate the last error</p>
<p class="mb-3 text-gray-600">When all retries are exhausted, reject with the last caught error — not a generic message. The caller needs to know what actually failed.</p>`,
    solution: `// Iterative with async/await
async function retry(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()                     // success — return immediately
    } catch (err) {
      lastError = err
      if (attempt === maxRetries) break     // exhausted — stop retrying

      const delay = baseDelay * 2 ** attempt  // 1s, 2s, 4s…
      console.log(\`Attempt \${attempt + 1} failed. Retrying in \${delay}ms…\`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError  // all retries failed — propagate last error
}

// Usage
const fetchData = () => fetch('/api/unstable').then(r => {
  if (!r.ok) throw new Error(\`HTTP \${r.status}\`)
  return r.json()
})

retry(fetchData, 3, 1000)
  .then(data => console.log('Success:', data))
  .catch(err => console.error('All retries failed:', err.message))

// Recursive version (bonus)
function retryRecursive(fn, maxRetries, baseDelay = 1000, attempt = 0) {
  return fn().catch(err => {
    if (attempt >= maxRetries) throw err
    const delay = baseDelay * 2 ** attempt
    return new Promise(resolve => setTimeout(resolve, delay))
      .then(() => retryRecursive(fn, maxRetries, baseDelay, attempt + 1))
  })
}`,
  },

  {
    id: 'deep-clone',
    title: 'Deep Clone an Object',
    category: 'JavaScript',
    difficulty: 'Medium',
    prompt: `Implement a deepClone function that creates a complete deep copy of an object — including nested objects, arrays, Date objects, and handles circular references. Discuss the trade-offs of each approach.`,
    approach: `<p class="font-semibold text-gray-800 mb-1">Step 1 — Know the options and their trade-offs</p>
<p class="mb-3 text-gray-600"><code>JSON.parse(JSON.stringify(obj))</code>: simple but loses Dates (becomes strings), functions, undefined values, and throws on circular references. <code>structuredClone(obj)</code>: native, handles Dates, circular refs, Maps, Sets — the right answer for most cases in modern environments.</p>
<p class="font-semibold text-gray-800 mb-1">Step 2 — Custom recursive implementation</p>
<p class="mb-3 text-gray-600">Handle each type: <code>null</code> and primitives return as-is. <code>Date</code> → <code>new Date(obj)</code>. <code>Array</code> → map and recurse. Plain object → iterate keys and recurse. Functions → copy reference (can't truly clone a function).</p>
<p class="font-semibold text-gray-800 mb-1">Step 3 — Circular reference handling</p>
<p class="text-gray-600">Keep a <code>WeakMap</code> of already-visited objects. Before recursing into an object, check if it's already in the map and return the clone. This prevents infinite loops.</p>`,
    solution: `// ① Native — use this in production
structuredClone({ a: 1, b: { c: new Date() } })
// Handles: nested objects, arrays, Dates, Maps, Sets, circular refs
// Does NOT handle: functions, class instances with methods

// ② JSON — simple but lossy
const clone = JSON.parse(JSON.stringify(obj))
// Loses: Date (→ string), undefined, functions, circular refs → throws

// ③ Custom deep clone with circular reference support
function deepClone(obj, seen = new WeakMap()) {
  // Primitives and null
  if (obj === null || typeof obj !== 'object') return obj

  // Circular reference check
  if (seen.has(obj)) return seen.get(obj)

  // Date
  if (obj instanceof Date) return new Date(obj)

  // Array
  if (Array.isArray(obj)) {
    const clone = []
    seen.set(obj, clone)          // register before recursing
    obj.forEach((item, i) => { clone[i] = deepClone(item, seen) })
    return clone
  }

  // Plain object
  const clone = Object.create(Object.getPrototypeOf(obj))
  seen.set(obj, clone)            // register before recursing
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], seen)
  }
  return clone
}

// Test
const a = { x: 1, date: new Date(), nested: { y: 2 } }
a.self = a   // circular reference
const b = deepClone(a)
b.nested.y = 99
console.log(a.nested.y)  // 1 — not affected`,
  },

  {
    id: 'event-delegation',
    title: 'Event Delegation & Dynamic Lists',
    category: 'JavaScript',
    difficulty: 'Easy',
    prompt: `You have a list with 10,000 items that can be added to dynamically. Clicking any item should log its data-id attribute. Implement this efficiently. Why is attaching a listener to each item a bad idea?`,
    approach: `<p class="font-semibold text-gray-800 mb-1">Step 1 — Explain the problem with naive approach</p>
<p class="mb-3 text-gray-600">Attaching a click listener to each of 10,000 list items means 10,000 listener objects in memory. Adding items dynamically requires attaching listeners to each new element. This is expensive in both memory and setup time.</p>
<p class="font-semibold text-gray-800 mb-1">Step 2 — Event delegation</p>
<p class="mb-3 text-gray-600">Attach one listener to the parent container. DOM events bubble up — every click on a child eventually reaches the parent. Check <code>event.target</code> to identify which child was actually clicked.</p>
<p class="font-semibold text-gray-800 mb-1">Step 3 — Guard against clicking between items</p>
<p class="text-gray-600">The user might click on a child element inside the <code>&lt;li&gt;</code>. Use <code>closest()</code> to walk up to the nearest <code>li</code> from the actual click target, rather than assuming <code>event.target</code> is the <code>&lt;li&gt;</code> itself.</p>`,
    solution: `// ❌ Naive — 10,000 listeners, doesn't handle dynamic items
document.querySelectorAll('li').forEach(li => {
  li.addEventListener('click', e => console.log(li.dataset.id))
})

// ✅ Event delegation — one listener on the parent
const list = document.getElementById('todo-list')

list.addEventListener('click', (event) => {
  // Walk up from the actual click target to find the nearest <li>
  const li = event.target.closest('li')
  if (!li || !list.contains(li)) return  // click was outside a list item

  console.log('Clicked item:', li.dataset.id)
})

// Adding items dynamically — no extra listeners needed
function addItem(id, text) {
  const li = document.createElement('li')
  li.dataset.id = id
  li.textContent = text
  list.appendChild(li)   // the existing parent listener handles it automatically
}

// Works for any number of items, past or future.
// One listener in memory regardless of list size.`,
  },

]
