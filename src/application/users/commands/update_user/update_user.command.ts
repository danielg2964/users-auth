import type { Marked } from '#types/marked.ts'
import type { Maybe } from '#types/maybe.ts'

const UpdateUserCommandMark : unique symbol
= Symbol ()

export type UpdateUserCommandMark
= typeof UpdateUserCommandMark

export type UpdateUserCommand
= Marked < UpdateUserCommandMark, {
    uuid : string
  , email : Maybe < string >
  , password : Maybe < string >
  , type : Maybe < string >
  } >

export const UpdateUserCommand
= (uuid : string) =>
  (email : Maybe < string >) =>
  (password : Maybe < string >) =>
  (type : Maybe < string >) : UpdateUserCommand =>
  ({
    mark : UpdateUserCommandMark
  , uuid
  , email
  , password
  , type
  })

