import { ValueAndMark } from '#types/value_and_mark.ts'

export type Uuid < TMark extends symbol >
= ValueAndMark < string, TMark >

export const Uuid
= (value : string) =>
  < TMark extends symbol > (symbol : TMark) : Uuid < TMark > =>
  ValueAndMark (value) (symbol)

