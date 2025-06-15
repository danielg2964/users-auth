import { REQUESTER_NOT_FOUND, USER_NOT_FOUND } from "#application/users/failures/user.failures.ts";
import type { FindUserByUuid, UserExistsByUuid } from "#application/users/user.repository.ts";
import type { UserEntity } from "#domain/users/entities/user.entity.ts";
import { match, otherwise } from "#functions/match.ts";
import { Left, Right, type Either } from "#types/either.ts";
import type { Failure } from "#types/failure.ts";
import { isJust } from "#types/maybe.ts";
import type { GetUserMeta } from "./get_user_meta.ts";
import type { GetUserQuery } from "./get_user_query.ts";

type ResultType
= Promise < Either < UserEntity, Failure > >

export type GetUserHandler
= (meta : GetUserMeta) =>
  (query : GetUserQuery) => ResultType

export const GetUserHandler
= (userExistsByUuid : UserExistsByUuid) =>
  (findUserByUuid : FindUserByUuid) : GetUserHandler =>
  meta => async query =>
  match (await userExistsByUuid (meta.requester_uuid))
  (r => r === true) (async _ =>
    match (await findUserByUuid (query.user_uuid))
    (m => isJust (m)) (j => Left (j.value))
    (otherwise) (Right (USER_NOT_FOUND)))
  (otherwise) (Right (REQUESTER_NOT_FOUND))
 
