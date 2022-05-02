import { isObject } from '../shared'
import { track, trigger } from './effect'
import { ReactiveFlags, reactive, readonly } from './reactive'
export function createGetter(isReadonly = false) {
  return function get<T extends object>(target: T, key: string | symbol) {
    if (key === ReactiveFlags.IS_REACTIVE)
      return !isReadonly
    if (key === ReactiveFlags.IS_READONLY)
      return isReadonly
    const res = Reflect.get(target, key)
    if (isObject(res))
      return isReadonly ? readonly(res) : reactive(res)
    if (!isReadonly)
      track(target, key)
    return res
  }
}
export function createSetter(readonly = false) {
  return function set<T extends object>(target: T, key: string | symbol, value: any) {
    if (readonly) {
      console.warn(`set ${key.toString()} on ${target} is readonly`)
      return true
    }
    const res = Reflect.set(target, key, value)
    trigger(target, key)
    return res
  }
}
export const get = createGetter()
export const set = createSetter()

export const readonlyGet = createGetter(true)
export const readonlySet = createSetter(true)

export interface ReactiveEffect<T extends object> {
  get: (target: T, key: string | symbol) => any
  set: (target: T, key: string | symbol, value: any) => boolean
}
export const reactiveHandler: ProxyHandler<any> = {
  get,
  set,
}

export const readonlyHandler: ProxyHandler<any> = {
  get: readonlyGet,
  set: readonlySet,
}
