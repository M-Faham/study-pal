import type { ILesson, IQuiz } from '../../types/tutorial'

export const rxjsLessons: ILesson[] = [
  {
    id: 1,
    type: 'lesson',
    title: 'What Is RxJS? Observables vs Promises',
    content: `
      <h2>RxJS in One Line</h2>
      <p><strong>RxJS</strong> (Reactive Extensions for JavaScript) is a library for composing asynchronous and event-based programs using <strong>Observables</strong>.</p>
      <p>Angular uses RxJS everywhere: HTTP calls, routing events, form value changes, NgRx store — all Observables.</p>

      <h2>Observable vs Promise</h2>
      <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
        <tr style="background:#f3f4f6">
          <th style="padding:8px;text-align:left;border:1px solid #e5e7eb">Feature</th>
          <th style="padding:8px;text-align:left;border:1px solid #e5e7eb">Promise</th>
          <th style="padding:8px;text-align:left;border:1px solid #e5e7eb">Observable</th>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #e5e7eb">Values emitted</td>
          <td style="padding:8px;border:1px solid #e5e7eb">One</td>
          <td style="padding:8px;border:1px solid #e5e7eb"><strong>Zero, one, or many</strong></td>
        </tr>
        <tr style="background:#f9fafb">
          <td style="padding:8px;border:1px solid #e5e7eb">Lazy?</td>
          <td style="padding:8px;border:1px solid #e5e7eb">No — executes immediately</td>
          <td style="padding:8px;border:1px solid #e5e7eb"><strong>Yes — only runs when subscribed</strong></td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #e5e7eb">Cancellable?</td>
          <td style="padding:8px;border:1px solid #e5e7eb">No</td>
          <td style="padding:8px;border:1px solid #e5e7eb"><strong>Yes — unsubscribe()</strong></td>
        </tr>
        <tr style="background:#f9fafb">
          <td style="padding:8px;border:1px solid #e5e7eb">Operators</td>
          <td style="padding:8px;border:1px solid #e5e7eb">then/catch only</td>
          <td style="padding:8px;border:1px solid #e5e7eb"><strong>100+ operators (map, filter, switchMap…)</strong></td>
        </tr>
        <tr>
          <td style="padding:8px;border:1px solid #e5e7eb">Use case</td>
          <td style="padding:8px;border:1px solid #e5e7eb">One-time async value</td>
          <td style="padding:8px;border:1px solid #e5e7eb"><strong>Streams: events, websockets, HTTP, form values</strong></td>
        </tr>
      </table>

      <h2>The Three Callbacks</h2>
      <p>Every <code>subscribe()</code> accepts up to three handlers:</p>
      <pre><code>observable$.subscribe({
  next:     value  => console.log('Got:', value),  // each emitted value
  error:    err    => console.error('Error:', err), // terminal error
  complete: ()     => console.log('Done!')          // no more values
})</code></pre>

      <h2>Hot vs Cold Observables</h2>
      <ul>
        <li><strong>Cold</strong> — creates a new producer per subscriber (e.g. <code>HttpClient.get()</code> — each subscriber makes its own HTTP request).</li>
        <li><strong>Hot</strong> — shares one producer across all subscribers (e.g. mouse events, WebSocket, <code>Subject</code>).</li>
      </ul>
      <p><strong>Interview tip:</strong> "Is HttpClient cold?" Yes. Every <code>subscribe()</code> fires a separate HTTP request — use <code>shareReplay(1)</code> or <code>async</code> pipe to avoid duplicate requests.</p>
    `,
  },
  {
    id: 2,
    type: 'lesson',
    title: 'Creating Observables — of, from, interval, Subject',
    content: `
      <h2>Creation Operators</h2>
      <pre><code>import { of, from, interval, fromEvent } from 'rxjs'

// of — emits each argument then completes
of(1, 2, 3).subscribe(console.log)  // 1, 2, 3

// from — converts array, Promise, or iterable into an Observable
from([10, 20, 30]).subscribe(console.log)  // 10, 20, 30
from(fetch('/api/user')).subscribe(console.log)  // Promise → Observable

// interval — emits 0,1,2,3… every N ms (NEVER completes)
interval(1000).subscribe(n => console.log(n))

// fromEvent — wraps DOM events
fromEvent(document, 'click').subscribe(e => console.log(e))</code></pre>

      <h2>Subject — Hot Observable + Observer in One</h2>
      <p>A <code>Subject</code> is both an Observable AND an Observer. You can call <code>.next()</code> on it manually. It's the RxJS equivalent of an EventEmitter.</p>
      <pre><code>import { Subject } from 'rxjs'

const clicks$ = new Subject&lt;string&gt;()

clicks$.subscribe(v => console.log('Sub 1:', v))
clicks$.subscribe(v => console.log('Sub 2:', v))

clicks$.next('hello')  // Both subscribers get 'hello'
clicks$.complete()     // Signal done</code></pre>

      <h2>BehaviorSubject — Subject with a Current Value</h2>
      <p>Stores the <strong>latest emitted value</strong>. New subscribers immediately receive the current value. Perfect for shared state (e.g. current user, auth status).</p>
      <pre><code>import { BehaviorSubject } from 'rxjs'

const user$ = new BehaviorSubject&lt;string | null&gt;(null)

user$.subscribe(u => console.log('User:', u))  // immediately: User: null

user$.next('Alice')  // User: Alice
console.log(user$.getValue())  // 'Alice' — synchronous read</code></pre>

      <h2>ReplaySubject</h2>
      <p>Replays the last N values to any new subscriber — useful for caching the last N events.</p>
      <pre><code>const replay$ = new ReplaySubject&lt;number&gt;(2)  // buffer last 2
replay$.next(1)
replay$.next(2)
replay$.next(3)
replay$.subscribe(console.log)  // gets 2, 3 immediately</code></pre>

      <p><strong>Interview tip:</strong> Know the difference: <code>Subject</code> (no buffer), <code>BehaviorSubject</code> (1 value, requires initial), <code>ReplaySubject</code> (N values).</p>
    `,
  },
  {
    id: 3,
    type: 'lesson',
    title: 'Pipeable Operators — map, filter, tap, take, debounceTime',
    content: `
      <h2>The pipe() Method</h2>
      <p>Operators are applied through <code>pipe()</code>. Each operator takes an Observable and returns a new Observable — the original is never mutated.</p>
      <pre><code>import { of } from 'rxjs'
import { map, filter, tap } from 'rxjs/operators'

of(1, 2, 3, 4, 5).pipe(
  filter(n => n % 2 === 0),  // 2, 4
  map(n => n * 10),          // 20, 40
  tap(n => console.log('side effect:', n))  // logs but doesn't change stream
).subscribe(console.log)  // 20, 40</code></pre>

      <h2>Essential Operators to Know</h2>

      <h3>map</h3>
      <p>Transforms each value — exactly like <code>Array.map</code>.</p>
      <pre><code>http.get('/users').pipe(
  map(response => response.data)
)</code></pre>

      <h3>filter</h3>
      <p>Passes only values that satisfy the predicate.</p>

      <h3>tap</h3>
      <p>For side effects (logging, debugging) without modifying the stream.</p>
      <pre><code>source$.pipe(
  tap(v => console.log('before map:', v)),
  map(v => v * 2),
  tap(v => console.log('after map:', v))
)</code></pre>

      <h3>take(n)</h3>
      <p>Completes after emitting N values. Great for unsubscribing from infinite streams.</p>
      <pre><code>interval(1000).pipe(take(3)).subscribe(console.log)
// 0, 1, 2 — then auto-completes</code></pre>

      <h3>debounceTime(ms)</h3>
      <p>Waits until silence for N ms, then emits the latest value. Classic use: search input.</p>
      <pre><code>searchInput.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged()  // skip if same value as last
).subscribe(query => this.search(query))</code></pre>

      <h3>distinctUntilChanged</h3>
      <p>Skips consecutive duplicate values.</p>

      <h3>takeUntil(notifier$)</h3>
      <p>Completes when the notifier emits — the standard Angular unsubscribe pattern.</p>
      <pre><code>private destroy$ = new Subject&lt;void&gt;()

ngOnInit() {
  interval(1000).pipe(
    takeUntil(this.destroy$)
  ).subscribe(console.log)
}

ngOnDestroy() {
  this.destroy$.next()
  this.destroy$.complete()
}</code></pre>
    `,
  },
  {
    id: 4,
    type: 'lesson',
    title: 'Higher-Order Mapping — switchMap, mergeMap, concatMap, exhaustMap',
    content: `
      <h2>The Problem: Observable of Observables</h2>
      <p>When each emitted value needs to trigger a new async operation (e.g. HTTP call per search term), you end up with a nested Observable. Higher-order mapping operators flatten this automatically.</p>

      <h2>switchMap — Cancel Previous, Use Latest</h2>
      <p><strong>Most common in Angular.</strong> When a new value arrives, it <em>cancels</em> the previous inner Observable and starts a new one.</p>
      <pre><code>// Search: only care about the LATEST query
searchInput.valueChanges.pipe(
  debounceTime(300),
  switchMap(query => this.http.get('/search?q=' + query))
).subscribe(results => this.results = results)
// If user types fast, old requests are cancelled</code></pre>
      <p><strong>Use when:</strong> only the latest result matters (search, autocomplete, navigation).</p>

      <h2>mergeMap (flatMap) — Run All Concurrently</h2>
      <p>Does NOT cancel. All inner Observables run in parallel.</p>
      <pre><code>// Upload multiple files at once
from(files).pipe(
  mergeMap(file => this.uploadService.upload(file))
).subscribe(result => console.log('Uploaded:', result))</code></pre>
      <p><strong>Use when:</strong> order doesn't matter and you want maximum parallelism.</p>

      <h2>concatMap — Queue, One at a Time</h2>
      <p>Subscribes to each inner Observable only after the previous one completes. Preserves order.</p>
      <pre><code>// Process items in strict order
from(tasks).pipe(
  concatMap(task => this.processTask(task))
).subscribe(result => console.log('Done:', result))</code></pre>
      <p><strong>Use when:</strong> order matters (analytics events, sequential API calls).</p>

      <h2>exhaustMap — Ignore New While Busy</h2>
      <p>While an inner Observable is active, new outer values are ignored.</p>
      <pre><code>// Login button — ignore extra clicks while request is in flight
loginBtn.clicks$.pipe(
  exhaustMap(() => this.authService.login(credentials))
).subscribe()</code></pre>
      <p><strong>Use when:</strong> prevent duplicate submissions (login, payment).</p>

      <h2>Cheat Sheet</h2>
      <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
        <tr style="background:#f3f4f6">
          <th style="padding:8px;border:1px solid #e5e7eb">Operator</th>
          <th style="padding:8px;border:1px solid #e5e7eb">Concurrent?</th>
          <th style="padding:8px;border:1px solid #e5e7eb">Cancels previous?</th>
          <th style="padding:8px;border:1px solid #e5e7eb">Best for</th>
        </tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb">switchMap</td><td style="padding:8px;border:1px solid #e5e7eb">No (1 at a time)</td><td style="padding:8px;border:1px solid #e5e7eb">✅ Yes</td><td style="padding:8px;border:1px solid #e5e7eb">Search, navigation</td></tr>
        <tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">mergeMap</td><td style="padding:8px;border:1px solid #e5e7eb">✅ Yes (all)</td><td style="padding:8px;border:1px solid #e5e7eb">No</td><td style="padding:8px;border:1px solid #e5e7eb">Parallel uploads</td></tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb">concatMap</td><td style="padding:8px;border:1px solid #e5e7eb">No (queued)</td><td style="padding:8px;border:1px solid #e5e7eb">No</td><td style="padding:8px;border:1px solid #e5e7eb">Ordered tasks</td></tr>
        <tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">exhaustMap</td><td style="padding:8px;border:1px solid #e5e7eb">No (ignores new)</td><td style="padding:8px;border:1px solid #e5e7eb">No</td><td style="padding:8px;border:1px solid #e5e7eb">Login/submit</td></tr>
      </table>
    `,
  },
  {
    id: 5,
    type: 'lesson',
    title: 'Error Handling — catchError, retry, throwError',
    content: `
      <h2>Errors Are Terminal</h2>
      <p>When an Observable errors, it <strong>stops emitting</strong>. You must handle errors with operators, not try/catch.</p>

      <h2>catchError — Recover From an Error</h2>
      <pre><code>import { catchError, of } from 'rxjs'

this.http.get('/api/users').pipe(
  catchError(err => {
    console.error('Request failed:', err)
    return of([])  // return a fallback Observable — stream continues
  })
).subscribe(users => this.users = users)</code></pre>
      <p><code>catchError</code> must return a new Observable. <code>of([])</code> is a common "empty fallback" pattern.</p>

      <h2>throwError — Rethrow With a Custom Error</h2>
      <pre><code>import { throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

this.http.get('/api/data').pipe(
  catchError(err => {
    if (err.status === 401) return throwError(() => new Error('Unauthorised'))
    return throwError(() => err)  // rethrow other errors
  })
)</code></pre>

      <h2>retry(n) — Retry on Error</h2>
      <pre><code>import { retry } from 'rxjs/operators'

this.http.get('/api/data').pipe(
  retry(3)  // retry up to 3 times before erroring
).subscribe()</code></pre>

      <h2>retryWhen / retry with delay (RxJS 7+)</h2>
      <pre><code>import { retry, timer } from 'rxjs'

this.http.get('/api/data').pipe(
  retry({
    count: 3,
    delay: (error, retryCount) => timer(retryCount * 1000)  // exponential backoff
  })
)</code></pre>

      <h2>finalize — Always Runs (like finally)</h2>
      <pre><code>import { finalize } from 'rxjs/operators'

this.loading = true
this.http.get('/api/data').pipe(
  finalize(() => this.loading = false)  // runs on complete OR error
).subscribe(data => this.data = data)</code></pre>
    `,
  },
  {
    id: 6,
    type: 'lesson',
    title: 'Combining Observables — forkJoin, combineLatest, merge, zip',
    content: `
      <h2>forkJoin — Wait for All to Complete</h2>
      <p>Like <code>Promise.all</code> for Observables. Waits for all inner Observables to <strong>complete</strong>, then emits an array of their last values.</p>
      <pre><code>import { forkJoin } from 'rxjs'

forkJoin({
  user:    this.http.get('/api/user'),
  posts:   this.http.get('/api/posts'),
  settings: this.http.get('/api/settings')
}).subscribe(({ user, posts, settings }) => {
  this.user = user
  this.posts = posts
})</code></pre>
      <p><strong>Gotcha:</strong> If any inner Observable errors or never completes, <code>forkJoin</code> never emits. Use <code>catchError</code> on each inner stream to protect against this.</p>

      <h2>combineLatest — Re-emit When Any Updates</h2>
      <p>Emits whenever <em>any</em> source emits, combining the <strong>latest value from each</strong>. Waits until all have emitted at least once.</p>
      <pre><code>import { combineLatest } from 'rxjs'

combineLatest([
  this.filter$,   // current filter
  this.sort$,     // current sort
  this.page$      // current page
]).pipe(
  switchMap(([filter, sort, page]) => this.api.getItems(filter, sort, page))
).subscribe(items => this.items = items)</code></pre>
      <p>Perfect for reactive forms where multiple controls drive a query.</p>

      <h2>merge — Emit From Any Source</h2>
      <p>Subscribes to all sources simultaneously and forwards every emission as it arrives. Useful for merging event streams.</p>
      <pre><code>import { merge } from 'rxjs'

merge(
  fromEvent(saveBtn, 'click'),
  fromEvent(document, 'keydown').pipe(
    filter((e: KeyboardEvent) => e.ctrlKey && e.key === 's')
  )
).subscribe(() => this.save())</code></pre>

      <h2>zip — Pair Values by Index</h2>
      <p>Waits for each source to emit, then pairs values by position.</p>
      <pre><code>zip(of('A', 'B', 'C'), of(1, 2, 3))
  .subscribe(pair => console.log(pair))
// ['A', 1], ['B', 2], ['C', 3]</code></pre>

      <h2>Quick Reference</h2>
      <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
        <tr style="background:#f3f4f6">
          <th style="padding:8px;border:1px solid #e5e7eb">Operator</th>
          <th style="padding:8px;border:1px solid #e5e7eb">Emits when</th>
          <th style="padding:8px;border:1px solid #e5e7eb">Use case</th>
        </tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb">forkJoin</td><td style="padding:8px;border:1px solid #e5e7eb">All complete</td><td style="padding:8px;border:1px solid #e5e7eb">Parallel HTTP on load</td></tr>
        <tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">combineLatest</td><td style="padding:8px;border:1px solid #e5e7eb">Any emits (all seeded)</td><td style="padding:8px;border:1px solid #e5e7eb">Reactive filters/forms</td></tr>
        <tr><td style="padding:8px;border:1px solid #e5e7eb">merge</td><td style="padding:8px;border:1px solid #e5e7eb">Any emits</td><td style="padding:8px;border:1px solid #e5e7eb">Multiple event sources</td></tr>
        <tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">zip</td><td style="padding:8px;border:1px solid #e5e7eb">All emit (by index)</td><td style="padding:8px;border:1px solid #e5e7eb">Pair matched values</td></tr>
      </table>
    `,
  },
  {
    id: 7,
    type: 'lesson',
    title: 'Angular-Specific RxJS Patterns',
    content: `
      <h2>async Pipe — Let Angular Manage Subscriptions</h2>
      <p>The <code>async</code> pipe subscribes to an Observable in the template and <strong>automatically unsubscribes</strong> when the component is destroyed. Always prefer it over manual <code>subscribe()</code>.</p>
      <pre><code>// component.ts
users$ = this.http.get&lt;User[]&gt;('/api/users')

// template
&lt;div *ngFor="let user of users$ | async"&gt;
  {{ user.name }}
&lt;/div&gt;</code></pre>

      <h2>takeUntilDestroyed (Angular 16+)</h2>
      <p>The modern replacement for the destroy$ Subject pattern. Works in injection context.</p>
      <pre><code>import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({...})
export class MyComponent {
  constructor() {
    interval(1000).pipe(
      takeUntilDestroyed()  // auto-unsubscribes on destroy
    ).subscribe(console.log)
  }
}</code></pre>

      <h2>HttpClient + RxJS</h2>
      <pre><code>// HttpClient returns a COLD Observable — subscribe() triggers the request
this.http.get&lt;User&gt;('/api/user').pipe(
  map(user => user.name),
  catchError(err => of('Guest'))
).subscribe(name => this.name = name)

// Share one HTTP call across multiple subscribers
readonly currentUser$ = this.http.get&lt;User&gt;('/api/me').pipe(
  shareReplay(1)  // cache latest value, replay to late subscribers
)</code></pre>

      <h2>Reactive Forms + RxJS</h2>
      <pre><code>// Every Angular reactive form control has a valueChanges Observable
this.searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(q => this.api.search(q)),
  takeUntil(this.destroy$)
).subscribe(results => this.results = results)</code></pre>

      <h2>Router Events</h2>
      <pre><code>import { NavigationEnd } from '@angular/router'
import { filter } from 'rxjs/operators'

this.router.events.pipe(
  filter(event => event instanceof NavigationEnd)
).subscribe((event: NavigationEnd) => {
  this.currentUrl = event.url
})</code></pre>

      <h2>NgRx Store</h2>
      <p>If the job uses NgRx, the store exposes state as Observables via <code>select()</code>:</p>
      <pre><code>// Reading state
this.users$ = this.store.select(selectAllUsers)

// Dispatching actions triggers reducers
this.store.dispatch(loadUsers())

// Effects — side effects in response to actions
loadUsers$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadUsers),
    switchMap(() => this.api.getUsers().pipe(
      map(users => loadUsersSuccess({ users })),
      catchError(err => of(loadUsersFailure({ error: err })))
    ))
  )
)</code></pre>
    `,
  },
]

