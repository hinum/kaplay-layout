import { FlexboxStyle } from "./types/flexboxStyle"
import { NodeStyleStter } from "./yogaWrapper"

export function applyStyle(setter: NodeStyleStter, style: FlexboxStyle) {
  for (const key in style) {
    setter[key as keyof FlexboxStyle](style[key as keyof FlexboxStyle] as any)
  }
}
export function createStyleProxy(setters: NodeStyleStter, style: FlexboxStyle) {
  return new Proxy(style, {
    set(target, p, newValue, receiver) {
      const setter = setters[p as keyof FlexboxStyle]
      if (!setter) {
        throw `non existent style option: ${String(p)} (tried setting to ${newValue})`
      }
      setter(newValue)
      return Reflect.set(target, p, newValue, receiver)
    },
  })
}
export function copy<TFrom, TTo>(from: TFrom, to: TTo) {
  Object.defineProperties(from, Object.getOwnPropertyDescriptors(to))
  return from as TFrom & TTo
}
