import { extractTree, test } from "@fixtures"
import { expect } from "vitest"

test("left top", async ({ addStaticBox, addFlexbox, once }) => {
  const parent = addFlexbox()
  const parent2 = addFlexbox(
    {
      left: 100,
      top: 100,
    },
    parent
  )
  addStaticBox(parent2)
  addStaticBox(parent2)

  await once("update")
  expect(parent2.pos.x).toBe(100)
  expect(parent2.pos.y).toBe(100)
  expect(extractTree(parent)).toMatchSnapshot()
})

test("right (row-reverse parent)", async ({
  addStaticBox,
  addFlexbox,
  once,
}) => {
  const parent = addFlexbox({
    minWidth: 200,
    minHeight: 200,
    alignItems: "start",
    flexDirection: "row-reverse",
  })
  const child = addFlexbox(
    {
      right: -30,
    },
    parent
  )
  addStaticBox(child)
  await once("update")
  expect(child.pos.x).toBe(200 - 30 - 50)
  expect(child.pos.y).toBe(0)
})

test("bottom (column-reverse parent)", async ({
  addStaticBox,
  addFlexbox,
  once,
}) => {
  const parent = addFlexbox({
    minWidth: 200,
    minHeight: 200,
    alignItems: "start",
    flexDirection: "column-reverse",
  })
  const child = addFlexbox(
    {
      bottom: -30,
    },
    parent
  )
  addStaticBox(child)
  await once("update")
  expect(child.pos.x).toBe(0)
  expect(child.pos.y).toBe(200 - 30 - 50)
})
