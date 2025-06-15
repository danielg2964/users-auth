import {  beforeEach, describe, it, mock } from 'node:test'
import assert from 'node:assert'

import { faker } from '@faker-js/faker'

import { UpdateUserCommand } from '#application/users/commands/update_user/update_user.command.ts'
import { UpdateUserHandler } from '#application/users/commands/update_user/update_user.handler.ts'
import { UpdateUserMeta } from '#application/users/commands/update_user/update_user.meta.ts'

import { FindUserByUuid, SaveUser, UserExistsByUuid } from '#application/users/user.repository.ts'
import { Just, Nothing } from '#types/maybe.ts'
import { UserEntity } from '#domain/users/entities/user.entity.ts'
import { UserEmail } from '#domain/users/user.email.ts'
import { UserPassword } from '#domain/users/user.password.ts'
import { isLeft, isRight, Left, Right } from '#types/either.ts'
import { GenSalt, HashString } from '#application/shared/hasher.ts'
import { REQUESTER_NOT_FOUND, USER_NOT_FOUND } from '#application/users/failures/user.failures.ts'
import type { Failure } from '#types/failure.ts'
import { UserType } from '#domain/users/user.type.ts'
import { UserUuid } from '#domain/users/user.uuid.ts'

describe ('UpdateUserHandler Test', () => {
  const user_uuid : string
  = faker.string.uuid ()

  const user_to_update : UserEntity
  = UserEntity (UserUuid (user_uuid))
    (UserEmail (faker.internet.email ()) (true))
    (UserPassword (faker.string.alphanumeric (15)) (faker.string.alphanumeric (15)))
    (UserType ('Delegate'))
    (UserUuid (faker.string.uuid ()))
    (UserUuid (faker.string.uuid ()))

  const requester_uuid : string
  = faker.string.uuid ()

  const meta : UpdateUserMeta
  = UpdateUserMeta (UserUuid (requester_uuid))

  const command : UpdateUserCommand
  = UpdateUserCommand (user_uuid)
    (Just (faker.internet.email ()))
    (Just (faker.internet.password ()))
    (Just ('Company'))

  let userExistsByUuid
  = mock.fn (UserExistsByUuid)

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
    userExistsByUuid.mock.mockImplementation (async uuid => {
      assert.strictEqual (uuid, requester_uuid)

      return true
    })

    findUserByUuid.mock.mockImplementation (async uuid => {
      assert.strictEqual (uuid, command.uuid)

      return Just (user_to_update)
    })

    handler
    = UpdateUserHandler 
        (userExistsByUuid)
        (findUserByUuid)
        (genSalt)
        (hashString)
        (saveUser)
  })

  it ('should return REQUESTER_NOT_FOUND Failure', async () => {
    userExistsByUuid.mock.mockImplementationOnce (async uuid => {
      assert.strictEqual (uuid, requester_uuid)

      return false
    })

    const result
    = await handler (meta) (command)

    assert.strictEqual (isRight (result), true)

    const right
    = result as Right < Failure >

    assert.strictEqual (right.value, REQUESTER_NOT_FOUND)
    assert.strictEqual (userExistsByUuid.mock.callCount (), 1)
  })

  it ('should return USER_NOT_FOUND Failure', async () => {
    findUserByUuid.mock.mockImplementationOnce (async uuid => {
      assert.strictEqual (uuid, command.uuid) 

      return Nothing ()
    })

    const result
    = await handler (meta) (command)

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
      assert.strictEqual (user.uuid.value, command.uuid)

      assert.strictEqual (user.email.value, (command.email as Just < string >).value)

      assert.strictEqual (user.email.is_verified, false)

      assert.strictEqual (user.password.salt, salt)
      assert.strictEqual (user.password.hash, hash)

      assert.strictEqual (user.type.value, (command.type as Just < string >).value)

      assert.strictEqual (user.father_uuid.value, user_to_update.father_uuid.value)
      assert.strictEqual (user.creator_uuid.value, user_to_update.creator_uuid.value)

      user_saved = user

      return user
    })

    const result
    = await handler (meta) (command)

    assert.strictEqual (saveUser.mock.callCount (), 1)

    assert.strictEqual (isLeft (result), true)
    assert.strictEqual (isRight (result), false)

    const left
    = result as Left < UserEntity >

    assert.deepStrictEqual (left.value, user_saved!)
  })
})

