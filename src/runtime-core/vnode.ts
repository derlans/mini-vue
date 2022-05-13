import type { ComponentOptions } from './component'
export interface VNode{
  type: ComponentOptions
  props?: any
  children?: string | Array<any>
}
export function createVNode(
  type: ComponentOptions,
  props?: any,
  children?: string | Array<any>,
): VNode {
  const vnode = {
    type,
    props,
    children,
  }
  return vnode
}
