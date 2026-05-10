import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: 'javascript-core',
  title: 'JavaScript Core',
  icon: '⚡',
  difficulty: 'Tricky',
  targets: ['General'],
  keyPoints: [
    '== coerces types; === never coerces — always use ===',
    'var = function-scoped + hoisted; let/const = block-scoped + TDZ',
    'typeof null === "object" — historical bug, check null with === null',
    'Arrow functions capture lexical this; regular functions bind this at call site',
    'Primitives copied by value; objects/arrays copied by reference',
  ],
  cheatSheet: [
    {
      concept: 'var vs let vs const — Scope & Hoisting',
      explanation: 'var is function-scoped and hoisted with value undefined. let and const are block-scoped and in the Temporal Dead Zone (TDZ) — accessing before declaration throws ReferenceError, not undefined.',
      code: `// Hoisting
console.log(x)  // undefined (var is hoisted, initialized to undefined)
var x = 5

console.log(y)  // ReferenceError: Cannot access 'y' before initialization
let y = 5

// y = 1; var y = 2 — what happens?
y = 1        // y is hoisted to top of function scope, y = 1
var y = 2    // declaration is hoisted (already done), assignment sets y = 2
// Final: y = 2

// var can be redeclared; let/const cannot
var a = 1; var a = 2   // fine
let b = 1; let b = 2   // SyntaxError`,
    },
    {
      concept: 'Undeclared vs Undefined vs Null',
      explanation: 'Undeclared: variable was never declared — ReferenceError on access. Undefined: declared but never assigned a value. Null: explicitly set to "no value" — intentional absence.',
      code: `console.log(foo)      // ReferenceError: foo is not defined
console.log(typeof foo) // "undefined" — typeof is safe for undeclared vars

let bar               // declared, not assigned
console.log(bar)      // undefined

let baz = null        // explicitly no value
console.log(baz)      // null
console.log(typeof baz) // "object" — famous JS quirk`,
    },
    {
      concept: 'Data Types — Primitive vs Non-Primitive',
      explanation: 'Primitives are immutable and copied by value: string, number, bigint, boolean, undefined, null, symbol. Non-primitives (objects, arrays, functions) are copied by reference.',
      code: `// Primitive — copied by value
let a = 5
let b = a
b = 10
console.log(a)  // 5 — unchanged

// Non-primitive — copied by reference
let obj1 = { x: 1 }
let obj2 = obj1
obj2.x = 99
console.log(obj1.x)  // 99 — both point to the same object

// Immutability — string methods return NEW strings
let str = 'hello'
str.toUpperCase()     // returns 'HELLO' but str is still 'hello'`,
    },
    {
      concept: '== vs === and Type Coercion',
      explanation: '=== (strict equality): no type conversion — values must be same type and value. == (loose equality): converts types first (type coercion), then compares. Always use ===.',
      code: `// Type coercion surprises
2   == '2'    // true  — string '2' coerced to number
0   == false  // true  — false coerced to 0
null == undefined // true  — special rule
[]  == false  // true  — [] → '' → 0, false → 0

// Strict equality — no coercion
2   === '2'   // false — different types
0   === false // false

// Arithmetic coercion
2 + '2'   // '22' — number coerced to string (+ concatenates)
2 * '2'   // 4    — string coerced to number (* is numeric only)
+'5'      // 5    — unary + converts string to number`,
    },
    {
      concept: 'Prototype Chain & this',
      explanation: 'Every JS object has a hidden [[Prototype]] link. Property lookup walks the chain until it finds the property or reaches null. this refers to the execution context — the object before the dot, or undefined in strict mode functions.',
      code: `// Prototype chain
function Animal(name) { this.name = name }
Animal.prototype.speak = function() { return this.name + ' speaks' }

const dog = new Animal('Rex')
dog.speak()         // found on Animal.prototype
dog.hasOwnProperty('name')   // true — own property
dog.hasOwnProperty('speak')  // false — inherited

// this — depends on call site
const obj = {
  name: 'Alice',
  greet() { return this.name }   // this = obj
}
const fn = obj.greet
fn()   // this = undefined (strict) or window — not obj!

// Arrow functions capture lexical this
class Timer {
  start() {
    setTimeout(() => console.log(this), 1000)  // this = Timer instance
  }
}`,
    },
  ],
  spokenAnswer: {
    question: 'Explain type coercion in JavaScript and why == is dangerous.',
    answer: `JavaScript has implicit type coercion — when you use the loose equality operator ==, the engine tries to convert one or both values to the same type before comparing. This produces results that look wrong at first glance: the string "2" equals the number 2, an empty array equals false, null equals undefined. The rules are complex and inconsistent enough that most experienced developers can't reliably predict all of them. The practical consequence is that bugs are hard to spot — a comparison that looks like it's checking whether something is false might also return true for an empty string, zero, or null. Strict equality === never coerces — it returns false if the types differ, period. I always use === in production code. The only time I deliberately lean on coercion is for intentional type conversion — using the unary + operator to convert a string to a number — and even then I'd prefer Number() for clarity.`,
    followUp: `Explain the event loop in 60 seconds — call stack, microtasks, macrotasks.`,
  },
  traps: [
    {
      trap: 'Assuming typeof null === "null"',
      correction: 'typeof null returns "object" — a historical bug in JavaScript that cannot be fixed without breaking the web. Check for null explicitly with value === null, not typeof.',
    },
    {
      trap: 'Using var inside a for loop and expecting block scoping',
      correction: 'var is function-scoped. A var declared inside a for loop leaks into the enclosing function. Classic bug: setTimeout inside a for loop with var captures the final value of i, not the loop iteration value. Use let.',
    },
    {
      trap: 'Losing this context when passing a method as a callback',
      correction: 'const fn = obj.method; fn() — this is no longer obj, it\'s undefined (strict mode) or the global object. Fix with fn.bind(obj), an arrow function wrapper (() => obj.method()), or storing the method as an arrow function property.',
    },
  ],
  quiz: [
    {
      id: 1,
      question: 'What does "2 + \'2\'" evaluate to in JavaScript?',
      options: ['4', '"22"', 'NaN', '2'],
      correct: 1,
      explanation: 'The + operator with a string operand triggers string concatenation. The number 2 is coerced to the string "2", then concatenated with "2" — result is "22". Contrast with 2 * "2" = 4, because * is always numeric.',
    },
    {
      id: 2,
      question: 'y = 1; var y = 2. What is the value of y after both lines?',
      options: ['1', '2', 'undefined', 'ReferenceError'],
      correct: 1,
      explanation: 'var declarations are hoisted to the top of the function scope. The declaration (var y) is hoisted and y starts as undefined. Then y = 1 sets it to 1. Then var y = 2 — the declaration was already hoisted, so only the assignment y = 2 runs. Final value: 2.',
    },
    {
      id: 3,
      question: 'What is the output of: console.log(typeof null)?',
      options: ['"null"', '"undefined"', '"object"', '"boolean"'],
      correct: 2,
      explanation: 'typeof null === "object" is a historical JavaScript bug. The correct check for null is strict equality: value === null.',
    },
    {
      id: 4,
      question: 'An arrow function inside a class method uses "this". What does it refer to?',
      options: [
        'undefined in strict mode',
        'The global window object',
        'The class instance — arrow functions capture this lexically from their enclosing scope',
        'The arrow function itself',
      ],
      correct: 2,
      explanation: 'Arrow functions do not have their own this — they inherit it from the surrounding lexical scope at the time they are defined. Inside a class method, the surrounding this is the class instance.',
    },
  ],
  relatedTutorialId: 'event-loop',
}
