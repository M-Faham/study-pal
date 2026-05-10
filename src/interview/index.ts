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
import { topic as httpStatusCodes } from './topics/http-status-codes'
import { topic as authentication } from './topics/authentication'
import { topic as testing } from './topics/testing'
import { topic as browserInternals } from './topics/browser-internals'
import { topic as renderingLifecycle } from './topics/rendering-lifecycle'
import { topic as security } from './topics/security'
import { topic as cicd } from './topics/cicd'
import { topic as angularAdvanced } from './topics/angular-advanced'
import { topic as angularStorageInterceptors } from './topics/angular-storage-interceptors'
import { topic as angularCommon } from './topics/angular-common'
import { topic as angularChangeDetection } from './topics/angular-change-detection'
import { topic as rxjsAdvanced } from './topics/rxjs-advanced'
import { topic as ngrxState } from './topics/ngrx-state'
import { topic as angularTesting } from './topics/angular-testing'
import { topic as angularPerformance } from './topics/angular-performance'

export const allInterviewTopics: IInterviewTopic[] = [
  htmlSemantics,
  cssFundamentals,
  oopFundamentals,
  javascriptCore,
  designPatterns,
  angularDeepDives,
  angularAdvanced,
  angularChangeDetection,
  angularStorageInterceptors,
  angularCommon,
  angularPerformance,
  angularTesting,
  typescriptTraps,
  rxjs,
  rxjsAdvanced,
  ngrxState,
  stateManagement,
  performance,
  systemDesign,
  frontendArchitecture,
  cleanCode,
  apiIntegration,
  httpStatusCodes,
  authentication,
  testing,
  browserInternals,
  renderingLifecycle,
  security,
  cicd,
]

export type { IInterviewTopic }
