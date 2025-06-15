import type { Marked } from "./marked.ts"

const FailureMark : unique symbol
= Symbol ()

type FailureMark
= typeof FailureMark

export type Failure 
= Marked < FailureMark, {
    get message () : string
  , get code () : string
  } >

export const Failure : (message : string) => (code : string) => Failure
= (message : string) =>
  (code : string) : Failure =>
  ({
    mark : FailureMark 
  , message 
  , code
  })

export const isFailure : (value : unknown) => value is Failure
= (value : unknown): value is Failure =>
  value !== null
  && value !== undefined
  && typeof value === 'object'
  && (value as Failure).mark === FailureMark 

