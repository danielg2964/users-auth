import type { RoleEntity } from "#domain/roles/entities/role.entity.ts"

export type RoleExistsByName
= (name : string) => Promise < boolean >

export const RoleExistsByName : RoleExistsByName
= _ => { throw new Error () }

export type SaveRole
= (role : RoleEntity) => Promise < RoleEntity >
export const SaveRole : SaveRole
= _ => { throw new Error () }

