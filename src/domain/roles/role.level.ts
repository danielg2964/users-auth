import { ValueAndMark } from "#types/value_and_mark.ts"

const RoleLevelMark : unique symbol
= Symbol ()

export type RoleLevelMark
= typeof RoleLevelMark

export type RoleLevel
= ValueAndMark < number, RoleLevelMark >

export const RoleLevel
= (level : number) : RoleLevel =>
  ValueAndMark (level) (RoleLevelMark)
  

export const isRoleLevel
= (value : unknown) : value is RoleLevel =>
  value !== null
  && value !== undefined
  && (value as RoleLevel).mark === RoleLevelMark

