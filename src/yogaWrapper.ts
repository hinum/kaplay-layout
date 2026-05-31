import Yoga, { Edge, Gutter, Node, MeasureFunction as YogaMesaureFn } from "yoga-layout";

// TODO: align baseline? overflow
// component inspect properties
// flex order?

export type FlexboxStyle = {
  flex: number | undefined
  flexBasis: Length | "auto" | undefined
  flexGrow: number | undefined
  flexShrink: number | undefined
  alignSelf: FlexAlign | undefined

  /** 
   * the content box CSS width,
   * this is not the object real width.
   * use {@link getComputedLayout} or {@link width} instead.
  */
  boxWidth: Length | "auto" | undefined
  /** 
   * the content box CSS height,
   * this is not the object real height.
   * use {@link getComputedLayout} or {@link width} instead.
  */
  boxHeight: Length | "auto" | undefined
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
  /** gap between columns */
  gapX: Length | undefined
  /** gap between rows */
  gapY: Length | undefined

  position: Position | undefined
  display: Display | undefined
}

/**
 * "fit-content" ~ at most as big as the containing box
 * "stretch"     ~ exactly as big as the containing box
 * "max-content" ~ as big as possible
*/
export type MeasureMode =
  | "fit-content"
  | "max-content"
  | "stretch"

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
function fromMeasureMode(mode: number): MeasureMode {
  switch (mode) {
    case Yoga.MEASURE_MODE_UNDEFINED: return "max-content"
    case Yoga.MEASURE_MODE_AT_MOST: return "fit-content"
    case Yoga.MEASURE_MODE_EXACTLY: return "stretch"
  }
  throw `unregonized measure mode from Yoga: ${mode}`
}
export function toYogaMesaureFn(fn: MeasureFunction): YogaMesaureFn {
  return (width, widthMode, height, heightMode) => {
    return fn(width, height, fromMeasureMode(widthMode), fromMeasureMode(heightMode))
  }
}

export type Length = number | undefined | `${number}%`
export type Display = 
  | "none"
  | "flex"
function toYogaDisplay(value: Display | undefined) {
  switch (value) {
    case "none": return Yoga.DISPLAY_NONE
    case "flex": 
    case undefined: return Yoga.DISPLAY_FLEX
  }
}
export type FlexJustify =
  | "center"
  | "end"
  | "start"
  | "space-around"
  | "space-between"
  | "space-evenly"

function toYogaJustify(value: FlexJustify | undefined): number {
  switch (value) {
    case "center": return Yoga.JUSTIFY_CENTER
    case "end": return Yoga.JUSTIFY_FLEX_END
    case "start": return Yoga.JUSTIFY_FLEX_START
    case "space-around": return Yoga.JUSTIFY_SPACE_AROUND
    case "space-between": return Yoga.JUSTIFY_SPACE_BETWEEN
    case "space-evenly": return Yoga.JUSTIFY_SPACE_EVENLY
    case undefined: return Yoga.JUSTIFY_FLEX_START
  }
}
export type FlexAlign = 
  | "auto"
  | "center"
  | "end"
  | "start"
  | "space-around"
  | "space-between"
  | "stretch"
function toYogaAlign(value: FlexAlign | undefined): number {
  switch (value) {
    case "auto": return Yoga.ALIGN_AUTO
    case "center": return Yoga.ALIGN_CENTER
    case "end": return Yoga.ALIGN_FLEX_END
    case "start": return Yoga.ALIGN_FLEX_START
    case "space-around": return Yoga.ALIGN_SPACE_AROUND
    case "space-between": return Yoga.ALIGN_SPACE_BETWEEN
    case "stretch": return Yoga.ALIGN_STRETCH
    case undefined: return Yoga.ALIGN_FLEX_START
  }
}
export type FlexDirection = 
  | "column"
  | "column-reverse"
  | "row"
  | "row-reverse"
