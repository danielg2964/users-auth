import type { Marked } from "./marked.ts"

const PairMark : unique symbol
= Symbol ()

type PairMark
= typeof PairMark

export type Pair < T, B >
= Marked < PairMark > & {
    get left () : T
  , get right () : B
  }

export const Pair 
= < T > (left : T) =>
  < B > (right: B) : Pair < T, B > =>
  ({
    mark : PairMark
  , left
  , right
  })

export const isPair
= < T, B > (value : unknown) : value is Pair < T, B > =>
  value !== null
  && value !== undefined
  && typeof value === 'object'
  && (value as Pair < T, B >).mark === PairMark 

