import { extend } from './shared'

export class ReactiveEffect {
  public deps: Set< Set<ReactiveEffect>> = new Set()
  public active = true
  public scheduler?: Function
  public onStop?: Function
  constructor(private _fn: Function) {
    this._fn = _fn
  }

  public run() {
    return this._fn()
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
}
let activeEffect: ReactiveEffect | undefined
export type EffectMap=Map<string | symbol, Set<ReactiveEffect>>
export type TrackMap=Map<object, EffectMap>
const trackMap: TrackMap = new Map()
export function track(target: object, key: string | symbol) {
  // 依赖收集
  let effectMap = trackMap.get(target)
  if (!effectMap)
    trackMap.set(target, effectMap = new Map())
  let effects = effectMap.get(key)
  if (!effects)
    effectMap.set(key, effects = new Set())
  if (activeEffect && !effects.has(activeEffect)) {
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
  activeEffect = _effect
  _effect.run()
  activeEffect = undefined
  const runner: ReactiveEffectRunner<T> = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner
}

export function stop(runner: ReactiveEffectRunner) {
  runner.effect.stop()
}
