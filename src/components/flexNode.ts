import { GameObj, KAPLAYCtx } from "kaplay"
import { createNodeSetter, toYogaMesaureFn } from "../yogaWrapper"
import { Edge, Node } from "yoga-layout/load"
import { applyStyle, createStyleProxy } from "../utils"
import { FlexboxStyle } from "../types/flexboxStyle"
import { FlexNodeComp } from "../types/components"

export function createFlexNodeComp(
  k: KAPLAYCtx,
  node: Node,
  layoutOpts: FlexboxStyle,
  index?: number
): FlexNodeComp {
  const setters = createNodeSetter(node)
  let style = createStyleProxy(setters, layoutOpts)
  applyStyle(setters, style)

  return {
    id: "flex-node",

    destroy() {
      node.free()
    },
    add(this: GameObj<FlexNodeComp>) {
      this.parent?.insertChild?.(node, index)
    },
    update(this: GameObj<FlexNodeComp>) {
      if (node.getParent()) return
      if (!node.isDirty()) return
      node.calculateLayout(undefined, undefined)
      this.updateLayout()
    },
    get layout() {
      return style
    },
    set layout(style: FlexboxStyle) {
      style = createStyleProxy(setters, style)
      node.reset()
      applyStyle(setters, style)
    },

    onLayoutShift(this: GameObj, handler: () => void) {
      return this.on("layoutShift", handler)
    },
    markDirty() {
      node.markDirty()
    },
    setMeasureFn(fn) {
      node.setMeasureFunc(toYogaMesaureFn(fn))
    },
    insertChild(child, index) {
      node.insertChild(child, index ?? node.getChildCount())
    },
    drop() {
      node.getParent()?.removeChild(node)
    },
    updateLayout(this: GameObj) {
      if (!node.hasNewLayout()) return
      node.markLayoutSeen()
      this.trigger("layoutShift")
      for (const child of this.children) {
        child.updateLayout?.()
      }
    },

    getComputedLayout() {
      return node.getComputedLayout()
    },
    getComputedOffset() {
      return k.vec2(node.getComputedLeft(), node.getComputedTop())
    },
    getComputedSize() {
      return {
        width: node.getComputedWidth(),
        height: node.getComputedHeight(),
      }
    },
    getComputedMargin() {
      return {
        left: node.getComputedMargin(Edge.Left),
        right: node.getComputedMargin(Edge.Right),
        top: node.getComputedMargin(Edge.Top),
        bottom: node.getComputedMargin(Edge.Bottom),
      }
    },
    getComputedPadding() {
      return {
        left: node.getComputedPadding(Edge.Left),
        right: node.getComputedPadding(Edge.Right),
        top: node.getComputedPadding(Edge.Top),
        bottom: node.getComputedPadding(Edge.Bottom),
      }
    },
  }
}
