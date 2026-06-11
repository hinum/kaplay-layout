import { AnchorComp, GameObj, PosComp } from "kaplay"
import { FlexboxStyle, Size } from "../types/flexboxStyle"
import { FlexboxComp } from "../types/components"
import { createNodeSetter } from "../yogaWrapper"
import { applyStyle, createStyleProxy } from "../utils"
import { Node } from "yoga-layout"
import { setFlexItemPosition } from "../transform"

export function createFlexboxComp(
  node: Node,
  opts: FlexboxStyle,
  index?: number
): FlexboxComp {
  const setter = createNodeSetter(node)
  let style = createStyleProxy(setter, opts)
  applyStyle(setter, opts)

  return {
    id: "flexbox",
    destroy() {
      node.free()
    },
    add(this: GameObj) {
      this.parent?.insertChild?.(node, index)
    },
    update(this: GameObj<FlexboxComp>) {
      if (node.getParent()) return
      if (!node.isDirty()) return
      node.calculateLayout(undefined, undefined)
      this.updateLayout()
    },
    get layout() {
      return style
    },
    set layout(style: FlexboxStyle) {
      style = createStyleProxy(setter, style)
      node.reset()
      applyStyle(setter, style)
    },
    insertChild(child: Node, index?: number) {
      node.insertChild(child, index ?? node.getChildCount())
    },
    updateLayout(this: GameObj<PosComp | Size | AnchorComp | FlexboxComp>) {
      if (!node.hasNewLayout()) return
      node.markLayoutSeen()
      if (this.pos && node.getParent()) {
        setFlexItemPosition(this.parent, this, node)
      }
      this.width = node.getComputedWidth()
      this.height = node.getComputedHeight()
      for (const child of this.children) {
        child.updateLayout?.()
      }
    },
  }
}
