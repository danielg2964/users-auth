export type GetUserQuery
= {
    user_uuid : string
  }

export const GetUserQuery
= (user_uuid : string) : GetUserQuery =>
  ({
    user_uuid
  })

