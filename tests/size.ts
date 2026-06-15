import { extractTree, test } from "@fixtures"
import { Size } from "@src"
import { GameObj, PosComp } from "kaplay"
import { expect } from "vitest"

test("flexbox without size", async ({ k, addStaticBox, once }) => {
  const parent = k.add([k.flexbox()])
  addStaticBox(parent)
  addStaticBox(parent)
  addStaticBox(parent)

  await once("update")
  expect(parent.height).toBe(150)
  expect(parent.width).toBe(50)
})

test("transformed flexbox without size", async ({ k, addStaticBox }) => {
  const parent = k.add([k.flexbox(), k.rotate(45), k.pos(100, 100)])
  const parent2 = parent.add([
    k.flexbox(),
    k.pos(),
    k.scale(1.5),
    k.anchor("center"),
  ])
  addStaticBox(parent2)
  addStaticBox(parent)
  addStaticBox(parent)

  k.add([k.rect(50, 150), k.pos(100, 100), k.opacity(0.5), k.color(k.GREEN)])
  parent.calculateLayout()
  expect(parent.height).toBe(150)
  expect(parent.width).toBe(50)
  expect(extractTree(parent)).toMatchSnapshot()
})

test("static without size", async ({ k, addStaticBox, once }) => {
  const parent = k.add([k.flexbox(), k.rect(0, 0), k.pos()])
  addStaticBox(parent)
  const box = parent.add([k.pos(), k.static()])
  await once("update")
  expect(box.pos.y).toBe(50)
  expect(parent.height).toBe(50)
  expect(parent.width).toBe(50)
})

test("static change size", async ({ addStaticBox, k, once }) => {
  const parent = k.add([k.pos(k.center()), k.anchor("center"), k.flexbox()])
  const boxes: GameObj<PosComp | Size>[] = []
  for (let i = 0; i < 5; i++) {
    boxes.push(addStaticBox(parent))
  }
  await once("update")
  const pos = boxes.map((a) => ({ ...a.pos }))
  expect(pos).toMatchObject(boxes.map((a) => a.pos))

  boxes.forEach((a) => {
    a.width += 10
    a.height += 10
  })
  await once("update")
  expect(pos).not.toMatchObject(boxes.map((a) => a.pos))
})
