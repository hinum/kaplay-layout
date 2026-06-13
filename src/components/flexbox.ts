import { AnchorComp, GameObj, PosComp, RotateComp, ScaleComp } from "kaplay"
import { FlexboxStyle, Size } from "../types/flexboxStyle"
import { FlexboxComp } from "../types/components"
import { Node } from "yoga-layout"
import { setFlexItemPosition } from "../transform"
import { copy, createBaseFlexComp } from "./base"

type TransformComp = AnchorComp | ScaleComp | RotateComp | Size
type PossibleFlexbox = GameObj<Partial<TransformComp> | FlexboxComp | PosComp>

export function createFlexboxComp(
  node: Node,
  opts: FlexboxStyle,
  index?: number
): FlexboxComp {
  const base = createBaseFlexComp(node, opts, index)

  return copy(base, {
    id: "flex",
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
    insertChild(child: Node, index?: number) {
      node.insertChild(child, index ?? node.getChildCount())
    },
    calculateLayout(this: PossibleFlexbox) {
      node.calculateLayout(undefined, undefined)
      this.updateLayout()
    },
  }) satisfies Omit<FlexboxComp, keyof Size> as FlexboxComp
}
