import { extractTree, test } from "@fixtures"
import { expect } from "vitest"

test("default (flex-column)", async ({ once, addFlexbox, addStaticBox }) => {
  const parent = addFlexbox()
  for (let i = 0; i < 10; i++) {
    addStaticBox(parent)
  }
  await once("update")
  expect(extractTree(parent)).toMatchSnapshot()
})

test("flex-row", async ({ once, addFlexbox, addStaticBox }) => {
  const parent = addFlexbox({ flexDirection: "row" })
  for (let i = 0; i < 10; i++) {
    addStaticBox(parent)
  }
  await once("update")
  expect(extractTree(parent)).toMatchSnapshot()
})
test("flex-row-reverse", async ({ once, addFlexbox, addStaticBox }) => {
  const parent = addFlexbox({ flexDirection: "row-reverse" })
  for (let i = 0; i < 10; i++) {
    addStaticBox(parent)
  }
  await once("update")
  for (let idx = 0; idx < parent.children.length; idx++) {
    expect(parent.children[idx].pos.x).toBe((9 - idx) * 50)
    expect(parent.children[idx].pos.y).toBe(0)
  }
})
test("flex-column-reverse", async ({ once, addFlexbox, addStaticBox }) => {
  const parent = addFlexbox({ flexDirection: "column-reverse" })
  for (let i = 0; i < 10; i++) {
    addStaticBox(parent)
  }
  await once("update")
  for (let idx = 0; idx < parent.children.length; idx++) {
    expect(parent.children[idx].pos.y).toBe((9 - idx) * 50)
    expect(parent.children[idx].pos.x).toBe(0)
  }
})
