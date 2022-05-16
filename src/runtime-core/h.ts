import type { ComponentOptions } from './component'
import { createVNode } from './vnode'

export function h(type: ComponentOptions, props: any, children: any) {
  return createVNode(
    type,
    props,
    children,
  )
}
