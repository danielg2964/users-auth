import { ValueAndMark } from '#types/value_and_mark.ts'

const UserTypeMark : unique symbol
= Symbol ()

export type UserTypeMark
= typeof UserTypeMark

export type UserType
= ValueAndMark < string, UserTypeMark >

export const UserType
= (name : string) : UserType =>
  ValueAndMark (name) (UserTypeMark)

export const isUserType
= (value : unknown) : value is UserType =>
  value !== null
  && value !== undefined
  && (value as UserType).mark === UserTypeMark

