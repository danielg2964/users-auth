import {  beforeEach, describe, it, mock } from 'node:test'
import assert from 'node:assert'

import { faker } from '@faker-js/faker'

import { FindUserByUuid, SaveUser } from '#application/users/user.repository.ts'
import { UpdateUserCommand } from '#application/users/commands/update_user/update_user_command.ts'
import { UpdateUserHandler } from '#application/users/commands/update_user/update_user_handler.ts'
import { Just, Nothing } from '#types/maybe.ts'
import { UserEntity } from '#domain/users/entities/user.entity.ts'
import { UserEmail } from '#domain/users/user.email.ts'
import { UserPassword } from '#domain/users/user.password.ts'
import { isLeft, isRight, Left, Right } from '#types/either.ts'
import { GenSalt, HashString } from '#application/shared/hasher.ts'
import { USER_NOT_FOUND } from '#application/users/failures/user.failures.ts'
import type { Failure } from '#types/failure.ts'

describe ('UpdateUserHandler Test', () => {
  const user_uuid : string
  = faker.string.uuid ()

  const user_to_update : UserEntity
  = UserEntity (user_uuid)
    (UserEmail (faker.internet.email ()) (true))
    (UserPassword (faker.string.alphanumeric (15)) (faker.string.alphanumeric (15)))
    ('Delegate')
    (faker.string.uuid ())
    (faker.string.uuid ())

  const command : UpdateUserCommand
  = UpdateUserCommand (user_uuid)
    (Just (faker.internet.email ()))
    (Just (faker.internet.password ()))
    (Just ('Company'))

  let findUserByUuid
  = mock.fn (FindUserByUuid)

  let genSalt
  = mock.fn (GenSalt)

  let hashString
  = mock.fn (HashString)

  let saveUser
  = mock.fn (SaveUser)

  let handler : UpdateUserHandler

  beforeEach(() => {
    findUserByUuid.mock.mockImplementation (async uuid => {
      assert.strictEqual (uuid, command.uuid)

      return Just (user_to_update)
    })

    handler
    = UpdateUserHandler (findUserByUuid)
        (genSalt)
        (hashString)
        (saveUser)
  })

  it ('should return USER_NOT_FOUND Failure', async () => {
    findUserByUuid.mock.mockImplementationOnce (async uuid => {
      assert.strictEqual (uuid, command.uuid) 

      return Nothing ()
    })

    const result
    = await handler (command)

    assert.strictEqual (isRight (result), true)

    const right
    = result as Right < Failure >

    assert.strictEqual (right.value, USER_NOT_FOUND)

    assert.strictEqual (findUserByUuid.mock.callCount (), 1)
  })

  it ('should update user successfully', async () => {
    const salt 
    = faker.string.alphanumeric (12)
    genSalt.mock.mockImplementation (() => salt)

    const hash
    = faker.string.alphanumeric (12)
    hashString.mock.mockImplementation ($salt => plain => {
      assert.strictEqual ($salt, salt)
      assert.strictEqual (plain, (command.password as Just < string >).value)

      return hash
    })

    let user_saved : UserEntity

    saveUser.mock.mockImplementation (async user => {
      assert.strictEqual (user.uuid, command.uuid)

      assert.strictEqual (user.email.value, (command.email as Just < string >).value)
      assert.strictEqual (user.email.is_verified, false)

      assert.strictEqual (user.password.salt, salt)
      assert.strictEqual (user.password.hash, hash)

      assert.strictEqual (user.type, (command.type as Just < string >).value)

      assert.strictEqual (user.father_uuid, user_to_update.father_uuid)

      user_saved = user

      return user
    })

    const result
    = await handler (command)

    assert.strictEqual (saveUser.mock.callCount (), 1)

    assert.strictEqual (isLeft (result), true)
    assert.strictEqual (isRight (result), false)

    const left
    = result as Left < UserEntity >

    assert.deepStrictEqual (left.value, user_saved!)
  })
})


