import { hasChanged, isObject } from '../shared'
import type { ReactiveEffect } from './effect'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

class RefImpl<T> {
  public dep: Set<ReactiveEffect> = new Set()
  private _value: T
  private _rawValue: T
  constructor(value: T) {
    this._rawValue = value
    const _value = cover(value)
    this._value = _value
  }

  get value(): T {
    trackRefEffects(this.dep)
    return this._value
  }

  set value(newVal) {
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = cover(newVal)
      triggerEffects(this.dep)
    }
  }
}
export interface Ref<T> {
  value: T
}
export function ref<T>(value: T): Ref<T> {
  return new RefImpl(value)
}
export function trackRefEffects(dep: Set<ReactiveEffect>) {
  if (isTracking())
    trackEffects(dep)
}
export function cover<T>(value: T): T {
  if (isObject(value))
    return reactive(value)
  return value
}
