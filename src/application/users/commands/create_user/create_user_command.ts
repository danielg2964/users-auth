export type CreateUserCommand
= {
    get email () : string
  , get password () : string
  , get type () : string
  , get father_uuid () : string
  }

export const CreateUserCommand
= (email : string) =>
  (password : string) =>
  (type : string) =>
  (father_uuid : string) : CreateUserCommand =>
  ({
    email
  , password
  , type
  , father_uuid
  })

