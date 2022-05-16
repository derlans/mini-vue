import type { ComponentOptions } from './component'
import { render } from './render'
import { createVNode } from './vNode'
export function createApp(rootComponent: ComponentOptions) {
  const app = {
    _component: rootComponent,
    mount(rootContainer: string | Element) {
      // 创建VNode 然后render
      console.log('基于根组件创建 vnode')
      const vnode = createVNode(rootComponent)
      console.log('调用 render，基于 vnode 进行开箱')
      render(vnode, getElement(rootContainer)!)
    },
  }
  return app
}

function getElement(container: string | Element) {
  return typeof container === 'string' ? document.querySelector(container) : container
}