export const rxjsQuizzes: IQuiz[] = [
  {
    id: 100,
    type: 'quiz',
    title: 'RxJS Interview Quiz',
    afterLesson: 7,
    questions: [
      {
        id: 1,
        question: 'You have a search input. The user types fast and you want to cancel in-flight HTTP requests when a new keystroke arrives. Which operator do you use?',
        options: ['mergeMap', 'concatMap', 'switchMap', 'exhaustMap'],
        correct: 2,
        explanation: 'switchMap cancels the previous inner Observable when a new value arrives — perfect for search where only the latest result matters.',
      },
      {
        id: 2,
        question: 'What is the difference between a Subject and a BehaviorSubject?',
        options: [
          'Subject is hot, BehaviorSubject is cold',
          'BehaviorSubject holds and replays the latest value to new subscribers; Subject does not',
          'Subject can have multiple subscribers; BehaviorSubject cannot',
          'BehaviorSubject is synchronous; Subject is asynchronous',
        ],
        correct: 1,
        explanation: 'BehaviorSubject stores the last emitted value and immediately delivers it to any new subscriber. A plain Subject emits nothing to late subscribers.',
      },
      {
        id: 3,
        question: 'You need to make 3 HTTP calls simultaneously and act only when ALL have returned. Which operator do you use?',
        options: ['merge', 'combineLatest', 'zip', 'forkJoin'],
        correct: 3,
        explanation: 'forkJoin (like Promise.all) waits for all inner Observables to complete, then emits their last values as an array or object.',
      },
      {
        id: 4,
        question: 'What does the async pipe in Angular do?',
        options: [
          'Converts a Promise to an Observable',
          'Subscribes to an Observable and unsubscribes automatically on component destroy',
          'Makes HTTP calls asynchronous',
          'Delays template rendering by one tick',
        ],
        correct: 1,
        explanation: 'The async pipe subscribes to an Observable or Promise in the template and handles unsubscription automatically when the component is destroyed — preventing memory leaks.',
      },
      {
        id: 5,
        question: 'Which statement about cold Observables is TRUE?',
        options: [
          'All subscribers share the same producer',
          'HttpClient.get() is hot because it uses HTTP',
          'Each subscriber gets its own independent execution',
          'Cold Observables always complete immediately',
        ],
        correct: 2,
        explanation: 'Cold Observables create a new producer per subscriber. HttpClient.get() is cold — each subscribe() triggers a separate HTTP request.',
      },
      {
        id: 6,
        question: 'A login button should ignore additional clicks while the login request is in flight. Which operator prevents duplicate submissions?',
        options: ['switchMap', 'mergeMap', 'concatMap', 'exhaustMap'],
        correct: 3,
        explanation: 'exhaustMap ignores new outer values while the current inner Observable is still active — preventing duplicate login requests.',
      },
      {
        id: 7,
        question: 'What does catchError() return to keep the stream alive after an error?',
        options: [
          'undefined',
          'The original error',
          'A new Observable (e.g. of(fallbackValue))',
          'A Promise',
        ],
        correct: 2,
        explanation: 'catchError must return a new Observable. Returning of(fallbackValue) lets the stream continue with a default value instead of terminating.',
      },
      {
        id: 8,
        question: 'You have two form controls (filter$ and sort$) and want to re-fetch data whenever either changes. Which operator combines them reactively?',
        options: ['forkJoin', 'zip', 'combineLatest', 'merge'],
        correct: 2,
        explanation: 'combineLatest re-emits whenever any source emits, always pairing the latest value from each. It waits until all sources have emitted at least once.',
      },
    ],
  },
]
