import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: 'angular-advanced',
  title: 'Angular — Advanced Concepts',
  icon: '🅰️',
  difficulty: 'Tricky',
  targets: ['Angular'],
  keyPoints: [
    'TypeScript = JavaScript + static types; compiles to plain JS; catches errors before runtime',
    'Observable = lazy, cancellable, multi-value stream; Promise = eager, one-value, not cancellable',
    'Lifecycle order: constructor → ngOnChanges → ngOnInit → ngAfterViewInit → ngOnDestroy',
    'Signals give fine-grained reactivity without Zone.js — read with (), write with .set()/.update()',
    'CanActivate runs after match; CanMatch prevents route matching entirely (lazy module never loads)',
  ],
  cheatSheet: [
    {
      concept: 'TypeScript vs JavaScript',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Superset of JavaScript</p><p class="mb-3 text-gray-600">Any valid JS is valid TS. TypeScript adds <strong>static types</strong>, interfaces, enums, generics, and access modifiers — then compiles to plain JS. No runtime overhead.</p><p class="font-semibold text-gray-800 mb-1">Why Use It</p><p class="text-gray-600">Catch type errors <strong>at compile time</strong> before they reach production. Better IDE autocomplete, self-documenting APIs, and safe refactoring across large codebases. The compiler flags the error the moment you misuse a type.</p>`,
      code: `// JavaScript — no type safety
function add(a, b) { return a + b }
add(2, '3')  // '23' — no warning

// TypeScript — type error at compile time
function add(a: number, b: number): number { return a + b }
add(2, '3')  // ❌ Argument of type 'string' is not assignable to parameter of type 'number'

// TypeScript-only features
interface User { id: number; name: string }
type Status = 'active' | 'inactive'
enum Direction { Up, Down, Left, Right }

// Generics
function first<T>(arr: T[]): T { return arr[0] }`,
    },
    {
      concept: 'Observable vs Promise',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Promise</p><p class="mb-3 text-gray-600"><strong>One async value</strong>. <strong>Eager</strong> — starts executing immediately on creation. <strong>Not cancellable</strong>. No built-in operators. Simple and fine for one-shot async operations like a single HTTP call in vanilla JS.</p><p class="font-semibold text-gray-800 mb-1">Observable</p><p class="text-gray-600"><strong>Stream of 0–n values</strong>. <strong>Lazy</strong> — nothing happens until you <code>.subscribe()</code>. <strong>Cancellable</strong> via <code>.unsubscribe()</code>. Composable with RxJS operators (debounce, retry, switchMap). The right choice for streams, retries, cancellation, and reactive data flows in Angular.</p>`,
      code: `// Promise — eager, one value, not cancellable
const p = fetch('/api/user')  // starts immediately
p.then(r => r.json()).then(console.log)
// Can't cancel — even if component destroyed

// Observable — lazy, multiple values, cancellable
const obs$ = this.http.get('/api/user')  // does nothing yet
const sub = obs$.subscribe(console.log)  // starts now
sub.unsubscribe()  // cancels the HTTP request

// Observable advantages
this.searchInput$.pipe(
  debounceTime(300),      // wait for pause
  switchMap(q => this.http.get('/search?q=' + q)),  // cancel previous
  retry(3),               // retry on error
  catchError(() => of([]))
).subscribe(results => this.results = results)`,
    },
    {
      concept: 'Angular Lifecycle Hooks — Full Order',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Run Once</p><p class="mb-3 text-gray-600"><strong>ngOnChanges</strong>: before ngOnInit, then on every @Input change. <strong>ngOnInit</strong>: safe to use @Input values, make HTTP calls. <strong>ngAfterContentInit</strong>: ng-content projected. <strong>ngAfterViewInit</strong>: view + children rendered, safe to query DOM. <strong>ngOnDestroy</strong>: your cleanup hook — unsubscribe, clear timers.</p><p class="font-semibold text-gray-800 mb-1">Run Every CD Cycle</p><p class="text-gray-600"><strong>ngDoCheck</strong>: every cycle — avoid heavy logic here. <strong>ngAfterContentChecked</strong> and <strong>ngAfterViewChecked</strong>: after every content/view check. Keep these empty unless you have a specific reason.</p>`,
      code: `// Order of execution:
// 1. constructor()          — DI only, no inputs yet
// 2. ngOnChanges()          — @Input values set/changed (runs BEFORE ngOnInit, then on each change)
// 3. ngOnInit()             — safe to use @Input values, call APIs (runs ONCE)
// 4. ngDoCheck()            — every CD cycle (avoid heavy logic)
// 5. ngAfterContentInit()   — ng-content projected (runs ONCE)
// 6. ngAfterContentChecked()— after every projected content check
// 7. ngAfterViewInit()      — view + children rendered, safe to query DOM (runs ONCE)
// 8. ngAfterViewChecked()   — after every view check
// 9. ngOnDestroy()          — cleanup: unsubscribe, clear timers (runs ONCE)

export class MyComponent implements OnInit, OnDestroy {
  private sub!: Subscription

  ngOnInit() {
    this.sub = this.service.data$.subscribe(d => this.data = d)
  }

  ngOnDestroy() {
    this.sub.unsubscribe()  // prevent memory leak
  }
}`,
    },
    {
      concept: 'SPA vs PWA',
      explanation: `<p class="font-semibold text-gray-800 mb-1">SPA — Single Page Application</p><p class="mb-3 text-gray-600">Loads once, navigates by <strong>swapping components</strong> without full page reloads. Faster navigation after initial load. Angular, React, and Vue are SPA frameworks.</p><p class="font-semibold text-gray-800 mb-1">PWA — Progressive Web App</p><p class="text-gray-600">SPA + <strong>service worker</strong> + <strong>web manifest</strong> = offline support, installable on the home screen, push notifications. Every PWA is an SPA — but not every SPA is a PWA. Add with <code>ng add @angular/pwa</code>.</p>`,
      code: `// PWA additions over a plain SPA:
// 1. web app manifest
{
  "name": "MyApp",
  "start_url": "/",
  "display": "standalone",
  "icons": [...]
}

// 2. Service Worker — intercepts network requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request) || fetch(event.request)
  )
})

