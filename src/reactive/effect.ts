import { extend } from '../shared'
let activeEffect: ReactiveEffect | undefined
let shouldTrack = false
export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}
export class ReactiveEffect {
  public deps: Set< Set<ReactiveEffect>> = new Set()
  public active = true
  public scheduler?: Function
  public onStop?: Function
  constructor(private _fn: Function) {
    this._fn = _fn
  }

  public run() {
    if (!this.active)
      return this._fn()
    // 为什么要把ReactiveEffect状态的操作封装进入ReactiveEffect 暂时还没有发现优势
    activeEffect = this as ReactiveEffect
    shouldTrack = true
    const res = this._fn()
    shouldTrack = false
    activeEffect = undefined
    return res
  }

  public stop() {
    if (!this.active)
      return
    this.active = false
    clearEffects(this)
    if (this.onStop)
      this.onStop()
  }
}
function clearEffects(reactiveEffect: ReactiveEffect) {
  for (const dep of reactiveEffect.deps)
    dep.delete(reactiveEffect)
  reactiveEffect.deps.clear()
}
export type EffectMap=Map<string | symbol, Set<ReactiveEffect>>
export type TrackMap=Map<object, EffectMap>
const trackMap: TrackMap = new Map()
export function track(target: object, key: string | symbol) {
  // 如果不需要收集直接返回
  if (!(shouldTrack && activeEffect !== undefined))
    return
  // 依赖收集
  let effectMap = trackMap.get(target)
  if (!effectMap)
    trackMap.set(target, effectMap = new Map())
  let effects = effectMap.get(key)
  if (!effects)
    effectMap.set(key, effects = new Set())
  if (!effects.has(activeEffect!)) {
    effects.add(activeEffect)
    // 把储存了这个依赖的set存入ReactiveEffect的deps中 这样ReactiveEffect就知道被哪些依赖了
    activeEffect.deps.add(effects)
  }
  return effects
}

export function trigger(target: object, key: string | symbol) {
  const effects = trackMap.get(target)
  if (!effects)
    return
  const effectsSet = effects.get(key)
  if (!effectsSet)
    return
  for (const effect of effectsSet) {
    if (effect.scheduler)
      effect.scheduler()
    else
      effect.run()
  }
}
export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}
export interface effectOptions{
  scheduler?: Function
  onStop?: Function
}
export function effect<T>(fn: () => T, options?: effectOptions): ReactiveEffectRunner {
  const _effect = new ReactiveEffect(fn)
  extend(_effect, options)
  _effect.run()
  const runner: ReactiveEffectRunner<T> = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner
}

export function stop(runner: ReactiveEffectRunner) {
  runner.effect.stop()
}
