import type { ComponentInstance } from './component'
const propoertiesMap = {
  $el: (instance: ComponentInstance) => instance.vnode.el,
}
type Propoerties='$el'
export const componentProxyHandle = {
  get({ instance }: { instance: ComponentInstance }, key: string | symbol) {
    const setupState = instance.setupState as any
    if (key in setupState)
      return setupState[key]
    if (key in propoertiesMap)
      return propoertiesMap[key as Propoerties](instance)
  },
}
