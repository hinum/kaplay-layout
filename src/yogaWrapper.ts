import * as Yoga from "yoga-layout/load"
import {
  Display,
  FlexAlign,
  FlexboxStyle,
  FlexDirection,
  FlexJustify,
  FlexWrap,
  MeasureFunction,
  MeasureMode,
  Position,
} from "./types"

// TODO: align baseline? overflow
// component inspect properties
// flex order?

function fromMeasureMode(mode: number): MeasureMode {
  switch (mode) {
    case Yoga.MeasureMode.Undefined:
      return "max-content"
    case Yoga.MeasureMode.AtMost:
      return "fit-content"
    case Yoga.MeasureMode.Exactly:
      return "stretch"
  }
  throw `unregonized measure mode from Yoga: ${mode}`
}
export function toYogaMesaureFn(fn: MeasureFunction): Yoga.MeasureFunction {
  return (width, widthMode, height, heightMode) => {
    return fn(
      width,
      height,
      fromMeasureMode(widthMode),
      fromMeasureMode(heightMode)
    )
  }
}

function toYogaDisplay(value: Display | undefined) {
  switch (value) {
    case "none":
      return Yoga.Display.None
    case "flex":
    case undefined:
      return Yoga.Display.Flex
  }
}

function toYogaJustify(value: FlexJustify | undefined): number {
  switch (value) {
    case "center":
      return Yoga.Justify.Center
    case "end":
      return Yoga.Justify.FlexEnd
    case "start":
      return Yoga.Justify.FlexStart
    case "space-around":
      return Yoga.Justify.SpaceAround
    case "space-between":
      return Yoga.Justify.SpaceBetween
    case "space-evenly":
      return Yoga.Justify.SpaceEvenly
    case undefined:
      return Yoga.Justify.FlexStart
  }
}
function toYogaAlign(value: FlexAlign | undefined): number {
  switch (value) {
    case "auto":
      return Yoga.Align.Auto
    case "center":
      return Yoga.Align.Center
    case "end":
      return Yoga.Align.FlexEnd
    case "start":
      return Yoga.Align.FlexStart
    case "space-around":
      return Yoga.Align.SpaceAround
    case "space-between":
      return Yoga.Align.SpaceBetween
    case "stretch":
      return Yoga.Align.Stretch
    case undefined:
      return Yoga.Align.FlexStart
  }
}
function toYogaFlexDirection(value: FlexDirection | undefined): number {
  switch (value) {
    case "column":
      return Yoga.FlexDirection.Column
    case "column-reverse":
      return Yoga.FlexDirection.ColumnReverse
    case "row":
      return Yoga.FlexDirection.Row
    case "row-reverse":
      return Yoga.FlexDirection.RowReverse
    case undefined:
      return Yoga.FlexDirection.Row
  }
}
function toYogaFlexWrap(value: FlexWrap | undefined): number {
  switch (value) {
    case "wrap":
      return Yoga.Wrap.Wrap
    case "wrap-reverse":
      return Yoga.Wrap.WrapReverse
    case "no-wrap":
      return Yoga.Wrap.NoWrap
    case undefined:
      return Yoga.Wrap.NoWrap
  }
}
function toYogaPosition(value: Position | undefined): number {
  switch (value) {
    case "absolute":
      return Yoga.PositionType.Absolute
    case "relative":
      return Yoga.PositionType.Relative
    case "static":
      return Yoga.PositionType.Static
    case undefined:
      return Yoga.PositionType.Relative
  }
}

export type NodeStyleStter = {
  [K in keyof FlexboxStyle]: (arg: FlexboxStyle[K]) => void
}
export function createNodeSetter(node: Yoga.Node): NodeStyleStter {
  return {
    alignContent: (a) => node.setAlignContent(toYogaAlign(a)),
    alignItems: (a) => node.setAlignItems(toYogaAlign(a)),
    alignSelf: (a) => node.setAlignSelf(toYogaAlign(a)),
    display: (a) => node.setDisplay(toYogaDisplay(a)),
    flexWrap: (a) => node.setFlexWrap(toYogaFlexWrap(a)),
    flexDirection: (a) => node.setFlexDirection(toYogaFlexDirection(a)),
    justifyContent: (a) => node.setJustifyContent(toYogaJustify(a)),

    margin: (a) => node.setMargin(Yoga.Edge.All, a),
    marginX: (a) => node.setMargin(Yoga.Edge.Horizontal, a),
    marginY: (a) => node.setMargin(Yoga.Edge.Vertical, a),
    marginLeft: (a) => node.setMargin(Yoga.Edge.Left, a),
    marginRight: (a) => node.setMargin(Yoga.Edge.Right, a),
    marginTop: (a) => node.setMargin(Yoga.Edge.Top, a),
    marginBottom: (a) => node.setMargin(Yoga.Edge.Bottom, a),

    padding: (a) => node.setPadding(Yoga.Edge.All, a),
    padX: (a) => node.setPadding(Yoga.Edge.Horizontal, a),
    padY: (a) => node.setPadding(Yoga.Edge.Vertical, a),
    padLeft: (a) => node.setPadding(Yoga.Edge.Left, a),
    padRight: (a) => node.setPadding(Yoga.Edge.Right, a),
    padTop: (a) => node.setPadding(Yoga.Edge.Top, a),
    padBottom: (a) => node.setPadding(Yoga.Edge.Bottom, a),

    position: (a) => node.setPositionType(toYogaPosition(a)),
    left: (a) => node.setPosition(Yoga.Edge.Left, a),
    right: (a) => node.setPosition(Yoga.Edge.Right, a),
    top: (a) => node.setPosition(Yoga.Edge.Top, a),
    bottom: (a) => node.setPosition(Yoga.Edge.Bottom, a),

    gap: (a) => node.setGap(Yoga.Gutter.All, a),
    gapX: (a) => node.setGap(Yoga.Gutter.Column, a),
    gapY: (a) => node.setGap(Yoga.Gutter.Row, a),

    aspectRatio: (a) => node.setAspectRatio(a),
    flex: (a) => node.setFlex(a),
    flexBasis: (a) => node.setFlexBasis(a),
    flexGrow: (a) => node.setFlexGrow(a),
    flexShrink: (a) => node.setFlexShrink(a),
    height: (a) => node.setHeight(a),
    width: (a) => node.setWidth(a),
    maxHeight: (a) => node.setMaxHeight(a),
    maxWidth: (a) => node.setMaxWidth(a),
    minHeight: (a) => node.setMinHeight(a),
    minWidth: (a) => node.setMinWidth(a),
  }
}