// Angular: ng add @angular/pwa  — adds both automatically`,
    },
    {
      concept: 'Data Binding Types',
      explanation: `<p class="font-semibold text-gray-800 mb-1">One-Way — Component → DOM</p><p class="mb-3 text-gray-600"><strong>Interpolation <code>{{ }}</code></strong>: outputs text. <strong>Property binding <code>[prop]</code></strong>: binds any value — expressions, objects, booleans. Use <code>[disabled]="isLoading"</code> not <code>disabled="{{ isLoading }}"</code>.</p><p class="font-semibold text-gray-800 mb-1">One-Way — DOM → Component</p><p class="mb-3 text-gray-600"><strong>Event binding <code>(event)</code></strong>: calls a component method when a DOM event fires. Passes <code>$event</code> with the native event object.</p><p class="font-semibold text-gray-800 mb-1">Two-Way — <code>[(ngModel)]</code></p><p class="text-gray-600">Combines <code>[ngModel]</code> and <code>(ngModelChange)</code> — both directions simultaneously. Sugar syntax: <code>[(x)]</code> is short for <code>[x]="val" (xChange)="val = $event"</code>.</p>`,
      code: `<!-- Interpolation — string output only -->
<h1>{{ title }}</h1>

<!-- Property binding — any value, evaluated as expression -->
<img [src]="imageUrl">
<button [disabled]="isLoading">

<!-- Event binding — DOM to component -->
<button (click)="onSave($event)">Save</button>

<!-- Two-way — combines [value] and (valueChange) -->
<input [(ngModel)]="username">
<!-- equivalent to: -->
<input [ngModel]="username" (ngModelChange)="username = $event">`,
    },
    {
      concept: 'Component Communication',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Parent ↔ Child</p><p class="mb-3 text-gray-600"><strong>@Input</strong>: parent pushes data down. <strong>@Output + EventEmitter</strong>: child emits events up. <strong>ViewChild / ContentChild</strong>: parent gets a direct reference to a child component or DOM element.</p><p class="font-semibold text-gray-800 mb-1">Sibling / Cross-Component</p><p class="text-gray-600"><strong>Shared service with BehaviorSubject</strong>: any component can read/write — use for feature-level state. <strong>NgRx / signals store</strong>: large-scale shared state with time-travel debugging, selectors, and effects.</p>`,
      code: `// Parent → Child: @Input
@Input() user!: User

// Child → Parent: @Output
@Output() delete = new EventEmitter<number>()
this.delete.emit(this.user.id)

// Any → Any: shared service
@Injectable({ providedIn: 'root' })
class UserStore {
  private user$ = new BehaviorSubject<User | null>(null)
  currentUser$ = this.user$.asObservable()
  setUser(u: User) { this.user$.next(u) }
}`,
    },
    {
      concept: 'Pipes — Pure vs Impure',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Pure Pipes (default)</p><p class="mb-3 text-gray-600">Only re-run when the <strong>input reference changes</strong> — effectively memoized. Angular skips the pipe if the same reference is passed again. Always prefer pure pipes for data transformations in templates.</p><p class="font-semibold text-gray-800 mb-1">Impure Pipes</p><p class="text-gray-600">Run on <strong>every change detection cycle</strong> — expensive. Use only when you must react to internal object mutations (e.g., a mutable array that changes in place). Set <code>pure: false</code> explicitly and document why.</p>`,
      code: `// Pure pipe — only runs when 'items' reference changes
@Pipe({ name: 'activeFilter', pure: true })
export class ActiveFilterPipe implements PipeTransform {
  transform(items: Item[]) { return items.filter(i => i.active) }
}

// Impure pipe — runs every CD cycle (avoid unless necessary)
@Pipe({ name: 'asyncStatus', pure: false })
export class AsyncStatusPipe implements PipeTransform {
  transform(promise: Promise<any>) { /* ... */ }
}

// Template — pure pipe caches the result
{{ items | activeFilter }}`,
    },
    {
      concept: 'Directives — Three Types',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Component Directive</p><p class="mb-2 text-gray-600">A directive <strong>with a template</strong>. The most common type — every <code>@Component</code> is technically a directive.</p><p class="font-semibold text-gray-800 mb-1">Structural Directive</p><p class="mb-2 text-gray-600"><strong>Adds or removes DOM nodes</strong>. <code>*ngIf</code>, <code>*ngFor</code>, <code>*ngSwitch</code>. The asterisk is sugar for <code>&lt;ng-template&gt;</code>.</p><p class="font-semibold text-gray-800 mb-1">Attribute Directive</p><p class="text-gray-600"><strong>Modifies appearance or behaviour</strong> without changing the DOM structure. <code>[ngClass]</code>, <code>[ngStyle]</code>, and custom directives like <code>[appHighlight]</code>.</p>`,
      code: `// Structural directive — creates/destroys DOM
<div *ngIf="isLoggedIn">Dashboard</div>
<!-- Sugar for: -->
<ng-template [ngIf]="isLoggedIn"><div>Dashboard</div></ng-template>

// Attribute directive — modifies existing element
@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {
  @HostListener('mouseenter') onEnter() {
    this.el.nativeElement.style.background = 'yellow'
  }
  constructor(private el: ElementRef) {}
}`,
    },
    {
      concept: 'Signals & Computed Signals (Angular 16+)',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Signals</p><p class="mb-3 text-gray-600">Reactive primitives — a signal <strong>holds a value</strong> and automatically notifies any consumers when it changes. Read with <code>count()</code>, write with <code>count.set(n)</code> or <code>count.update(fn)</code>.</p><p class="font-semibold text-gray-800 mb-1">Computed & Effect</p><p class="text-gray-600"><strong>Computed signals</strong> derive values from other signals and are <strong>memoized</strong> — they only recompute when their dependencies change. <strong>Effects</strong> run side-effects when dependencies change. Together they enable fine-grained reactivity <strong>without Zone.js</strong>.</p>`,
      code: `import { signal, computed, effect } from '@angular/core'

// Signal — writable reactive value
const count = signal(0)
count.set(1)
count.update(c => c + 1)
console.log(count())  // read by calling as function

// Computed — derived, memoized
const double = computed(() => count() * 2)

// Effect — runs when dependencies change
effect(() => console.log('count is', count()))

// In template — no async pipe needed
{{ count() }}
{{ double() }}`,
    },
    {
      concept: 'Standalone Components & Deferrable Views',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Standalone Components</p><p class="mb-3 text-gray-600">Components without <code>NgModule</code> — declare imports directly in <code>@Component({ imports: [] })</code>. Simpler architecture, easier lazy-loading. The Angular team's recommended approach for new code. Avoid mid-migration in large codebases — the mix of module + standalone can be confusing.</p><p class="font-semibold text-gray-800 mb-1">Deferrable Views (@defer)</p><p class="text-gray-600">Lazy-load template blocks on a <strong>trigger</strong>: <code>on viewport</code>, <code>on interaction</code>, or <code>on idle</code>. The component's JS chunk is only downloaded when the trigger fires. Pair with <code>@loading</code> and <code>@placeholder</code> for smooth UX.</p>`,
      code: `// Standalone component — no module needed
@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, UserCardComponent],
  template: '<user-card [user]="user" />'
})
export class ProfilePage {}

