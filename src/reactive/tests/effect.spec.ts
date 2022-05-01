import { effect } from '../effect'
import { reactive } from '../reactive'

describe('effect', () => {
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
  it('effect runner', () => {
    const reactiveRaw = reactive({ a: 1 })
    let effectRunCount = 0
    const run = effect(() => {
      effectRunCount += reactiveRaw.a
    })
    expect(effectRunCount).toBe(1)
    reactiveRaw.a = 2
    expect(effectRunCount).toBe(3)
    run()
    expect(effectRunCount).toBe(5)
  })
})
