import { isOwn } from '../shared'
import type { ComponentInstance } from './component'
const propoertiesMap = {
  $el: (instance: ComponentInstance) => instance.vnode.el,
}
type Propoerties='$el'
export const componentProxyHandle = {
  get({ instance }: { instance: ComponentInstance }, key: string | symbol) {
    const setupState = instance.setupState as any
    const props = instance.props as any
    if (isOwn(setupState, key))
      return setupState[key]
    if (isOwn(props, key))
      return props[key]
    if (isOwn(propoertiesMap, key))
      return propoertiesMap[key as Propoerties](instance)
  },
}
