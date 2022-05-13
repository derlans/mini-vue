import { effect } from '../effect'
import { isProxy, isReactive, reactive } from '../reactive'

describe('reactive', () => {
  it('start', () => {
    const raw = { a: 1, b: 2 }
    const reactiveRaw = reactive(raw)
    expect(reactiveRaw.a).toBe(1)
    expect(reactiveRaw.b).toBe(2)
    expect(reactiveRaw).not.toBe(raw)
    expect(reactiveRaw).toEqual(raw)
  })
  it('isReactive should be true', () => {
    const raw = { a: 1, b: 2 }
    const reactiveRaw = reactive(raw)
    expect(isReactive(reactiveRaw)).toBe(true)
    expect(isReactive(raw)).toBe(false)
    expect(isProxy(reactiveRaw)).toBe(true)
    expect(isProxy(raw)).toBe(false)
  })
  test('nested reactives', () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    }
    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })
  // TODO fix this test
  it.skip('原型链', () => {
    const obj: any = {}
    const proto = { bar: 1 }
    const child = reactive(obj)
    const parent = reactive(proto)
    Object.setPrototypeOf(child, parent)
    const fn = jest.fn(() => {
      child.bar
    })
    effect(fn)
    expect(fn).toHaveBeenCalledTimes(1)
    child.bar = 2
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
