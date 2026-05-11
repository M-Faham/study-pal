import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: 'design-patterns',
  title: 'Design Patterns & SOLID',
  icon: '🏛️',
  difficulty: 'Architecture',
  targets: ['General', 'Angular', 'TypeScript'],
  keyPoints: [
    'SOLID: Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion',
    'Singleton: one instance — prefer DI over manual singletons',
    'Observer: subject notifies observers on state change — foundation of RxJS',
    'MVVM: View binds to ViewModel observables — Angular + React follow this',
    'DI: depend on abstractions, inject concretions from outside',
  ],
  cheatSheet: [
    {
      concept: 'SOLID Principles',
      explanation: `<p class="font-semibold text-gray-800 mb-1">S — Single Responsibility</p><p class="mb-2 text-gray-600">A class should have <strong>one reason to change</strong>. If it handles data fetching, business logic, <em>and</em> formatting — that's three reasons.</p><p class="font-semibold text-gray-800 mb-1">O — Open/Closed</p><p class="mb-2 text-gray-600"><strong>Open for extension, closed for modification</strong>. Add new behaviour via new classes or abstractions — don't modify existing tested code.</p><p class="font-semibold text-gray-800 mb-1">L — Liskov Substitution</p><p class="mb-2 text-gray-600">Subtypes must be <strong>substitutable for their base type</strong> without breaking the caller. If your subclass throws exceptions the parent doesn't, it violates LSP.</p><p class="font-semibold text-gray-800 mb-1">I — Interface Segregation</p><p class="mb-2 text-gray-600">No client should be forced to depend on methods it <strong>doesn't use</strong>. Split fat interfaces into focused ones.</p><p class="font-semibold text-gray-800 mb-1">D — Dependency Inversion</p><p class="text-gray-600"><strong>Depend on abstractions, not concretions</strong>. High-level modules shouldn't know about concrete implementations — inject them. This is the foundation of Angular's DI system.</p>`,
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
      explanation: `<p class="font-semibold text-gray-800 mb-1">How It Works</p><p class="mb-3 text-gray-600">A <strong>subject</strong> maintains a list of dependent <strong>observers</strong> and notifies them automatically when its state changes. Observers subscribe and unsubscribe dynamically.</p><p class="font-semibold text-gray-800 mb-1">Where You See It</p><p class="text-gray-600">Foundation of <strong>RxJS Observables</strong>, Angular's <code>EventEmitter</code>, and native DOM events. Every <code>addEventListener</code> call is the Observer pattern.</p>`,
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
      explanation: `<p class="font-semibold text-gray-800 mb-1">What It Does</p><p class="mb-3 text-gray-600">Ensures a class has <strong>exactly one instance</strong> and provides a global access point to it. Useful for shared resources like config, loggers, or connection pools.</p><p class="font-semibold text-gray-800 mb-1">The Trap</p><p class="text-gray-600">Manual singletons are <strong>hard to test</strong> (can't inject a mock) and create hidden global state. In Angular, use <code>providedIn: 'root'</code> — the DI system manages the singleton for you and it stays testable.</p>`,
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
      explanation: `<p class="font-semibold text-gray-800 mb-1">MVC</p><p class="mb-2 text-gray-600">Controller handles input, updates Model, View renders Model. The View may directly observe the Model.</p><p class="font-semibold text-gray-800 mb-1">MVP</p><p class="mb-2 text-gray-600">Presenter handles all logic and <strong>actively pushes updates</strong> to a passive View. The View only updates when the Presenter tells it to.</p><p class="font-semibold text-gray-800 mb-1">MVVM — Angular & React</p><p class="text-gray-600">ViewModel exposes <strong>observable state</strong>. The View <strong>data-binds</strong> to it and updates automatically when state changes. No imperative push from the ViewModel needed.</p>`,
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
      explanation: `<p class="font-semibold text-gray-800 mb-1">The Principle</p><p class="mb-3 text-gray-600">Instead of a class <em>creating</em> its dependencies with <code>new</code>, it <strong>receives them from outside</strong> — via constructor, method, or a DI framework. The class declares what it needs; something else provides it.</p><p class="font-semibold text-gray-800 mb-1">Why It Matters</p><p class="text-gray-600">Decouples classes from concrete implementations. In tests, inject a <strong>mock</strong>. In production, inject the real service. Angular's entire DI system is built on this principle — <code>@Injectable</code> + constructor injection.</p>`,
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
    followUp: `Give me an example of a time when you refactored code from inheritance to composition. What triggered that decision?`,
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
  relatedTutorialId: 'react-best-practices',
}
