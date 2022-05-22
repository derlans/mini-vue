import { h, reactive } from '../lib/mini-vue.esm.js'
const children = {
  render() {
    console.log(this.props, 'this 也可以访问props')
    return h('input', {
      value: this.obj.msg,
      onInput: (e) => {
        console.log('input 事件触发成功', e)
      },
    }, ['hello world'])
  },
  setup(props) {
    console.log(props, 'props')
    console.log('props不能修改')
    props.props = 'props不能修改'
    console.log(props, 'props')

    const obj = reactive({ msg: 'hello' })
    window.obj = obj
    return {
      msg: 'mini vue',
      obj,
    }
  },
  name: 'children',
}
window.self = null
export const App = {
  render() {
    window.self = this
    const child = h(children, { props: '我是props' })
    return h('div', { value: this.obj.msg, class: 'red', onClick: () => { console.log('点击事件触发') } }, [`hello world${this.obj.msg}`, child])
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
