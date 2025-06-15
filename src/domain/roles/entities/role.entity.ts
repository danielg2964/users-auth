import { Entity } from '../../shared/entity.ts'
import type { RoleLevel } from '../role.level.ts'
import type { RoleName } from '../role.name.ts'
import type { RoleUuidMark, RoleUuid } from '../role.uuid.ts'

const RoleEntityMark : unique symbol
=  Symbol ()

export type RoleEntityMark
= typeof RoleEntityMark

export type RoleEntity
= Entity < RoleEntityMark, RoleUuidMark, RoleUuid,  {
    get name () : RoleName 
  , get level () : RoleLevel
  } >

export const RoleEntity
= (uuid : RoleUuid) =>
  (name : RoleName) =>
  (level : RoleLevel) : RoleEntity =>
  Entity (RoleEntityMark)
    (uuid)
    ({
      name
    , level
    })

export const isRoleEntity
= (value : unknown) : value is RoleEntity =>
  value !== null
  && value !== undefined
  && (value as RoleEntity).mark === RoleEntityMark

