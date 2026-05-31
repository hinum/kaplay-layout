import { KAPLAYCtx } from "kaplay";
import { Length } from "./yogaWrapper";

// TODO

export default function kaplayLayout(_k: KAPLAYCtx) {
  return {
    per(number: number): Length {
      return `${number}%`
    },
    reactiveSprite() {

    }
  }
}
