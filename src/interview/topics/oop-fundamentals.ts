import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: 'oop-fundamentals',
  title: 'OOP Fundamentals',
  icon: '🧬',
  difficulty: 'Core',
  targets: ['General', 'TypeScript'],
  keyPoints: [
    '4 pillars: Encapsulation, Abstraction, Inheritance, Polymorphism',
    'Composition = assemble from small pieces; Inheritance = is-a relationship',
    'Favour composition — avoids fragile base class problem',
    'Override = runtime (subclass replaces method); Overload = compile-time (same name, different params)',
    'Default to private, expose via public API',
  ],
  cheatSheet: [
    {
      concept: 'OOP vs Procedural',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Procedural</p><p class="mb-3 text-gray-600">Code is a sequence of <strong>functions operating on shared data</strong>. Simple and direct for scripts and small utilities, but state is spread across the codebase and hard to control as it grows.</p><p class="font-semibold text-gray-800 mb-1">OOP</p><p class="text-gray-600"><strong>Data and behaviour are bundled into objects</strong>. Objects model real-world entities with clear ownership of their state. Enables reuse through inheritance and composition, and makes large codebases easier to reason about.</p>`,
      code: `// Procedural — functions + shared data
function getArea(width, height) { return width * height }
function getPerimeter(width, height) { return 2 * (width + height) }

// OOP — data + behaviour together
class Rectangle {
  constructor(public width: number, public height: number) {}
  getArea()      { return this.width * this.height }
  getPerimeter() { return 2 * (this.width + this.height) }
}`,
    },
    {
      concept: 'The Four Pillars',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Encapsulation</p><p class="mb-2 text-gray-600">Hide internal state behind a <strong>public API</strong>. Callers can't accidentally corrupt private data.</p><p class="font-semibold text-gray-800 mb-1">Abstraction</p><p class="mb-2 text-gray-600">Expose only what callers <em>need</em> — hide the implementation details. Callers depend on the interface, not the internals.</p><p class="font-semibold text-gray-800 mb-1">Inheritance</p><p class="mb-2 text-gray-600">Extend a base class to <strong>reuse behaviour</strong>. Use for genuine "is-a" relationships — a <code>Dog</code> is an <code>Animal</code>.</p><p class="font-semibold text-gray-800 mb-1">Polymorphism</p><p class="text-gray-600">Different classes respond to the <strong>same interface</strong> differently. A function that accepts a <code>Shape</code> works for <code>Circle</code>, <code>Rect</code>, or any other subclass.</p>`,
      code: `// Encapsulation — private state, public API
class BankAccount {
  private balance = 0
  deposit(amount: number) { this.balance += amount }
  getBalance() { return this.balance }
}

// Polymorphism — same method name, different behaviour
abstract class Shape { abstract area(): number }
class Circle extends Shape { area() { return Math.PI * this.r ** 2 } }
class Rect   extends Shape { area() { return this.w * this.h } }

function printArea(s: Shape) { console.log(s.area()) }  // works for any Shape`,
    },
    {
      concept: 'Composition vs Inheritance',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Inheritance — tight coupling</p><p class="mb-3 text-gray-600">Child classes depend on parent internals. Changing the parent can silently break all children — the <strong>fragile base class problem</strong>. Best for genuine "is-a" type hierarchies.</p><p class="font-semibold text-gray-800 mb-1">Composition — flexible & testable</p><p class="text-gray-600">Assemble behaviour from <strong>small independent pieces</strong>. Each piece can be swapped, mocked in tests, and reused in completely different contexts. The rule: if you're inheriting to <em>reuse</em> rather than to model a type relationship, use composition instead.</p>`,
      code: `// Inheritance — tight coupling
class Animal { breathe() {} }
class Bird extends Animal { fly() {} }
class Duck extends Bird { quack() {} }  // fragile — changing Animal breaks Duck

// Composition — loose coupling
const canFly   = { fly:   () => console.log('flying') }
const canQuack = { quack: () => console.log('quack') }
const canBreathe = { breathe: () => {} }

const duck = { ...canBreathe, ...canFly, ...canQuack }`,
    },
    {
      concept: 'Override vs Overload',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Override — Runtime Polymorphism</p><p class="mb-3 text-gray-600">A subclass provides its <strong>own implementation</strong> of a parent method with the exact same signature. At runtime, the subclass version is called. TypeScript enforces this with the <code>override</code> keyword.</p><p class="font-semibold text-gray-800 mb-1">Overload — Compile-Time</p><p class="text-gray-600">Multiple method signatures for the <strong>same name</strong> with different parameter types or counts. TypeScript supports overloads via declaration signatures above the implementation. The compiler picks the matching signature at the call site.</p>`,
      code: `// Override — same signature, different body
class Logger { log(msg: string) { console.log(msg) } }
class FileLogger extends Logger {
  override log(msg: string) { writeToFile(msg) }  // replaces parent
}

// Overload — TypeScript declaration overloads
function parse(input: string): number
function parse(input: number): string
function parse(input: string | number): string | number {
  return typeof input === 'string' ? parseInt(input) : input.toString()
}`,
    },
    {
      concept: 'Access Modifiers & Interface vs Class',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Access Modifiers</p><p class="mb-3 text-gray-600"><strong><code>public</code></strong> (default): accessible everywhere. <strong><code>protected</code></strong>: accessible within the class and subclasses only. <strong><code>private</code></strong>: accessible only within the declaring class. Default to <code>private</code> and expose only what's needed.</p><p class="font-semibold text-gray-800 mb-1">Interface vs Class</p><p class="text-gray-600"><strong>Interface</strong>: pure contract — no implementation, zero runtime cost, only exists at compile time. <strong>Class</strong>: contract + implementation + instantiable. Use an interface when you want to define a shape that multiple classes can implement without sharing code.</p>`,
      code: `interface Serializable {
  serialize(): string   // contract only — no code
}

class User implements Serializable {
  public  name: string
  protected id: number
  private password: string

  constructor(name: string, id: number, pw: string) {
    this.name = name; this.id = id; this.password = pw
  }

  serialize() { return JSON.stringify({ name: this.name, id: this.id }) }
}`,
    },
  ],
  spokenAnswer: {
    question: 'When would you choose composition over inheritance?',
    answer: `I default to composition. Inheritance works well for true "is-a" relationships — a Dog is an Animal — but in practice most code relationships are "has-a" or "can-do". If I model a user that can send emails, I don't extend an EmailSender class — I inject an EmailService. The practical problem with inheritance is the fragile base class problem: changing a parent class can unexpectedly break all its children, and the children often have to know too much about how the parent works internally. Composition is more flexible — I assemble behaviour from small focused pieces, I can swap them out, mock them in tests, and reuse them in completely different contexts. The rule of thumb I follow: if you're thinking of inheriting to get reuse rather than to model a genuine type hierarchy, reach for composition instead.`,
  },
  traps: [
    {
      trap: 'Overriding a method without calling super where needed',
      correction: 'If the parent constructor or method does important initialization, overriding without calling super() skips it silently. Always check if the parent\'s implementation needs to run. In Angular lifecycle hooks like ngOnInit, forgetting super.ngOnInit() in inherited components is a common source of subtle bugs.',
    },
    {
      trap: 'Making everything public for convenience',
      correction: 'Public properties expose internal state and make the class impossible to refactor without breaking callers. Default to private, expose via methods. This is Encapsulation — the first pillar of OOP.',
    },
  ],
  quiz: [
    {
      id: 1,
      question: 'What is the difference between method overriding and method overloading?',
      options: [
        'They are the same thing — both replace a method',
        'Overriding: subclass replaces a parent\'s method at runtime. Overloading: same method name with different parameter signatures at compile time',
        'Overloading is only for constructors',
        'Overriding requires the abstract keyword',
      ],
      correct: 1,
      explanation: 'Overriding is a runtime polymorphism mechanism — a subclass provides a new body for a parent method. Overloading is compile-time — the same function name accepts different parameter types or counts.',
    },
    {
      id: 2,
      question: 'Why is "favour composition over inheritance" a best practice?',
      options: [
        'Inheritance is not supported in TypeScript',
        'Composition has better runtime performance',
        'Inheritance creates tight coupling — changes to a parent class break all children. Composition assembles flexible, swappable pieces',
        'Composition uses less memory',
      ],
      correct: 2,
      explanation: 'The fragile base class problem: inheriting classes often depend on parent implementation details. Changing the parent can silently break children. Composition keeps pieces independent and swappable.',
    },
  ],
}
