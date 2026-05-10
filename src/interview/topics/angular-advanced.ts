import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: 'angular-advanced',
  title: 'Angular — Advanced Concepts',
  icon: '🅰️',
  difficulty: 'Tricky',
  targets: ['Angular'],
  keyPoints: [
    'Change detection: Default checks whole tree; OnPush checks only on input change or async event',
    'Zone.js monkey-patches async APIs to trigger CD',
    'Signals give fine-grained reactivity without Zone.js',
    'CanActivate runs after match; CanMatch prevents route matching entirely',
    'Lazy loading: loadChildren/loadComponent splits bundle, loaded on demand',
  ],
  cheatSheet: [
    {
      concept: 'SPA vs PWA',
      explanation: 'SPA (Single Page Application): loads once, navigates by swapping components — no full page reload. PWA (Progressive Web App): SPA + service worker + manifest = offline support, installable, push notifications. Every PWA is an SPA; not every SPA is a PWA.',
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
      explanation: 'Interpolation {{ }}: component → DOM (one-way, text). Property binding [prop]: component → DOM (one-way, any value). Event binding (event): DOM → component (one-way, events). Two-way [(ngModel)]: both directions simultaneously.',
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
      explanation: '@Input/@Output: parent↔child. ViewChild/ContentChild: parent→child DOM access. Shared service with BehaviorSubject: sibling/any components. NgRx/state management: large-scale shared state.',
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
      explanation: 'Pure pipes (default): run only when the input reference changes — memoized. Impure pipes: run on every change detection cycle — expensive. Use impure only when you must react to internal object mutations.',
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
      explanation: 'Component: directive with a template (most common). Structural: change DOM structure (*ngIf, *ngFor, *ngSwitch — asterisk is syntactic sugar for <ng-template>). Attribute: change appearance/behaviour without adding/removing elements ([ngClass], [ngStyle], custom).',
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
      explanation: 'Signals are reactive primitives — a signal holds a value and notifies any consumers when it changes. Computed signals derive values from other signals and are memoized. Together they enable fine-grained reactivity without Zone.js.',
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
      explanation: 'Standalone: components without NgModule — declare imports directly in @Component. Simplifies architecture. When NOT to use: in large existing codebases mid-migration, or when you need module-level providers. Deferrable views (@defer): lazy-load template blocks on interaction, viewport entry, or idle.',
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
      explanation: 'Angular components have ViewEncapsulation.Emulated by default — styles are scoped with attribute selectors. ng-deep pierces encapsulation (deprecated, use ::ng-deep sparingly). Typed Reactive Forms (Angular 14+): FormControl<string>, FormGroup — fully typed, no more .value as any.',
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
