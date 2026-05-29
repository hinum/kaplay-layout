import { KAPLAYCtx } from "kaplay";
import { Length } from "./yogaWrapper";

// TODO

export default function (_k: KAPLAYCtx) {
  return {
    per(number: number): Length {
      return `${number}%`
    },
    reactiveSprite() {

    }
  }
}
