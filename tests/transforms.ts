import { test } from "@fixtures"
import { Anchor } from "kaplay"
import { expect } from "vitest"

const testAnchors = test.for([
  "topleft",
  "top",
  "topright",
  "left",
  "center",
  "right",
  "botleft",
  "bot",
  "botright",
] satisfies Anchor[])

testAnchors("%s anchored rotation", async (anchor, { k, addFlexbox, once }) => {
  const parent = addFlexbox({ padding: 20, gap: 20 })
  const box1 = parent.add([
    k.pos(100, 100),
    k.rect(100, 100),
    k.static(),
    k.anchor(anchor),
    k.outline(1),
    k.rotate(45),
  ])
  const parent2 = parent.add([
    k.pos(),
    k.rect(0, 0),
    k.flexbox({ padding: 10 }),
    k.anchor(anchor),
    k.outline(1),
    k.rotate(45),
  ])
  parent2.add([k.pos(), k.rect(80, 80), k.static(), k.outline(1)])
  k.onDraw(() => {
    k.drawRect({
      opacity: 0.5,
      pos: k.vec2(20, 20),
      width: 100,
      height: 100,
      color: k.GREEN,
    })
    k.drawRect({
      opacity: 0.5,
      pos: k.vec2(20, 140),
      width: 100,
      height: 100,
      color: k.GREEN,
    })
  })
  await once("update")
  expect(box1.width).toBe(100)
  expect(parent2.width).toBe(100)
})

testAnchors("%s anchored scaling", async (anchor, { k, addFlexbox, once }) => {
  const parent = addFlexbox({ padding: 40, gap: 40 })
  const box1 = parent.add([
    k.pos(100, 100),
    k.rect(100, 100),
    k.static(),
    k.anchor(anchor),
    k.outline(1),
    k.scale(1.25),
  ])
  const parent2 = parent.add([
    k.pos(),
    k.rect(0, 0),
    k.flexbox({ padding: 10 }),
    k.anchor(anchor),
    k.outline(1),
    k.scale(1.25),
  ])
  parent2.add([k.pos(), k.rect(80, 80), k.static(), k.outline(1)])
  k.onDraw(() => {
    k.drawRect({
      opacity: 0.5,
      pos: k.vec2(40, 40),
      width: 100,
      height: 100,
      color: k.GREEN,
    })
    k.drawRect({
      opacity: 0.5,
      pos: k.vec2(40, 180),
      width: 100,
      height: 100,
      color: k.GREEN,
    })
  })
  await once("update")
  expect(box1.width).toBe(100)
  expect(parent2.width).toBe(100)
})
