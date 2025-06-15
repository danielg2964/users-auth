import type { Marked } from "./marked.ts"

const ValueAndMarkMark : unique symbol
= Symbol ()

export type ValueAndMarkMark
= typeof ValueAndMarkMark

type Shape < TValue >
= {
    get value () : TValue
  }

export type ValueAndMark < TValue, TMark extends symbol >
= Marked < TMark, Shape < TValue > >

export const ValueAndMark
= < TValue > (value : TValue) =>
  < TMark extends symbol > (mark : TMark) : ValueAndMark < TValue, TMark > =>
  ({
    mark
  , value
  })

export const isValueAndMark
= < TValue, TMark extends symbol > 
  (mark : TMark) =>
  < TValueAndMark extends ValueAndMark < TValue, TMark > > (marked : unknown) : marked is TValueAndMark =>
  marked !== null 
  && marked !== undefined 
  && typeof marked === 'object'
  && (marked as ValueAndMark < TValue, TMark >).mark === mark 

