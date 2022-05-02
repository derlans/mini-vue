import { reactiveHandler, readonlyHandler, readonlyShallowHandler } from './baseHandlers'
export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive__',
  IS_READONLY = '__v_isReadonly__',
}
export function reactive<T extends object>(raw: T): T {
  return new Proxy(raw, reactiveHandler)
}
export function readonly<T extends object>(raw: T): T {
  return new Proxy(raw, readonlyHandler)
}

export function shallowReadonly<T extends object>(raw: T): T {
  return new Proxy(raw, readonlyShallowHandler)
}
export function isReactive(value: unknown): boolean {
  return !!(value && (value as any)[ReactiveFlags.IS_REACTIVE])
}

export function isReadonly(value: unknown): boolean {
  return !!(value && (value as any)[ReactiveFlags.IS_READONLY])
}

export function isProxy(value: unknown): boolean {
  return isReactive(value) || isReadonly(value)
}
