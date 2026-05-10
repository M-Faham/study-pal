import type { IInterviewTopic } from './types'

import { topic as htmlSemantics } from './topics/html-semantics'
import { topic as cssFundamentals } from './topics/css-fundamentals'
import { topic as oopFundamentals } from './topics/oop-fundamentals'
import { topic as javascriptCore } from './topics/javascript-core'
import { topic as designPatterns } from './topics/design-patterns'
import { topic as angularDeepDives } from './topics/angular-deep-dives'
import { topic as typescriptTraps } from './topics/typescript-traps'
import { topic as rxjs } from './topics/rxjs'
import { topic as stateManagement } from './topics/state-management'
import { topic as performance } from './topics/performance'
import { topic as systemDesign } from './topics/system-design'
import { topic as frontendArchitecture } from './topics/frontend-architecture'
import { topic as cleanCode } from './topics/clean-code'
import { topic as apiIntegration } from './topics/api-integration'
import { topic as authentication } from './topics/authentication'
import { topic as testing } from './topics/testing'
import { topic as browserInternals } from './topics/browser-internals'
import { topic as renderingLifecycle } from './topics/rendering-lifecycle'
import { topic as security } from './topics/security'
import { topic as cicd } from './topics/cicd'
import { topic as angularAdvanced } from './topics/angular-advanced'
import { topic as angularStorageInterceptors } from './topics/angular-storage-interceptors'
import { topic as angularCommon } from './topics/angular-common'

export const allInterviewTopics: IInterviewTopic[] = [
  htmlSemantics,
  cssFundamentals,
  oopFundamentals,
  javascriptCore,
  designPatterns,
  angularDeepDives,
  typescriptTraps,
  rxjs,
  stateManagement,
  performance,
  systemDesign,
  frontendArchitecture,
  cleanCode,
  apiIntegration,
  authentication,
  testing,
  browserInternals,
  renderingLifecycle,
  security,
  cicd,
  angularAdvanced,
  angularStorageInterceptors,
  angularCommon,
]

export type { IInterviewTopic }
