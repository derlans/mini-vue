// import { effect } from '../reactive'
import { shapeFlags } from '../shared/shapeFlags'
import type { ComponentInstance } from './component'
import { createComponentInstance, setupComponent } from './component'
import type { Tags, VNode } from './vNode'
export function render(vnode: VNode, container: Element) {
  patch(vnode, null, container)
}

export function patch(newVnode: VNode, oldVnode: VNode | null, container: Element) {
  // TODO 处理不同的vnode
  // removeAllChild(container)
  if (newVnode.shapeFlag & shapeFlags.ELEMENT)
    mountElement(newVnode, container)
  else if (newVnode.shapeFlag & shapeFlags.STATEFUL_COMPONENT)
    mountComponent(newVnode, container)
}

export function removeAllChild(container: Element) {
  while (container.firstChild)
    container.removeChild(container.firstChild)
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
  const subTree = instance.render!.call(instance.proxy) as VNode
  patch(subTree, null, container)
  instance.vnode.el = subTree.el
}

export function processElement(vnode: VNode, container: Element) {
  mountElement(vnode, container)
}
export function mountElement(vnode: VNode, container: Element) {
  // TODO Props
  const { children, props } = vnode
  const type = vnode.type as Tags
  const el = vnode.el = document.createElement(type)
  // handle props
  if (props) {
    for (const key in props) {
      const value = props[key]
      el.setAttribute(key, value)
    }
  }
  // handle children
  if (vnode.shapeFlag & shapeFlags.TEXT_CHILDREN)
    processText(children as string, el)
  if (vnode.shapeFlag & shapeFlags.ARRAY_CHILDREN)
    mountChildren(children as [], el)

  container.appendChild(el)
}
function mountChildren(children: Array<string | VNode>, container: Element) {
  for (const child of children) {
    if (typeof child === 'string')
      processText(child, container)
    else
      processComponent(child, container)
  }
}
export function processText(text: string, container: Element) {
  mountText(text, container)
}
export function mountText(text: string, container: Element) {
  const el = document.createTextNode(text)
  container.appendChild(el)
}
