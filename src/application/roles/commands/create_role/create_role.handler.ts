import { Left, Right, type Either } from "#types/either.ts";
import type { Failure } from "#types/failure.ts";

import type { CreateRoleCommand } from "./create_role.command.ts";
import type { CreateRoleMeta } from "./create_role.meta.ts";

import type { RoleExistsByName, SaveRole } from "#application/roles/role.repository.ts";
import { REQUESTER_NOT_FOUND } from "#application/users/failures/user.failures.ts";
import type { UserExistsByUuid } from "#application/users/user.repository.ts";
import { RoleEntity } from "#domain/roles/entities/role.entity.ts";
import { ROLE_NAME_IN_USE } from "#application/roles/failures/role.failures.ts";
import type { GenerateUuid } from "#application/shared/generatos/uuid.generator.ts";
import { end, pipe } from "#functions/pipe.ts";
import { RoleUuid } from "#domain/roles/role.uuid.ts";
import { RoleName } from "#domain/roles/role.name.ts";
import { RoleLevel } from "#domain/roles/role.level.ts";

type ResultType
= Promise < Either < RoleEntity, Failure > >

export type CreateRoleHandler
= (meta : CreateRoleMeta) => (command : CreateRoleCommand) => ResultType

export const CreateRoleHandler
= (userExistsByUuid : UserExistsByUuid) =>
  (roleExistsByName : RoleExistsByName) =>
  (generateUuid : GenerateUuid) =>
  (saveRole : SaveRole) : CreateRoleHandler =>
  meta => async command =>
  await userExistsByUuid (meta.requester_uuid.value) === false
  ? Right (REQUESTER_NOT_FOUND)
  : await roleExistsByName (command.name) === true
    ? Right (ROLE_NAME_IN_USE)
    : Left (await pipe (RoleEntity)
      (c => c (RoleUuid (generateUuid ())))
      (c => c (RoleName (command.name)))
      (c => c (RoleLevel (command.level)))
      (saveRole)
      (end))
               
