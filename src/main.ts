import { KAPLAYCtx } from "kaplay"
import { loadYoga } from "yoga-layout/load"
import { createFlexNodeComp } from "./components/flexNode"
import { createStaticComp } from "./components/static"
import { FlexboxStyle } from "./main"
import { StaticFlexboxStyle } from "./main"
import { FlexNodeComp } from "./main"
import { StaticComp } from "./main"
import { FlexboxComp } from "./main"
import { createFlexboxComp } from "./components/flexbox"

export * from "./types/components"
export * from "./types/flexboxStyle"

export interface KaplayLayoutPlugin {
  /**
   *
   * turns the object into a flexbox. without binding position and size.
   * useful for implementing custom transition and custom size measuring.
   *
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
  flexNode(style?: FlexboxStyle, index?: number): FlexNodeComp
  /**
   * turns the object into a flexbox.
   * the object size (and position if it is a child to another flexbox)
   * will be automatically changed to match the layout.
   *
   * @param style CSS properties.
   * @param index index in which to insert the object into. defaults to appending the object.
   * @example
   * ```
   * const parent = k.add([
   *   k.pos(0,0),
   *   k.rect(0,0),
   *   k.flex({ padding: 10 }),
   * ])
   * parent.add([
   *   k.pos(),
   *   k.rect(10, 10),
   *   k.static()
   * ])
   * ```
   */
  flexbox(style?: FlexboxStyle, index?: number): FlexboxComp
  /**
   * turns the object into a static children.
   * its size is not managed by kaplay-layout so it wont grow or shrink.
   *
   * @param style CSS properties.
   * @param index index in which to insert the object into. defaults to appending the object.
   * @example
   * ```
   * const parent = k.add([
   *   k.pos(0,0),
   *   k.rect(0,0),
   *   k.flex({ padding: 10 }),
   * ])
   * parent.add([
   *   k.pos(),
   *   k.rect(10, 10),
   *   k.static()
   * ])
   * ```
   */
  static(style?: StaticFlexboxStyle, index?: number): StaticComp
}

export default async function kaplayLayout() {
  const Yoga = await loadYoga()

  return function (k: KAPLAYCtx): KaplayLayoutPlugin {
    return {
      flexNode(style, index) {
        return createFlexNodeComp(k, Yoga.Node.create(), style ?? {}, index)
      },
      flexbox(style, index) {
        return createFlexboxComp(k, Yoga.Node.create(), style ?? {}, index)
      },
      static(style, index) {
        return createStaticComp(k, Yoga.Node.create(), style ?? {}, index)
      },
    }
  }
}
