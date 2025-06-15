import type { Marked } from '#types/marked.ts'
import type { UserUuid } from '#domain/users/user.uuid.ts'

const UpdateUserMetaMark : unique symbol
= Symbol ()

export type UpdateUserMetaMark
= typeof UpdateUserMetaMark

export type UpdateUserMeta
= Marked < UpdateUserMetaMark, {
    requester_uuid : UserUuid
  } >

export const UpdaateUserMeta
= (requester_uuid : UserUuid) : UpdateUserMeta =>
  ({
    mark : UpdateUserMetaMark
  , requester_uuid
  })

