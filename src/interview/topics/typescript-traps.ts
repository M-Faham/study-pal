import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: "typescript-traps",
  title: "TypeScript Traps",
  icon: "🔷",
  difficulty: "Tricky",
  targets: ['TypeScript', 'Angular', 'React'],
  keyPoints: [
    'Structural typing: types are compatible if shapes match, not names',
    'any disables type checking; unknown forces you to narrow before use',
    'Discriminated unions: shared literal field narrows the type in switch/if',
    'Generics make code reusable while preserving type safety',
    'never = a value that can never occur; useful for exhaustive checks',
  ],
  cheatSheet: [
    {
      concept: "Type vs Interface — When to Use Which",
      explanation:
        "Use interface for object shapes that might be extended or implemented. Use type for unions, intersections, mapped types, and anything that can't be expressed as an interface.",
      code: `// interface — extendable, implementable
interface User { id: number; name: string }
interface Admin extends User { role: string }

// type — unions, mapped types, complex compositions
type Status = 'active' | 'inactive' | 'banned'
type Readonly<T> = { readonly [K in keyof T]: T[K] }
type ApiResponse<T> = { data: T; error: null } | { data: null; error: string }`,
    },
    {
      concept: "unknown vs any",
      explanation:
        "any turns off type checking entirely. unknown is type-safe — you must narrow it before use. Always prefer unknown for values whose type you don't know yet (API responses, caught errors).",
      code: `// any — no safety, compiler trusts you blindly
function bad(value: any) {
  value.nonExistent.method()  // compiles fine, crashes at runtime
}

// unknown — must prove the type before use
function good(value: unknown) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase())  // TS knows it's a string here
  }
}

// Caught errors should be unknown
catch (err) {
  if (err instanceof Error) console.log(err.message)
}`,
    },
    {
      concept: "Discriminated Unions",
      explanation:
        "A union where each member has a literal type field. TypeScript can narrow the type inside an if/switch by checking that field — no casting needed.",
      code: `type Shape =
  | { kind: 'circle';    radius: number }
  | { kind: 'rectangle'; width: number; height: number }

function area(s: Shape): number {
  switch (s.kind) {
    case 'circle':    return Math.PI * s.radius ** 2
    case 'rectangle': return s.width * s.height
    // TypeScript enforces exhaustiveness — add a new Shape member
    // and this switch becomes a compile error if you don't handle it
  }
}`,
    },
    {
      concept: "Utility Types You Must Know",
      explanation:
        "Partial, Required, Readonly, Pick, Omit, Record, ReturnType, Parameters — built-in mapped/conditional types that eliminate repetitive type definitions.",
      code: `interface User { id: number; name: string; email: string }

type UpdateUser  = Partial<User>          // all fields optional
type PublicUser  = Omit<User, 'email'>    // remove email
type UserPreview = Pick<User, 'id'|'name'>// only id and name
type UserMap     = Record<string, User>   // dictionary of users

// Infer return type of a function
type FetchResult = ReturnType<typeof fetchUser>`,
    },
    {
      concept: "as const and Literal Types",
      explanation:
        "Without as const, TypeScript widens array and object literals to broad types. as const freezes the type to the exact literal values.",
      code: `// Without as const — widened to string[]
const roles = ['admin', 'editor', 'viewer']
// roles: string[]

// With as const — tuple of string literals
const roles = ['admin', 'editor', 'viewer'] as const
// roles: readonly ["admin", "editor", "viewer"]

type Role = typeof roles[number]  // "admin" | "editor" | "viewer"`,
    },
  ],
  spokenAnswer: {
    question:
      "What is the difference between any and unknown, and when should you use each?",
    answer: `any basically turns TypeScript off for that value — you can call any method, access any property, and the compiler just trusts you. It's an escape hatch and should be avoided in production code because it defeats the purpose of TypeScript. unknown is the type-safe alternative for "I don't know what this is yet." TypeScript forces you to narrow the type before you can do anything with it — using typeof, instanceof, or a type guard. The practical places I reach for unknown are: caught error values in catch blocks, because in TypeScript 4.0+ errors are typed as unknown by default, and for raw API responses before I've validated the shape. I never use any except in genuine migration scenarios where I'm adding types to an existing JavaScript file and need a temporary escape hatch.`,
    followUp: `How do you handle the case where a third-party library has incorrect or missing type definitions?`,
  },
  traps: [
    {
      trap: "Using as to silence TypeScript instead of fixing the actual type problem",
      correction:
        "Type assertions (as SomeType) tell TypeScript to trust you. If you're wrong, you get a runtime crash with no warning. Fix the actual types instead. The only legitimate uses of as are narrowing from a broader type you know is safe, or working with DOM APIs.",
    },
    {
      trap: "Typing function parameters as object when you mean a specific shape",
      correction:
        "object accepts any non-primitive — you can't access any properties on it without casting. Use a specific interface or Record<string, unknown> if the shape is dynamic.",
    },
    {
      trap: "Forgetting that type narrowing doesn't cross function boundaries",
      correction:
        'If you check typeof x === "string" in one function then pass x to another, TypeScript does not carry the narrowing into the second function. Use type predicates (value is string) to carry narrowing across function calls.',
    },
  ],
  quiz: [
    {
      id: 1,
      question:
        'What does as const do to an array literal like ["a", "b", "c"]?',
      options: [
        "Converts it to a Set",
        'Makes it readonly and narrows the type to the exact literal tuple ["a", "b", "c"]',
        "Prevents the array from being reassigned",
        "Converts string[] to a union type automatically",
      ],
      correct: 1,
      explanation:
        'as const freezes the inferred type to the exact literal values and makes it readonly. Without it, TypeScript widens to string[]. With it, you get readonly ["a", "b", "c"] and can derive "a" | "b" | "c" as a union type.',
    },
    {
      id: 2,
      question:
        "A catch block receives an error. What is the TypeScript-safe way to access error.message?",
      options: [
        "Directly access error.message — TypeScript types it as Error automatically",
        "Cast it with (error as Error).message",
        "Check error instanceof Error first, then access error.message",
        "Use any: (error: any) => error.message",
      ],
      correct: 2,
      explanation:
        "Caught errors are typed as unknown (or any in older TS). The safe way is to check instanceof Error before accessing .message — TypeScript then narrows the type correctly. Using as Error is a gamble — if something throws a string, it crashes.",
    },
    {
      id: 3,
      question: "What is the purpose of a discriminated union?",
      options: [
        "To combine two interfaces into one",
        "To create a union where TypeScript can narrow the type by checking a shared literal field",
        "To mark certain fields as optional",
        "To exclude null and undefined from a type",
      ],
      correct: 1,
      explanation:
        'A discriminated union has a shared "tag" field (like kind or type) with a unique literal value per member. TypeScript uses this field to narrow the type in switch/if statements without any casting.',
    },
  ],
}
