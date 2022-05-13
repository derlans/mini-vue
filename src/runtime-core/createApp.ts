import type { ComponentOptions } from './component'
import { render } from './render'
import { createVNode } from './vNode'
export function createApp(rootComponent: ComponentOptions) {
  const app = {
    _component: rootComponent,
    mount(rootContainer: string | Element) {
      // 创建VNode 然后render
      const vnode = createVNode(rootComponent)
      render(vnode, getElement(rootContainer)!)
    },
  }
  return app
}

function getElement(container: string | Element) {
  return typeof container === 'string' ? document.querySelector(container) : container
}
