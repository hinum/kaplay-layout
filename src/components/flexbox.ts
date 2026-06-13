import { AnchorComp, GameObj, PosComp, RotateComp, ScaleComp } from "kaplay"
import { FlexboxStyle, Size } from "../types/flexboxStyle"
import { FlexboxComp } from "../types/components"
import { createNodeSetter } from "../yogaWrapper"
import { applyStyle, createStyleProxy } from "../utils"
import { Node } from "yoga-layout"
import { setFlexItemPosition } from "../transform"

type TransformComp = AnchorComp | ScaleComp | RotateComp
type PossibleFlexbox = GameObj<
  Partial<TransformComp> | FlexboxComp | Size | PosComp
>

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
    update(this: PossibleFlexbox) {
      if (node.getParent()) return
      if (!node.isDirty()) return
      node.calculateLayout(undefined, undefined)
      this.updateLayout()
    },
    updateLayout(this: PossibleFlexbox) {
      if (!node.hasNewLayout()) return
      node.markLayoutSeen()
      this.width = node.getComputedWidth()
      this.height = node.getComputedHeight()
      if (this.pos && node.getParent()) {
        setFlexItemPosition(this.parent, this, node)
      }
      for (const child of this.children) {
        child.updateLayout?.()
      }
    },

    destroy() {
      node.free()
    },
    add(this: GameObj<FlexboxComp>) {
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
    insertChild(child: Node, index?: number) {
      node.insertChild(child, index ?? node.getChildCount())
    },
    dropLayoutNode() {
      node.getParent()?.removeChild(node)
    },
    addLayoutNode(this: GameObj, index) {
      this.parent?.insertChild?.(node, index)
    },
  }
}
