import { ValueAndMark } from "./value_and_mark.ts"

const NothingMark : unique symbol
= Symbol ()

export type Nothing
= typeof NothingMark

export const Nothing : () => Nothing
= () => NothingMark 

export const isNothing
= < T > (value : Maybe < T >) : value is Nothing =>
  value === Nothing ()
  
const JustMark : unique symbol
= Symbol ()

type JustMark
= typeof JustMark

export type Just < T >
= ValueAndMark < T, JustMark >

export const Just 
= < T > (value : T) : Just < T > =>
  ValueAndMark (value) (JustMark)

export const isJust
= < T > (value : Maybe < T >) : value is Just < T > =>
  value !== null
  && value !== undefined 
  && typeof value === 'object'
  && (value as Just < T >).mark === JustMark

export const justValue
= < T > (just : Just < T >) : T =>
  just.value

export type Maybe < T >
= Just < T > | Nothing

