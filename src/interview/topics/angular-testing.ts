import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: 'angular-testing',
  title: 'Angular Testing — TestBed & Best Practices',
  icon: '🧪',
  difficulty: 'Tricky',
  targets: ['Angular'],
  keyPoints: [
    'TestBed.configureTestingModule() creates a mini Angular module — declare components, provide services',
    'Use NO_ERRORS_SCHEMA sparingly — it hides missing imports; prefer shallow testing with stubs',
    'fakeAsync + tick() lets you control timers and microtasks synchronously in tests',
    'Spy on services with jasmine.createSpyObj or jest.fn() — never call real HTTP in unit tests',
    'ComponentHarnesses (CDK) let you interact with components via their public API, not fragile DOM queries',
  ],
  cheatSheet: [
    {
      concept: 'TestBed basics',
      explanation: 'TestBed compiles and creates a mini NgModule for the test. fixture.detectChanges() runs the first ngOnInit and triggers initial CD. Call it again after state changes.',
      code: `beforeEach(async () => {
  await TestBed.configureTestingModule({
    declarations: [MyComponent],
    providers: [
      { provide: MyService, useValue: mockService }
    ],
  }).compileComponents()

  fixture = TestBed.createComponent(MyComponent)
  component = fixture.componentInstance
  fixture.detectChanges() // triggers ngOnInit
})`,
    },
    {
      concept: 'Mocking services',
      explanation: 'Replace real services with spies to isolate the unit under test. Never hit a real API in a unit test.',
      code: `const mockUserService = jasmine.createSpyObj(
  'UserService', ['getUsers', 'deleteUser']
)
mockUserService.getUsers.and.returnValue(of([{ id: 1, name: 'Alice' }]))

// OR Jest
const mockUserService = {
  getUsers: jest.fn().mockReturnValue(of([]))
}`,
    },
    {
      concept: 'fakeAsync & tick()',
      explanation: 'fakeAsync wraps the test in a virtual time zone. tick(ms) advances the virtual clock, resolving setTimeout, setInterval, and Promises synchronously without awaiting.',
      code: `it('shows success after 1s delay', fakeAsync(() => {
  component.save()
  tick(1000)              // advance virtual clock 1s
  fixture.detectChanges()
  expect(component.saved).toBeTrue()
}))`,
    },
    {
      concept: 'Testing OnPush components',
      explanation: 'OnPush components won\'t update in tests unless you call fixture.detectChanges() after mutating an @Input. Use fixture.componentRef.setInput() (Angular 14+) to set inputs and trigger CD correctly.',
      code: `it('renders new input', () => {
  fixture.componentRef.setInput('user', { name: 'Bob' })
  fixture.detectChanges()
  expect(el.textContent).toContain('Bob')
})`,
    },
    {
      concept: 'Component Harnesses (CDK)',
      explanation: 'Harnesses provide a stable API to interact with Angular Material (and custom) components in tests — no fragile CSS selectors.',
      code: `it('clicks the submit button', async () => {
  const loader = TestbedHarnessEnvironment.loader(fixture)
  const btn = await loader.getHarness(MatButtonHarness.with({ text: 'Submit' }))
  await btn.click()
  expect(component.submitted).toBeTrue()
})`,
    },
    {
      concept: 'Routing tests',
      explanation: 'Use RouterTestingModule.withRoutes([]) for shallow routing tests. Inject Router and Location to assert navigation.',
      code: `await TestBed.configureTestingModule({
  imports: [RouterTestingModule.withRoutes(routes)],
}).compileComponents()

const router = TestBed.inject(Router)
const location = TestBed.inject(Location)

router.navigate(['/dashboard'])
tick()
expect(location.path()).toBe('/dashboard')`,
    },
  ],
  spokenAnswer: {
    question: 'How do you test an Angular component that depends on a service making HTTP calls?',
    answer: 'I configure TestBed with a mock version of the service — either a jasmine.createSpyObj or a plain object with jest.fn() methods returning Observable stubs via of(). That way the component logic is tested in isolation without any network calls. For the service itself I use HttpClientTestingModule and HttpTestingController to intercept requests and flush mock responses — that tests the service in isolation including error paths. I avoid NO_ERRORS_SCHEMA in component tests because it silently hides template errors; I\'d rather provide stub components or use shallow rendering deliberately.',
    followUp: 'How do you test a component that uses OnPush change detection?',
  },
  traps: [
    {
      trap: 'NO_ERRORS_SCHEMA is safe to use in all tests',
      correction: 'NO_ERRORS_SCHEMA ignores unknown elements and attributes, hiding real template errors — use stub components instead',
    },
    {
      trap: 'fixture.detectChanges() only needs to be called once at setup',
      correction: 'detectChanges() must be called again after any state change to flush the component\'s view',
    },
    {
      trap: 'async/await can replace fakeAsync for testing timers',
      correction: 'async/await waits for real promises but cannot control setTimeout or setInterval — only fakeAsync + tick() can advance virtual time',
    },
  ],
  quiz: [
    {
      id: 1,
      question: 'You write an Angular unit test but the template never updates after you change a component property. What is the most likely cause?',
      options: [
        'You need to import FormsModule',
        'You forgot to call fixture.detectChanges() after the change',
        'The component must use Default CD strategy in tests',
        'TestBed does not support OnPush components',
      ],
      correct: 1,
      explanation: 'fixture.detectChanges() must be called after state changes to flush the component\'s view. It does not happen automatically.',
    },
    {
      id: 2,
      question: 'Which utility lets you test code that uses setTimeout without real waiting?',
      options: [
        'async / await',
        'waitForAsync()',
        'fakeAsync() + tick()',
        'flushMicrotasks()',
      ],
      correct: 2,
      explanation: 'fakeAsync() creates a virtual time zone. tick(ms) advances it synchronously, resolving setTimeout callbacks without real delays.',
    },
    {
      id: 3,
      question: 'What is the correct way to test an Angular service that uses HttpClient?',
      options: [
        'Import HttpClientModule and let tests hit the real API',
        'Import HttpClientTestingModule and use HttpTestingController to flush mock responses',
        'Mock HttpClient with jasmine.createSpyObj',
        'Use fetch() instead of HttpClient in tests',
      ],
      correct: 1,
      explanation: 'HttpClientTestingModule replaces HttpClient with a test backend. HttpTestingController lets you verify requests were made and flush controlled responses.',
    },
  ],
}
