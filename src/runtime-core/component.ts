import type { VNode } from './vNode'

export interface ComponentOptions{
  name?: string
  template?: string
  setup?: (props?: any) => any
  render?: (props: any) => any
}
export interface ComponentInstance{
  vnode: VNode
  type: VNode['type']
  setupState?: object
  render?: Function
}
export function createComponentInstance(vnode: VNode): ComponentInstance {
  const componentInstance = {
    vnode,
    type: vnode.type,
  }
  return componentInstance
}
export function setupComponent(instance: ComponentInstance) {
  // TODO
  // initProps
  // initSlotste
  setupStatefulComponent(instance)
}

export function setupStatefulComponent(instance: ComponentInstance) {
  const ComponentOptions = instance.type
  const { setup } = ComponentOptions
  if (setup) {
    const setupResult = setup()
    handleSetupResult(instance, setupResult)
  }
}
export function handleSetupResult(instance: ComponentInstance, setupResult: any) {
  if (typeof setupResult === 'object')
    instance.setupState = setupResult
}
export function finishComponentSetuo(instance: ComponentInstance) {
  const component = instance.type
  if (component.render)
    instance.render = component.render
}
