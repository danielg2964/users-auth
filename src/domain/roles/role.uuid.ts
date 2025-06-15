import { Uuid } from '#domain/shared/uuid.ts'

const RoleUuidMark : unique symbol
= Symbol ()

export type RoleUuidMark
= typeof RoleUuidMark

export type RoleUuid
= Uuid < RoleUuidMark >

export const RoleUuid
= (value : string) : RoleUuid =>
  Uuid (value) (RoleUuidMark)

export const isRoleUuid
= (value : unknown) : value is RoleUuid =>
  value !== null
  && value !== undefined
  && (value as RoleUuid).mark === RoleUuidMark

