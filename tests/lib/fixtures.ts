import { test as baseTest, expect } from "vitest"
import kaplay, { GameObj } from "kaplay"
import kaplayLayout, { FlexboxStyle, StaticFlexboxStyle } from "@src"

export const test = baseTest
  .extend("kctx", { scope: "worker" }, async ({}) => {
    return kaplay({
      plugins: [await kaplayLayout()],
    })
  })
  .extend("k", async ({ kctx }) => {
    kctx.destroyAll("*")
    return kctx
  })
  .extend("once", async ({ k }) => {
    return function (event: string, tag = "*") {
      return new Promise<void>((res) => {
        const ev = k.on(event, tag, () => {
          k.wait(0, () => res())
          ev.cancel()
        })
      })
    }
  })
  .extend("addFlexbox", async ({ k }) => {
    return function (style?: FlexboxStyle, parent?: GameObj) {
      return (parent ?? k).add([
        k.pos(),
        k.rect(0, 0),
        k.outline(1),
        k.flexbox(style),
      ])
    }
  })
  .extend("addStaticBox", async ({ k }) => {
    return function (parent: GameObj, style?: StaticFlexboxStyle) {
      return parent.add([
        k.pos(),
        k.rect(50, 50),
        k.outline(1),
        k.static(style),
        "child",
      ])
    }
  })

type ObjectTree = {
  x: number
  y: number
  width: number
  height: number
  children?: ObjectTree[]
}
export function extractTree(obj: GameObj): ObjectTree {
  expect(obj.pos.x).toBeDefined
  expect(obj.pos.y).toBeDefined
  expect(obj.width).toBeDefined()
  expect(obj.height).toBeDefined()

  const out: ObjectTree = {
    x: obj.pos.x,
    y: obj.pos.y,
    width: obj.width,
    height: obj.height,
  }
  if (obj.children.length > 0) {
    out.children = obj.children.map(extractTree)
  }
  return out
}
