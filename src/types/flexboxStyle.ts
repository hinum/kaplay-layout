export type Length = number | undefined | `${number}%`
export type Display = "none" | "flex"
export type FlexDirection = "column" | "column-reverse" | "row" | "row-reverse"
export type FlexWrap = "wrap" | "wrap-reverse" | "no-wrap"
export type Position = "absolute" | "relative"

export type FlexAlign =
  | "auto"
  | "center"
  | "end"
  | "start"
  | "space-around"
  | "space-between"
  | "space-evenly"
  | "stretch"
export type FlexJustify =
  | "center"
  | "end"
  | "start"
  | "space-around"
  | "space-between"
  | "space-evenly"

export type StrictFlexboxStyle = {
  flex: number | undefined
  flexBasis: Length | "auto" | undefined
  flexGrow: number | undefined
  flexShrink: number | undefined
  alignSelf: FlexAlign | undefined
  position: Position | undefined

  width: Length | "auto" | undefined
  height: Length | "auto" | undefined
  maxHeight: Length | undefined
  maxWidth: Length | undefined
  minHeight: Length | undefined
  minWidth: Length | undefined

  left: Length | undefined
  /** avoid using this, it doesnt work very well */
  right: Length | undefined
  top: Length | undefined
  /** avoid using this, it doesnt work very well */
  bottom: Length | undefined

  // doesnt work
  // aspectRatio: number | undefined

  alignContent: FlexAlign | undefined
  alignItems: FlexAlign | undefined
  flexDirection: FlexDirection | undefined
  flexWrap: FlexWrap | undefined
  justifyContent: FlexJustify | undefined

  padding: Length | undefined
  padLeft: Length | undefined
  padRight: Length | undefined
  padTop: Length | undefined
  padBottom: Length | undefined
  padX: Length | undefined
  padY: Length | undefined

  gap: Length | undefined
  gapX: Length | undefined
  gapY: Length | undefined
}

export type FlexboxStyle = {
  [K in keyof StrictFlexboxStyle]?: StrictFlexboxStyle[K]
}

/**
 * | mode | description |
 * |------|-------------|
 * |"fit-content" | at most as big as the containing box |
 * |"stretch"     | exactly as big as the containing box |
 * |"max-content" | as big as possible |
 */
export type MeasureMode = "fit-content" | "max-content" | "stretch"
export type Size = {
  width: number
  height: number
}

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
) => Size
