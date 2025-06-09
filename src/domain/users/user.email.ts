export type UserEmail
= {
    value : string
  , is_verified : boolean
  }

export const UserEmail
= (value : string) => (is_verified : boolean) : UserEmail =>
  ({
    value
  , is_verified
  })

