import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: "state-management",
  title: "State Management",
  icon: "🗄️",
  difficulty: "Architecture",
  targets: ['Angular', 'React'],
  keyPoints: [
    'Local state: useState/signals for component-only data',
    'Shared state: Context/BehaviorSubject for cross-component data',
    'NgRx/Redux: unidirectional flow — Action → Reducer → State → View',
    'Selector memoization prevents unnecessary re-renders',
    'Lift state to the nearest common ancestor, not higher',
  ],
  cheatSheet: [
    {
      concept: "When to Use Global State",
      explanation:
        "Not everything needs to be global. Ask: does this data need to be shared across multiple unrelated components? If yes, consider global state. If only parent→child, use props/Input.",
      code: `// Local state — fine for form, toggle, pagination
const [isOpen, setIsOpen] = useState(false)

// Global state — auth user accessed in header, sidebar, and profile page
// NgRx / Zustand / Redux Toolkit
store.select(selectCurrentUser)`,
    },
    {
      concept: "NgRx Core Concepts",
      explanation:
        "Store holds state. Actions describe what happened. Reducers compute new state. Effects handle side effects (HTTP). Selectors derive and memoize views of state.",
      code: `// Action
export const loadUsers = createAction('[Users] Load')
export const loadUsersSuccess = createAction('[Users] Load Success', props<{ users: User[] }>())

// Reducer
const usersReducer = createReducer(
  initialState,
  on(loadUsersSuccess, (state, { users }) => ({ ...state, users, loading: false }))
)

// Effect
loadUsers$ = createEffect(() => this.actions$.pipe(
  ofType(loadUsers),
  switchMap(() => this.api.getUsers().pipe(
    map(users => loadUsersSuccess({ users })),
    catchError(err => of(loadUsersFailure({ error: err })))
  ))
))`,
    },
    {
      concept: "Selector Memoization",
      explanation:
        "Selectors computed with createSelector are memoized — they only recompute when their input selectors return new values. This prevents unnecessary re-renders.",
      code: `const selectUsers = (state: AppState) => state.users.list
const selectFilter = (state: AppState) => state.users.filter

// Only recomputes when selectUsers or selectFilter changes
const selectFilteredUsers = createSelector(
  selectUsers, selectFilter,
  (users, filter) => users.filter(u => u.name.includes(filter))
)`,
    },
    {
      concept: "Immutability Is Non-Negotiable",
      explanation:
        "Reducers must return new state objects — never mutate the existing state. NgRx uses reference equality for change detection; mutation defeats it.",
      code: `// ❌ Mutation — breaks NgRx change detection
on(addUser, (state, { user }) => {
  state.users.push(user)  // WRONG — mutates existing array
  return state
})

// ✅ Return new state
on(addUser, (state, { user }) => ({
  ...state,
  users: [...state.users, user]
}))`,
    },
  ],
  spokenAnswer: {
    question:
      "How do you decide when to use NgRx versus a simpler solution like a shared service with BehaviorSubject?",
    answer: `My default is to start with the simplest thing that works — a service with a BehaviorSubject or even just component state. NgRx adds real overhead: boilerplate, a learning curve, and a mental model that every developer on the team needs to understand. I reach for NgRx when the state interactions become complex enough that I'd otherwise have trouble reasoning about what happened and why — for example, when multiple feature areas can all trigger changes to the same slice of state, or when I need time-travel debugging to reproduce production bugs, or when the team is large enough that having an enforced unidirectional data flow prevents a class of mistakes. For a mid-size app where only one or two features share state, a service with BehaviorSubject is perfectly adequate and much simpler to maintain.`,
  },
  traps: [
    {
      trap: "Putting all state in the NgRx store including local UI state",
      correction:
        "Form state, modal open/closed, selected tab — these are local component concerns. Putting them in the global store creates boilerplate for no benefit and pollutes the store with ephemeral UI details.",
    },
    {
      trap: "Dispatching an action and then immediately selecting the state expecting the updated value",
      correction:
        "Store updates are asynchronous. After dispatch(), the state has not yet changed in the same synchronous block. Subscribe to a selector to react to state changes rather than reading state immediately after dispatch.",
    },
    {
      trap: "Mutating state inside a reducer",
      correction:
        "NgRx relies on reference equality to detect changes. Pushing to an existing array or modifying an existing object in place means the reference stays the same — components using that selector will not update. Always spread to create new references.",
    },
  ],
  quiz: [
    {
      id: 1,
      question:
        "Why must NgRx reducers return new state objects instead of mutating existing ones?",
      options: [
        "NgRx uses deep equality checks that require new objects",
        "NgRx uses reference equality — mutation keeps the same reference and components do not update",
        "JavaScript prevents mutation inside reducer functions",
        "Mutation causes NgRx effects to fire twice",
      ],
      correct: 1,
      explanation:
        "NgRx and Angular's change detection use reference equality (===). If you mutate the existing state object, the reference is the same — selectors see no change and do not emit, so components do not update.",
    },
    {
      id: 2,
      question: "What is the purpose of createSelector in NgRx?",
      options: [
        "To create new actions that modify the store",
        "To memoize derived state — only recompute when input selectors return new values",
        "To subscribe to store changes in a component",
        "To combine multiple reducers into one",
      ],
      correct: 1,
      explanation:
        "createSelector composes selectors and memoizes the result. The derived value only recomputes when its input selectors change, preventing unnecessary re-renders in components that use this.store.select().",
    },
    {
      id: 3,
      question:
        "Where should HTTP calls and other side effects live in an NgRx architecture?",
      options: [
        "Directly inside reducers",
        "In the component that dispatches the action",
        "In NgRx Effects",
        "In Angular Guards",
      ],
      correct: 2,
      explanation:
        "Reducers must be pure functions with no side effects. HTTP calls, navigation, and other async operations belong in Effects, which listen for actions, perform the side effect, and dispatch result actions back to the store.",
    },
  ],
}
