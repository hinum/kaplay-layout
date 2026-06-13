import { extractTree, test } from "@fixtures"
import { expect } from "vitest"

test("flex", async ({ addFlexbox, once }) => {
  const parent = addFlexbox({
    width: 100,
    height: 300,
  })
  const child1 = addFlexbox({ flex: 1 }, parent)
  const child2 = addFlexbox({ flex: 2 }, parent)
  await once("update")
  expect(child1.height).toBe(100)
  expect(child2.height).toBe(child1.height * 2)
})

test("expand fill", async ({ addFlexbox, addStaticBox, once }) => {
  const parent = addFlexbox({
    width: 100,
    height: 300,
    padding: 10,
    gap: 10,
  })
  addStaticBox(parent)
  const child1 = addFlexbox({ flex: 1 }, parent)
  const child2 = addFlexbox({ flex: 2 }, parent)
  await once("update")
  expect(child2.height).toBe(child1.height * 2)
  expect(extractTree(parent)).toMatchSnapshot()
})

test("flex shrink", async ({ addFlexbox, addStaticBox, once }) => {
  const parent = addFlexbox({
    width: 100,
    height: 300,
  })
  const box = addStaticBox(parent)
  const child1 = addFlexbox({ flexShrink: 1, height: 100 }, parent)
  const child2 = addFlexbox({ flexShrink: 2, height: 100 }, parent)
  await once("update")
  expect(child1.height).toBe(100)
  expect(child2.height).toBe(100)
  box.height = 200
  await once("update")
  expect(child1.height).not.toBe(100)
  expect(child2.height).not.toBe(100)
  expect(child1.height).toBe(child2.height * 2 + 1) // rounding error?
})

test("flex grow", async ({ addFlexbox, once }) => {
  const parent = addFlexbox({
    width: 100,
    height: 300,
  })
  const child1 = addFlexbox({ flexGrow: 1, flexBasis: 0 }, parent)
  const child2 = addFlexbox({ flexGrow: 2, flexBasis: 0 }, parent)
  await once("update")
  expect(child1.height).not.toBe(0)
  expect(child2.height).toBe(child1.height * 2) // rounding error?
})

test("flex with max height", async ({ addFlexbox, once }) => {
  const parent = addFlexbox({
    width: 100,
    height: 300,
  })
  const child = addFlexbox({ flex: 1, maxHeight: 100 }, parent)
  await once("update")
  expect(child.height).toBe(100)
  parent.layout.height = 50
  await once("update")
  expect(child.height).toBe(50)
})

// minheight doesnt interact as i expected with flex?
// browsers are werid
