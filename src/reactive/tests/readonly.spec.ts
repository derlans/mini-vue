import { isReadonly, readonly } from '../reactive'

describe('readonly', () => {
  it('should be readonly', () => {
    console.warn = jest.fn()
    const readonlyData = readonly({ a: 1, b: 2 })
    expect(readonlyData.a).toBe(1)
    expect(readonlyData.b).toBe(2)
    readonlyData.a = 2
    expect(readonlyData.a).toBe(1)
    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(isReadonly(readonlyData)).toBe(true)
  })
})
