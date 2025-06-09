import { ValueAndMark } from "./value_and_mark.ts"

const RightMark : unique symbol
= Symbol ()

export type RightMark
= typeof RightMark

export type Right < TRight >
= ValueAndMark < TRight, RightMark >

export const Right
= < TLeft, TRight > (value : TRight) : Either < TLeft, TRight > =>
  ValueAndMark (value) (RightMark)

export const isRight
= < TLeft, TRight > (either : Either < TLeft, TRight >) : either is Right < TRight > =>
  either.mark === RightMark

export const fromRight
= < TDefault > ($default : TDefault) =>
  < TLeft, TRight > (either : Either < TLeft, TRight >) : TRight | TDefault =>
  isRight (either)
  ? either.value
  : $default

const LeftMark : unique symbol
= Symbol ()

export type LeftMark
= typeof LeftMark

export type Left < TLeft >
= ValueAndMark < TLeft, LeftMark >

export const Left
= < TLeft, TRight > (value : TLeft) : Either < TLeft, TRight > =>
  ValueAndMark (value) (LeftMark)

export const isLeft
= < TLeft, TRight > (either : Either < TLeft, TRight >) : either is Left < TLeft > =>
  either.mark === LeftMark

export const fromLeft
= < TDefault > ($default : TDefault) =>
  < TLeft, TRight > (either : Either < TLeft, TRight >) : TLeft | TDefault =>
  isLeft (either)
  ? either.value
  : $default

export type Either < TLeft, TRigth >
= Left < TLeft > | Right < TRigth >

