export type CreateUserMeta
= {
    requester_uuid : string
  }

export const CreateUserMeta
= (requester_uuid : string) : CreateUserMeta =>
  ({
    requester_uuid
  })

