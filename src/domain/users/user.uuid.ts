import { Uuid } from "#domain/shared/uuid.ts"

const UserUuidMark : unique symbol
= Symbol ()

export type UserUuidMark
= typeof UserUuidMark

export type UserUuid
= Uuid < UserUuidMark >

export const UserUuid
= (uuid : string) : UserUuid =>
  Uuid (uuid) (UserUuidMark)

export const isUserUuid
= (value : unknown) : value is UserUuid =>
  value !== null
  && value !== undefined
  && (value as UserUuid).mark === UserUuidMark

