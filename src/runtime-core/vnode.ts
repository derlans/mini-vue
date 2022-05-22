import { shapeFlags } from '../shared/shapeFlags'
import { isObject } from '../shared'

import type { ComponentOptions } from './component'
export type Tags='div' | 'img' | 'a'
export type VNodeType=ComponentOptions | Tags
export interface VNode{
  type: VNodeType
  props?: any
  children?: Array<string | VNode> | string
  el?: Element
  shapeFlag: number
}
export function createVNode(
  type: VNodeType,
  props?: any,
  children?: Array<string> | Array<VNode>,
): VNode {
  let shapeFlag = 0
  if (typeof type === 'string')
    shapeFlag = shapeFlag | shapeFlags.ELEMENT
  else if (isObject(type))
    shapeFlag = shapeFlag | shapeFlags.STATEFUL_COMPONENT
  if (Array.isArray(children))
    shapeFlag = shapeFlag | shapeFlags.ARRAY_CHILDREN
  else if (typeof children === 'string')
    shapeFlag = shapeFlag | shapeFlags.TEXT_CHILDREN
  const vnode = {
    type,
    props: props || {},
    children,
    shapeFlag,
  }
  return vnode
}
