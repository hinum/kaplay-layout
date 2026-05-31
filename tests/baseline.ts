import kaplay from "kaplay"
import kaplayLayout from "../src/main"

const k = kaplay({
  plugins: [await kaplayLayout()],
})

const parent = k.add([
  k.pos(),
  k.rect(0, 0),
  k.outline(),
  k.flexbox({
    minWidth: 100,
    minHeight: 100,
    left: 10,
    top: 10,
    padding: 10,
    gap: 10,
    maxHeight: 400,
    flexWrap: "wrap",
    alignItems: "end",
  }),
])

parent.bindFlex()

k.onMousePress((action) => {
  if (action == "left") {
    parent.add([k.pos(), k.rect(30, 30), k.outline(), k.flexbox()]).bindStatic()
  }
  if (action == "right") {
    for (const child of parent.children) {
      child.width += 4
      child.height += 4
      child.markDirty()
    }
  }
})
