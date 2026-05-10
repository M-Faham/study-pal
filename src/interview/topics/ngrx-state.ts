import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: 'ngrx-state',
  title: 'State Management — NgRx & Signals',
  icon: '🗃️',
  difficulty: 'Architecture',
  targets: ['Angular'],
  keyPoints: [
    'NgRx flow: Component dispatches Action → Reducer produces new State → Selector projects slice → Component renders',
    'Effects handle side-effects (HTTP, localStorage) — never put them in reducers',
    'Selectors are memoized — they only recompute when their input slice changes',
    'Signals-based state: signalStore() or a plain service with signal() + computed() replaces NgRx for smaller apps',
    'State must be immutable — reducers return a new object, never mutate the existing one',
  ],
  cheatSheet: [
    {
      concept: 'NgRx Core Flow',
      explanation: 'Unidirectional data flow: Action → Reducer → Store → Selector → Component. Components dispatch actions, never mutate state directly.',
      code: `// action
export const loadUsers = createAction('[Users] Load')
export const loadUsersSuccess = createAction(
  '[Users] Load Success',
  props<{ users: User[] }>()
)

// reducer
export const usersReducer = createReducer(
  { users: [], loading: false },
  on(loadUsers, state => ({ ...state, loading: true })),
  on(loadUsersSuccess, (state, { users }) => ({ ...state, users, loading: false }))
)`,
    },
    {
      concept: 'Effects',
      explanation: 'Effects listen for actions, perform side-effects, and dispatch new actions. They run outside components — HTTP calls, localStorage, analytics belong here.',
      code: `@Injectable()
export class UsersEffects {
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      switchMap(() =>
        this.http.get<User[]>('/api/users').pipe(
          map(users => loadUsersSuccess({ users })),
          catchError(() => of(loadUsersFailure()))
        )
      )
    )
  )
  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}
}`,
    },
    {
      concept: 'Selectors & Memoization',
      explanation: 'Selectors project slices of state. createSelector() memoizes — the projector only runs when inputs change, preventing unnecessary re-renders.',
      code: `const selectUsersState = (state: AppState) => state.users

export const selectAllUsers = createSelector(
  selectUsersState,
  s => s.users
)
export const selectAdmins = createSelector(
  selectAllUsers,
  users => users.filter(u => u.role === 'admin')
)

// component
admins$ = this.store.select(selectAdmins)`,
    },
    {
      concept: 'Signals-based State (lightweight alternative)',
      explanation: 'For simpler apps or feature-level state, a service with signal() + computed() + effect() removes the NgRx boilerplate while staying reactive.',
      code: `@Injectable({ providedIn: 'root' })
export class CartStore {
  private items = signal<CartItem[]>([])

  readonly count   = computed(() => this.items().length)
  readonly total   = computed(() =>
    this.items().reduce((s, i) => s + i.price, 0)
  )

  add(item: CartItem) {
    this.items.update(list => [...list, item])
  }
  remove(id: string) {
    this.items.update(list => list.filter(i => i.id !== id))
  }
}`,
    },
    {
      concept: 'NgRx ComponentStore (local state)',
      explanation: 'ComponentStore provides NgRx-style state scoped to a single component or feature — no global store needed. Good for complex forms, wizards, or data-heavy pages.',
      code: `@Injectable()
export class TodosStore extends ComponentStore<TodosState> {
  constructor() { super({ todos: [], filter: 'all' }) }

  readonly todos$ = this.select(s => s.todos)

  readonly addTodo = this.updater((state, todo: Todo) => ({
    ...state,
    todos: [...state.todos, todo]
  }))
}`,
    },
  ],
  spokenAnswer: {
    question: 'How would you choose between NgRx, ComponentStore, and Signals for state management in an Angular application?',
    answer: 'I think of it as three tiers. For app-wide shared state that multiple routes need — auth, user profile, shopping cart — NgRx gives you the audit trail, time-travel debugging, and the clear action/reducer/effect separation that makes large teams productive. For feature-level state that\'s complex but only lives inside one module — a multi-step form or a data table with lots of UI state — ComponentStore gives you the same patterns without polluting the global store. For simple reactive state inside a single service or component, Signals are the lightest option and the direction Angular itself is moving — no boilerplate, just signal(), computed(), and effect(). The anti-pattern is putting everything in NgRx regardless of scope, which creates action-name soup and makes simple things complicated.',
    followUp: 'How do selectors prevent unnecessary re-renders, and what happens if you create a new selector inside a component template?',
  },
  traps: [
    {
      trap: 'Reducers can call APIs or dispatch actions',
      correction: 'Reducers must be pure functions — no side effects. HTTP calls and dispatching go in Effects',
    },
    {
      trap: 'Creating a selector inline in a template is fine',
      correction: 'Inline selectors create a new memoized function on every render, breaking memoization — always define selectors at module level',
    },
    {
      trap: 'Signals replace NgRx for all use cases',
      correction: 'Signals are great for local/feature state but NgRx still wins for complex cross-cutting state that needs audit trails, dev-tools, or team conventions',
    },
  ],
  quiz: [
    {
      id: 1,
      question: 'Where should an HTTP call triggered by an NgRx action be placed?',
      options: [
        'Inside the reducer',
        'Inside an Effect',
        'In the component that dispatches the action',
        'In a selector',
      ],
      correct: 1,
      explanation: 'Reducers must be pure. Effects are designed for side-effects — they listen for actions, call the API, and dispatch success/failure actions.',
    },
    {
      id: 2,
      question: 'A selector depends on two slices of state. When does its projector function re-run?',
      options: [
        'On every state change anywhere in the store',
        'Only when at least one of its two input slices changes',
        'Only when the component subscribes',
        'On every CD cycle',
      ],
      correct: 1,
      explanation: 'createSelector() memoizes by comparing input references. The projector only re-runs when one of its inputs produces a new reference.',
    },
    {
      id: 3,
      question: 'Which is the best fit for managing state in a multi-step checkout wizard inside one Angular module?',
      options: [
        'Global NgRx store',
        'NgRx ComponentStore',
        'A plain class with public properties',
        'localStorage',
      ],
      correct: 1,
      explanation: 'ComponentStore is scoped to the component/service that provides it — perfect for complex local state like a wizard. Global NgRx would pollute the root store with transient UI state.',
    },
  ],
}
