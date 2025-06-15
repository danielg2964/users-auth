import type { UserUuid } from "#domain/users/user.uuid.ts"
import type { Marked } from "#types/marked.ts"

const GetUserMetaMark : unique symbol
= Symbol ()

export type GetUserMetaMark
= typeof GetUserMetaMark

export type GetUserMeta
= Marked < GetUserMetaMark, {
    requester_uuid : UserUuid
  } >

export const GetUserMeta
= (requester_uuid : UserUuid) : GetUserMeta =>
  ({
    mark : GetUserMetaMark
  , requester_uuid
  })

export const isGetUserMeta
= (value : unknown) : value is GetUserMeta =>
  value !== null
  && value !== undefined
  && (value as GetUserMeta).mark === GetUserMetaMark

