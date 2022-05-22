export const extend = Object.assign

export function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object'
}
export function hasChanged(value: any, oldValue: any): boolean {
  return !Object.is(value, oldValue)
}

export function isOn(key: string): boolean {
  return /^on[A-Z]/.test(key)
}

export function isOwn(obj: object, key: string | symbol): boolean {
  return Object.hasOwnProperty.call(obj, key)
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
