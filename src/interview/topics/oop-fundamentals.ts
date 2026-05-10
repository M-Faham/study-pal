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
      explanation: 'Procedural: code is a sequence of functions operating on shared data. OOP: data and behaviour are bundled into objects. OOP models real-world entities and enables reuse through inheritance and composition.',
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
      explanation: 'Encapsulation: hide internal state behind a public API. Abstraction: expose only what callers need. Inheritance: extend a base class to reuse behaviour. Polymorphism: different classes respond to the same interface differently.',
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
      explanation: '"Favour composition over inheritance." Inheritance creates tight coupling — child knows about parent\'s internals. Composition assembles behaviour from small independent pieces, making it easier to swap, test, and reuse.',
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
      explanation: 'Override: subclass provides its own implementation of a parent method (runtime polymorphism). Overload: multiple methods with the same name but different parameter signatures (compile-time). TypeScript supports overloads via declaration signatures.',
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
      explanation: 'public (default): accessible everywhere. protected: accessible within the class and subclasses. private: accessible only within the class. Interface: pure contract — no implementation, no runtime cost. Class: contract + implementation + instantiable.',
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
