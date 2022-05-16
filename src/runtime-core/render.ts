import type { ComponentInstance } from './component'
import { createComponentInstance, setupComponent } from './component'
import type { VNode } from './vNode'

export function render(vnode: VNode, container: Element) {
  patch(vnode, null, container)
}

export function patch(newVnode: VNode, oldVnode: VNode | null, container: Element) {
  // TODO 处理不同的vnode
  if (oldVnode === null)
    processComponent(newVnode, container)
}

export function processComponent(vnode: VNode, container: Element) {
  mountComponent(vnode, container)
}
export function mountComponent(vnode: VNode, container: Element) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance)
  setupRenderEffect(instance, container)
}

export function setupRenderEffect(instance: ComponentInstance, container: Element) {
  const subTree = instance.render!()
  patch(subTree, null, container)
}
