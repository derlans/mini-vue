import type { ComponentOptions } from './component'
export type Tags='div' | 'img' | 'a'
export type VNodeType=ComponentOptions | Tags
export interface VNode{
  type: VNodeType
  props?: any
  children?: Array<string | VNode> | string
}
export function createVNode(
  type: VNodeType,
  props?: any,
  children?: Array<string> | Array<VNode>,
): VNode {
  const vnode = {
    type,
    props,
    children,
  }
  return vnode
}
