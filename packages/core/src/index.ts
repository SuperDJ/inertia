import { Router } from './router'

export * from './types'

export { default as setupProgress } from './progress'
export { default as createHeadManager } from './head'
export { default as shouldIntercept } from './shouldIntercept'
export { hrefToUrl, mergeDataIntoQueryString, urlWithoutHash } from './url'

export const router = new Router()
