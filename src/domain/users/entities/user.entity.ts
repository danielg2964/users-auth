import { Entity } from "#domain/shared/entity.ts";
import type { UserEmail } from "../user.email.ts";
import type { UserPassword } from "../user.password.ts";

export type UserEntity
= Entity & {
    email : UserEmail
  , password : UserPassword
  , type : string
  , father_uuid : string
  , creator_uuid : string
  }

export const UserEntity
= (uuid : string) =>
  (user_email : UserEmail) =>
  (user_password : UserPassword) =>
  (type : string) => 
  (father_uuid : string)  =>
  (creator_uuid : string) : UserEntity =>
  ({
    ...Entity (uuid)
  , email : user_email
  , password : user_password
  , type
  , father_uuid
  , creator_uuid
  })
 
