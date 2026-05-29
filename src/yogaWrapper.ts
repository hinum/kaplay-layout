import Yoga, { MeasureFunction, Node } from "yoga-layout";

// TODO: align baseline? overflow

type ReactiveProps = {
  flex: number | undefined
  flexBasis: Length | "auto" | undefined
  flexGrow: number | undefined
  flexShrink: number | undefined
  alignSelf: FlexAlign | undefined

  layoutWidth: Length | "auto" | undefined
  layoutHeight: Length | "auto" | undefined
  maxHeight: Length | undefined
  maxWidth: Length | undefined
  minHeight: Length | undefined
  minWidth: Length | undefined

  left: Length | undefined
  right: Length | undefined
  top: Length | undefined
  bottom: Length | undefined

  // border: number
  // borderLeft: number
  // borderRight: number
  // borderTop: number
  // borderBottom: number
  // overflow: Overflow
  // contentBox: Content
  
  alignContent: FlexAlign | undefined
  alignItems: FlexAlign | undefined
  aspectRatio: number | undefined
  flexDirection: FlexDirection | undefined
  flexWrap: FlexWrap | undefined
  justifyContent: FlexJustify | undefined

  margin: Length | "auto" | undefined
  marginLeft: Length | "auto" | undefined
  marginRight: Length | "auto" | undefined
  marginTop: Length | "auto" | undefined
  marginBottom: Length | "auto" | undefined
  marginX: Length | "auto" | undefined
  marginY: Length | "auto" | undefined

  padding: Length | undefined
  padLeft: Length | undefined
  padRight: Length | undefined
  padTop: Length | undefined
  padBottom: Length | undefined
  padX: Length | undefined
  padY: Length | undefined

  position: Position | undefined
  display: Display | undefined
}
export type LayoutOption = {
  [K in keyof ReactiveProps]?: ReactiveProps[K]
}
export type Length = number | undefined | `${number}%`
export type Display = 
  | "none"
  | "flex"
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
  }
  return Yoga.JUSTIFY_FLEX_START
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
  }
  return Yoga.ALIGN_FLEX_START
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
  }
  return Yoga.FLEX_DIRECTION_COLUMN
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
  }
  return Yoga.WRAP_NO_WRAP
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
  }
  return Yoga.POSITION_TYPE_RELATIVE
}

export class ReactiveComp implements ReactiveProps {
  protected yogaNode: Node
  protected layoutStyle = {} as ReactiveProps

