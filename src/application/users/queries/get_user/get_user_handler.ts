import { USER_NOT_FOUND } from "#application/users/failures/user.failures.ts";
import type { FindUserByUuid } from "#application/users/user.repository.ts";
import type { UserEntity } from "#domain/users/entities/user.entity.ts";
import { match, otherwise } from "#functions/match.ts";
import { Left, Right, type Either } from "#types/either.ts";
import type { Failure } from "#types/failure.ts";
import { isJust } from "#types/maybe.ts";
import type { GetUserQuery } from "./get_user_query.ts";

export type GetUserHandler
= (query : GetUserQuery) => Promise < Either < UserEntity, Failure > >

export const GetUserHandler
= (findUserByUuid : FindUserByUuid) : GetUserHandler =>
  async query =>
  match (await findUserByUuid (query.user_uuid))
  (m => isJust (m)) (j => Left (j.value))
  (otherwise) (Right (USER_NOT_FOUND))
  
