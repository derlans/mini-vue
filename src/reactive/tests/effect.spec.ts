import { effect, stop } from '../effect'
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
  // TODO 解决effect无限循环的问题
  it.skip('effect self Maximum call stack', () => {
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
  it('effect self', () => {
    const raw = { a: 1 }
    const reactiveRaw = reactive(raw)
    effect(() => {
      reactiveRaw.a = reactiveRaw.a + 1
    })
    expect(raw.a).toBe(2)
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

  it('scheduler', () => {
    let dummy
    let run: any
    let runner: any
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler },
    )
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // // should not run yet
    expect(dummy).toBe(1)
    // // manually run
    run()
    // // should have run
    expect(dummy).toBe(2)
  })
  it('stop', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    // obj.prop = 3
    obj.prop++
    expect(dummy).toBe(2)

    // stopped effect should still be manually callable
    runner()
    expect(dummy).toBe(3)
  })
  it('events: onStop', () => {
    const onStop = jest.fn()
    const runner = effect(() => {}, {
      onStop,
    })

    stop(runner)
    expect(onStop).toHaveBeenCalled()
  })
  it('分支切换', () => {
    const obj = reactive({ a: true, b: 3 })
    let dummy = 1
    const event = jest.fn(() => {
      if (obj.a)
        dummy = obj.b
      else
        dummy++
    })
    effect(event)
    expect(dummy).toBe(3)
    obj.a = false
    expect(dummy).toBe(4)
    obj.b++
    expect(dummy).toBe(4)
    expect(event).toHaveBeenCalledTimes(2)
  })
  it('嵌套effect', () => {
    const obj = reactive({ bar: 1, foo: true })
    let temp1, temp2
    let count1 = 0
    let count2 = 0
    effect(() => {
      count1++
      console.log('effect1执行')
      effect(() => {
        count2++
        console.log('effect2执行')
        temp2 = obj.bar
      })
      temp1 = obj.foo
    })

    expect(temp1).toBe(true)
    expect(temp2).toBe(1)
    expect(count1).toBe(1)
    expect(count2).toBe(1)
    obj.bar = 2
    expect(temp2).toBe(2)
    expect(count1).toBe(1)
    expect(count2).toBe(2)
    obj.foo = false
    expect(temp1).toBe(false)
    expect(count1).toBe(2)
    expect(count2).toBe(3)
  })
})
