import { effect } from '../effect'
import { reactive } from '../reactive'
import { ref } from '../ref'
import { traverse, watch } from '../watch'

describe('Watch', () => {
  it('traverse', () => {
    const obj = reactive({ a: 1, b: 2, c: 3 })
    let count = 1
    effect(() => {
      traverse(obj)
      count++
    })
    expect(count).toBe(2)
    obj.a = 2
    expect(count).toBe(3)
  })
  it('deep traverse', () => {
    const obj = { a: reactive({ a: 1 }) }
    let count = 1
    effect(() => {
      traverse(obj)
      count++
    })
    expect(count).toBe(2)
    obj.a.a = 2
    expect(count).toBe(3)
  })
  it('ref traverse', () => {
    const obj = ref(1)
    let count = 1
    effect(() => {
      traverse(obj)
      count++
    })
    expect(count).toBe(2)
    obj.value = 2
    expect(count).toBe(3)
  })
  it('watch start', () => {
    const obj = reactive({ a: 1 })
    let count = 1
    watch(() => obj.a, () => {
      count++
    },
    )
    obj.a = 2
    expect(count).toBe(2)
  })
  it('watch ref', () => {
    const obj = ref(1)
    let count = 1
    watch(() => obj.value, () => {
      count++
    },
    )
    obj.value = 2
    expect(count).toBe(2)
    watch(obj, () => {
      count++
    })
    obj.value = 3
    expect(count).toBe(4)
  })
  it('watch cb', () => {
    const obj: { a: number;c?: number } = reactive({ a: 1 })
    let count: any
    let count2 = 0
    watch(() => obj.a, (oldValue) => {
      count = oldValue
      count2++
    })
    expect(count).toBe(undefined)
    expect(count2).toBe(0)
    obj.a = 2
    expect(count).toBe(1)
    expect(count2).toBe(1)
    obj.c = 3
    expect(count).toBe(1)
    expect(count2).toBe(1)
  })
  it('immediate', () => {
    const obj = reactive({ a: 1 })
    let count = 1
    let count2 = 0
    watch(() => obj.a, (oldValue, newValue) => {
      count = newValue
      count2 = oldValue
    },
    { immediate: true })
    expect(count).toBe(1)
    expect(count2).toBe(undefined)
    obj.a = 2
    expect(count).toBe(2)
    expect(count2).toBe(1)
  })
  it('flush', () => {
    const obj = reactive({ a: 1 })
    let count = 0
    let count2 = 0
    watch(() => obj.a, (oldValue, newValue) => {
      count = newValue
      count2 = oldValue
    },
    { flush: 'post' })
    expect(count).toBe(0)
    expect(count2).toBe(0)
    obj.a = 2
    expect(count).toBe(0)
    expect(count2).toBe(0)
    process.nextTick(() => {
      expect(count).toBe(2)
      expect(count2).toBe(1)
      watch(() => obj.a, (oldValue, newValue) => {
        count = newValue
        count2 = oldValue
      },
      { flush: 'pre' })
      obj.a = 3
      expect(count).toBe(3)
      expect(count2).toBe(2)
    })
  })
  // 这玩意还不太好理解 通俗来说就是在下一次修改后告诉上一次修改值已经更新了 你过期了
  it('onInvalidate', async() => {
    const obj = reactive({ a: 1 })
    let count = 0
    let flag = ''
    watch(() => obj.a, (oldValue, newValue, onInvalidate) => {
      count = newValue
      onInvalidate(() => {
        flag = `已经过期了${newValue}`
      })
    })
    expect(count).toBe(0)
    expect(flag).toBe('')
    obj.a = 2
    expect(count).toBe(2)
    expect(flag).toBe('')
    obj.a = 3
    expect(count).toBe(3)
    expect(flag).toBe('已经过期了2')
    obj.a = 4
    expect(count).toBe(4)
    expect(flag).toBe('已经过期了3')
  })
  it('onInvalidate 应用', async() => {
    const obj = reactive({ time: 100, value: 1 })
    function createPromise(timeout: number, value: number) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(value)
        }, timeout)
      })
    }
    let count = 0
    watch(() => obj.time, async(oldValue, newValue, onInvalidate) => {
      let expriced = false
      onInvalidate(() => {
        expriced = true
      })
      const res = await createPromise(obj.time, obj.value) as number
      if (!expriced)
        count = res
    })
    expect(count).toBe(0)
    obj.time = 200
    obj.value = 0
    await createPromise(200, 2)
    expect(count).toBe(1)
    obj.time = 200
    obj.value = 3
    obj.time = 100
    await createPromise(100, 100)
    expect(count).toBe(3)
    await createPromise(100, 100)
    expect(count).toBe(3)
    obj.value = 4
    obj.time = 400
    obj.value = 3
    obj.time = 300
    obj.value = 2
    obj.time = 200
    obj.value = 1
    obj.time = 100
    await createPromise(100, 100)
    expect(count).toBe(1)
    await createPromise(300, 100)
    expect(count).toBe(1)
  })
})
