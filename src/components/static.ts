import { AnchorComp, GameObj, PosComp } from "kaplay"
import { StaticComp, StaticFlexboxStyle } from "../types/components"
import { FlexboxStyle, Size } from "../types/flexboxStyle"
import { applyStyle, copy, createStyleProxy } from "../utils"
import { Node } from "yoga-layout"
import { createNodeSetter } from "../yogaWrapper"
import { setFlexItemPosition } from "../transform"

export function createStaticComp(
  node: Node,
  opts: StaticFlexboxStyle,
  index?: number
): StaticComp {
  const setter = createNodeSetter(node)
  let style = createStyleProxy(setter, opts)
  applyStyle(setter, opts)

  return {
    id: "staticbox",

    destroy() {
      node.free()
    },
    add(this: GameObj) {
      this.parent?.insertChild?.(node, index)
      node.setMeasureFunc(() => ({
        width: this.width,
        height: this.height,
      }))

      const widthDescriptor = Object.getOwnPropertyDescriptor(this, "width")!
      const heightDescriptor = Object.getOwnPropertyDescriptor(this, "height")!
      let width: number | undefined = widthDescriptor?.value
      let height: number | undefined = heightDescriptor?.value

      copy(this, {
        get width() {
          return widthDescriptor.get?.() ?? width
        },
        set width(value) {
          node.markDirty()
          if (widthDescriptor.set) widthDescriptor.set(value)
          else width = value
        },
        get height() {
          return heightDescriptor.get?.() ?? height
        },
        set height(value) {
          node.markDirty()
          if (heightDescriptor.set) heightDescriptor.set(value)
          else height = value
        },
      })
    },
    updateLayout(this: GameObj<PosComp | Size | AnchorComp>) {
      if (!node.hasNewLayout()) return
      node.markLayoutSeen()
      if (this.pos) setFlexItemPosition(this.parent, this, node)
    },
    get layout() {
      return style
    },
    set layout(style: FlexboxStyle) {
      style = createStyleProxy(setter, style)
      node.reset()
      applyStyle(setter, style)
    },
  }
}
