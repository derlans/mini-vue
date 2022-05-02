import { reactiveHandler, readonlyHandler } from './baseHandlers'
export function reactive<T extends object>(raw: T): T {
  return new Proxy(raw, reactiveHandler)
}
export function readonly<T extends object>(raw: T): T {
  return new Proxy(raw, readonlyHandler)
}
