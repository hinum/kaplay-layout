import { extractTree, test } from "@fixtures"
import { expect } from "vitest"

test("use with text", async ({ addFlexbox, once, k }) => {
  const parent = addFlexbox({ padding: 20 })
  const text = parent.add([
    k.pos(),
    k.text("testing testing"),
    k.color(k.BLACK),
    k.static(),
  ])
  await once("update")
  expect(extractTree(parent)).toMatchSnapshot()
  text.text = "asdasdasdasd lorem asdjkldasjkldqasjkl;"
  await once("update")
  expect(extractTree(parent)).toMatchSnapshot()
})
