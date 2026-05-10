import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: 'angular-performance',
  title: 'Angular — Performance & Build Optimisation',
  icon: '⚡',
  difficulty: 'Architecture',
  targets: ['Angular'],
  keyPoints: [
    'OnPush + trackBy + pure pipes = the three cheapest CD wins before touching the build',
    'Lazy loading routes splits the bundle — each loadComponent/loadChildren call = a separate chunk',
    'Preloading strategies (PreloadAllModules, custom) load lazy chunks in the background after initial paint',
    'defer block (Angular 17+) renders a template block lazily — on interaction, viewport, or idle',
    'Bundle analysis: ng build --stats-json + webpack-bundle-analyzer to find what\'s bloating your chunks',
  ],
  cheatSheet: [
    {
      concept: 'Virtual Scrolling (CDK)',
      explanation: 'Renders only the DOM nodes visible in the viewport. Eliminates thousands of nodes for long lists — the single biggest rendering win for data-heavy pages.',
      code: `<cdk-virtual-scroll-viewport itemSize="48" style="height:400px">
  <div *cdkVirtualFor="let item of items">
    {{ item.name }}
  </div>
</cdk-virtual-scroll-viewport>`,
    },
    {
      concept: '@defer (Angular 17+)',
      explanation: 'Defers rendering and downloading of a component until a trigger condition. Reduces initial bundle size and Time to Interactive.',
      code: `@defer (on interaction) {
  <heavy-chart [data]="data" />
} @placeholder {
  <div class="skeleton">Loading chart…</div>
}

<!-- Other triggers: on viewport, on idle, on timer(2s) -->`,
    },
    {
      concept: 'Preloading Strategies',
      explanation: 'After the initial route loads, Angular can preload lazy chunks in the background. PreloadAllModules loads everything. A custom strategy can preload only high-priority routes.',
      code: `RouterModule.forRoot(routes, {
  preloadingStrategy: PreloadAllModules
})

// Custom: only preload routes with data.preload === true
@Injectable({ providedIn: 'root' })
export class SelectivePreload implements PreloadingStrategy {
  preload(route: Route, fn: () => Observable<any>) {
    return route.data?.['preload'] ? fn() : EMPTY
  }
}`,
    },
    {
      concept: 'Pure Pipes over methods in templates',
      explanation: 'A method in a template runs on every CD cycle. A pure pipe only runs when its input reference changes. Always prefer pipes for data transformations.',
      code: `// ❌ runs every CD cycle
<li *ngFor="let u of users">{{ formatName(u) }}</li>

// ✅ runs only when u changes
<li *ngFor="let u of users">{{ u | formatName }}</li>

@Pipe({ name: 'formatName', pure: true })
export class FormatNamePipe implements PipeTransform {
  transform(u: User) { return \`\${u.first} \${u.last}\` }
}`,
    },
    {
      concept: 'Server-Side Rendering (Angular Universal / SSR)',
      explanation: 'Renders the initial HTML on the server, improving First Contentful Paint and SEO. Angular 17+ ships SSR support via ng add @angular/ssr with hydration built in.',
      code: `ng add @angular/ssr

// app.config.ts — server
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(), // reuse server-rendered DOM
  ]
}`,
    },
    {
      concept: 'Bundle analysis workflow',
      explanation: 'Identify bundle bloat before optimising. Build with stats, then visualise with webpack-bundle-analyzer.',
      code: `ng build --stats-json
npx webpack-bundle-analyzer dist/app/stats.json

# Common culprits: moment.js, lodash, large icon libraries
# Fixes: tree-shakeable alternatives, dynamic import(), onDemand icon loading`,
    },
  ],
  spokenAnswer: {
    question: 'A user reports that the Angular application feels slow on first load and when scrolling a large list. How do you approach fixing it?',
    answer: 'I split the problem into two: initial load and runtime. For initial load I\'d run ng build --stats-json and open it in webpack-bundle-analyzer to find what\'s bloating the main chunk — usually a library that should be lazy loaded, or a dependency that has a lighter alternative. I\'d also check that all non-critical routes are lazy loaded and consider adding a preloading strategy for the top routes. For the scroll performance I\'d profile in Chrome DevTools — if it\'s thousands of DOM nodes the fix is CDK virtual scrolling, which only renders the visible viewport. If it\'s expensive template expressions I\'d move them into pure pipes so they\'re memoized. If the component is still doing too much work each CD cycle I\'d switch it to OnPush and make sure inputs are immutable.',
    followUp: 'What is the @defer block and how does it differ from lazy loading a route?',
  },
  traps: [
    {
      trap: 'Lazy loading a route is enough — the initial bundle is always small',
      correction: 'Shared modules and third-party libraries imported in AppModule still end up in the main chunk — check the bundle analyser',
    },
    {
      trap: 'Virtual scrolling is only needed for lists with 10,000+ items',
      correction: 'Even 200–500 complex DOM nodes can cause scroll jank — profile first then decide',
    },
    {
      trap: 'SSR always improves performance',
      correction: 'SSR improves FCP and SEO but adds server cost and complexity; without proper hydration it can cause flickering',
    },
  ],
  quiz: [
    {
      id: 1,
      question: 'A template calls a method formatDate(item.date) inside *ngFor. When does this method run?',
      options: [
        'Once when the component initialises',
        'Only when item.date changes',
        'On every change detection cycle',
        'Only when the user interacts with that item',
      ],
      correct: 2,
      explanation: 'Template method calls are re-evaluated on every CD cycle. Replace with a pure pipe so it only runs when the input reference changes.',
    },
    {
      id: 2,
      question: 'What does the @defer (on viewport) trigger do?',
      options: [
        'Defers the HTTP request until the element scrolls into view',
        'Renders the deferred block only when it enters the browser viewport',
        'Preloads the lazy route when it becomes visible',
        'Pauses animations until the element is visible',
      ],
      correct: 1,
      explanation: '@defer (on viewport) delays both the download and rendering of the template block until the placeholder scrolls into view — ideal for below-the-fold content.',
    },
    {
      id: 3,
      question: 'Which tool do you use to visualise Angular bundle composition and find what\'s bloating a chunk?',
      options: [
        'Angular DevTools',
        'Chrome Lighthouse',
        'webpack-bundle-analyzer with --stats-json output',
        'source-map-explorer',
      ],
      correct: 2,
      explanation: 'ng build --stats-json produces a stats file; webpack-bundle-analyzer renders it as an interactive treemap showing exact sizes per module. source-map-explorer is also valid but the question asks about the --stats-json workflow.',
    },
  ],
}
