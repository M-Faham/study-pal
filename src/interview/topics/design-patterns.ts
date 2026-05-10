import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: 'design-patterns',
  title: 'Design Patterns & SOLID',
  icon: '🏛️',
  difficulty: 'Architecture',
  targets: ['General', 'Angular', 'TypeScript'],
  cheatSheet: [
    {
      concept: 'SOLID Principles',
      explanation: 'S: Single Responsibility — one reason to change. O: Open/Closed — open for extension, closed for modification. L: Liskov Substitution — subtypes must be substitutable for their base. I: Interface Segregation — no client forced to depend on methods it doesn\'t use. D: Dependency Inversion — depend on abstractions, not concretions.',
      code: `// S — Single Responsibility
class UserService  { getUser() {} }      // data
class UserRenderer { render() {} }       // display — separate concerns

// O — Open/Closed
abstract class Discount { abstract apply(price: number): number }
class PercentDiscount extends Discount { apply(p) { return p * 0.9 } }
// Add new discount types without modifying existing code

// D — Dependency Inversion
interface Logger { log(msg: string): void }
class UserService {
  constructor(private logger: Logger) {}  // depends on abstraction
}`,
    },
    {
      concept: 'Observable Pattern',
      explanation: 'An object (subject) maintains a list of dependents (observers) and notifies them when its state changes. Foundation of RxJS, Angular\'s EventEmitter, and DOM events.',
      code: `class EventEmitter<T> {
  private listeners: ((v: T) => void)[] = []

  subscribe(fn: (v: T) => void) {
    this.listeners.push(fn)
    return { unsubscribe: () => this.listeners = this.listeners.filter(l => l !== fn) }
  }

  emit(value: T) {
    this.listeners.forEach(fn => fn(value))
  }
}

const clicks = new EventEmitter<MouseEvent>()
const sub = clicks.subscribe(e => console.log(e))
sub.unsubscribe()`,
    },
    {
      concept: 'Singleton Pattern',
      explanation: 'Ensures a class has exactly one instance and provides a global access point. In Angular, providedIn: "root" services are singletons. The pattern risks tight coupling and is hard to test — prefer DI over manual singletons.',
      code: `// Manual singleton — harder to test
class Config {
  private static instance: Config
  private constructor(private data: Record<string, string>) {}

  static getInstance() {
    if (!this.instance) this.instance = new Config({ env: 'prod' })
    return this.instance
  }
}

// Angular way — let the DI system manage the singleton
@Injectable({ providedIn: 'root' })
export class ConfigService { }  // Angular guarantees one instance`,
    },
    {
      concept: 'MVC vs MVP vs MVVM',
      explanation: 'MVC: Controller handles input, updates Model, View renders Model. MVP: Presenter handles all logic, View is passive (updates only when Presenter calls it). MVVM: ViewModel exposes observable state, View binds to it via data binding — Angular and React follow MVVM.',
      code: `// MVVM in Angular
// ViewModel (component) — exposes observable state
@Component({...})
class UserComponent {
  user$ = this.store.select(selectUser)  // observable state
  save(user: User) { this.store.dispatch(saveUser({ user })) }
}

// View (template) — binds to ViewModel
// <div>{{ user$ | async | json }}</div>
// <button (click)="save(user)">Save</button>`,
    },
    {
      concept: 'Dependency Injection',
      explanation: 'Instead of creating dependencies inside a class, receive them from outside (via constructor, method, or framework). Decouples classes from their dependencies — makes code testable and modular.',
      code: `// ❌ Without DI — tightly coupled, untestable
class OrderService {
  private db = new DatabaseService()  // hardcoded dependency
}

// ✅ With DI — loosely coupled, testable
class OrderService {
  constructor(private db: DatabaseService) {}  // injected
}

// In tests — inject a mock
const mockDb = { save: jest.fn() }
const service = new OrderService(mockDb as any)

// Angular's DI system
@Injectable({ providedIn: 'root' })
class OrderService {
  constructor(private db: DatabaseService) {}  // Angular resolves this
}`,
    },
  ],
  spokenAnswer: {
    question: 'Explain the SOLID principles and give a real example of one you\'ve applied.',
    answer: `SOLID is five principles that make object-oriented code maintainable and extensible. Single Responsibility says a class should have one reason to change — if your UserService is also sending emails and generating PDFs, that's three responsibilities and three separate reasons it might need to change. Open-Closed says you should be able to add new behaviour without modifying existing code — you do this with abstractions and polymorphism rather than if-else chains. Liskov Substitution says a subclass should be usable anywhere the parent is expected without breaking the caller. Interface Segregation says don't force a class to implement methods it doesn't need — split fat interfaces into focused ones. Dependency Inversion says depend on abstractions not concrete classes — which is the foundation of Angular's dependency injection system. The one I apply most consciously is Single Responsibility — whenever I find myself writing a service that handles both data fetching and business logic and formatting, I split it. It makes testing much simpler because each class has a narrow scope.`,
  },
  traps: [
    {
      trap: 'Treating Singleton as the go-to pattern for shared state',
      correction: 'Manual singletons are hard to test (you can\'t easily inject a mock) and create hidden global state. In Angular, use providedIn: "root" and let the DI system manage the single instance. In React, use Context or a state management library.',
    },
    {
      trap: 'Violating Open/Closed with long if-else or switch chains for type-based behavior',
      correction: 'An if-else chain that switches on a type must be modified every time a new type is added — violating Open/Closed. Replace with polymorphism: define an interface, implement it per type, and the caller works with the interface.',
    },
  ],
  quiz: [
    {
      id: 1,
      question: 'Which SOLID principle does Angular\'s dependency injection system most directly implement?',
      options: ['Single Responsibility', 'Open/Closed', 'Dependency Inversion', 'Interface Segregation'],
      correct: 2,
      explanation: 'Dependency Inversion: high-level modules (components) should not depend on low-level modules (concrete services). Both should depend on abstractions. Angular\'s DI injects the concrete instance at runtime — the component declares what it needs, not how to create it.',
    },
    {
      id: 2,
      question: 'What is the key difference between MVP and MVVM?',
      options: [
        'MVP uses TypeScript; MVVM uses JavaScript',
        'MVP: Presenter actively pushes updates to a passive View. MVVM: View data-binds to ViewModel observables and updates automatically',
        'MVVM has no controller; MVP does',
        'They are the same pattern with different names',
      ],
      correct: 1,
      explanation: 'In MVP the Presenter calls View methods to update the UI explicitly. In MVVM the View binds to observable properties on the ViewModel — when the ViewModel\'s state changes, the View updates automatically via the binding mechanism. Angular\'s templates and React\'s hooks follow MVVM.',
    },
  ],
}
