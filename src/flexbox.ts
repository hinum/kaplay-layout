import { GameObj, KAPLAYCtx } from "kaplay"
import {
  createNodeSetter,
  NodeStyleStter,
  toYogaMesaureFn,
} from "./yogaWrapper"
import { Edge, Node } from "yoga-layout/load"
import { FlexboxComp, FlexboxOpts, FlexboxStyle } from "./types"

function applyStyle(setter: NodeStyleStter, style: FlexboxOpts) {
  for (const key in style) {
    console.log(key)
    setter[key as keyof FlexboxStyle](style[key as keyof FlexboxStyle] as any)
  }
}
function createStyleProxy(setters: NodeStyleStter, style: FlexboxOpts) {
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

export function createFlexboxComp(
  k: KAPLAYCtx,
  node: Node,
  layoutOpts: FlexboxOpts,
  index?: number
): FlexboxComp {
  const setters = createNodeSetter(node)
  let style = createStyleProxy(setters, layoutOpts)
  applyStyle(setters, style)

  return {
    id: "flexbox",

    destroy() {
      node.freeRecursive()
    },
    add(this: GameObj) {
      ;(this.parent as GameObj<FlexboxComp>)?.insertChild?.(node, index)
    },
    update(this: GameObj) {
      if (!this.parent?.has("flexbox") && node.isDirty()) {
        node.calculateLayout(undefined, undefined)
      }
      if (!node.hasNewLayout()) return
      node.markLayoutSeen()
      this.trigger("layoutShift")
    },
    get layout() {
      return style
    },
    set layout(style: FlexboxOpts) {
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
    bindFlex(this: GameObj) {
      this.onLayoutShift(() => {
        const { width, height } = this.getComputedSize()
        this.pos = this.getComputedOffset()
        this.width = width
        this.height = height
      })
    },
    bindStatic(this: GameObj) {
      this.onLayoutShift(() => {
        this.pos = this.getComputedOffset()
      })
      this.setMeasureFn(() => ({
        width: this.width,
        height: this.height,
      }))
    },
  }
}
