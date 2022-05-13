import type { VNode } from './vNode'

export function render(vnode: VNode, container: Element) {
  patch(vnode, null, container)
}

export function patch(newVnode: VNode, oldVnode: VNode | null, container: Element) {
  // TODO 处理不同的vnode
  if (oldVnode === null)
    mountComponent(newVnode, container)
}
export function mountComponent(vnode: VNode, container: Element) {
  const instance = createComponent(vnode)
}
