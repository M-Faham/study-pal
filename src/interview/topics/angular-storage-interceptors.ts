import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: 'angular-storage-interceptors',
  title: 'Angular — Storage, Interceptors & Lazy Loading',
  icon: '🔧',
  difficulty: 'Core',
  targets: ['Angular'],
  keyPoints: [
    'localStorage: persists forever, 5MB, JS-accessible (XSS risk) — never store auth tokens here',
    'Cookies: 4KB, sent with every request, httpOnly = invisible to JS (XSS-safe) — best for auth tokens',
    'Interceptors: always clone the request — HttpRequest is immutable, mutating throws',
    'CanActivate: blocks entry | CanDeactivate: blocks exit | CanMatch: prevents match + lazy load',
    'providedIn root = singleton; component providers[] = new isolated instance per component',
  ],
  cheatSheet: [
    {
      concept: 'localStorage vs sessionStorage vs Cookies',
      explanation: 'localStorage: persists until cleared, ~5MB, JS only. sessionStorage: cleared on tab close, ~5MB, JS only. Cookies: 4KB limit, sent with every HTTP request, can be httpOnly (invisible to JS) and Secure.',
      code: `// localStorage — persists forever
localStorage.setItem('theme', 'dark')
localStorage.getItem('theme')  // 'dark' after browser restart

// sessionStorage — tab lifetime only
sessionStorage.setItem('draft', JSON.stringify(form))
// cleared when tab closes

// Cookie — server can set httpOnly (XSS-safe)
document.cookie = 'pref=dark; path=/; max-age=31536000'
// httpOnly cookies set by server: JS cannot read them`,
    },
    {
      concept: 'HTTP Interceptor',
      explanation: 'Intercepts all HTTP requests and responses globally. Use for: attaching auth tokens, logging, error handling, adding common headers, retrying failed requests.',
      code: `// Angular 15+ functional interceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken()
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: 'Bearer ' + token } })
    : req
  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) inject(Router).navigate(['/login'])
      return throwError(() => err)
    })
  )
}

// Register in app.config.ts
provideHttpClient(withInterceptors([authInterceptor])`,
    },
    {
      concept: 'Lazy Loading Routes',
      explanation: 'Split the app into feature modules loaded only when the user navigates there. Reduces initial bundle. The router downloads the chunk on demand and caches it.',
      code: `// app.routes.ts
export const routes: Routes = [
  {
    path: 'admin',
    canMatch: [adminGuard],  // check access BEFORE loading
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'dashboard',
    loadComponent: () =>   // standalone component lazy load
      import('./dashboard/dashboard.component').then(c => c.DashboardComponent)
  }
]`,
    },
    {
      concept: 'Route Guards — CanActivate, CanDeactivate, CanMatch',
      explanation: 'CanActivate: blocks navigation TO a route (auth check). CanDeactivate: blocks navigation AWAY from a route (unsaved changes warning). CanMatch: prevents route from matching at all — lazy module never downloads.',
      code: `// CanActivate — protect entry
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService)
  return auth.isLoggedIn() ? true : inject(Router).createUrlTree(['/login'])
}

// CanDeactivate — protect exit (unsaved changes)
export const unsavedGuard: CanDeactivateFn<EditComponent> = (component) => {
  if (component.hasUnsavedChanges()) {
    return confirm('You have unsaved changes. Leave anyway?')
  }
  return true
}

// CanMatch — prevent loading lazy module entirely
export const adminGuard: CanMatchFn = () => {
  return inject(AuthService).hasRole('admin')
}

// Routes
{
  path: 'edit/:id',
  component: EditComponent,
  canActivate: [authGuard],
  canDeactivate: [unsavedGuard],
},
{
  path: 'admin',
  canMatch: [adminGuard],    // checked BEFORE loading the chunk
  loadChildren: () => import('./admin/admin.routes')
}`,
    },
    {
      concept: 'Service: providedIn root vs AppModule vs Component',
      explanation: 'providedIn: "root": singleton, tree-shakeable — the standard. AppModule providers[]: singleton but not tree-shakeable — always bundled. Component providers[]: new instance per component — each component gets its own isolated service.',
      code: `// Singleton — one instance app-wide, tree-shakeable
@Injectable({ providedIn: 'root' })
export class AuthService {}

// Component-scoped — each MyComponent gets its own instance
@Component({
  providers: [CacheService]  // isolated — not shared with other components
})
export class MyComponent {
  constructor(private cache: CacheService) {}
}

// Two sibling components each declaring CacheService in providers[]
// get TWO separate CacheService instances — they do NOT share state`,
    },
  ],
  spokenAnswer: {
    question: 'Two components both declare the same service in their providers array. Do they share the same instance?',
    answer: `No — they get two completely separate instances. When you list a service in a component's providers array, Angular creates a new injector scope for that component's subtree. Each component gets its own instance of the service, and any child components will inherit from their nearest ancestor's injector. So the two sibling components each have their own isolated copy of the service — they don't share any state. This is actually a useful pattern when you have a stateful service like a form state manager or a local cache that should be isolated per component instance. If you want a single shared instance, either use providedIn: "root" or provide the service in a common parent component or module.`,
  },
  traps: [
    {
      trap: 'Storing auth tokens in localStorage without considering XSS',
      correction: 'localStorage is accessible to any JavaScript on the page. An XSS vulnerability lets an attacker read your token. Use httpOnly cookies for auth tokens — they\'re invisible to JavaScript. If you must use localStorage, ensure strict CSP headers.',
    },
    {
      trap: 'Mutating the original HttpRequest in an interceptor',
      correction: 'HttpRequest objects are immutable in Angular. You must clone the request with req.clone({ ... }) to modify headers or body. Mutating the original throws an error.',
    },
  ],
  quiz: [
    {
      id: 1,
      question: 'Two sibling components each list the same service in their providers[] array. What happens?',
      options: [
        'They share one instance — Angular deduplicates it',
        'Angular throws an error — a service can only be provided once',
        'Each component gets its own independent instance — no shared state',
        'The second component\'s instance overrides the first',
      ],
      correct: 2,
      explanation: 'providers[] in a component creates a new injector scope. Each component that declares a service in its own providers[] gets a fresh, independent instance. Use providedIn: "root" for shared singletons.',
    },
    {
      id: 2,
      question: 'What is the correct way to add a header to an HttpRequest in an Angular interceptor?',
      options: [
        'req.headers.set("Authorization", token)',
        'req.clone({ setHeaders: { Authorization: token } })',
        'request.headers["Authorization"] = token',
        'inject(HttpClient).setDefaultHeaders({ Authorization: token })',
      ],
      correct: 1,
      explanation: 'HttpRequest is immutable — you cannot modify it directly. req.clone() returns a new request with the specified modifications applied. This is the required pattern for all interceptor mutations.',
    },
  ],
}
