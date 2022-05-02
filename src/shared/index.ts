export const extend = Object.assign

export function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object'
}
export function hasChanged(value: any, oldValue: any): boolean {
  return !Object.is(value, oldValue)
}
