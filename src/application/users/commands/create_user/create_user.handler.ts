import type { CreateUserCommand } from "./create_user.command.ts";
import type { CreateUserMeta } from "./create_user.meta.ts";

import type { GenerateUuid } from "#application/shared/generatos/uuid.generator.ts";
import type { GenSalt, HashString } from "#application/shared/hasher.ts";
import { EMAIL_IN_USE, FATHER_DOESNT_EXIST, REQUESTER_NOT_FOUND } from "#application/users/failures/user.failures.ts";
import type { FindUserByUuid, SaveUser, UserExistsByEmail, UserExistsByUuid } from "#application/users/user.repository.ts";
import { UserEntity } from "#domain/users/entities/user.entity.ts";
import { UserEmail } from "#domain/users/user.email.ts";
import { UserPassword } from "#domain/users/user.password.ts";
import { UserType } from "#domain/users/user.type.ts";
import { UserUuid } from "#domain/users/user.uuid.ts";
import { match, otherwise } from "#functions/match.ts";
import { end, pipe } from "#functions/pipe.ts";
import { Left, Right, type Either } from "#types/either.ts";
import type { Failure } from "#types/failure.ts";
import { isJust } from "#types/maybe.ts";

type ResultType
= Promise < Either < UserEntity, Failure > >

export type CreateUserHandler
= (meta: CreateUserMeta) =>
  (command : CreateUserCommand) => ResultType 

export const CreateUserHandler
= (findUserByUuid : FindUserByUuid) =>
  (userExistsByEmail : UserExistsByEmail) =>
  (userExistsByUuid : UserExistsByUuid) =>
  (genSalt : GenSalt) =>
  (hashString : HashString) =>
  (generateUuid : GenerateUuid) =>
  (saveUser : SaveUser) : CreateUserHandler =>
  meta => async command =>
  match (await findUserByUuid (meta.requester_uuid.value))
  (x => isJust (x)) (async (just) : ResultType => 
  await userExistsByEmail (command.email) == false
    ? await userExistsByUuid (command.father_uuid)
      ? await pipe (UserEntity)
          (c => c (UserUuid (generateUuid ())))
          (c => c (UserEmail (command.email) (false)))
          (c => c (pipe (genSalt ()) 
                   (salt => UserPassword (salt)
                     (hashString (salt)
                     (command.password)))
                   (end)))
          (c => c (UserType (command.type)))
          (c => c (UserUuid (command.father_uuid)))
          (c => c (just.value.uuid))
          (saveUser)
          (u => Left (u))
          (end)
      : Right (FATHER_DOESNT_EXIST)
    : Right (EMAIL_IN_USE))
  (otherwise) (Right (REQUESTER_NOT_FOUND))

