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
    'Closure = function that remembers variables from its outer scope after that scope is gone',
    'call(ctx, ...args) / apply(ctx, [args]) invoke immediately; bind(ctx) returns a new function',
    'Classic closure trap: var in a loop captures the final value — fix with let or IIFE',
  ],
  cheatSheet: [
    {
      concept: 'var vs let vs const — Scope & Hoisting',
      explanation: '<strong>var</strong> is <strong>function-scoped</strong> and <strong>hoisted</strong> — the declaration is moved to the top of its function and initialised to <code>undefined</code>, so reading it before the assignment gives you <code>undefined</code>, not an error. <strong>let</strong> and <strong>const</strong> are <strong>block-scoped</strong> and enter the <strong>Temporal Dead Zone (TDZ)</strong> — they are hoisted but not initialised, so accessing them before the declaration throws a <code>ReferenceError</code>. Prefer <code>const</code> by default; use <code>let</code> only when you need to reassign; avoid <code>var</code>.',
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
      explanation: '<strong>Undeclared</strong>: the variable was never defined anywhere — accessing it throws a <code>ReferenceError</code>. Use <code>typeof</code> to safely probe for it without throwing. <strong>Undefined</strong>: the variable exists but was never given a value — JS initialises unassigned variables to <code>undefined</code>. <strong>Null</strong>: the developer explicitly set the value to <code>null</code> to signal intentional absence of an object. Key quirk: <code>typeof null === "object"</code> — a historical JS bug; always check for null with <code>=== null</code>, not <code>typeof</code>.',
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
      explanation: '<strong>Primitive types</strong> — <code>string</code>, <code>number</code>, <code>bigint</code>, <code>boolean</code>, <code>undefined</code>, <code>null</code>, <code>symbol</code> — are <strong>immutable</strong> and <strong>copied by value</strong>: assigning to a new variable makes an independent copy. <strong>Non-primitive types</strong> (objects, arrays, functions) are <strong>copied by reference</strong>: the variable holds a pointer to the same object in memory, so mutating through one variable affects all references. This is the source of many accidental mutation bugs — always clone objects with spread or <code>structuredClone()</code> before modifying.',
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
      explanation: '<strong><code>===</code> (strict equality)</strong> compares type <em>and</em> value with no conversion — two values of different types are always <code>false</code>. <strong><code>==</code> (loose equality)</strong> applies <strong>type coercion</strong> first: JS silently converts one or both operands to match, following a complex set of rules that produce counterintuitive results (<code>[] == false</code> is <code>true</code>, <code>null == undefined</code> is <code>true</code>). Always use <code>===</code> in production. The only safe uses of coercion are intentional conversions like <code>+\'5\'</code> → <code>5</code> or <code>!!value</code> → boolean — and even then, prefer explicit casts like <code>Number()</code> and <code>Boolean()</code> for readability.',
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
      concept: 'Redeclare vs Reassign & Mutable vs Immutable',
      explanation: '<strong>Redeclare</strong> means creating a second variable with the same name in the same scope. <code>var</code> allows this silently; <code>let</code> and <code>const</code> throw a <code>SyntaxError</code>. <strong>Reassign</strong> means changing what a variable points to. <code>const</code> prevents reassignment of the <em>binding</em> — but it does <strong>not</strong> make objects immutable. A <code>const</code> object\'s properties can still be mutated freely. To prevent all mutation, use <code>Object.freeze()</code> (shallow) or deep-clone + freeze recursively. The idiomatic immutability pattern in React and functional code is to return a new object with spread rather than mutate in place.',
      code: `// Redeclare
var a = 1; var a = 2    // ✅ fine — var allows redeclaration
let b = 1; let b = 2    // ❌ SyntaxError

// Reassign
let x = 1; x = 2        // ✅ fine
const y = 1; y = 2      // ❌ TypeError: Assignment to constant variable

// const does NOT make objects immutable
const obj = { name: 'Alice' }
obj.name = 'Bob'         // ✅ works — obj still points to same reference
obj = {}                 // ❌ TypeError — can't reassign the binding

// True immutability — Object.freeze()
const frozen = Object.freeze({ x: 1 })
frozen.x = 99            // silently ignored (or throws in strict mode)
console.log(frozen.x)   // 1

// Immutable pattern — return new objects instead of mutating
const user = { name: 'Alice', age: 30 }
const updated = { ...user, age: 31 }  // new object, original unchanged`,
    },
    {
      concept: 'Prototype Chain & this',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Prototype Chain</p><p class="mb-3 text-gray-600">Every object has a hidden <code>[[Prototype]]</code> link. Property lookup walks the chain until the property is found or <code>null</code> is reached — that's how <code>dog.speak()</code> resolves even though <code>speak</code> lives on <code>Animal.prototype</code>, not on <code>dog</code> itself.</p><p class="font-semibold text-gray-800 mb-1">this — Regular Functions</p><p class="mb-3 text-gray-600"><code>this</code> is determined at the <strong>call site</strong>. <code>obj.greet()</code> → <code>this = obj</code>. Detach it (<code>const fn = obj.greet; fn()</code>) and <code>this</code> becomes <code>undefined</code> in strict mode or <code>window</code> globally.</p><p class="font-semibold text-gray-800 mb-1">this — Arrow Functions</p><p class="text-gray-600">Arrow functions have no own <code>this</code> — they capture it <strong>lexically</strong> from the enclosing scope at definition time. That's why they're the standard choice for callbacks inside class methods.</p>`,
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
    {
      concept: 'Closures',
      explanation: `<p class="font-semibold text-gray-800 mb-1">What Is a Closure</p><p class="mb-3 text-gray-600">A closure is a function that <strong>remembers variables from its outer (enclosing) scope</strong> even after that scope has finished executing. The inner function carries a live reference to those variables — not a copy.</p><p class="font-semibold text-gray-800 mb-1">Why It Matters</p><p class="mb-3 text-gray-600">Closures power <strong>data encapsulation</strong> (private state without a class), <strong>factory functions</strong>, <strong>memoization</strong>, and any pattern where a callback needs to remember context from when it was created.</p><p class="font-semibold text-gray-800 mb-1">The Classic Trap — var in a Loop</p><p class="text-gray-600">Every closure shares the <em>same</em> <code>var</code> variable — by the time the callbacks run, the loop is done and the variable holds its final value. Fix with <code>let</code> (block-scoped, new binding per iteration) or an IIFE to capture the value.</p>`,
      code: `// Basic closure — inner function remembers outer variable
function makeCounter() {
  let count = 0          // lives in makeCounter's scope
  return {
    increment() { count++ },
    value()     { return count }
  }
}
const counter = makeCounter()
counter.increment()
counter.increment()
counter.value()  // 2 — count is private, only accessible via returned methods

// Factory pattern — closure over config
function multiplier(factor) {
  return (n) => n * factor   // factor is remembered
}
const double = multiplier(2)
const triple = multiplier(3)
double(5)  // 10
triple(5)  // 15

// ❌ Classic trap — var shares one binding across all iterations
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
// Prints: 3, 3, 3  (all closures share the same var i)

// ✅ Fix 1 — let creates a new binding per iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100)
}
// Prints: 0, 1, 2

// ✅ Fix 2 — IIFE captures value at each iteration
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100)
  })(i)
}
// Prints: 0, 1, 2`,
    },
    {
      concept: 'call, apply & bind',
      explanation: `<p class="font-semibold text-gray-800 mb-1">call — Invoke with explicit this</p><p class="mb-3 text-gray-600"><code>fn.call(context, arg1, arg2)</code> calls the function <strong>immediately</strong> with <code>this</code> set to <code>context</code>. Arguments are passed <strong>individually</strong>.</p><p class="font-semibold text-gray-800 mb-1">apply — Same but array of args</p><p class="mb-3 text-gray-600"><code>fn.apply(context, [arg1, arg2])</code> works identically to <code>call</code> but takes arguments as an <strong>array</strong>. Handy when you already have args in an array.</p><p class="font-semibold text-gray-800 mb-1">bind — Returns a new function</p><p class="text-gray-600"><code>fn.bind(context, arg1)</code> does <strong>not</strong> call the function — it returns a <strong>new function</strong> with <code>this</code> permanently fixed to <code>context</code>. Can also partially apply arguments (partial application / currying).</p>`,
      code: `function greet(greeting, punctuation) {
  return \`\${greeting}, \${this.name}\${punctuation}\`
}

const user = { name: 'Alice' }

// call — immediate, args spread
greet.call(user, 'Hello', '!')     // "Hello, Alice!"

// apply — immediate, args as array
greet.apply(user, ['Hi', '?'])     // "Hi, Alice?"

// bind — returns new function, this fixed
const greetAlice = greet.bind(user, 'Hey')
greetAlice('.')   // "Hey, Alice."
greetAlice('!')   // "Hey, Alice!"  — greeting is partially applied

// Real-world: fix this when passing a method as callback
class Timer {
  name = 'Timer'
  start() {
    setTimeout(this.tick.bind(this), 1000)  // without bind, this = undefined
  }
  tick() { console.log(this.name) }
}

// Partial application with bind
function multiply(a, b) { return a * b }
const double = multiply.bind(null, 2)  // a = 2, this = null (irrelevant)
double(5)   // 10
double(10)  // 20`,
    },
    {
      concept: 'Immediately Invoked Function Expression (IIFE)',
      explanation: `<p class="font-semibold text-gray-800 mb-1">What It Is</p><p class="mb-3 text-gray-600">A function that is <strong>defined and called in one expression</strong>. The wrapping parentheses turn the function declaration into an expression, and the trailing <code>()</code> invoke it immediately.</p><p class="font-semibold text-gray-800 mb-1">Why Use It</p><p class="text-gray-600">Creates a <strong>private scope</strong> — variables inside don't leak to the outer scope. Historically used before <code>let</code>/<code>const</code> to avoid polluting the global namespace. Still useful for <strong>capturing loop values</strong> in closures, initialising async logic, and one-time setup code.</p>`,
      code: `// Basic IIFE
(function() {
  const secret = 'hidden'  // not accessible outside
  console.log('runs immediately')
})()

// Arrow IIFE
(() => {
  console.log('also runs immediately')
})()

// IIFE with return value
const result = (function() {
  const x = 10
  return x * 2
})()
console.log(result)  // 20

// Classic use — capture loop var
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), j * 100)
  })(i)
}
// 0, 1, 2 — each IIFE captures its own j

// Async IIFE — top-level await alternative
(async function() {
  const data = await fetch('/api/init').then(r => r.json())
  console.log(data)
})()`,
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
    {
      trap: 'Closure in a loop with var — all callbacks print the final value',
      correction: 'var is function-scoped so every iteration shares the same binding. By the time the callbacks run the loop is done and i equals its final value. Fix: use let (creates a new binding per iteration) or wrap in an IIFE to capture the value immediately.',
    },
    {
      trap: 'Confusing call/apply/bind — thinking bind calls the function',
      correction: 'bind() does NOT call the function — it returns a new function with this fixed. call() and apply() invoke immediately. A common mistake: someElem.addEventListener("click", obj.method.bind(obj)) is correct; obj.method.call(obj) inside addEventListener is wrong because call fires instantly.',
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
    {
      id: 5,
      question: 'What does this print?\nfor (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0) }',
      options: ['0, 1, 2', '3, 3, 3', '0, 0, 0', 'undefined, undefined, undefined'],
      correct: 1,
      explanation: 'var is function-scoped — all three arrow functions close over the same i variable. By the time the timeouts fire, the loop has finished and i === 3. Replace var with let to get 0, 1, 2 because let creates a new binding per iteration.',
    },
    {
      id: 6,
      question: 'What is the difference between fn.call(ctx) and fn.bind(ctx)?',
      options: [
        'They are identical — both invoke the function with ctx as this',
        'call() invokes the function immediately; bind() returns a new function with this fixed',
        'bind() invokes immediately; call() returns a new function',
        'call() works only on arrow functions; bind() works on all functions',
      ],
      correct: 1,
      explanation: 'call() and apply() invoke the function immediately with the given this. bind() does not call the function — it returns a new function with this permanently bound. Use bind() when you need to pass a method as a callback and preserve this.',
    },
    {
      id: 7,
      question: 'What does a closure "close over"?',
      options: [
        'A copy of the outer variable\'s value at the time the function is created',
        'A live reference to the outer variable — changes to it are visible inside the closure',
        'Only primitive values from the outer scope',
        'The global window object',
      ],
      correct: 1,
      explanation: 'A closure holds a live reference to the outer variable, not a snapshot copy. If the outer variable changes after the closure is created, the closure sees the new value. This is exactly why the var-in-loop bug produces the final loop value, not each iteration\'s value.',
    },
  ],
  relatedTutorialId: 'event-loop',
}
