import { h, reactive } from '../lib/mini-vue.esm.js'
const children = {
  render() {
    return h('input', { value: this.obj.msg }, ['hello world'])
  },
  setup() {
    const obj = reactive({ msg: 'hello' })
    window.obj = obj
    return {
      msg: 'mini vue',
      obj,
    }
  },
  name: 'children',
}
export const App = {
  render() {
    const child = h(children)
    return h('div', { value: this.obj.msg, class: 'red' }, [`hello world${this.obj.msg}`, child])
  },
  setup() {
    const obj = reactive({ msg: 'hello' })
    return {
      msg: 'mini vue',
      obj,
    }
  },
  name: 'App',
}
