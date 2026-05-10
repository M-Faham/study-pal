import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: 'angular-change-detection',
  title: 'Angular — ChangeDetectorRef & Zoneless',
  icon: '🔄',
  difficulty: 'Architecture',
  targets: ['Angular'],
  keyPoints: [
    'ChangeDetectorRef.markForCheck() marks OnPush component and ancestors dirty — checked on next cycle',
    'ChangeDetectorRef.detach() completely removes a component from the CD tree until reattach()',
    'detectChanges() runs CD synchronously on the component subtree — useful inside setTimeout/Worker',
    'Zoneless Angular (provideZonelessChangeDetection) relies on Signals/markForCheck only — no Zone.js overhead',
    'async pipe calls markForCheck automatically — prefer it over manual subscriptions',
  ],
  cheatSheet: [
    {
      concept: 'markForCheck() vs detectChanges()',
      explanation: 'markForCheck() schedules the component for the next Zone.js-triggered cycle — asynchronous. detectChanges() runs synchronously right now. Use detectChanges() when you\'re outside Zone.js (Web Worker, third-party callback).',
      code: `constructor(private cdr: ChangeDetectorRef) {}

ngOnInit() {
  externalLib.onEvent(() => {
    this.data = transform()
    this.cdr.detectChanges() // sync, outside Zone
  })
}`,
    },
    {
      concept: 'detach() / reattach()',
      explanation: 'detach() cuts the component from the CD tree entirely. Useful for heavy list items that only need updates on explicit user action. Call reattach() + markForCheck() when the component needs to refresh.',
      code: `ngOnInit() {
  this.cdr.detach() // stop automatic checks
}

refresh() {
  this.cdr.reattach()
  this.cdr.markForCheck()
}`,
    },
    {
      concept: 'Zoneless Angular (Angular 18+)',
      explanation: 'Replace Zone.js with provideZonelessChangeDetection(). CD is now triggered only by Signals, markForCheck(), or async pipe. Results in smaller bundle and deterministic rendering.',
      code: `// main.ts
bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection()]
})

// component — must use signals or markForCheck
count = signal(0)
increment() { this.count.update(c => c + 1) }`,
    },
    {
      concept: 'inject() function (Angular 14+)',
      explanation: 'inject() can be called in any injection context — constructor, field initializer, or standalone function. Replaces constructor injection for cleaner code and enables composable utilities.',
      code: `// composable utility
function useRouter() {
  return inject(Router)
}

@Component({...})
export class MyComponent {
  private router = inject(Router)      // field injection
  private http    = inject(HttpClient)
}`,
    },
    {
      concept: 'InjectionToken',
      explanation: 'Use InjectionToken to provide non-class values (strings, configs, primitives) through DI. Avoids "magic string" injection and stays type-safe.',
      code: `export const API_URL = new InjectionToken<string>('API_URL')

// providers
{ provide: API_URL, useValue: 'https://api.example.com' }

// consumer
private apiUrl = inject(API_URL)`,
    },
    {
      concept: 'Nested Injectors',
      explanation: 'Angular has a hierarchy: platform → root → module → component. A component with providers:[] creates a child injector. inject() walks up the tree until it finds a provider — or throws.',
      code: `@Component({
  providers: [UserService] // new instance for this subtree
})
export class AdminPanelComponent {
  private users = inject(UserService) // isolated instance
}`,
    },
  ],
  spokenAnswer: {
    question: 'How does Angular change detection work, and how would you optimise a component that\'s re-rendering too often?',
    answer: 'Angular\'s default strategy walks every component on every async event. I\'d switch to OnPush so the component only checks on @Input reference changes or events fired within it. If that\'s still not enough — for example a chart receiving constant data — I\'d use ChangeDetectorRef.detach() to remove it from the tree entirely and call detectChanges() only when I have a new data point to render. For modern Angular I\'d migrate the component to Signals, which gives fine-grained reactivity without Zone.js at all.',
    followUp: 'What\'s the difference between markForCheck() and detectChanges(), and when would you reach for each?',
  },
  traps: [
    {
      trap: 'markForCheck() immediately updates the DOM',
      correction: 'markForCheck() only schedules the component for the next CD cycle — detectChanges() is the synchronous version',
    },
    {
      trap: 'detach() means the component never updates',
      correction: 'detach() stops automatic checks; you can still call detectChanges() or reattach() + markForCheck() manually',
    },
    {
      trap: 'Zoneless Angular removes the need for markForCheck()',
      correction: 'Zoneless removes Zone.js triggers; you still need Signals, async pipe, or markForCheck() to schedule updates',
    },
  ],
  quiz: [
    {
      id: 1,
      question: 'You have an OnPush component receiving live WebSocket data via a raw callback (no RxJS, no Zone.js). The view never updates. What is the minimal fix?',
      options: [
        'Switch to Default change detection',
        'Call ChangeDetectorRef.detectChanges() inside the callback',
        'Wrap the callback in NgZone.run()',
        'Both B and C are valid fixes',
      ],
      correct: 3,
      explanation: 'Both work. NgZone.run() re-enters Zone.js so Angular triggers a CD cycle automatically. detectChanges() manually runs CD synchronously on the component. B is more targeted; C is simpler if you want the whole app to react.',
    },
    {
      id: 2,
      question: 'Which is the correct way to provide an API base URL string through Angular DI?',
      options: [
        'provide: String, useValue: url',
        'provide: "API_URL", useValue: url',
        'provide: new InjectionToken("API_URL"), useValue: url',
        'You cannot inject primitive values in Angular',
      ],
      correct: 2,
      explanation: 'InjectionToken creates a unique, type-safe DI token for non-class values. String literals as tokens work technically but cause collisions and are not type-safe.',
    },
    {
      id: 3,
      question: 'What does provideZonelessChangeDetection() do?',
      options: [
        'Removes Signals support from the application',
        'Eliminates Zone.js and requires Signals or explicit markForCheck() to trigger updates',
        'Automatically detaches all components from the CD tree',
        'Enables the Default CD strategy globally',
      ],
      correct: 1,
      explanation: 'Zoneless mode removes Zone.js entirely. Angular only updates the view when a Signal changes, an async pipe emits, or markForCheck()/detectChanges() is called explicitly.',
    },
  ],
}
