import { ReactiveEffect } from './effect'

class ComputedRefImpl {
  private _dirty = true
  private _value: any
  private _effect: ReactiveEffect
  constructor(private _getter: Function) {
    this._getter = _getter
    this._effect = new ReactiveEffect(_getter, () => {
      this._dirty = true
    })
  }

  get value() {
    if (this._dirty) {
      this._value = this._effect.run()
      // 收集了一次依赖就够了 算是性能优化吧 可能有分支切换 需要重新收集依赖
      // this._effect.active = false
      this._dirty = false
    }
    return this._value
  }
}

export function computed(getter: Function) {
  return new ComputedRefImpl(getter)
}
