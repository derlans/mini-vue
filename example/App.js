import { h, reactive } from '../lib/mini-vue.esm.js'
const children = {
  render() {
    console.log(this.props, 'this 也可以访问props')
    return h('input', {
      value: this.obj.msg,
      onInput: (e) => {
        console.log('input 事件触发成功', e)
        this.emitEvent(e.data)
      },
    }, ['hello world'])
  },
  setup(props, { emit }) {
    console.log(props, 'props')
    console.log('props不能修改')
    props.props = 'props不能修改'
    console.log(props, 'props')
    emit('test', 'emit事件')
    const obj = reactive({ msg: 'hello' })
    window.obj = obj
    function emitEvent(data) {
      emit('test', data)
    }
    return {
      msg: 'mini vue',
      obj,
      emitEvent,
    }
  },
  name: 'children',
}
window.self = null
export const App = {
  render() {
    window.self = this
    const child = h(children, { props: '我是props', onTest: this.onTest })
    return h('div', { value: this.obj.msg, class: 'red', onClick: () => { console.log('点击事件触发') } }, [`hello world${this.obj.msg}`, child])
  },
  setup() {
    const obj = reactive({ msg: 'hello' })
    function onTest(msg) {
      console.log(msg, 'Ontest')
    }
    return {
      msg: 'mini vue',
      obj,
      onTest,
    }
  },
  name: 'App',
}
