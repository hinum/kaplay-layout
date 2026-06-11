import { Anchor, AnchorComp, GameObj, PosComp, Vec2 } from "kaplay"
import { Node } from "yoga-layout"
import { Size } from "./main"

type CompleteParent = GameObj<PosComp | AnchorComp | Size>
type PossibleParent = Partial<CompleteParent>

function offsetAnchor(
  object: GameObj<{ pos: Vec2 }>,
  width?: number,
  height?: number,
  anchor?: Anchor | Vec2
) {
  if (typeof anchor == "object") {
    object.pos.x -= anchor.x
    object.pos.y -= anchor.y
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
        object.pos.x -= width / 2
        return
      case "topright":
        object.pos.x -= width
        return
      case "left":
        object.pos.y -= height / 2
        return
      case "center":
        object.pos.x -= width / 2
        object.pos.y -= height / 2
        return
      case "right":
        object.pos.x -= width
        object.pos.y -= height / 2
        return
      case "botleft":
        object.pos.y -= height
        return
      case "bot":
        object.pos.x -= width / 2
        object.pos.y -= height
        return
      case "botright":
        object.pos.x -= width
        object.pos.y -= height
        return
    }
  }
}

export function setFlexItemPosition(
  parent: PossibleParent | null,
  object: GameObj<{ pos: Vec2 } | Size | AnchorComp>,
  node: Node
) {
  object.pos.x = node.getComputedLeft()
  object.pos.y = node.getComputedTop()
  offsetAnchor(object, parent?.width, parent?.height, parent?.anchor)
  offsetAnchor(object, object.width, object.height, object.anchor)
}
