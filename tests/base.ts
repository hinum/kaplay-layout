import { test } from "@fixtures"

test("create a kaplay context", ({ k }) => {
  k.add([k.rect(100, 100), k.pos(50, 50)])
})
