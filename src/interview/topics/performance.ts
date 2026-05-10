import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: "performance",
  title: "Performance Optimization",
  icon: "⚡",
  difficulty: "Architecture",
  targets: ['Angular', 'React'],
  cheatSheet: [
    {
      concept: "OnPush + Immutability — The Foundation",
      explanation:
        "OnPush cuts the number of components Angular checks on each cycle. Combined with immutable data patterns it is the single highest-impact change detection optimisation.",
      code: `@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  @Input() items: Item[] = []  // must receive new array reference to update
}

// Parent — always return new array, never mutate
this.items = [...this.items, newItem]  // ✅
this.items.push(newItem)               // ❌ OnPush won't detect this`,
    },
    {
      concept: "trackBy — Prevent DOM Thrashing",
      explanation:
        "Without trackBy, Angular destroys and recreates every list item DOM node when the array reference changes. trackBy maps items to stable keys so Angular reuses existing nodes.",
      code: `<li *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</li>

trackById(_: number, item: Item): number { return item.id }`,
    },
    {
      concept: "Lazy Loading Modules & Routes",
      explanation:
        "Split the app into feature modules and load them only when the user navigates there. Reduces the initial bundle and time-to-interactive.",
      code: `// Angular router — lazy load the admin module
{
  path: 'admin',
  loadChildren: () =>
    import('./admin/admin.module').then(m => m.AdminModule)
}

// React — lazy load a route
const Dashboard = React.lazy(() => import('./Dashboard'))
<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>`,
    },
    {
      concept: "Memoization — useMemo / memo / pure pipe",
      explanation:
        "Prevent re-computation of expensive derivations. In React: useMemo + React.memo. In Angular: pure pipes (memoized by default) and NgRx selectors.",
      code: `// React — memoize expensive filter
const filtered = useMemo(
  () => largeList.filter(i => i.active),
  [largeList]
)

// Angular — pure pipe runs only when input reference changes
@Pipe({ name: 'activeItems', pure: true })  // pure is the default
export class ActiveItemsPipe implements PipeTransform {
  transform(items: Item[]) { return items.filter(i => i.active) }
}`,
    },
    {
      concept: "Virtual Scrolling for Long Lists",
      explanation:
        "Rendering 10,000 DOM nodes causes layout thrashing. Virtual scrolling renders only the visible items — typically 20–50 at a time. Angular CDK provides ScrollingModule out of the box.",
      code: `// Angular CDK virtual scroll
<cdk-virtual-scroll-viewport itemSize="50" class="list">
  <div *cdkVirtualFor="let item of items">{{ item.name }}</div>
</cdk-virtual-scroll-viewport>

// React — react-virtual or TanStack Virtual
const rowVirtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50,
})`,
    },
  ],
  spokenAnswer: {
    question:
      "How would you diagnose and fix a sluggish Angular list that contains 500 items?",
    answer: `I'd start by profiling with Chrome DevTools and Angular DevTools to see exactly where time is being spent — is it change detection, layout/paint, or JavaScript execution? My first fix is almost always to add OnPush change detection to the list component and any item components, because by default Angular checks every component on every event. The second thing I'd look for is whether trackBy is in use on the ngFor — without it, every data refresh destroys and recreates 500 DOM nodes even if only one item changed. For 500 items that's usually fast enough, but if it were 5,000 or 50,000 items I'd replace the simple ngFor with CDK virtual scrolling, which only renders the items currently in the viewport. If there's any expensive computation inside the template or in methods called from the template, I'd move that into a pure pipe or an NgRx selector so it's memoized. After each change I'd re-profile to validate the improvement rather than assuming it helped.`,
  },
  traps: [
    {
      trap: "Using a method call in the template for derived values",
      correction:
        "A method called in the template runs on every change detection cycle — potentially hundreds of times per second. Use a pure pipe or memoize with useMemo/NgRx selector so it only recomputes when the input changes.",
    },
    {
      trap: "Optimising before measuring",
      correction:
        "Premature optimisation wastes time and adds complexity. Profile first with Angular DevTools or React Profiler. Fix only what the data shows is slow. Most performance problems are in one or two hot paths, not everywhere.",
    },
    {
      trap: "Putting everything in a lazy-loaded module but forgetting shared dependencies",
      correction:
        "If a shared library (like a UI component library) is imported in both the main bundle and a lazy module, it gets bundled twice. Use a SharedModule or proper import strategy to ensure shared code is in the common chunk.",
    },
  ],
  quiz: [
    {
      id: 1,
      question:
        "A method called in an Angular template runs hundreds of times per second during scroll. What is the right fix?",
      options: [
        "Move the method to the constructor",
        "Replace the method call with a pure pipe or pre-computed property",
        "Add OnPush change detection to the host component",
        "Switch to a setTimeout to throttle the calls",
      ],
      correct: 1,
      explanation:
        "Any expression in the template is evaluated every change detection cycle. A pure pipe or pre-computed property (via ngOnChanges or an NgRx selector) runs only when the input changes — not on every cycle.",
    },
    {
      id: 2,
      question:
        "You have a list of 10,000 items. What is the most effective way to prevent DOM performance issues?",
      options: [
        "Add trackBy to ngFor",
        "Use OnPush on the list component",
        "Use virtual scrolling — only render visible items",
        "Paginate to show 10 items at a time",
      ],
      correct: 2,
      explanation:
        "trackBy and OnPush help with update performance, but 10,000 DOM nodes still exist and cause layout cost. Virtual scrolling renders only the visible subset — 20–50 nodes — making the initial render and scrolling both fast.",
    },
    {
      id: 3,
      question:
        "What is the Angular CDK feature that renders only visible list items?",
      options: [
        "cdkDrag",
        "cdk-virtual-scroll-viewport with *cdkVirtualFor",
        "cdkTrapFocus",
        "cdkOverlay",
      ],
      correct: 1,
      explanation:
        "cdk-virtual-scroll-viewport with *cdkVirtualFor is Angular CDK's virtual scrolling implementation. It calculates which items are in the viewport and renders only those, drastically reducing DOM node count for large lists.",
    },
  ],
}
