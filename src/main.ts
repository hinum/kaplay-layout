import { KAPLAYCtx } from "kaplay"
import { createFlexboxComp } from "./flexbox"
import { loadYoga } from "yoga-layout/load"
import { FlexboxOpts, Length } from "./types"

export * from "./types"

export default async function kaplayLayout() {
  const Yoga = await loadYoga()

  return function (k: KAPLAYCtx) {
    return {
      /**
       * convert a number to percent string
       * @param value
       * @returns value in percent string
       * @alias percent
       */
      per(value: number): Length {
        return `${value}%`
      },
      /**
       * convert a number to percent string
       * @param value
       * @returns value in percent string
       * @alias per
       */
      percent(value: number): Length {
        return `${value}%`
      },

      /**
       * turns the object into a flexbox.
       * @param style CSS properties.
       * @param index index in which to insert the object into. defaults to appending the object.
       * @example
       * ```
       * const parent = k.add([
       *   flexbox({
       *     width: k.width(),
       *     height: k.height(),
       *   })
       * ])
       * const object = parent.add([
       *   pos(),
       *   rect(),
       *   flexbox({ flex: 1 })
       * ])
       * k.bindFlex(object)
       * ```
       * @returns the flexbox component.
       */
      flexbox(style?: FlexboxOpts, index?: number) {
        return createFlexboxComp(
          k,
          Yoga.Node.createDefault(),
          style ?? {},
          index
        )
      },
    }
  }
}
