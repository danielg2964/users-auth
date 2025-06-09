import type { GenerateUuid } from "#application/shared/generatos/uuid.generator.ts";
import type { GenSalt, HashString } from "#application/shared/hasher.ts";
import { EMAIL_IN_USE, FATHER_DOESNT_EXIST } from "#application/users/failures/user.failures.ts";
import type { SaveUser, UserExistsByEmail, UserExistsByUuid } from "#application/users/user.repository.ts";
import { UserEntity } from "#domain/users/entities/user.entity.ts";
import { UserEmail } from "#domain/users/user.email.ts";
import { UserPassword } from "#domain/users/user.password.ts";
import { Left, Right, type Either } from "#types/either.ts";
import type { Failure } from "#types/failure.ts";
import type { CreateUserCommand } from "./create_user_command.ts";

export type CreateUserHandler
= (command : CreateUserCommand) => Promise < Either < UserEntity, Failure > >

export const createUserHandler
= (userExistsByEmail : UserExistsByEmail) =>
  (userExistsByUuid : UserExistsByUuid) =>
  (genSalt : GenSalt) =>
  (hashString : HashString) =>
  (generateUuid : GenerateUuid) =>
  (saveUser : SaveUser) : CreateUserHandler =>
  async command =>
  await userExistsByEmail (command.email) === false
  ? await userExistsByUuid (command.father_uuid)
    ? Left (await saveUser
          (UserEntity (generateUuid ())
          (UserEmail (command.email) (false))
          (createUserPassword (command.password)
            (genSalt ()) 
            (hashString))
          (command.type)
          (command.father_uuid)))
    : Right (FATHER_DOESNT_EXIST)
  : Right (EMAIL_IN_USE)

const createUserPassword
= (plain : string) =>
  (salt : string) =>
  (hashString : HashString) : UserPassword =>
  UserPassword (hashString (salt) (plain)) (salt)

