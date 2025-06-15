export type GetUserMeta
= {
    requester_uuid : string
  }

export const GetUserMeta
= (requester_uuid : string) : GetUserMeta =>
  ({
    requester_uuid
  })

  