function toYogaFlexDirection(value: FlexDirection | undefined): number {
  switch (value) {
    case "column": return Yoga.FLEX_DIRECTION_COLUMN
    case "column-reverse": return Yoga.FLEX_DIRECTION_COLUMN_REVERSE
    case "row": return Yoga.FLEX_DIRECTION_ROW
    case "row-reverse": return Yoga.FLEX_DIRECTION_ROW_REVERSE
    case undefined: return Yoga.FLEX_DIRECTION_COLUMN
  }
}
export type FlexWrap =
  | "wrap"
  | "wrap-reverse"
  | "no-wrap"
function toYogaFlexWrap(value: FlexWrap | undefined): number {
  switch (value) {
    case "wrap": return Yoga.WRAP_WRAP
    case "wrap-reverse": return Yoga.WRAP_WRAP_REVERSE
    case "no-wrap": return Yoga.WRAP_NO_WRAP
    case undefined: return Yoga.WRAP_NO_WRAP
  }
}
type Position =
  | "absolute"
  | "relative"
  | "static"
function toYogaPosition(value: Position | undefined): number {
  switch (value) {
    case "absolute": return Yoga.POSITION_TYPE_ABSOLUTE
    case "relative": return Yoga.POSITION_TYPE_RELATIVE
    case "static": return Yoga.POSITION_TYPE_STATIC
    case undefined: return Yoga.POSITION_TYPE_RELATIVE
  }
}

export type NodeStyleStter = {
  [K in keyof FlexboxStyle]: (arg: FlexboxStyle[K]) => void
}
export function createNodeSetter(node: Node): NodeStyleStter {
  return {
    alignContent: a => node.setAlignContent(toYogaAlign(a)),
    alignItems: a => node.setAlignItems(toYogaAlign(a)),
    alignSelf: a => node.setAlignSelf(toYogaAlign(a)),
    display: a => node.setDisplay(toYogaDisplay(a)),
    flexWrap: a => node.setFlexShrink(toYogaFlexWrap(a)),
    flexDirection: a => node.setFlexDirection(toYogaFlexDirection(a)),
    justifyContent: a => node.setJustifyContent(toYogaJustify(a)),

    margin: a => node.setMargin(Edge.All, a),
    marginX: a => node.setMargin(Edge.Horizontal, a),
    marginY: a => node.setMargin(Edge.Vertical, a),
    marginLeft: a => node.setMargin(Edge.Left, a),
    marginRight: a => node.setMargin(Edge.Right, a),
    marginTop: a => node.setMargin(Edge.Top, a),
    marginBottom: a => node.setMargin(Edge.Bottom, a),

    padding: a => node.setPadding(Edge.All, a),
    padX: a => node.setPadding(Edge.Horizontal, a),
    padY: a => node.setPadding(Edge.Vertical, a),
    padLeft: a => node.setPadding(Edge.Left, a),
    padRight: a => node.setPadding(Edge.Right, a),
    padTop: a => node.setPadding(Edge.Top, a),
    padBottom: a => node.setPadding(Edge.Bottom, a),

    position: a => node.setPositionType(toYogaPosition(a)),
    left: a => node.setPosition(Edge.Left, a),
    right: a => node.setPosition(Edge.Right, a),
    top: a => node.setPosition(Edge.Top, a),
    bottom: a => node.setPosition(Edge.Bottom, a),

    gap: a => node.setGap(Gutter.All, a),
    gapX: a => node.setGap(Gutter.Column, a),
    gapY: a => node.setGap(Gutter.Row, a),

    aspectRatio: node.setAspectRatio,
    flex: node.setFlex,
    flexBasis: node.setFlexBasis,
    flexGrow: node.setFlexGrow,
    flexShrink: node.setFlexShrink,
    boxHeight: node.setHeight,
    boxWidth: node.setWidth,
    maxHeight: node.setMaxHeight,
    maxWidth: node.setMaxWidth,
    minHeight: node.setMinHeight,
    minWidth: node.setMinWidth,
  }
}
