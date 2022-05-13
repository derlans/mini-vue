import type { VNode } from './vNode'

export interface ComponentOptions{
  name?: string
  template?: string
  setup?: (props: any) => any
  render?: (props: any) => any
}
export interface ComponentInstance{
  vnode: VNode
  type: VNode['type']
}
export function createComponent(vnode: VNode): ComponentInstance {
  const component = {
    vnode,
    type: vnode.type,
  }
  return component
}
export function setupComponent(instance: ComponentInstance) {
  // TODO
  // initProps
  // initSlots
}
