import { KAPLAYCtx } from "kaplay"
import { loadYoga } from "yoga-layout/load"
import { createFlexNodeComp } from "./components/flexNode"
import { createFlexboxComp } from "./components/flexbox"
import { createStaticComp } from "./components/static"
import { FlexboxStyle } from "./main"
import { StaticFlexboxStyle } from "./main"

export * from "./types/components"
export * from "./types/flexboxStyle"

export default async function kaplayLayout() {
  const Yoga = await loadYoga()

  return function (k: KAPLAYCtx) {
    return {
      /**
       *
       * turns the object into a flexbox. without binding position and size.
       * useful for implementing custom transition (via {@link onLayoutShift})
       * and auto-sizing (via {@link setMeasureFn}).
       * @param style CSS properties.
       * @param index index in which to insert the object into. defaults to appending the object.
       * @example
       * ```
       * const object = k.add([
       *   k.pos(0,0),
       *   k.rect(0,0),
       *   k.flexNode(),
       * ])
       * obj.onLayoutShift(() => {
       *   const { width, height } = object.getComputedSize()
       *   k.tween(object.pos, object.getComputedOffset(), 1, a => object.pos = a)
       *   k.tween(object.width, width, 1, a => object.width = a)
       *   k.tween(object.height, height, 1, a => object.height = a)
       * })
       * ```
       */
      flexNode(style?: FlexboxStyle, index?: number) {
        return createFlexNodeComp(
          k,
          Yoga.Node.createDefault(),
          style ?? {},
          index
        )
      },
      /**
       * turns the object into a flexbox.
       * the object size (and position if it is a child to another flexbox)
       * will be automatically changed to match the layout.
       * @param style CSS properties.
       * @param index index in which to insert the object into. defaults to appending the object.
       * @example
       * ```
       * const parent = k.add([
       *   k.pos(0,0),
       *   k.rect(0,0),
       *   k.flexbox({ padding: 10 }),
       * ])
       * parent.add([
       *   k.pos(),
       *   k.rect(10, 10),
       *   k.static()
       * ])
       * ```
       */
      flexbox(style?: FlexboxStyle, index?: number) {
        return createFlexboxComp(Yoga.Node.createDefault(), style ?? {}, index)
      },
      /**
       * turns the object into a static flex children.
       * its size wont be updated but its position will be updated according to the layout.
       * @param style CSS properties.
       * @param index index in which to insert the object into. defaults to appending the object.
       * @example
       * ```
       * const parent = k.add([
       *   k.pos(0,0),
       *   k.rect(0,0),
       *   k.flexbox({ padding: 10 }),
       * ])
       * parent.add([
       *   k.pos(),
       *   k.rect(10, 10),
       *   k.static()
       * ])
       * ```
       */
      static(style?: StaticFlexboxStyle, index?: number) {
        return createStaticComp(Yoga.Node.createDefault(), style ?? {}, index)
      },
    }
  }
}
