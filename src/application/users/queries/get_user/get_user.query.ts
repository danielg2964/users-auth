import type { Marked } from "#types/marked.ts"

const GetUserQueryMark : unique symbol
= Symbol () 

export type GetUserQueryMark
= typeof GetUserQueryMark

export type GetUserQuery
= Marked < GetUserQueryMark, {
    user_uuid : string
  } >

export const GetUserQuery
= (user_uuid : string) : GetUserQuery =>
  ({
    mark : GetUserQueryMark
  , user_uuid
  })

export const isGetUserQuery
= (value : unknown) : value is GetUserQuery =>
  value !== null
  && value !== undefined
  && (value as GetUserQuery).mark === GetUserQueryMark

