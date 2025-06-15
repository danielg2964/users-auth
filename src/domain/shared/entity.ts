import type { Marked } from "#types/marked.ts"
import type { Uuid } from "./uuid.ts"

export type Entity < TMark extends symbol, TUuidMark extends symbol, TUuid extends Uuid < TUuidMark >, TShape >
= Marked < TMark, TShape & { uuid : TUuid } >

export const Entity 
=< TMark extends symbol > (mark : TMark) =>
  < TUuidMark extends symbol, TUuid extends Uuid < TUuidMark > > (uuid : TUuid) =>
  < TShape > (shape : TShape)
    : Entity < TMark, TUuidMark, TUuid, TShape > =>
  ({
    mark
  , uuid
  , ...shape
  })

