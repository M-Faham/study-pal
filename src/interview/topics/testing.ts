import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: "testing",
  title: "Testing",
  icon: "🧪",
  difficulty: "Core",
  targets: ['Angular', 'React', 'General'],
  keyPoints: [
    'Unit tests: fast, isolated, mock dependencies',
    'Integration tests: real interactions between units, no mocks at boundaries',
    'E2E tests: full user flow through the browser — slowest, highest confidence',
    'Test behaviour not implementation — tests should survive refactors',
    'AAA pattern: Arrange, Act, Assert',
  ],
  cheatSheet: [
    {
      concept: "Testing Pyramid",
      explanation:
        "Many unit tests (fast, isolated), fewer integration tests (test collaboration), even fewer E2E tests (slow, brittle). Invert the pyramid and you get a slow, fragile test suite.",
      code: `// Unit — test pure functions and isolated components
expect(formatCurrency(1000, 'USD')).toBe('$1,000.00')

// Integration — test a component with real dependencies
render(<UserForm onSubmit={mockSubmit} />)
await userEvent.type(screen.getByLabelText('Email'), 'test@test.com')
await userEvent.click(screen.getByRole('button', { name: /submit/i }))
expect(mockSubmit).toHaveBeenCalledWith({ email: 'test@test.com' })

// E2E — test the full user journey in a real browser (Cypress / Playwright)
cy.visit('/login')
cy.get('[data-cy=email]').type('user@example.com')
cy.get('[data-cy=submit]').click()
cy.url().should('include', '/dashboard')`,
    },
    {
      concept: "Angular Testing — TestBed",
      explanation:
        "TestBed creates a mini Angular module for each test. Provide real or mock dependencies. Use ComponentFixture to interact with the component and trigger change detection.",
      code: `describe('UserCardComponent', () => {
  let fixture: ComponentFixture<UserCardComponent>
  let component: UserCardComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserCardComponent],
      providers: [
        { provide: UserService, useValue: { getUser: () => of(mockUser) } }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(UserCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()  // trigger ngOnInit
  })

  it('displays user name', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toBe('Alice')
  })
})`,
    },
    {
      concept: "Mocking vs Real Dependencies",
      explanation:
        "Mock external dependencies (HTTP, databases) but use real implementations for the unit under test. Over-mocking tests that the mock works, not that your code works.",
      code: `// ✅ Mock HttpClient — test the service logic, not HTTP
const httpMock = TestBed.inject(HttpTestingController)
service.getUser(1).subscribe(user => expect(user.name).toBe('Alice'))
const req = httpMock.expectOne('/api/users/1')
req.flush({ name: 'Alice' })

// ❌ Mocking the service under test — you're testing the mock
const userService = { getUser: jest.fn().mockReturnValue(of(mockUser)) }
// This test passes even if UserService has a bug`,
    },
    {
      concept: "Test What the User Sees, Not Implementation Details",
      explanation:
        "Query by role, label, and visible text — not by CSS class or component instance properties. Tests coupled to implementation break on refactors that don't change behaviour.",
      code: `// ❌ Testing implementation details
expect(component.isLoading).toBe(false)
expect(fixture.debugElement.query(By.css('.spinner')).nativeElement)

// ✅ Testing user-visible behaviour
expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
expect(screen.getByText('Alice Johnson')).toBeInTheDocument()`,
    },
  ],
  spokenAnswer: {
    question: "How do you approach testing in a frontend application?",
    answer: `I follow the testing pyramid: lots of fast unit tests for pure functions and isolated components, a smaller number of integration tests that test components with their real dependencies collaborating, and a handful of E2E tests for the most critical user journeys. For unit and integration tests I use Jest in React projects and Jasmine with TestBed in Angular. I try to test what the user would actually see and do — querying by role and label text rather than CSS classes or component properties — because tests that are coupled to implementation details break every time you refactor, even if the behaviour is unchanged. For E2E I use Cypress or Playwright and I'm selective — covering the login flow, the checkout flow, and any other flow where a regression would be catastrophic. I don't aim for 100% coverage because coverage can be gamed — I aim for tests that would catch real bugs. The question I ask for every test is: would this test fail if I introduced the kind of bug a user would actually notice?`,
  },
  traps: [
    {
      trap: "Testing implementation details (class properties, private methods)",
      correction:
        "Tests that access component.somePrivateFlag or query by CSS class break on every refactor — even when behaviour is unchanged. Test what a user sees: text content, aria roles, and events. Implementation can change freely as long as the behaviour is correct.",
    },
    {
      trap: "100% code coverage as a goal",
      correction:
        "Coverage measures which lines were executed — not whether the tests assert anything meaningful. A test that calls every function but asserts nothing has 100% coverage and zero value. Aim for tests that would catch real regressions.",
    },
  ],
  quiz: [
    {
      id: 1,
      question:
        "Why should you query DOM elements by role and label rather than CSS class in tests?",
      options: [
        "CSS class queries are slower",
        "Role and label queries test user-visible behaviour — CSS class queries break on styling refactors that don't change behaviour",
        "CSS classes are not accessible in test environments",
        "Jest does not support CSS selectors",
      ],
      correct: 1,
      explanation:
        'A test that queries by .submit-btn breaks if you rename the class. A test that queries by role="button" and name="Submit" only breaks if the user-visible button actually changes — which is when you want it to break.',
    },
    {
      id: 2,
      question: "What is the testing pyramid and why does it matter?",
      options: [
        "A tool for measuring test coverage percentage",
        "Many fast unit tests, fewer integration tests, even fewer slow E2E tests — provides fast feedback with broad coverage",
        "A method for organising test files in folders",
        "An Angular testing utility for creating component hierarchies",
      ],
      correct: 1,
      explanation:
        "The pyramid guides the ratio of test types. Unit tests are fast and isolated — run them frequently. E2E tests are slow and brittle — run them on critical paths only. Inverting the pyramid gives a slow, fragile suite that gives late, unreliable feedback.",
    },
  ],
}
