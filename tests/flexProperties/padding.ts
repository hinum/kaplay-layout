import { extractTree, test } from "@fixtures"
import { expect } from "vitest"

test.for([
  ["all edges", { padding: 10 }],
  ["horizontal edges", { padX: 10 }],
  ["vertical edges", { padY: 10 }],
  ["left edge", { padLeft: 10 }],
  ["right edge", { padRight: 10 }],
  ["bottom edge", { padBottom: 10 }],
  ["top edge", { padTop: 10 }],
] as const)("pad %s", async ([_, opts], { addFlexbox, addStaticBox, once }) => {
  const parent = addFlexbox(opts)
  addStaticBox(parent)
  addStaticBox(parent)
  await once("update")
  expect(extractTree(parent)).toMatchSnapshot()
})

test("mixed", async ({ addFlexbox, addStaticBox, once }) => {
  const parent = addFlexbox({
    padding: 10,
    padLeft: 20,
    padX: 30,
    padBottom: 50,
  })
  const child = addStaticBox(parent)
  await once("update")
  expect(child.pos.y).toBe(10)
  expect(child.pos.x).toBe(20)
  expect(parent.width).toBe(20 + 50 + 30)
  expect(parent.height).toBe(10 + 50 + 50)
})

test("nested", async ({ addFlexbox, addStaticBox, once }) => {
  const parent = addFlexbox({ padding: 10, gap: 10 })
  const parent2 = addFlexbox({ padX: 20, padY: 10 }, parent)
  addFlexbox({ padY: 40 }, parent)
  addFlexbox({ padX: 40 }, parent2)
  addStaticBox(parent)
  addStaticBox(parent2)
  await once("update")
  expect(extractTree(parent)).toMatchSnapshot()
})
