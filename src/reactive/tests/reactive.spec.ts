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
})
