import type { UpdateUserCommand } from "#application/users/commands/update_user/update_user.command.ts";

import type { GenSalt, HashString } from "#application/shared/hasher.ts";
import { REQUESTER_NOT_FOUND, USER_NOT_FOUND } from "#application/users/failures/user.failures.ts";
import type { FindUserByUuid, SaveUser, UserExistsByUuid } from "#application/users/user.repository.ts";
import { UserEntity } from "#domain/users/entities/user.entity.ts";
import { UserEmail } from "#domain/users/user.email.ts";
import { UserPassword } from "#domain/users/user.password.ts";
import { UserType } from "#domain/users/user.type.ts";
import { match, otherwise } from "#functions/match.ts";
import { end, pipe } from "#functions/pipe.ts";
import { Left, Right, type Either } from "#types/either.ts";
import type { Failure } from "#types/failure.ts";
import { isJust } from "#types/maybe.ts";
import type { UpdateUserMeta } from "./update_user.meta.ts";

type ResultType
= Promise < Either < UserEntity, Failure > >

export type UpdateUserHandler
= (meta : UpdateUserMeta) => (command : UpdateUserCommand) => ResultType

export const UpdateUserHandler
= (userExistsByUuid : UserExistsByUuid) =>
  (findUserByUuid : FindUserByUuid) =>
  (genSalt : GenSalt) =>
  (hashString : HashString) =>
  (saveUser : SaveUser) : UpdateUserHandler =>
  meta => async command =>
  await userExistsByUuid (meta.requester_uuid.value) === false
  ? Right (REQUESTER_NOT_FOUND)
  : match (await findUserByUuid (command.uuid))
    (x => isJust (x)) (async (just) : ResultType =>  
       (await pipe (just.value)
        (user => createUserFromCommandAndUser (genSalt) (hashString) (command) (user))
        (saveUser)
        (u => Left (u))
        (end)))
    (otherwise) (Right (USER_NOT_FOUND))

const hashPassword
= (plain : string) =>
  (salt : string) => 
  (hashString : HashString) : UserPassword =>
  UserPassword (hashString (salt) (plain)) (salt)

const createUserFromCommandAndUser
= (genSalt : GenSalt) =>
  (hashString : HashString) =>
  (command : UpdateUserCommand) =>
  (user : UserEntity) : UserEntity =>
  UserEntity (user.uuid)
    (isJust (command.email)
      ? UserEmail (command.email.value) (false)
      : user.email)
    (isJust (command.password)
      ? hashPassword (command.password.value)
          (genSalt ())
          (hashString)
      : user.password)
    (isJust (command.type)
      ? UserType (command.type.value)
      : user.type)
    (user.father_uuid)
    (user.creator_uuid)

