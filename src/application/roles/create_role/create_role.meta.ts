import type { UserUuid } from "#domain/users/user.uuid.ts"
import type { Marked } from "#types/marked.ts"

const CreateRoleMetaMark : unique symbol
= Symbol ()

export type CreateRoleMetaMark
= typeof CreateRoleMetaMark

export type CreateRoleMeta
= Marked < CreateRoleMetaMark, {
    requester_uuid : UserUuid
  } >

export const CreateRoleMeta
= (requester_uuid : UserUuid) : CreateRoleMeta =>
  ({
    mark : CreateRoleMetaMark
  , requester_uuid
  })

