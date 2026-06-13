import { GameObj, KAPLAYCtx } from "kaplay"
import { toYogaMesaureFn } from "../yogaWrapper"
import { Edge, Node } from "yoga-layout/load"
import { FlexboxStyle, MeasureFunction } from "../types/flexboxStyle"
import { FlexNodeComp, FlexObject } from "../types/components"
import { copy, createBaseFlexComp } from "./base"

export function createFlexNodeComp(
  k: KAPLAYCtx,
  node: Node,
  layoutOpts: FlexboxStyle,
  index?: number
): FlexNodeComp {
  const base = createBaseFlexComp(node, layoutOpts, index)
  return copy(base, {
    id: "flex-node",

    update(this: GameObj<FlexNodeComp>) {
      if (node.getParent()) return
      if (!node.isDirty()) return
      node.calculateLayout(undefined, undefined)
      this.updateLayout()
    },
    onLayoutShift(this: GameObj, handler: () => void) {
      return this.on("layoutShift", handler)
    },
    markDirty() {
      node.markDirty()
    },
    setMeasureFn(fn: MeasureFunction) {
      node.setMeasureFunc(toYogaMesaureFn(fn))
    },
    updateLayout(this: GameObj) {
      if (!node.hasNewLayout()) return
      node.markLayoutSeen()
      this.trigger("layoutShift")
      for (const child of this.children) {
        child.updateLayout?.()
      }
    },
    insertChild(child: Node, index?: number) {
      node.insertChild(child, index ?? node.getChildCount())
    },
    calculateLayout(this: GameObj<FlexObject>) {
      node.calculateLayout(undefined, undefined)
      this.updateLayout()
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
  })
}
