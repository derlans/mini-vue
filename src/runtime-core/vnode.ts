import type { ComponentOptions } from './component'
export type Tags='div' | 'img' | 'a'
export interface VNode{
  type: ComponentOptions
  props?: any
  children?: string | Array<any>
}
export function createVNode(
  type: ComponentOptions,
  props?: any,
  children?: string | Array<VNode>,
): VNode {
  const vnode = {
    type,
    props,
    children,
  }
  return vnode
}