  constructor(
    opts: LayoutOption,
    mesuare?: MeasureFunction,
  ) {
    this.yogaNode = Yoga.Node.create()
    if (opts.alignContent) this.alignContent = opts.alignContent
    if (opts.alignItems) this.alignItems = opts.alignItems
    if (opts.alignSelf) this.alignSelf = opts.alignSelf
    if (opts.aspectRatio) this.aspectRatio = opts.aspectRatio
    if (opts.display) this.display = opts.display
    if (opts.flex) this.flex = opts.flex
    if (opts.flexBasis) this.flexBasis = opts.flexBasis
    if (opts.flexDirection) this.flexDirection = opts.flexDirection
    if (opts.flexGrow) this.flexGrow = opts.flexGrow
    if (opts.flexShrink) this.flexShrink = opts.flexShrink
    if (opts.flexWrap) this.flexWrap = opts.flexWrap
    if (opts.layoutHeight) this.layoutHeight = opts.layoutHeight
    if (opts.layoutWidth) this.layoutWidth = opts.layoutWidth
    if (opts.justifyContent) this.justifyContent = opts.justifyContent
    if (opts.margin) this.margin = opts.margin
    if (opts.marginX) this.marginX = opts.marginX
    if (opts.marginY) this.marginY = opts.marginY
    if (opts.marginLeft) this.marginLeft = opts.marginLeft
    if (opts.marginRight) this.marginRight = opts.marginRight
    if (opts.marginTop) this.marginTop = opts.marginTop
    if (opts.marginBottom) this.marginBottom = opts.marginBottom
    if (opts.padding) this.padding = opts.padding
    if (opts.padX) this.padX = opts.padX
    if (opts.padY) this.padY = opts.padY
    if (opts.padLeft) this.padLeft = opts.padLeft
    if (opts.padRight) this.padRight = opts.padRight
    if (opts.padTop) this.padTop = opts.padTop
    if (opts.padBottom) this.padBottom = opts.padBottom
    if (opts.maxHeight) this.maxHeight = opts.maxHeight
    if (opts.maxWidth) this.maxWidth = opts.maxWidth
    if (opts.minHeight) this.minHeight = opts.minHeight
    if (opts.minWidth) this.minWidth = opts.minWidth
    if (opts.left) this.left = opts.left
    if (opts.right) this.right = opts.right
    if (opts.top) this.top = opts.top
    if (opts.bottom) this.bottom = opts.bottom

    if (mesuare) this.yogaNode.setMeasureFunc(mesuare)
  }
  get display() {
    return this.layoutStyle.display
  }
  set display(a) {
    this.layoutStyle.display = a
    if (this.display == "flex") {
      this.yogaNode.setDisplay(Yoga.DISPLAY_FLEX)
    } else {
      this.yogaNode.setDisplay(Yoga.DISPLAY_NONE)
    }
  }
  get aspectRatio() {
    return this.layoutStyle.aspectRatio
  }
  set aspectRatio(a) {
    this.layoutStyle.aspectRatio = a
    this.yogaNode.setAspectRatio(a)
  }
  get alignSelf() {
    return this.layoutStyle.alignSelf
  }
  set alignSelf(a) {
    this.layoutStyle.alignSelf = a
    this.yogaNode.setAlignSelf(toYogaAlign(a))
  }
  get alignItems() {
    return this.layoutStyle.alignItems
  }
  set alignItems(a) {
    this.layoutStyle.alignItems = a
    this.yogaNode.setAlignItems(toYogaAlign(a))
  }
  get alignContent() {
    return this.layoutStyle.alignContent
  }
  set alignContent(a) {
    this.layoutStyle.alignContent = a
    this.yogaNode.setAlignContent(toYogaAlign(a))
  }
  get justifyContent() {
    return this.layoutStyle.justifyContent
  }
  set justifyContent(a) {
    this.layoutStyle.justifyContent = a
    this.yogaNode.setJustifyContent(toYogaJustify(a))
  }
  get flex() {
    return this.layoutStyle.flex
  }
  set flex(a) {
    this.layoutStyle.flex = a
    this.yogaNode.setFlex(a)
  }
  get flexGrow() {
    return this.layoutStyle.flexGrow
  }
  set flexGrow(a) {
    this.layoutStyle.flexGrow = a
    this.yogaNode.setFlexGrow(a)
  }
  get flexShrink() {
    return this.layoutStyle.flexShrink
  }
  set flexShrink(a) {
    this.layoutStyle.flexShrink = a
    this.yogaNode.setFlexShrink(a)
  }
  get flexDirection() {
    return this.layoutStyle.flexDirection
  }
  set flexDirection(a) {
    this.layoutStyle.flexDirection = a
    this.yogaNode.setFlexDirection(toYogaFlexDirection(a))
  }
  get flexWrap() {
    return this.layoutStyle.flexWrap
  }
  set flexWrap(a) {
    this.layoutStyle.flexWrap = a
    this.yogaNode.setFlexWrap(toYogaFlexWrap(a))
  }
  get flexBasis() {
    return this.layoutStyle.flexBasis
  }
  set flexBasis(a) {
    this.layoutStyle.flexBasis = a
    this.yogaNode.setFlexBasis(a)
  }
  get position() {
    return this.layoutStyle.position
  }
  set position(a) {
    this.layoutStyle.position = a
    this.yogaNode.setPositionType(toYogaPosition(a))
  }
  get layoutHeight() {
    return this.layoutStyle.layoutHeight
  }
  set layoutHeight(a) {
    this.layoutStyle.layoutHeight = a
    this.yogaNode.setHeight(a)
  }
  get layoutWidth() {
    return this.layoutStyle.layoutWidth
  }
  set layoutWidth(a) {
    this.layoutStyle.layoutWidth = a
    this.yogaNode.setWidth(a)
  }
  get maxWidth() {
    return this.layoutStyle.maxWidth
  }
  set maxWidth(a) {
    this.layoutStyle.maxWidth = a
    this.yogaNode.setMaxWidth(a)
  }
  get maxHeight() {
    return this.layoutStyle.maxHeight
  }
  set maxHeight(a) {
    this.layoutStyle.maxHeight = a
    this.yogaNode.setMaxHeight(a)
  }
  get minWidth() {
    return this.layoutStyle.minWidth
  }
  set minWidth(a) {
    this.layoutStyle.minWidth = a
    this.yogaNode.setMaxWidth(a)
  }
  get minHeight() {
    return this.layoutStyle.minHeight
  }
  set minHeight(a) {
    this.layoutStyle.minHeight = a
    this.yogaNode.setMaxHeight(a)
  }
  /** you cannot read this property */
  set margin(a: Length | "auto") {
    this.yogaNode.setMargin(Yoga.EDGE_ALL, a)
    this.layoutStyle.marginLeft = a
    this.layoutStyle.marginRight = a
    this.layoutStyle.marginTop = a
    this.layoutStyle.marginBottom = a
  }
  /** you cannot read this property */
  set marginX(a: Length | "auto") {
    this.yogaNode.setMargin(Yoga.EDGE_HORIZONTAL, a)
    this.layoutStyle.marginLeft = a
    this.layoutStyle.marginRight = a
  }
  /** you cannot read this property */
  set marginY(a: Length | "auto") {
    this.yogaNode.setMargin(Yoga.EDGE_VERTICAL, a)
    this.layoutStyle.marginTop = a
    this.layoutStyle.marginBottom = a
  }
  get marginLeft() {
    return this.layoutStyle.marginLeft
  }
  set marginLeft(a) {
    this.layoutStyle.marginLeft = a
    this.yogaNode.setMargin(Yoga.EDGE_LEFT, a)
  }
  get marginRight() {
    return this.layoutStyle.marginRight
  }
  set marginRight(a) {
    this.layoutStyle.marginRight = a
    this.yogaNode.setMargin(Yoga.EDGE_RIGHT, a)
  }
  get marginTop() {
    return this.layoutStyle.marginTop
  }
  set marginTop(a) {
    this.layoutStyle.marginTop = a
    this.yogaNode.setMargin(Yoga.EDGE_TOP, a)
  }
  get marginBottom() {
    return this.layoutStyle.marginBottom
  }
  set marginBottom(a) {
    this.layoutStyle.marginBottom = a
    this.yogaNode.setMargin(Yoga.EDGE_BOTTOM, a)
  }
  get left() {
    return this.layoutStyle.left
  }
  set left(a) {
    this.layoutStyle.left = a
    this.yogaNode.setPosition(Yoga.EDGE_LEFT, a)
  }
  get right() {
    return this.layoutStyle.right
  }
  set right(a) {
    this.layoutStyle.right = a
    this.yogaNode.setPosition(Yoga.EDGE_RIGHT, a)
  }
  get top() {
    return this.layoutStyle.top
  }
  set top(a) {
    this.layoutStyle.top = a
    this.yogaNode.setPosition(Yoga.EDGE_TOP, a)
  }
  get bottom() {
    return this.layoutStyle.bottom
  }
  set bottom(a) {
    this.layoutStyle.bottom = a
    this.yogaNode.setPosition(Yoga.EDGE_BOTTOM, a)
  }
  /** you cannot read this property */
  set padding(a: Length) {
    this.yogaNode.setPadding(Yoga.EDGE_ALL, a)
    this.layoutStyle.padLeft = a
    this.layoutStyle.padRight = a
    this.layoutStyle.padTop = a
    this.layoutStyle.padBottom = a
  }
  /** you cannot read this property */
  set padX(a: Length) {
    this.yogaNode.setPadding(Yoga.EDGE_HORIZONTAL, a)
    this.layoutStyle.padLeft = a
    this.layoutStyle.padRight = a
  }
  /** you cannot read this property */
  set padY(a: Length) {
    this.yogaNode.setPadding(Yoga.EDGE_VERTICAL, a)
    this.layoutStyle.padTop = a
    this.layoutStyle.padBottom = a
  }
  get padLeft() {
    return this.layoutStyle.padLeft
  }
  set padLeft(a) {
    this.layoutStyle.padLeft = a
    this.yogaNode.setPadding(Yoga.EDGE_LEFT, a)
  }
  get padRight() {
    return this.layoutStyle.padRight
  }
  set padRight(a) {
    this.layoutStyle.padRight = a
    this.yogaNode.setPadding(Yoga.EDGE_RIGHT, a)
  }
  get padTop() {
    return this.layoutStyle.padTop
  }
  set padTop(a) {
    this.layoutStyle.padTop = a
    this.yogaNode.setPadding(Yoga.EDGE_TOP, a)
  }
  get padBottom() {
    return this.layoutStyle.padBottom
  }
  set padBottom(a) {
    this.layoutStyle.padBottom = a
    this.yogaNode.setPadding(Yoga.EDGE_BOTTOM, a)
  }
}
