import { h } from '../src/runtime-core/h'
export const App = {
  render() {
    return h('div', null, `hello world${this.msg}`)
  },
  setup() {
    return {
      msg: 'mini vue',
    }
  },
}
