import { h } from '../lib/mini-vue.esm.js'

const children = {
  render() {
    console.log(this.$slots)
    return h('div', null, [this.$slots.default(), this.$slots.slot1()])
  },
  setup() {
    return {}
  },
}
export const slotApp = {
  render() {
    const defaultSlot = () => h('div', null, '默认插槽')
    const slot1 = () => h('div', null, '插槽一')
    const child = h(children, {}, { slot1, default: defaultSlot })
    return h('div', {}, [child])
  },
  setup() {
    return {}
  },
}
