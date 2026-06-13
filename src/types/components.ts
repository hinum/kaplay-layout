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

/**
 * base flex object component interface.
 *
 * components implementing this don't necessary
 * need to be able to contain other flex objects.
 * @see {@link ContainerComp}
 */
export interface LayoutComp extends Comp {
  /** flexbox CSS properties. */
  layout: FlexboxStyle
  /** update the object size and position. used internally. */
  updateLayout(): void
  /** drop the object from the layout tree (if it's in one) */
  dropLayoutNode(): void
  /**
   * insert the object into its parent layout tree (if it has one).
   * called automatically when the object is added.
   * @param index index to insert the object into. defaults to appending.
   */
  addLayoutNode(index?: number): void
}

/** base flex container component interface */
export interface ContainerComp extends LayoutComp {
  /**
   * insert a child Yoga node.
   * called automatically when a child game object is added.
   * @param index index to insert the object into. defaults to appending.
   */
  insertChild(child: Node, index?: number): void
  /** force a layout calculation and updates all children. parents will not be effacted */
  calculateLayout(): void
}

export interface FlexNodeComp extends ContainerComp {
  /**
   * fires when the object is moved from a layout calculation.
   *
   * the object's real size and position may or may not be updated
   * because you are expected to handle them yourself or use helper functions.
   * use {@link getComputedLayout} or similar functions instead.
   */
  onLayoutShift(handler: () => void): KEventController
  /** tell yoga to re calculate the object size using its measure function. */
  markDirty(): void
  /**
   * set the measure function.
   * the measure function is used to determined the object size.
   * @see {@link markDirty}
   * @see {@link MeasureFunction}
   */
  setMeasureFn(measureFn: MeasureFunction): void

  /** @returns position relative to top left of the containing box */
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

export interface FlexboxComp extends ContainerComp {
  width: number
  height: number
}
export interface StaticComp extends LayoutComp {
  /** flexbox CSS properties. */
  layout: StaticFlexboxStyle
}
