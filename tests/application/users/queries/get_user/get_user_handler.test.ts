import { beforeEach, describe, it, mock } from 'node:test'
import assert from 'node:assert'
import { GetUserHandler } from '#application/users/queries/get_user/get_user_handler.ts'
import { FindUserByUuid } from '#application/users/user.repository.ts'
import { faker } from '@faker-js/faker'
import { GetUserQuery } from '#application/users/queries/get_user/get_user_query.ts'
import { Just, Nothing } from '#types/maybe.ts'
import { isLeft, isRight, Left, Right } from '#types/either.ts'
import type { Failure } from '#types/failure.ts'
import { USER_NOT_FOUND } from '#application/users/failures/user.failures.ts'
import { UserEntity } from '#domain/users/entities/user.entity.ts'
import { UserEmail } from '#domain/users/user.email.ts'
import { UserPassword } from '#domain/users/user.password.ts'

describe ('GetUserHandler Test', () => {
  let findUserByUuid
  = mock.fn(FindUserByUuid)
  
  let handler : GetUserHandler

  const user_uuid
  = faker.string.uuid ()

  const query : GetUserQuery 
  = GetUserQuery (user_uuid)
const user : UserEntity
    = UserEntity (user_uuid)
      (UserEmail (faker.internet.email ()) (true))
      (UserPassword (faker.string.octal ()) (faker.string.octal ()))
      ('Company')
      (faker.string.uuid ())
      (faker.string.uuid ())

  beforeEach (() => {
    handler
    = GetUserHandler (findUserByUuid)
  })

  it ('should return USER_NOT_FOUND Failure', async () => {
    findUserByUuid.mock.mockImplementationOnce (async uuid => {
      assert.strictEqual (uuid, query.user_uuid)

      return Nothing ()
    })

    const result
    = await handler (query)

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
    = await handler (query)

    assert.strictEqual (isLeft (result), true)

    const user_result
    = (result as Left < UserEntity >).value

    assert.strictEqual (user_result, user)
  })
})

