import type { Marked } from "#types/marked.ts"

const UserPasswordMark : unique symbol
= Symbol ()

export type UserPasswordMark
= typeof UserPasswordMark

export type UserPassword
= Marked < UserPasswordMark, {
    get hash () : string
  , get salt () : string
  } >

export const UserPassword
= (hash : string) => (salt : string) : UserPassword =>
  ({
    mark : UserPasswordMark
  , hash
  , salt
  })

export const isUserPassword
= (value : unknown) : value is UserPassword =>
  value !== null
  && value !== undefined
  && (value as UserPassword).mark === UserPasswordMark

