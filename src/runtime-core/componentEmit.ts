import { capitalize } from '../shared'
import type { ComponentInstance } from './component'
export function emit(component: ComponentInstance, event: string, ...args: any[]) {
  const props = component.props as any
  const eventName = `on${capitalize(event)}`
  const emit = props[eventName]
  emit && emit(...args)
}
