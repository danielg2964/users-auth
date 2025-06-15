import type { Marked } from "#types/marked.ts"

const UserEmailMark : unique symbol
= Symbol ()

export type UserEmailMark
= typeof UserEmailMark

export type UserEmail
= Marked < UserEmailMark, {
    get value () : string
  , get is_verified () : boolean
  } >

export const UserEmail
= (value : string) => (is_verified : boolean) : UserEmail =>
  ({
    mark : UserEmailMark
  , value
  , is_verified
  })

export const isUserEmail
= (value : unknown) : value is UserEmail =>
  value !== null
  && value !== undefined
  && (value as UserEmail).mark === UserEmailMark

