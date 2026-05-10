import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: "cicd",
  title: "CI/CD Frontend Workflow",
  icon: "🚀",
  difficulty: "Core",
  targets: ['General'],
  keyPoints: [
    'CI: run tests + lint + build on every push — catch regressions early',
    'CD: deploy automatically to staging; manual gate to production',
    'Feature flags decouple deploy from release',
    'Blue-green deployment: switch traffic between two identical environments',
    'Rollback strategy: keep previous build artifact ready to redeploy',
  ],
  cheatSheet: [
    {
      concept: "CI Pipeline Stages for Frontend",
      explanation:
        "Install → Lint → Type-check → Unit tests → Build → E2E → Deploy. Fail fast: lint and type-check before running slower tests.",
      code: `# .github/workflows/ci.yml
jobs:
  ci:
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci               # deterministic install
      - run: npm run lint         # fast — fail early
      - run: npm run type-check   # tsc --noEmit
      - run: npm test -- --ci    # unit tests
      - run: npm run build       # production build
      - run: npm run e2e:ci      # Cypress headless`,
    },
    {
      concept: "Bundle Size Budgets",
      explanation:
        "Set size limits in the build config. The build fails if a bundle exceeds the budget — prevents silent bundle bloat from new dependencies.",
      code: `// angular.json — fail build if bundle too large
"budgets": [
  { "type": "initial", "maximumWarning": "500kb", "maximumError": "1mb" },
  { "type": "anyComponentStyle", "maximumWarning": "2kb" }
]

// Vite / Rollup — rollup-plugin-visualizer to inspect bundle
import { visualizer } from 'rollup-plugin-visualizer'
// Generates stats.html — shows every module's size`,
    },
    {
      concept: "Preview / Staging Deployments",
      explanation:
        "Deploy every PR to an isolated preview URL for QA and stakeholder review before merging. Vercel, Netlify, and Azure Static Web Apps do this automatically.",
      code: `# Vercel — automatic preview for every PR
# No config needed — Vercel detects push to PR branch
# Preview URL: https://myapp-git-feature-branch.vercel.app

# Manual GitHub Actions preview
- name: Deploy preview
  run: npx vercel deploy --token \${{ secrets.VERCEL_TOKEN }}`,
    },
    {
      concept: "Environment Variables in CI",
      explanation:
        "Store secrets in CI/CD secrets store, not in the repository. Inject them at build time for frontend bundles. Never commit .env files.",
      code: `# GitHub Actions — secrets injected as env vars
- name: Build
  env:
    VITE_API_URL: \${{ secrets.VITE_API_URL }}
    VITE_ANALYTICS_KEY: \${{ secrets.VITE_ANALYTICS_KEY }}
  run: npm run build

# .gitignore — never commit
.env
.env.production
.env.local`,
    },
  ],
  spokenAnswer: {
    question:
      "Walk me through the CI/CD pipeline you would set up for a frontend application.",
    answer: `My CI pipeline follows a fail-fast principle — I want the cheapest checks to run first so I'm not waiting five minutes for a build to fail on a lint error. So the order is: install dependencies using npm ci for a deterministic install from the lockfile, then lint and TypeScript type-checking in parallel — these are fast and catch the most common mistakes. Then unit tests with coverage thresholds. Then the production build with bundle size budgets enforced so we catch accidental dependency bloat. Then E2E tests against the built artifacts — these are slower so they run last. For CD, every PR gets a preview deployment automatically — stakeholders and QA can review at a real URL before anything merges. Main branch merges deploy to staging automatically, and production deployments are either automatic after staging passes a smoke test or gated on manual approval depending on the team's risk tolerance. Environment secrets are stored in the CI/CD secrets store — never in the repository — and injected at build time. I also set up bundle size monitoring so we get notified if a PR adds significant weight to the bundle.`,
  },
  traps: [
    {
      trap: "Using npm install instead of npm ci in CI pipelines",
      correction:
        "npm install can update package-lock.json and install different versions than those in the lockfile. npm ci deletes node_modules and installs exactly what's in the lockfile — deterministic and faster.",
    },
    {
      trap: "Committing .env files or secrets to the repository",
      correction:
        "Even a private repository can be leaked or have its access history exposed. Store secrets in the CI/CD platform's secrets store (GitHub Secrets, GitLab CI variables) and inject them as environment variables at build or deploy time.",
    },
  ],
  quiz: [
    {
      id: 1,
      question: "Why use npm ci instead of npm install in a CI pipeline?",
      options: [
        "npm ci is faster because it skips the integrity check",
        "npm ci installs exactly what is in the lockfile — deterministic, never modifies package-lock.json",
        "npm install does not work in headless environments",
        "npm ci automatically runs tests after installation",
      ],
      correct: 1,
      explanation:
        "npm ci removes node_modules and installs exactly the versions specified in package-lock.json. npm install can update the lockfile if ranges allow newer versions — leading to different dependencies in CI vs local.",
    },
    {
      id: 2,
      question:
        "What is the purpose of bundle size budgets in an Angular build config?",
      options: [
        "To limit the number of HTTP requests the app can make",
        "To fail the build if any bundle exceeds the size limit — preventing silent bundle bloat",
        "To split the bundle into exactly equal-sized chunks",
        "To set a maximum number of components per module",
      ],
      correct: 1,
      explanation:
        "Size budgets make bundle size a hard constraint. If a PR adds a large dependency that pushes the bundle over the limit, the build fails — catching the bloat before it reaches production instead of noticing it when users complain about slow load times.",
    },
  ],
}
