import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: "rxjs",
  title: "RxJS",
  icon: "🔀",
  difficulty: "Tricky",
  targets: ['Angular'],
  cheatSheet: [
    {
      concept: "switchMap vs mergeMap vs concatMap vs exhaustMap",
      explanation:
        "The four higher-order mapping operators differ only in how they handle a new outer emission while an inner Observable is still running.",
      code: `// switchMap — cancel previous, use latest (search, navigation)
search$.pipe(switchMap(q => http.get('/search?q=' + q)))

// mergeMap — run all concurrently (parallel uploads)
files$.pipe(mergeMap(file => upload(file)))

// concatMap — queue strictly, one at a time (ordered writes)
actions$.pipe(concatMap(action => save(action)))

// exhaustMap — ignore new while busy (login button)
loginClick$.pipe(exhaustMap(() => authService.login(creds)))`,
    },
    {
      concept: "Subject Variants",
      explanation:
        "Subject: no buffer. BehaviorSubject: stores latest value, replays to new subscribers. ReplaySubject(n): replays last n values. AsyncSubject: emits only the last value on complete.",
      code: `const plain$    = new Subject<number>()          // no replay
const current$  = new BehaviorSubject<number>(0) // initial=0, replays latest
const history$  = new ReplaySubject<number>(3)   // replays last 3

current$.getValue()  // synchronous read of current value`,
    },
    {
      concept: "Memory Leak Prevention",
      explanation:
        "Every subscribe() that isn't cleaned up leaks memory. Three safe patterns: async pipe (auto-unsubscribe), takeUntil(destroy$), takeUntilDestroyed() in Angular 16+.",
      code: `// Pattern 1 — async pipe (preferred in templates)
{{ data$ | async }}

// Pattern 2 — takeUntil
private destroy$ = new Subject<void>()
ngOnInit() {
  interval(1000).pipe(takeUntil(this.destroy$)).subscribe()
}
ngOnDestroy() { this.destroy$.next(); this.destroy$.complete() }

// Pattern 3 — Angular 16+ (in constructor/injection context)
interval(1000).pipe(takeUntilDestroyed()).subscribe()`,
    },
    {
      concept: "shareReplay(1) — Multicasting HTTP",
      explanation:
        "HttpClient is cold — each subscriber triggers a new HTTP request. shareReplay(1) makes it hot and caches the last emission, so multiple subscribers share one request.",
      code: `// Without shareReplay — two HTTP requests
readonly user$ = this.http.get<User>('/me')
// template uses (user$ | async) twice = two requests

// With shareReplay(1) — one request, shared result
readonly user$ = this.http.get<User>('/me').pipe(
  shareReplay(1)
)`,
    },
    {
      concept: "combineLatest for Reactive Queries",
      explanation:
        "Combines multiple Observables and re-emits whenever any source emits. Waits until all sources have emitted at least once. Perfect for reactive filter/sort/page combinations.",
      code: `combineLatest([filter$, sort$, page$]).pipe(
  debounceTime(100),
  switchMap(([filter, sort, page]) =>
    this.api.getItems({ filter, sort, page })
  )
).subscribe(items => this.items = items)`,
    },
  ],
  spokenAnswer: {
    question:
      "Walk me through the difference between switchMap, mergeMap, concatMap, and exhaustMap.",
    answer: `All four take each emission from a source Observable and map it to an inner Observable — the difference is what happens when a new emission arrives while the previous inner Observable is still running. switchMap cancels the previous inner Observable and starts a new one, which is why it's the default choice for search — you only care about the result for the latest query. mergeMap keeps all inner Observables running concurrently, so it's good for things like uploading multiple files in parallel where you want maximum throughput and order doesn't matter. concatMap queues them — it waits for each inner Observable to complete before starting the next, which preserves order and is useful for sequential writes or analytics events. exhaustMap is the opposite of switchMap — while an inner Observable is active, it ignores any new outer emissions, which makes it perfect for a login button because you don't want to fire multiple auth requests if the user clicks twice.`,
  },
  traps: [
    {
      trap: "Using mergeMap for search or navigation",
      correction:
        "mergeMap runs all requests concurrently with no cancellation. If the user types fast, responses can arrive out of order — you could display results for an old query. Use switchMap so stale requests are cancelled.",
    },
    {
      trap: "Calling subscribe() inside subscribe()",
      correction:
        "Nested subscribes are a code smell — you lose error handling, create potential memory leaks, and can't compose the streams. Flatten with switchMap/mergeMap/concatMap instead.",
    },
    {
      trap: "Thinking switchMap cancels the HTTP request on the server",
      correction:
        'switchMap unsubscribes from the inner Observable — it cancels the browser\'s in-flight request via AbortController if the Observable is wired to one (like Angular\'s HttpClient). But the server may still process and complete the request. "Cancelled" means "we stop listening", not "the server stops working".',
    },
  ],
  quiz: [
    {
      id: 1,
      question:
        "A user types in a search box. Each keystroke triggers an HTTP request. Which operator ensures only the latest request's result is used?",
      options: ["mergeMap", "concatMap", "exhaustMap", "switchMap"],
      correct: 3,
      explanation:
        "switchMap cancels the previous inner Observable (and its HTTP request) when a new emission arrives. Only the latest request's result reaches the subscriber.",
    },
    {
      id: 2,
      question:
        "What does shareReplay(1) do to a cold Observable like HttpClient.get()?",
      options: [
        "It retries the request once on failure",
        "It replays the last emitted value to new subscribers and shares one execution among all subscribers",
        "It caches the response in localStorage",
        "It converts the Observable from cold to cold with a buffer",
      ],
      correct: 1,
      explanation:
        "shareReplay(1) multicasts the Observable — all subscribers share one HTTP request and the last response is replayed to any late subscriber. Without it, each subscribe() triggers a separate HTTP call.",
    },
    {
      id: 3,
      question:
        "What is the key difference between BehaviorSubject and ReplaySubject?",
      options: [
        "BehaviorSubject requires an initial value and replays only the latest; ReplaySubject replays N last values with no required initial",
        "ReplaySubject is synchronous; BehaviorSubject is asynchronous",
        "BehaviorSubject replays all values; ReplaySubject replays only one",
        "There is no difference — they are interchangeable",
      ],
      correct: 0,
      explanation:
        "BehaviorSubject requires an initial value at construction and always replays exactly the latest emission to new subscribers. ReplaySubject(n) replays the last n emissions and requires no initial value.",
    },
    {
      id: 4,
      question:
        "Which pattern is the correct way to prevent memory leaks from subscriptions in Angular components?",
      options: [
        "Call subscription.unsubscribe() in ngOnInit",
        "Use takeUntil(this.destroy$) and complete destroy$ in ngOnDestroy",
        "Set the subscription variable to null in ngOnDestroy",
        "Only subscribe inside ngAfterViewInit",
      ],
      correct: 1,
      explanation:
        "takeUntil(destroy$) automatically completes the subscription when destroy$ emits. You emit from destroy$ in ngOnDestroy. The async pipe and takeUntilDestroyed() (Angular 16+) are equally valid alternatives.",
    },
  ],
}
