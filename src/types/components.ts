import { Comp, KEventController, Vec2 } from "kaplay"
import {
  MeasureFunction,
  Display,
  FlexAlign,
  FlexboxStyle,
  Length,
  Position,
} from "./flexboxStyle"
import { Node } from "yoga-layout"

export type FlexNodeComp = Comp & {
  /** flexbox CSS properties. */
  layout: FlexboxStyle

  /** trigger a layout shift. used internally. */
  updateLayout(): void
  /**
   * fires when the object is moved from a layout calculation.
   *
   * the object's real size and position may or may not be updated
   * because you are expected to handle them yourself or use helper functions.
   * use {@link getComputedLayout} or similar functions instead.
   */
  onLayoutShift(handler: () => void): KEventController
  /** @private */
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
}
export type StaticFlexboxStyle = {
  flex?: number
  alignSelf?: FlexAlign

  left?: Length
  right?: Length
  top?: Length
  bottom?: Length

  /** set the margin on all sides. */
  margin?: Length | "auto"
  marginLeft?: Length | "auto"
  marginRight?: Length | "auto"
  marginTop?: Length | "auto"
  marginBottom?: Length | "auto"
  /** set the margin on the horizontal sides. */
  marginX?: Length | "auto"
  /** set the margin on the vertical sides. */
  marginY?: Length | "auto"

  /** set the padding on all sides. */
  padding?: Length
  padLeft?: Length
  padRight?: Length
  padTop?: Length
  padBottom?: Length
  /** set the padding on the horizontal sides. */
  padX?: Length
  /** set the padding on the vertical sides. */
  padY?: Length

  position?: Position
  display?: Display
}

export type StaticComp = Comp & {
  layout: StaticFlexboxStyle
  /** update the object position. used internally. */
  updateLayout(): void
  /** drop the object from the layout tree (if it's in one) */
  dropLayoutNode(): void
  /**
   * insert the object into its parent layout tree.
   * @throws if the object parent isnt a flexbox.
   */
  addLayoutNode(index?: number): void
}
export type FlexboxComp = Comp & {
  layout: FlexboxStyle
  /** @private */
  insertChild(child: Node, index?: number): void
  /** update the object size and position. used internally. */
  updateLayout(): void
  /**
   * drop the object from the layout tree
   * @throws if the object doesnt have a parent node.
   */
  dropLayoutNode(): void
  /**
   * insert the object into its parent (if it has one) layout tree.
   * called automatically when the object is added.
   * @param index index to insert the object into. defaults to appending.
   */
  addLayoutNode(index?: number): void
}
