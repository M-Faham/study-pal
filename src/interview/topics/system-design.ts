import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: "system-design",
  title: "System Design",
  icon: "🏗️",
  difficulty: "Architecture",
  targets: ['General'],
  cheatSheet: [
    {
      concept: "Micro-Frontend Architecture",
      explanation:
        "Split a large frontend into independently deployable vertical slices, each owned by a separate team. Module Federation (Webpack 5) is the standard mechanism.",
      code: `// Shell app (host) loads remote micro-frontends at runtime
// webpack.config.js in shell
new ModuleFederationPlugin({
  remotes: {
    checkout: 'checkout@https://checkout.myapp.com/remoteEntry.js',
    catalog:  'catalog@https://catalog.myapp.com/remoteEntry.js',
  }
})

// Usage in shell
const CheckoutApp = React.lazy(() => import('checkout/App'))`,
    },
    {
      concept: "BFF — Backend For Frontend",
      explanation:
        "A thin server layer that aggregates multiple downstream APIs into one tailored endpoint for a specific client (web, mobile). Reduces over-fetching and hides internal service topology.",
      code: `// Without BFF — client calls 3 APIs, assembles data itself
const [user, orders, prefs] = await Promise.all([
  fetch('/users/me'), fetch('/orders'), fetch('/preferences')
])

// With BFF — one call, server aggregates
const pageData = await fetch('/bff/account-page')
// BFF internally calls user-service, order-service, prefs-service`,
    },
    {
      concept: "Caching Strategy",
      explanation:
        "Layer caches from nearest to furthest: memory (React Query / NgRx), HTTP cache headers (Cache-Control, ETag), CDN, then origin. Match TTL to how frequently data changes.",
      code: `// React Query — 5 min stale time (in-memory cache)
useQuery({ queryKey: ['products'], staleTime: 5 * 60 * 1000 })

// HTTP cache header (from server response)
Cache-Control: public, max-age=300, stale-while-revalidate=60

// Service Worker — offline cache
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request) || fetch(event.request))
})`,
    },
    {
      concept: "API Gateway Pattern",
      explanation:
        "A single entry point for all client requests that handles routing, auth, rate limiting, and protocol translation. Clients talk to one URL; the gateway routes internally.",
      code: `// Client always hits one URL
GET https://api.myapp.com/v1/users
// Gateway routes to: user-microservice:3001/users
// Gateway handles: JWT validation, rate limit, logging`,
    },
  ],
  spokenAnswer: {
    question:
      "How would you design the frontend architecture for a large e-commerce platform with 10 teams?",
    answer: `With 10 teams working on the same frontend, the biggest risk is coupling — one team's release blocking another's. I'd propose a micro-frontend architecture using Module Federation. Each team owns a vertical slice: catalog, checkout, account, search. Each slice is independently deployable and the shell application composes them at runtime by loading remote entry points. Shared infrastructure — design system, auth, analytics — lives in a shared library that all teams consume as an npm package with a stable API contract. For state, I'd avoid a single global store shared across micro-frontends because it creates implicit coupling. Each micro-frontend manages its own state; they communicate through well-defined events or a lightweight event bus. The shell handles top-level routing and authentication. I'd also insist on a BFF layer per client type — web and mobile have different data needs, and letting them directly call 15 microservices creates fragile, over-fetching clients.`,
  },
  traps: [
    {
      trap: "Choosing micro-frontends for a small team",
      correction:
        "Micro-frontends add real operational complexity: separate deployments, shared dependency management, cross-app communication, and integration testing. For one or two teams, a well-structured monolith with clear module boundaries is simpler and faster.",
    },
    {
      trap: "Sharing too many dependencies between micro-frontends",
      correction:
        "If every micro-frontend loads its own copy of React or Angular, bundle sizes balloon. But over-sharing creates version coupling. Share only core framework dependencies at the shell level; keep business logic dependencies inside each micro-frontend.",
    },
  ],
  quiz: [
    {
      id: 1,
      question: "What problem does a Backend For Frontend (BFF) solve?",
      options: [
        "It replaces the need for a CDN",
        "It provides a tailored API endpoint that aggregates multiple services for a specific client, reducing over-fetching",
        "It handles frontend routing on the server",
        "It caches API responses in the browser",
      ],
      correct: 1,
      explanation:
        "A BFF sits between the client and microservices, aggregating and shaping data specifically for that client's needs. The web client gets one call instead of five, and internal service topology is hidden.",
    },
    {
      id: 2,
      question:
        "What is Module Federation used for in micro-frontend architecture?",
      options: [
        "Tree-shaking unused modules at build time",
        "Loading independently deployed frontend modules at runtime without sharing a build process",
        "Code-splitting single routes into async chunks",
        "Sharing TypeScript types between monorepo packages",
      ],
      correct: 1,
      explanation:
        "Module Federation (Webpack 5) lets a host application load remote JavaScript modules from separately deployed apps at runtime. Teams deploy independently; the shell composes them dynamically.",
    },
  ],
}
