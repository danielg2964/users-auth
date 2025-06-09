export type UserPassword
= {
    hash : string
  , salt : string
  }

export const UserPassword
= (hash : string) => (salt : string) : UserPassword =>
  ({
    hash
  , salt
  })

