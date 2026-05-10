import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: "frontend-architecture",
  title: "Frontend Architecture",
  icon: "🧱",
  difficulty: "Architecture",
  targets: ['Angular', 'React', 'General'],
  keyPoints: [
    'Feature folders over layer folders for large apps',
    'Smart/dumb component split: smart fetches data, dumb renders it',
    'Barrel files (index.ts) for clean public API per feature',
    'Micro-frontends: independent deploy of UI slices — adds complexity',
    'Module boundaries prevent cross-feature coupling',
  ],
  cheatSheet: [
    {
      concept: "Feature-Based Folder Structure",
      explanation:
        "Organise by feature (user, checkout, dashboard) rather than by type (components, services, models). Feature modules are self-contained and easier to lazy-load or extract.",
      code: `src/
  features/
    auth/
      components/   LoginForm, RegisterForm
      services/     AuthService
      store/        auth.actions, auth.reducer, auth.effects
      auth.module.ts
    products/
      ...
  shared/
    ui/             Button, Input, Modal
    pipes/
    guards/`,
    },
    {
      concept: "Presentation / Container Pattern",
      explanation:
        "Container components manage state and data fetching. Presentation components are pure functions of their props/inputs. Presentation components are testable without mocking services.",
      code: `// Container — knows about the store/service
@Component({ template: '<product-list [products]="products$ | async" />' })
export class ProductsPageComponent {
  products$ = this.store.select(selectProducts)
}

// Presentation — pure, no service injection
@Component({ selector: 'product-list' })
export class ProductListComponent {
  @Input() products: Product[] = []
  @Output() addToCart = new EventEmitter<Product>()
}`,
    },
    {
      concept: "Design System / Component Library",
      explanation:
        "A shared set of UI primitives (Button, Input, Card, Modal) with consistent APIs. Prevents duplication, enforces visual consistency, and speeds up feature development.",
      code: `// Shared button with consistent API
<app-button variant="primary" size="md" [loading]="saving" (click)="save()">
  Save
</app-button>

// Storybook documents and visually tests each component in isolation`,
    },
    {
      concept: "Unidirectional Data Flow",
      explanation:
        "Data flows down (parent → child via Input/props), events flow up (child → parent via Output/callbacks). Prevents hidden side-channel mutations and makes the data flow predictable.",
      code: `// ✅ Unidirectional
Parent → [data] → Child
Parent ← (event) ← Child

// ❌ Two-way binding everywhere hides who changes what
[(ngModel)]="value"  // fine for simple forms, not for complex state`,
    },
  ],
  spokenAnswer: {
    question:
      "How do you structure a large Angular application to keep it maintainable as it grows?",
    answer: `I organise by feature rather than by type. Each feature — products, checkout, user profile — gets its own folder with its own components, services, and state management all colocated. This makes it easy to understand what a feature needs, and easy to lazy-load or eventually extract the feature into a separate micro-frontend. I have a shared folder for things that are genuinely shared: UI primitives like buttons and inputs, common pipes, guards, and interceptors. The key distinction is that shared should have no knowledge of business logic — it's purely infrastructure. I enforce a strict presentation/container split: container components inject services and connect to state; presentation components are pure input/output. This makes presentation components trivially testable and reusable. For state I start with local component state and only promote to a shared service or store when multiple unrelated components need the same data.`,
  },
  traps: [
    {
      trap: "Putting everything in a single SharedModule",
      correction:
        "A SharedModule that imports and exports everything becomes a dependency of everything, defeating lazy loading. Split into focused shared modules: SharedUiModule, SharedUtilModule. Only import what a feature actually needs.",
    },
    {
      trap: "Letting presentation components import services directly",
      correction:
        'A presentation component that injects HttpClient can\'t be reused or tested without setting up the full service dependency tree. Pass data via Input and actions via Output — keep presentation components "dumb".',
    },
  ],
  quiz: [
    {
      id: 1,
      question:
        "What is the main benefit of organising code by feature rather than by type?",
      options: [
        "It reduces the number of files in the project",
        "All code related to a feature is colocated — easier to understand, lazy-load, and eventually extract",
        "It prevents naming conflicts between components",
        "TypeScript compiles faster with feature-based organisation",
      ],
      correct: 1,
      explanation:
        "Feature-based structure puts all related files together — components, services, state, tests. You can understand a feature by looking at one folder, lazy-load it as a module, or extract it to a micro-frontend without hunting across type-based folders.",
    },
    {
      id: 2,
      question:
        "A presentation component needs data from an API. What is the correct approach?",
      options: [
        "Inject HttpClient directly into the presentation component",
        "Have a parent container component fetch the data and pass it via @Input",
        "Use a global singleton service accessed via a static method",
        "Fetch data in the presentation component's ngOnInit",
      ],
      correct: 1,
      explanation:
        "Presentation components should be pure — they receive data via @Input and emit events via @Output. The parent container handles data fetching. This makes the presentation component reusable and testable without mocking HTTP.",
    },
  ],
}
