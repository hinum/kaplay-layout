import { Comp, KEventController, Vec2 } from "kaplay"
import { Node } from "yoga-layout"

export type Length = number | undefined | `${number}%`
export type Display = "none" | "flex"
export type FlexDirection = "column" | "column-reverse" | "row" | "row-reverse"
export type FlexWrap = "wrap" | "wrap-reverse" | "no-wrap"
export type Position = "absolute" | "relative" | "static"

export type FlexAlign =
  | "auto"
  | "center"
  | "end"
  | "start"
  | "space-around"
  | "space-between"
  | "stretch"
export type FlexJustify =
  | "center"
  | "end"
  | "start"
  | "space-around"
  | "space-between"
  | "space-evenly"

export type FlexboxStyle = {
  flex: number | undefined
  flexBasis: Length | "auto" | undefined
  flexGrow: number | undefined
  flexShrink: number | undefined
  alignSelf: FlexAlign | undefined

  width: Length | "auto" | undefined
  height: Length | "auto" | undefined
  maxHeight: Length | undefined
  maxWidth: Length | undefined
  minHeight: Length | undefined
  minWidth: Length | undefined

  left: Length | undefined
  right: Length | undefined
  top: Length | undefined
  bottom: Length | undefined

  alignContent: FlexAlign | undefined
  alignItems: FlexAlign | undefined
  aspectRatio: number | undefined
  flexDirection: FlexDirection | undefined
  flexWrap: FlexWrap | undefined
  justifyContent: FlexJustify | undefined

  /** set the margin on all sides. */
  margin: Length | "auto" | undefined
  marginLeft: Length | "auto" | undefined
  marginRight: Length | "auto" | undefined
  marginTop: Length | "auto" | undefined
  marginBottom: Length | "auto" | undefined
  /** set the margin on the horizontal sides. */
  marginX: Length | "auto" | undefined
  /** set the margin on the vertical sides. */
  marginY: Length | "auto" | undefined

  /** set the padding on all sides. */
  padding: Length | undefined
  padLeft: Length | undefined
  padRight: Length | undefined
  padTop: Length | undefined
  padBottom: Length | undefined
  /** set the padding on the horizontal sides. */
  padX: Length | undefined
  /** set the padding on the vertical sides. */
  padY: Length | undefined

  gap: Length | undefined
  /** gap between columns. */
  gapX: Length | undefined
  /** gap between rows. */
  gapY: Length | undefined

  position: Position | undefined
  display: Display | undefined
}

/**
 * "fit-content" ~ at most as big as the containing box
 * "stretch"     ~ exactly as big as the containing box
 * "max-content" ~ as big as possible
 */
export type MeasureMode = "fit-content" | "max-content" | "stretch"

/**
 * @param  width width of the containing box
 * @param  height height of the containing box
 * @param  widthMode
 * @param  heightMode
 * @returns  size of the content box
 * @see {@link MeasureMode}
 */
export type MeasureFunction = (
  width: number,
  height: number,
  widthMode: MeasureMode,
  heightMode: MeasureMode
) => {
  width: number
  height: number
}

export type FlexboxOpts = {
  [K in keyof FlexboxStyle]?: FlexboxStyle[K]
}

export interface FlexboxComp extends Comp {
  /** flexbox CSS properties. */
  layout: FlexboxOpts

  /**
   * fires when the object is moved from a layout calculation.
   *
   * the object's real size and position may or may not be updated
   * because you are expected to handle them yourself or use helper functions.
   * use {@link getComputedLayout} or similar functions instead.
   */
  onLayoutShift(handler: () => void): KEventController
  /**
   * insert a child Yoga node, this called automatically when a child is added.
   */
  insertChild(child: Node, index?: number): void
  /**
   * remove this object from the layout tree. this doesnt destroy the object.
   */
  drop(): void
  /**
   * tell yoga to re calculate the object size using its measure function.
   */
  markDirty(): void
  /**
   * set the measure function.
   * the measure function is used to determined the object size.
   * @see {@link markDirty}
   * @see {@link MeasureFunction}
   */
  setMeasureFn(measureFn: MeasureFunction): void

  /**
   * @returns position relative to top left of the containing box
   */
  getComputedOffset(): Vec2
  getComputedSize(): {
    readonly width: number
    readonly height: number
  }
  getComputedLayout(): {
    readonly left: number
    readonly right: number
    readonly top: number
    readonly bottom: number
    readonly width: number
    readonly height: number
  }
  getComputedPadding(): {
    readonly left: number
    readonly right: number
    readonly top: number
    readonly bottom: number
  }
  getComputedMargin(): {
    readonly left: number
    readonly right: number
    readonly top: number
    readonly bottom: number
  }
  /**
   * a helper function to bind size and position of a flexbox.
   * @param object
   * @example
   * ```
   * object.bindFlex()
   *
   * //is equivalent to
   *
   * object.onLayoutShift(() => {
   *   const { width, height } = object.getComputedSize()
   *   object.pos = object.getComputedOffset()
   *   object.width = width
   *   object.height = height
   * })
   * ```
   */
  bindFlex(): void
  /**
   * a helper function to fix a flexbox's size to its real size.
   * you need to call {@link markDirty} every time its size changes.
   *
   * @param object
   * @example
   * ```
   * k.bindFlex(object)
   *
   * //is equivalent to
   *
   * object.onLayoutShift(() => {
   *   object.pos = object.getComputedOffset()
   * })
   * object.setMeasureFn(() => ({
   *   width: object.width,
   *   height: object.height,
   * }))
   * ```
   */
  bindStatic(): void
}
