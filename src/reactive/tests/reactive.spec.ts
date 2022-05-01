import { effect } from '../effect'
import { reactive } from '../reactive'

describe('reactive', () => {
  it('start', () => {
    const raw = { a: 1, b: 2 }
    const reactiveRaw = reactive(raw)
    expect(reactiveRaw.a).toBe(1)
    expect(reactiveRaw.b).toBe(2)
    expect(reactiveRaw).not.toBe(raw)
    expect(reactiveRaw).toEqual(raw)
  })
  it('effect', () => {
    let effectRunCount = 0
    const a = { num: 10 }
    const reactiveA = reactive(a)
    effect(() => {
      effectRunCount = reactiveA.num
    })
    expect(effectRunCount).toBe(10)
    reactiveA.num = 20
    expect(effectRunCount).toBe(20)
  })
  it('effect double', () => {
    let effectRunCount = 0
    let effectRunCount2 = 0
    const a = { num: 10 }
    const reactiveA = reactive(a)
    effect(() => {
      effectRunCount = reactiveA.num
    })
    effect(() => {
      effectRunCount2 = reactiveA.num + 1
    })
    expect(effectRunCount).toBe(10)
    expect(effectRunCount2).toBe(11)
    reactiveA.num = 20
    expect(effectRunCount).toBe(20)
    expect(effectRunCount2).toBe(21)
  })
  it('effect self', () => {
    const raw = { a: 1 }
    const reactiveRaw = reactive(raw)
    try {
      effect(() => {
        reactiveRaw.a = reactiveRaw.a + 1
      })
    }
    catch (e) {
      expect((e as Error).message).toBe('Maximum call stack size exceeded')
    }
  })
})
