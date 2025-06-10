import type { GenSalt, HashString } from "#application/shared/hasher.ts";
import type { UpdateUserCommand } from "#application/users/commands/update_user/update_user_command.ts";
import { USER_NOT_FOUND } from "#application/users/failures/user.failures.ts";
import type { FindUserByUuid, SaveUser } from "#application/users/user.repository.ts";
import { UserEntity } from "#domain/users/entities/user.entity.ts";
import { UserEmail } from "#domain/users/user.email.ts";
import { UserPassword } from "#domain/users/user.password.ts";
import { match, otherwise } from "#functions/match.ts";
import { end, pipe } from "#functions/pipe.ts";
import { Left, Right, type Either } from "#types/either.ts";
import type { Failure } from "#types/failure.ts";
import { isJust } from "#types/maybe.ts";

export type UpdateUserHandler
= (command : UpdateUserCommand) => Promise < Either < UserEntity, Failure > >

export const UpdateUserHandler
= (findUserByUuid : FindUserByUuid) =>
  (genSalt : GenSalt) =>
  (hashString : HashString) =>
  (saveUser : SaveUser) : UpdateUserHandler =>
  async command =>
  match (await findUserByUuid (command.uuid))
  (x => isJust (x)) (async just =>  
                      Left < UserEntity, Failure > (await pipe (just.value)
                        (user => createUserFromCommandAndUser (genSalt) (hashString) (command) (user))
                        (saveUser)
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
      ? command.type.value
      : user.type)
    (user.father_uuid)

