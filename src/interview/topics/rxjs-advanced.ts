import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: 'rxjs-advanced',
  title: 'RxJS — Error Handling & Advanced Patterns',
  icon: '🔀',
  difficulty: 'Tricky',
  targets: ['Angular'],
  keyPoints: [
    'catchError must return a new Observable — returning EMPTY completes the stream without error',
    'retry(n) re-subscribes n times; retryWhen / retry({ delay }) lets you add backoff logic',
    'debounceTime waits for silence; throttleTime emits first then ignores; auditTime emits last after window',
    'A cold Observable starts fresh per subscriber; a hot Observable (Subject) shares one execution',
    'tap() is for side-effects only — logging, analytics — never transform data inside tap',
  ],
  cheatSheet: [
    {
      concept: 'catchError',
      explanation: 'Catches an error and returns a replacement Observable. The outer stream continues. Return EMPTY to swallow silently, of(fallback) to supply a default, or throwError(() => err) to re-throw.',
      code: `this.http.get('/api/data').pipe(
  catchError(err => {
    console.error(err)
    return of([])        // fallback value, stream completes normally
  })
)`,
    },
    {
      concept: 'retry & retryWhen',
      explanation: 'retry(3) re-subscribes up to 3 times on error. For exponential backoff use retry({ count: 3, delay: (_, i) => timer(i * 1000) }).',
      code: `this.http.get('/api').pipe(
  retry({
    count: 3,
    delay: (_, attempt) => timer(attempt * 1000)
  }),
  catchError(err => of(null))
)`,
    },
    {
      concept: 'debounceTime vs throttleTime vs auditTime',
      explanation: 'debounceTime(300): emits only after 300ms of silence — ideal for search inputs. throttleTime(300): emits immediately then ignores for 300ms — rate limiting. auditTime(300): emits the last value after a 300ms window — scroll events.',
      code: `// search input
fromEvent(input, 'input').pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(e => search(e.target.value))
)`,
    },
    {
      concept: 'Hot vs Cold Observables',
      explanation: 'Cold: each subscriber gets its own producer (HttpClient.get — two subscribers = two requests). Hot: all subscribers share one producer (Subject, fromEvent — one DOM listener, many subscribers). share() / shareReplay() convert cold to hot.',
      code: `// cold — two HTTP requests
const data$ = this.http.get('/api')
data$.subscribe(a => ...)
data$.subscribe(b => ...) // second request!

// hot — one request, two subscribers
const shared$ = data$.pipe(shareReplay(1))
shared$.subscribe(a => ...)
shared$.subscribe(b => ...) // cached, no extra request`,
    },
    {
      concept: 'Marble testing',
      explanation: 'Use TestScheduler from rxjs/testing to assert observable timings. Marble strings: - = 10ms, a-z = emission, | = complete, # = error.',
      code: `const scheduler = new TestScheduler((actual, expected) =>
  expect(actual).toEqual(expected)
)
scheduler.run(({ cold, expectObservable }) => {
  const src$ = cold('--a--b--|')
  expectObservable(src$.pipe(map(x => x.toUpperCase())))
    .toBe('--A--B--|')
})`,
    },
    {
      concept: 'takeUntilDestroyed (Angular 16+)',
      explanation: 'Replaces the manual takeUntil + Subject pattern. Inject DestroyRef or use takeUntilDestroyed() in the injection context to auto-unsubscribe when the component is destroyed.',
      code: `export class MyComponent {
  constructor() {
    interval(1000).pipe(
      takeUntilDestroyed()   // no ngOnDestroy needed
    ).subscribe(console.log)
  }
}`,
    },
  ],
  spokenAnswer: {
    question: 'How do you handle errors in an RxJS pipeline so the stream doesn\'t die?',
    answer: 'I use catchError inside the pipe, returning a fallback Observable — usually of([]) or EMPTY — so the outer stream completes gracefully instead of propagating the error to the subscriber. For transient network errors I pair it with retry and a delay so we get automatic backoff before giving up. The key thing to know is that catchError must return an Observable, not a value, and once you return from it the original stream is replaced — so if you want the stream to stay alive for future events you need to move catchError inside a switchMap or mergeMap.',
    followUp: 'Walk me through debounceTime vs throttleTime — when would you use each?',
  },
  traps: [
    {
      trap: 'catchError can return a plain value like return []',
      correction: 'catchError must return an Observable — use of([]) or EMPTY',
    },
    {
      trap: 'retry automatically adds a delay between attempts',
      correction: 'retry() with no config re-subscribes immediately; you must pass a delay factory for backoff',
    },
    {
      trap: 'debounceTime and throttleTime both prevent rapid emissions — they\'re interchangeable',
      correction: 'debounceTime waits for silence (search box); throttleTime rate-limits but emits the first event (button clicks)',
    },
    {
      trap: 'shareReplay(1) and share() do the same thing',
      correction: 'shareReplay(1) replays the last emission to late subscribers; share() does not — late subscribers miss previous values',
    },
  ],
  quiz: [
    {
      id: 1,
      question: 'A search$ Observable throws an error. You want the stream to survive and emit [] as fallback. Which is correct?',
      options: [
        'search$.pipe(catchError(() => []))',
        'search$.pipe(catchError(() => of([])))',
        'search$.pipe(catchError(() => throwError([])))',
        'search$.pipe(retry(1), catchError(() => EMPTY))',
      ],
      correct: 1,
      explanation: 'catchError must return an Observable. of([]) wraps the array in an Observable that emits [] and completes. Returning a plain array throws a runtime error.',
    },
    {
      id: 2,
      question: 'A user types rapidly in a search box. You want to wait 300ms after the last keystroke before firing a request. Which operator?',
      options: [
        'throttleTime(300)',
        'auditTime(300)',
        'debounceTime(300)',
        'sampleTime(300)',
      ],
      correct: 2,
      explanation: 'debounceTime waits for a pause in emissions — perfect for search. throttleTime would emit on the first keystroke then block for 300ms, missing the final typed value.',
    },
    {
      id: 3,
      question: 'You call HttpClient.get(\'/api\') and subscribe twice. How many HTTP requests are made?',
      options: [
        'One — Angular deduplicates HTTP requests',
        'Two — HttpClient returns a cold Observable',
        'One — HTTP Observables are hot by default',
        'Zero until you add shareReplay()',
      ],
      correct: 1,
      explanation: 'HttpClient returns a cold Observable. Each subscription creates a new request. Add shareReplay(1) to multicast and cache the response.',
    },
  ],
}
