import { isObject } from '../shared'
import type { ComponentInstance } from './component'
import type { Slot } from './vNode'

export function initSlots(instance: ComponentInstance, children: Slot) {
  if (isObject(children)) { instance.slots = children }
  else {
    instance.slots = {
      default: children,
    }
  }
}
