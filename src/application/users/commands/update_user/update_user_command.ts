import type { Maybe } from '#types/maybe.ts'

export type UpdateUserCommand
= {
    uuid : string
  , email : Maybe < string >
  , password : Maybe < string >
  , type : Maybe < string >
  }

export const UpdateUserCommand
= (uuid : string) =>
  (email : Maybe < string >) =>
  (password : Maybe < string >) =>
  (type : Maybe < string >) : UpdateUserCommand =>
  ({
    uuid
  , email
  , password
  , type
  })

