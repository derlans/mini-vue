export class ReactiveEffect {
  constructor(private _fn: Function, public scheduler?: Function) {
    this._fn = _fn
    this.scheduler = scheduler
  }

  public run() {
    return this._fn()
  }
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
  if (activeEffect && !effects.has(activeEffect))
    effects.add(activeEffect)
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
export function effect(fn: Function, options?: { scheduler?: Function }) {
  const { scheduler } = options || {}
  const _effect = new ReactiveEffect(fn, scheduler)
  activeEffect = _effect
  _effect.run()
  activeEffect = undefined
  return _effect.run.bind(_effect)
}
