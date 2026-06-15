import { AnchorComp, GameObj, KAPLAYCtx, PosComp } from "kaplay"
import { StaticComp, StaticFlexboxStyle } from "../types/components"
import { Size } from "../types/flexboxStyle"
import { Node } from "yoga-layout"
import { setFlexItemPosition } from "../transform"
import { copy, createBaseFlexComp } from "./base"

export function createStaticComp(
  k: KAPLAYCtx,
  node: Node,
  opts: StaticFlexboxStyle,
  index?: number
): StaticComp {
  const base = createBaseFlexComp(node, opts, index)
  return copy(base, {
    id: "static",
    require: ["pos"],

    update() {},
    destroy() {
      node.free()
    },
    add(this: GameObj) {
      this.parent?.insertChild?.(node, index)
      node.setMeasureFunc(() => ({
        width: this.width,
        height: this.height,
      }))

      const widthDescriptor = Object.getOwnPropertyDescriptor(this, "width")
      const heightDescriptor = Object.getOwnPropertyDescriptor(this, "height")
      let width: number = widthDescriptor?.value ?? 0
      let height: number = heightDescriptor?.value ?? 0

      copy(this, {
        get width() {
          return widthDescriptor?.get?.() ?? width
        },
        set width(value) {
          node.markDirty()
          if (widthDescriptor?.set) widthDescriptor?.set(value)
          else width = value
        },
        get height() {
          return heightDescriptor?.get?.() ?? height
        },
        set height(value) {
          node.markDirty()
          if (heightDescriptor?.set) heightDescriptor?.set(value)
          else height = value
        },
      })
    },
    updateLayout(this: GameObj<PosComp | Size | AnchorComp>) {
      if (!node.hasNewLayout()) return
      node.markLayoutSeen()
      if (this.pos && this.parent) {
        setFlexItemPosition(k, this.parent, this, node)
      }
    },
  })
}
