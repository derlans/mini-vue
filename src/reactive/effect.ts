export class ReactiveEffect {
  public deps: Set< Set<ReactiveEffect>> = new Set()
  public active = true
  constructor(private _fn: Function, public scheduler?: Function) {
    this._fn = _fn
    this.scheduler = scheduler
  }

  public run() {
    return this._fn()
  }

  public stop() {
    if (!this.active)
      return
    this.active = false
    clearEffects(this)
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
export function effect(fn: Function, options?: { scheduler?: Function }): ReactiveEffectRunner {
  const { scheduler } = options || {}
  const _effect = new ReactiveEffect(fn, scheduler)
  activeEffect = _effect
  _effect.run()
  activeEffect = undefined
  const runner: ReactiveEffectRunner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner
}

export function stop(runner: ReactiveEffectRunner) {
  runner.effect.stop()
}
