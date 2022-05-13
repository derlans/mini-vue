import { effect } from './effect'
import { isRef } from './ref'

export function traverse(value: any, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value))
    return
  if (isRef(value)) {
    seen.add(value)
    traverse(value.value, seen)
    return
  }
  seen.add(value)
  for (const k in value)
    traverse(value[k], seen)

  return value
}
interface watchOptions {
  immediate?: boolean
  flush?: 'pre' | 'post'
}
export function watch(source: object | Function, cb: (oldValue: any, newValue: any, onInvalidate: (fn: Function) => void) => void, options?: watchOptions) {
  options = options || {}
  const { immediate = false, flush = 'pre' } = options
  let getter: Function
  if (typeof source === 'function')
    getter = source
  else
    getter = () => traverse(source)
  let oldValue: any
  let newValue: any
  let cleanup: Function | undefined
  function onInvalidate(fn: Function) {
    cleanup = fn
  }
  const effectRunner = effect(() => getter(), {
    lazy: true,
    scheduler: () => {
      if (flush === 'post') {
        const p = Promise.resolve()
        p.then(job)
      }
      else {
        job()
      }
    },
  })
  function job() {
    newValue = effectRunner()
    if (cleanup)
      cleanup()
    cb(oldValue, newValue, onInvalidate)
    oldValue = newValue
  }

  if (immediate)
    job()
  else
    oldValue = effectRunner()
}
