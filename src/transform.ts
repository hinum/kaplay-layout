import { Anchor, AnchorComp, GameObj, KAPLAYCtx, PosComp, Vec2 } from "kaplay"
import { Node } from "yoga-layout"
import { Size } from "./main"

type CompleteParent = GameObj<PosComp | AnchorComp | Size>
type PossibleParent = Partial<CompleteParent>

function offsetAnchor(
  pos: Vec2,
  width?: number,
  height?: number,
  anchor?: Anchor | Vec2
) {
  if (typeof anchor == "object") {
    pos.x -= anchor.x
    pos.y -= anchor.y
  }
  if (
    width !== undefined &&
    height !== undefined &&
    typeof anchor == "string"
  ) {
    switch (anchor) {
      case "topleft":
        return
      case "top":
        pos.x -= width / 2
        return
      case "topright":
        pos.x -= width
        return
      case "left":
        pos.y -= height / 2
        return
      case "center":
        pos.x -= width / 2
        pos.y -= height / 2
        return
      case "right":
        pos.x -= width
        pos.y -= height / 2
        return
      case "botleft":
        pos.y -= height
        return
      case "bot":
        pos.x -= width / 2
        pos.y -= height
        return
      case "botright":
        pos.x -= width
        pos.y -= height
        return
    }
  }
}

export function setFlexItemPosition(
  k: KAPLAYCtx,
  parent: PossibleParent | null,
  object: GameObj<{ pos: Vec2 } | Size | Partial<AnchorComp>>,
  node: Node
) {
  const pos = k.vec2(node.getComputedLeft(), node.getComputedTop())
  offsetAnchor(pos, parent?.width, parent?.height, parent?.anchor)
  offsetAnchor(pos, -object.width, -object.height, object.anchor)
  object.pos = pos
}