// Deferrable views — lazy-load heavy content
@defer (on viewport) {
  <heavy-chart [data]="chartData" />
} @loading {
  <spinner />
} @placeholder {
  <div class="chart-placeholder"></div>
}`,
    },
    {
      concept: 'ng-deep, Style Encapsulation & Typed Forms',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Style Encapsulation</p><p class="mb-3 text-gray-600">Angular uses <strong>ViewEncapsulation.Emulated</strong> by default — styles are scoped by adding unique attribute selectors. <code>::ng-deep</code> pierces encapsulation to style child or third-party components. Use sparingly and only inside <code>:host</code> to limit blast radius.</p><p class="font-semibold text-gray-800 mb-1">Typed Reactive Forms (Angular 14+)</p><p class="text-gray-600"><code>FormControl&lt;string&gt;</code>, <code>FormGroup</code> — fully typed. <code>.value</code> is no longer <code>any</code>. Use <code>nonNullable: true</code> to strip null from the type. Catches form field mismatches at compile time.</p>`,
      code: `// ng-deep — use only for 3rd party component styling
:host ::ng-deep .mat-button { color: red; }

// ViewEncapsulation options
@Component({ encapsulation: ViewEncapsulation.None })  // global styles
@Component({ encapsulation: ViewEncapsulation.ShadowDom }) // true shadow DOM

// Typed Reactive Form (Angular 14+)
const form = new FormGroup({
  name:  new FormControl('', { nonNullable: true }),
  email: new FormControl<string>(''),
})
form.value.name   // type: string (not string | null | undefined)`,
    },
  ],
  spokenAnswer: {
    question: 'What are Angular Signals and how do they change the reactivity model?',
    answer: `Signals are Angular's answer to fine-grained reactivity. Before signals, Angular relied on Zone.js — a library that monkey-patches all async APIs and triggers change detection across the whole component tree after any async event. It works but it's a blunt instrument. Signals give you a precise reactivity model: a signal holds a value, and any template or computed function that reads from it is automatically subscribed. When the signal changes, only the things that read it are updated — not the whole tree. Computed signals derive a value from other signals and are memoized — they only recompute when their dependencies change. Effects let you run side effects when signal values change. The big architectural implication is that with signals you can eventually opt out of Zone.js entirely, giving you faster and more predictable change detection. In practice I use signals for component-level state where I want precise updates — counters, toggles, form state — while keeping Observables for streams of async events where the full RxJS operator set is valuable.`,
    followUp: `How do signals compare to RxJS Observables — when would you pick one over the other?`,
  },
  traps: [
    {
      trap: 'Using ng-deep broadly to override component styles',
      correction: 'ng-deep is deprecated and pierces ViewEncapsulation globally — your "scoped" style leaks to all instances of the child component across the app. For third-party components, use ViewEncapsulation.None on a wrapper component or target the documented CSS custom properties the library exposes.',
    },
    {
      trap: 'Using impure pipes for data that rarely changes',
      correction: 'Impure pipes run on every change detection cycle — potentially thousands of times per second during scroll or animation. Use pure pipes (the default) and pass a new array/object reference when the data changes instead of mutating in place.',
    },
    {
      trap: 'Not understanding the difference between Can Activate and Can Match guards',
      correction: 'CanActivate runs after the route is matched — the lazy-loaded module is already loaded. CanMatch runs before matching — if it returns false, Angular tries the next matching route and the lazy module is never loaded. Use CanMatch for role-based routing to avoid loading feature code the user has no access to.',
    },
  ],
  quiz: [
    {
      id: 1,
      question: 'What is the difference between CanActivate and CanMatch route guards?',
      options: [
        'They are identical — both prevent navigation',
        'CanActivate runs before lazy loading; CanMatch runs after',
        'CanMatch prevents the route from matching at all (lazy module never loads); CanActivate blocks activation after the route is matched',
        'CanMatch only works with standalone components',
      ],
      correct: 2,
      explanation: 'CanMatch runs during route matching — if it returns false, Angular skips that route entirely and tries the next. The lazy module is never downloaded. CanActivate runs after matching when the module is already loaded.',
    },
    {
      id: 2,
      question: 'An impure pipe transforms a list. It runs on every change detection cycle. What is the performance risk?',
      options: [
        'None — Angular optimises pipe execution automatically',
        'It can run hundreds of times per second during scroll or animation, making it a performance bottleneck',
        'Impure pipes only run once per second maximum',
        'The risk is only in development mode',
      ],
      correct: 1,
      explanation: 'Angular triggers change detection after every async event — clicks, timers, HTTP. An impure pipe runs every time CD runs. A pure pipe runs only when its input reference changes. Use pure pipes and immutable data patterns.',
    },
    {
      id: 3,
      question: 'In Angular Signals, how do you read a signal\'s current value?',
      options: [
        'signal.value',
        'signal.get()',
        'signal() — call it as a function',
        'await signal',
      ],
      correct: 2,
      explanation: 'Signals are functions — you call them with () to read the current value. This allows Angular\'s reactivity system to track which signals a template or computed function depends on.',
    },
  ],
  relatedTutorialId: 'rxjs',
}
