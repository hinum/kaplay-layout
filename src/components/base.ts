import { Node } from "yoga-layout"
import { createNodeSetter, NodeStyleStter } from "../yogaWrapper"
import { FlexboxStyle, LayoutComp } from "@src"
import { GameObj } from "kaplay"

export function copy<TFrom, TTo>(from: TFrom, to: TTo) {
  Object.defineProperties(from, Object.getOwnPropertyDescriptors(to))
  return from as TFrom & TTo
}
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
        throw new Error(
          `non existent style option: ${String(p)} (tried setting to ${newValue})`
        )
      }
      setter(newValue)
      return Reflect.set(target, p, newValue, receiver)
    },
  })
}

export function createBaseFlexComp(
  node: Node,
  layoutOpts: FlexboxStyle,
  index?: number
): LayoutComp {
  const setter = createNodeSetter(node)
  let style = createStyleProxy(setter, layoutOpts)
  applyStyle(setter, style)
  return {
    update() {
      if (node.getParent()) return
      if (!node.isDirty()) return
      node.calculateLayout(undefined, undefined)
      this.updateLayout()
    },
    updateLayout(this) {},
    destroy() {
      node.free()
    },
    add(this: GameObj) {
      this.addLayoutNode(index)
    },
    get layout() {
      return style
    },
    set layout(style: FlexboxStyle) {
      style = createStyleProxy(setter, style)
      node.reset()
      applyStyle(setter, style)
    },
    dropLayoutNode() {
      node.getParent()?.removeChild(node)
    },
    addLayoutNode(this: GameObj, index?: number) {
      this.parent?.insertChild?.(node, index)
    },
  }
}
