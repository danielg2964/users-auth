import { beforeEach, describe, it, mock } from 'node:test'
import assert from 'node:assert'
import { GetUserHandler } from '#application/users/queries/get_user/get_user_handler.ts'
import { FindUserByUuid, UserExistsByUuid } from '#application/users/user.repository.ts'
import { faker } from '@faker-js/faker'
import { GetUserQuery } from '#application/users/queries/get_user/get_user_query.ts'
import { Just, Nothing } from '#types/maybe.ts'
import { isLeft, isRight, Left, Right } from '#types/either.ts'
import type { Failure } from '#types/failure.ts'
import { REQUESTER_NOT_FOUND, USER_NOT_FOUND } from '#application/users/failures/user.failures.ts'
import { UserEntity } from '#domain/users/entities/user.entity.ts'
import { UserEmail } from '#domain/users/user.email.ts'
import { UserPassword } from '#domain/users/user.password.ts'
import { GetUserMeta } from '#application/users/queries/get_user/get_user_meta.ts'
import { UserUuid } from '#domain/users/user.uuid.ts'
import { UserType } from '#domain/users/user.type.ts'

describe ('GetUserHandler Test', () => {
  let findUserByUuid
  = mock.fn (FindUserByUuid)
  
  let userExistsByUuid
  = mock.fn (UserExistsByUuid)

  let handler : GetUserHandler

  const requester_uuid
  = faker.string.uuid ()

  const meta : GetUserMeta
  = GetUserMeta (requester_uuid)

  const user_uuid
  = faker.string.uuid ()

  const query : GetUserQuery 
  = GetUserQuery (user_uuid)

  const user : UserEntity
    = UserEntity (UserUuid (user_uuid))
      (UserEmail (faker.internet.email ()) (true))
      (UserPassword (faker.string.octal ()) (faker.string.octal ()))
      (UserType ('Company'))
      (UserUuid (faker.string.uuid ()))
      (UserUuid (faker.string.uuid ()))

  beforeEach (() => {
    userExistsByUuid.mock.mockImplementation (async uuid => {
      assert.strictEqual (uuid, requester_uuid)

      return true
    })

    handler
    = GetUserHandler (userExistsByUuid)
    (findUserByUuid)
  })

  it ('should return REQUESTER_NOT_FOUND Failure', async () => {
    userExistsByUuid.mock.mockImplementationOnce (async uuid => {
      assert.strictEqual (uuid, requester_uuid)

      return false
    })

    const result
    = await handler (meta) (query)

    assert.strictEqual (isRight (result), true)

    const failure
    = (result as Right < Failure >).value

    assert.strictEqual (REQUESTER_NOT_FOUND, failure)
  })

  it ('should return USER_NOT_FOUND Failure', async () => {
    findUserByUuid.mock.mockImplementationOnce (async uuid => {
      assert.strictEqual (uuid, query.user_uuid)

      return Nothing ()
    })

    const result
    = await handler (meta) (query)

    assert.strictEqual (isRight (result), true)

    const failure
    = (result as Right < Failure >).value

    assert.strictEqual (USER_NOT_FOUND, failure) 
  })

  it ('should return User as Left', async () => {
    findUserByUuid.mock.mockImplementationOnce (async uuid => {
      assert.strictEqual (uuid, user_uuid)

      return Just (user)
    })

    const result
    = await handler (meta) (query)

    assert.strictEqual (isLeft (result), true)

    const user_result
    = (result as Left < UserEntity >).value

    assert.strictEqual (user_result, user)
  })
})

