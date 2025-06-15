import type { Marked } from "#types/marked.ts"

const CreateRoleCommandMark : unique symbol
= Symbol ()

export type CreateRoleCommandMark
= typeof CreateRoleCommandMark

export type CreateRoleCommand
= Marked < CreateRoleCommandMark, {
    name : string
  , level : number
  } >
  
export const CreateRoleCommand
= (name : string) =>
  (level : number) : CreateRoleCommand =>
  ({
    mark : CreateRoleCommandMark
  , name
  , level
  })

