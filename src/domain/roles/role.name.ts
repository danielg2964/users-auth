import { ValueAndMark } from "#types/value_and_mark.ts"

const RoleNameMark : unique symbol
= Symbol ()

export type RoleNameMark
= typeof RoleNameMark

export type RoleName
= ValueAndMark < string, RoleNameMark >

export const RoleName
= (name : string) : RoleName =>
  ValueAndMark (name) (RoleNameMark)

export const isRoleName
= (value : unknown) : value is RoleName =>
  value !== null
  && value !== undefined
  && (value as RoleName).mark === RoleNameMark

