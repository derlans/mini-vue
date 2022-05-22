import { shallowReadonly } from '../reactive'
import { initProps } from './componentProps'
import { componentProxyHandle } from './componentProxyHandle'
import type { Slot, VNode } from './vNode'
import { emit } from './componentEmit'
import { initSlots } from './componentSlot'
interface Emit{
  (eventName: string, ...args: any[]): void
}
interface Setup{
  (props: any, utils: { emit: Emit }): void
}
export interface ComponentOptions{
  name?: string
  template?: string
  setup?: Setup
  render?: () => any
}
export interface ComponentInstance{
  vnode: VNode
  type: ComponentOptions
  setupState?: object
  render?: Function
  proxy?: object
  props: object
  slots: object
}
export function createComponentInstance(vnode: VNode): ComponentInstance {
  const componentInstance = {
    vnode,
    type: vnode.type as ComponentOptions,
    props: {},
    slots: {},
  }
  return componentInstance
}
export function setupComponent(instance: ComponentInstance) {
  // TODO
  initSlots(instance, instance.vnode.children as Slot)
  initProps(instance, instance.vnode.props)
  setupStatefulComponent(instance)
  finishComponentSetup(instance)
}

export function setupStatefulComponent(instance: ComponentInstance) {
  const ComponentOptions = instance.type
  const props = instance.props
  const { setup } = ComponentOptions
  if (setup) {
    const setupResult = setup(shallowReadonly(props), {
      emit: emit.bind(null, instance),
    })
    handleSetupResult(instance, setupResult)
  }
  instance.proxy = new Proxy({ instance }, componentProxyHandle as any)
}
export function handleSetupResult(instance: ComponentInstance, setupResult: any) {
  if (typeof setupResult === 'object')
    instance.setupState = setupResult
}
export function finishComponentSetup(instance: ComponentInstance) {
  const component = instance.type
  if (component.render)
    instance.render = component.render
}
