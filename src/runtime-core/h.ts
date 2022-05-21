import type { VNodeType } from './vnode'
import { createVNode } from './vnode'

export function h(type: VNodeType, props: any, children: any) {
  return createVNode(
    type,
    props,
    children,
  )
}
