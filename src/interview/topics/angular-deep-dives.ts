import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: "angular-deep-dives",
  title: "Angular Deep Dives",
  icon: "🅰️",
  difficulty: "Tricky",
  targets: ['Angular'],
  cheatSheet: [
    {
      concept: "Change Detection Strategies",
      explanation:
        "Default checks every component on every event. OnPush only checks when an @Input reference changes, an event fires inside the component, or the async pipe receives a new value.",
      code: `@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
// Now Angular only checks this component when:
// 1. An @Input reference changes (not mutated!)
// 2. An event originates inside it
// 3. An Observable via async pipe emits`,
    },
    {
      concept: "Dependency Injection — providedIn vs providers[]",
      explanation:
        'providedIn: "root" creates a singleton shared across the whole app. providers[] in a module/component creates a scoped instance — different components can get different instances.',
      code: `// Singleton — one instance for the whole app
@Injectable({ providedIn: 'root' })
export class AuthService {}

// Scoped — each component that declares it gets its own instance
@Component({ providers: [CacheService] })
export class SearchComponent {}`,
    },
    {
      concept: "Smart vs Dumb Components",
      explanation:
        "Smart (container) components own state and inject services. Dumb (presentational) components receive data via @Input and emit events via @Output — they are pure and reusable.",
      code: `// Smart — knows about services, owns state
@Component({ template: '<user-card [user]="user$ | async" />' })
export class UserPageComponent {
  user$ = this.userService.getCurrentUser()
  constructor(private userService: UserService) {}
}

// Dumb — pure input/output, no service injection
@Component({ selector: 'user-card' })
export class UserCardComponent {
  @Input() user!: User
  @Output() delete = new EventEmitter<number>()
}`,
    },
    {
      concept: "Angular Lifecycle Hooks Order",
      explanation:
        "ngOnChanges → ngOnInit → ngDoCheck → ngAfterContentInit → ngAfterContentChecked → ngAfterViewInit → ngAfterViewChecked → ngOnDestroy. OnInit runs once after first ngOnChanges.",
      code: `export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()

  ngOnInit() {
    // safe to access @Input values here
    this.dataService.getData().pipe(
      takeUntil(this.destroy$)
    ).subscribe()
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }
}`,
    },
    {
      concept: "trackBy in *ngFor",
      explanation:
        "Without trackBy, Angular destroys and recreates every DOM node when the array reference changes. trackBy tells Angular how to identify items by a unique key — only changed items are re-rendered.",
      code: `// template
<li *ngFor="let user of users; trackBy: trackById">{{ user.name }}</li>

// component
trackById(index: number, user: User): number {
  return user.id  // stable identity — Angular reuses the DOM node
}`,
    },
  ],
  spokenAnswer: {
    question:
      "Explain Angular change detection and when you would use OnPush.",
    answer: `Angular's default change detection checks every component in the tree after every browser event, timer, or HTTP response — it's thorough but can be slow in large apps. OnPush is an optimisation where you tell Angular "only check this component when one of its Input references changes, when an event fires inside it, or when an Observable it's subscribed to via the async pipe emits." The tradeoff is that you must treat your data as immutable — if you mutate an object in place, Angular won't detect the change because the object reference is the same. In practice I use OnPush on any component that receives data through Inputs rather than injecting services, which is most presentational components. Combined with the async pipe it makes the subscription lifecycle automatic and the performance gains are significant in component-heavy pages.`,
  },
  traps: [
    {
      trap: "Mutating an object instead of replacing it with OnPush",
      correction:
        'With OnPush, Angular compares Input references with ===. If you do this.user.name = "Alice", the reference is the same — Angular skips the check. Always return a new object: this.user = { ...this.user, name: "Alice" }.',
    },
    {
      trap: "Injecting a service in a dumb component",
      correction:
        "A dumb component that injects HttpClient or a domain service becomes untestable in isolation and hard to reuse. Pass data via @Input, emit events via @Output. Let the parent (smart component) own the service call.",
    },
    {
      trap: "Forgetting to unsubscribe from Observables in ngOnDestroy",
      correction:
        "Subscriptions that outlive the component cause memory leaks. Use takeUntil(this.destroy$) with a Subject, the async pipe, or takeUntilDestroyed() in Angular 16+. Never leave a bare .subscribe() without a matching teardown.",
    },
  ],
  quiz: [
    {
      id: 1,
      question:
        "A component uses OnPush. You mutate a property on an @Input object. The view does not update. Why?",
      options: [
        "OnPush does not support object inputs",
        "Angular compares Input references with === — the reference did not change",
        "You need to call detectChanges() after every mutation",
        "OnPush only works with primitive @Input values",
      ],
      correct: 1,
      explanation:
        "OnPush uses reference equality. Mutating an object keeps the same reference, so Angular considers the Input unchanged. Return a new object reference to trigger the check.",
    },
    {
      id: 2,
      question:
        'What is the difference between providedIn: "root" and listing a service in a module\'s providers array?',
      options: [
        "No difference — both create a singleton",
        'providedIn: "root" is tree-shakeable; providers[] always includes the service in the bundle',
        'providers[] creates a singleton; providedIn: "root" creates multiple instances',
        'providedIn: "root" only works in standalone components',
      ],
      correct: 1,
      explanation:
        'providedIn: "root" registers the service with the root injector and is tree-shakeable — if nothing injects it, it is excluded from the bundle. A service in providers[] is always included.',
    },
    {
      id: 3,
      question:
        "Which lifecycle hook should you use to access and manipulate the component's view (DOM) for the first time?",
      options: ["ngOnInit", "ngOnChanges", "ngAfterViewInit", "ngDoCheck"],
      correct: 2,
      explanation:
        "The component's view is not yet created when ngOnInit runs. ngAfterViewInit fires after the view and all child views are fully initialised — the safe place to query ViewChild references or interact with the DOM.",
    },
    {
      id: 4,
      question:
        "Why does *ngFor re-create all DOM nodes when the array reference changes, and how do you prevent it?",
      options: [
        "It is a browser limitation — you cannot prevent it",
        "Use trackBy to give Angular a stable identity for each item so it reuses existing DOM nodes",
        "Use the OnPush change detection strategy",
        "Replace *ngFor with a custom structural directive",
      ],
      correct: 1,
      explanation:
        "Without trackBy, Angular cannot tell which items changed, so it destroys and recreates every DOM node. trackBy provides a key (like item.id) that Angular uses to diff the list and only re-render what actually changed.",
    },
  ],
}
