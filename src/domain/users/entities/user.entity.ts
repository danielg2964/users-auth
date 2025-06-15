import { Entity } from "#domain/shared/entity.ts";
import type { UserEmail } from "../user.email.ts";
import type { UserPassword } from "../user.password.ts";
import type { UserType } from "../user.type.ts";
import type { UserUuidMark, UserUuid } from "../user.uuid.ts";

const UserEntityMark : unique symbol
= Symbol ()

export type UserEntityMark
= typeof UserEntityMark

export type UserEntity
= Entity < UserEntityMark, UserUuidMark, UserUuid, {
    get email () : UserEmail
  , get password () : UserPassword
  , get type () : UserType
  , get father_uuid () : UserUuid
  , get creator_uuid () : UserUuid
  } >

export const UserEntity
= (uuid : UserUuid) =>
  (user_email : UserEmail) =>
  (user_password : UserPassword) =>
  (type : UserType) => 
  (father_uuid : UserUuid)  =>
  (creator_uuid : UserUuid) : UserEntity =>
  Entity (UserEntityMark)
    (uuid)
    ({
      email : user_email
    , password : user_password
    , type
    , father_uuid
    , creator_uuid
    })
   
export const isUserEntity
= (value : unknown) : value is UserEntity =>
  value !== null
  && value !== undefined
  && (value as UserEntity).mark === UserEntityMark

