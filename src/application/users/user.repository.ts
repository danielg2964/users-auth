import type { UserEntity } from "#domain/users/entities/user.entity.ts";
import type { Maybe } from "#types/maybe.ts";

export type SaveUser
= (user : UserEntity) => Promise < UserEntity >

export const SaveUser : SaveUser
= _ => { throw new Error ('Not implemented yet') }

export type FindUserByUuid
= (uuid : string) => Promise < Maybe < UserEntity > >

export const FindUserByUuid : FindUserByUuid
= _ => { throw new Error ('Not implemented yet') }

export type FindUserByEmail
= (email : string) => Promise < Maybe < UserEntity > >

export const FindUserByEmail : FindUserByEmail
= _ => { throw new Error ('Not implemented yet') }

export type UserExistsByEmail
= (email : string) => Promise < boolean >

export const UserExistsByEmail : UserExistsByEmail
= _ => { throw new Error ('Not implemented yet') }

export type UserExistsByUuid
= (uuid : string) => Promise < boolean >

export const UserExistsByUuid : UserExistsByUuid
= _ => { throw new Error ('Not implemented yet') }

export type FindUserByUuidAndFather
= (uuid : string) => (father_uuid : string) => Promise < Maybe < UserEntity > >

export const FindUserByUuidAndFather : FindUserByUuidAndFather
= _ => _ => { throw new Error ('Not implemented yet') }

