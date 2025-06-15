import type { Marked } from "#types/marked.ts"

const CreateUserCommandMark : unique symbol
= Symbol ()

export type CreateUserCommandMark
= typeof CreateUserCommandMark

export type CreateUserCommand
= Marked < CreateUserCommandMark, {
    get email () : string
  , get password () : string
  , get type () : string
  , get father_uuid () : string
  } >

export const CreateUserCommand
= (email : string) =>
  (password : string) =>
  (type : string) =>
  (father_uuid : string) : CreateUserCommand =>
  ({
    mark : CreateUserCommandMark
  , email
  , password
  , type
  , father_uuid
  })

export const isCreateUserCommand
= (value : unknown) : value is CreateUserCommand =>
  value !== null
  && value !== undefined
  && (value as CreateUserCommand).mark === CreateUserCommandMark

