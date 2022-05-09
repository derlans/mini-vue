import { computed } from '../computed'
import { reactive } from '../reactive'

describe('computed', () => {
  it('happy path', () => {
    const value = reactive({
      foo: 1,
    })

    const getter = computed(() => {
      return value.foo
    })

    value.foo = 2
    expect(getter.value).toBe(2)
  })

  it('should compute lazily', () => {
    const value = reactive({
      foo: 1,
    })
    const getter = jest.fn(() => {
      return value.foo
    })
    const cValue = computed(getter)

    // lazy
    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute until needed
    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)

    // now it should compute
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })
  it('分支切换', () => {
    const obj = reactive({ a: true, b: 3 })
    const v = computed(() => {
      if (obj.a)
        return true
      else
        return obj.b
    })
    expect(v.value).toBe(true)
    obj.a = false
    expect(v.value).toBe(3)
    obj.b++
    expect(v.value).toBe(4)
  })
})
