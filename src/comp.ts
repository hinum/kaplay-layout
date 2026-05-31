import { Comp, Vec2, GameObj, KEventController, KAPLAYCtx } from "kaplay";
import { createNodeSetter, NodeStyleStter, FlexboxStyle, MeasureFunction, toYogaMesaureFn } from "./yogaWrapper";
import Yoga, { Edge, Node } from "yoga-layout";

export type FlexboxOpts = {
  [K in keyof FlexboxStyle]?: FlexboxStyle[K]
}

export interface FlexboxComp extends Comp {
  /** flexbox CSS properties. */
  layout: FlexboxOpts

  /** 
   * fires when the object is moved from a layout calculation.
   *
   * the object's real size and position may or may not be updated
   * because you are expected to handle them yourself or use helper functions.
   * use {@link getComputedLayout} or similar functions instead.
  */
  onLayoutShift(handler: () => void): KEventController
  /** insert a child Yoga node, this called automatically when a child is added. */
  insertChild(child: Node, index?: number): void
  /** remove this object from the layout tree. this doesnt destroy the object. */
  drop(): void
  /** tell yoga to re calculate the object size using its measure function. */
  markDirty(): void
  /** 
   * set the measure function.
   * the measure function is used to determined the object size.
   * @see {@link markDirty}
   * @see {@link MeasureFunction}
  */
  setMeasureFn(measureFn: MeasureFunction): void

  getComputedOffset(): Vec2
  getComputedSize(): Vec2
  getComputedLayout(): {
    readonly left: number;
    readonly right: number;
    readonly top: number;
    readonly bottom: number;
    readonly width: number;
    readonly height: number;
  }
  getComputedPadding(): {
    readonly left: number;
    readonly right: number;
    readonly top: number;
    readonly bottom: number;
  }
  getComputedMargin(): {
    readonly left: number;
    readonly right: number;
    readonly top: number;
    readonly bottom: number;
  }
}

function applyStyle(setter: NodeStyleStter, style: FlexboxOpts) {
  for (const key in style) {
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
  layoutOpts: FlexboxOpts,
  index?: number,
): FlexboxComp {

  const node = Yoga.Node.createDefault()
  const setters = createNodeSetter(node)
  let style = createStyleProxy(setters, layoutOpts)
  applyStyle(setters, style)

  return {
    id: "flexbox",

    destroy() {
      node.freeRecursive()
    },
    add(this: GameObj) {
      (this.parent as GameObj<FlexboxComp>)?.insertChild?.(node, index)
    },
    update(this: GameObj) {
      if (!this.parent?.has("flexbox") && node.isDirty()) {
        node.calculateLayout(undefined, undefined)
      }
      if (node.hasNewLayout()) return
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

    getComputedLayout(){
      return node.getComputedLayout()
    },
    getComputedOffset() {
      return k.vec2(
        node.getComputedLeft(),
        node.getComputedTop(),
      )
    },
    getComputedSize() {
      return k.vec2(
        node.getComputedWidth(),
        node.getComputedHeight(),
      )
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
