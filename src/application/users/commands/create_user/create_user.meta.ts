import type { UserUuid } from "#domain/users/user.uuid.ts"
import type { Marked } from "#types/marked.ts"

const CreateUserMetaMark : unique symbol
= Symbol ()

export type CreateUserMetaMark
= typeof CreateUserMetaMark

export type CreateUserMeta
= Marked < CreateUserMetaMark, {
    requester_uuid : UserUuid
  } >

export const CreateUserMeta
= (requester_uuid : UserUuid) : CreateUserMeta =>
  ({
    mark : CreateUserMetaMark
  , requester_uuid
  })

