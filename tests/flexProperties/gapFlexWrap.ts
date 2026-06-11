import { extractTree, test } from "@fixtures"
import { expect } from "vitest"

test.for([
  ["all", { gap: 10 }],
  ["horizontal", { gapX: 10 }],
  ["vertical", { gapY: 10 }],
  ["all reverse wrapped", { gap: 10, flexWrap: "wrap-reverse" }],
] as const)("gap %s", async ([_, opts], { addFlexbox, addStaticBox, once }) => {
  const parent = addFlexbox({
    flexWrap: "wrap",
    maxHeight: 200,
    ...opts,
  })
  for (let i = 0; i < 10; i++) {
    addStaticBox(parent)
  }
  await once("update")
  expect(extractTree(parent)).toMatchSnapshot()
})
