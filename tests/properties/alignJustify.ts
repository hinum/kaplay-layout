import { extractTree, test } from "@fixtures"
import { faker } from "@faker-js/faker"
import { expect } from "vitest"
import { FlexboxStyle } from "@src"

const cases: [string, FlexboxStyle][] = [
  [
    "align-items-center",
    {
      alignItems: "center",
    },
  ],
  [
    "align-items-end",
    {
      alignItems: "end",
    },
  ],
  [
    "align-items-strectch",
    {
      alignItems: "stretch",
    },
  ],
  // alignItems space-around space-evenly and space-between doesnt do anything

  [
    "align-content-center",
    {
      alignContent: "center",
      width: 800,
    },
  ],
  [
    "align-content-end",
    {
      alignContent: "end",
      width: 800,
    },
  ],
  [
    "align-content-strectch",
    {
      alignContent: "stretch",
      width: 800,
    },
  ],
  [
    "align-content-space-around",
    {
      alignContent: "space-around",
      width: 800,
    },
  ],
  [
    "align-content-between",
    {
      alignContent: "space-between",
      width: 800,
    },
  ],
  [
    "align-content-space-evenly",
    {
      alignContent: "space-evenly",
      width: 800,
    },
  ],
  [
    "justify-items-center",
    {
      // why tailwind call these justify-items?
      justifyContent: "center",
    },
  ],
  [
    "justify-items-end",
    {
      justifyContent: "end",
    },
  ],
  [
    "justify-items-between",
    {
      justifyContent: "space-between",
    },
  ],
  [
    "justify-items-space-around",
    {
      justifyContent: "space-around",
    },
  ],
  [
    "justify-items-space-evently",
    {
      justifyContent: "space-evenly",
    },
  ],
]

test.for(cases)("%s", async ([_, opts], { addFlexbox, once }) => {
  faker.seed(-9089032)
  const parent = addFlexbox({
    padding: 10,
    alignItems: "start",
    flexWrap: "wrap",
    gapX: 10,
    height: 300,
    ...opts,
  })
  for (let i = 0; i < 10; i++) {
    addFlexbox(
      {
        minWidth: faker.number.int({ min: 40, max: 200 }),
        minHeight: faker.number.int({ min: 20, max: 100 }),
      },
      parent
    )
  }
  await once("update")
  expect(extractTree(parent)).toMatchSnapshot()
})

test("test defaults", async ({ addFlexbox, once }) => {
  faker.seed(-9089032)
  const parent = addFlexbox({
    padding: 10,
    width: 800,
    flexDirection: "row",
  })
  for (let i = 0; i < 10; i++) {
    addFlexbox(
      {
        minWidth: faker.number.int({ min: 20, max: 100 }),
        minHeight: faker.number.int({ min: 20, max: 100 }),
      },
      parent
    )
  }
  await once("update")
  const tree = extractTree(parent)
  parent.layout.justifyContent = "start"
  await once("update")
  expect(extractTree(parent)).toMatchObject(tree)
  parent.layout.alignItems = "stretch"
  await once("update")
  expect(extractTree(parent)).toMatchObject(tree)
  parent.layout.alignItems = "start"
  await once("update")
  expect(extractTree(parent)).not.toMatchObject(tree) // sanity check
})

test("align-self", async ({ addFlexbox, addStaticBox, once }) => {
  const parent = addFlexbox({
    width: 200,
    padding: 10,
  })
  addStaticBox(parent, {
    alignSelf: "start",
  })
  addStaticBox(parent, {
    alignSelf: "center",
  })
  addStaticBox(parent, {
    alignSelf: "end",
  })
  addFlexbox(
    {
      alignSelf: "start",
      minWidth: 100,
      minHeight: 50,
    },
    parent
  )
  addFlexbox(
    {
      alignSelf: "center",
      minWidth: 100,
      minHeight: 50,
    },
    parent
  )
  addFlexbox(
    {
      alignSelf: "end",
      minWidth: 100,
      minHeight: 50,
    },
    parent
  )

  await once("update")
  expect(parent.width).toBe(200)
  expect(extractTree(parent)).toMatchSnapshot()
})
