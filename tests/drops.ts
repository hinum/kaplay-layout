import { test } from "@fixtures"
import { expect } from "vitest"

test("dropping and readding", async ({ addFlexbox, addStaticBox, once }) => {
  const parent = addFlexbox()
  const box = addStaticBox(parent)
  const box2 = addStaticBox(parent)

  await once("update")
  expect(box.pos.y).toBe(0)
  expect(box2.pos.y).toBe(50)
  box.dropLayoutNode()
  await once("update")
  expect(box2.pos.y).toBe(0)
  box.addLayoutNode()
  await once("update")
  expect(box.pos.y).toBe(50)
  expect(box2.pos.y).toBe(0)
})
