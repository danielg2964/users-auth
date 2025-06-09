import type { Marked } from "./marked.ts"

const SuccessMark : unique symbol
= Symbol ()

type SuccessMark 
= typeof SuccessMark

export type Success < T >
= Marked < SuccessMark > & {
    value: T
  , message: string
  , code: string
  }

export const Success : < T > (value : T) => (message : string) => (code : string) => Success < T >
= < T > (value : T) =>
  (message : string) =>
  (code : string): Success < T > =>
  ({
    mark: SuccessMark
  , value
  , message
  , code
  })

export const isSuccess : < T > (value : unknown) => value is Success < T >
= < T > (value : unknown): value is Success < T > =>
  value !== null
  && value !== undefined
  && typeof value === 'object'
  && (value as Success < T >).mark === SuccessMark

