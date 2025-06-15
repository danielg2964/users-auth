import { beforeEach, describe, it, mock } from 'node:test'
import assert from 'node:assert'

import { faker } from '@faker-js/faker'

import { GenerateUuid } from "#application/shared/generatos/uuid.generator.ts";
import { CreateUserCommand } from '#application/users/commands/create_user/create_user_command.ts'
import { createUserHandler, type CreateUserHandler } from '#application/users/commands/create_user/create_user_handler.ts'
import { FindUserByUuid, SaveUser, UserExistsByEmail, UserExistsByUuid } from '#application/users/user.repository.ts'
import { isLeft, isRight, Left, Right } from '#types/either.ts'
import { EMAIL_IN_USE, FATHER_DOESNT_EXIST, REQUESTER_NOT_FOUND } from '#application/users/failures/user.failures.ts'
import { GenSalt, HashString } from '#application/shared/hasher.ts'
import { UserEntity } from '#domain/users/entities/user.entity.ts';
import { UserEmail } from '#domain/users/user.email.ts';
import { UserPassword } from '#domain/users/user.password.ts';
import { Just, Nothing } from '#types/maybe.ts';
import type { Failure } from '#types/failure.ts';
import { CreateUserMeta } from '#application/users/commands/create_user/create_user_meta.ts';
import { UserType } from '#domain/users/user.type.ts';
import { UserUuid } from '#domain/users/user.uuid.ts';

describe ('CreateUserHandler Test', () => {
  const father_uuid
  = faker.string.uuid ()

  const command : CreateUserCommand
  = CreateUserCommand
      (faker.internet.email ())
      (faker.internet.password ())
      ('Company')
      (father_uuid)

  const requester_uuid
  = faker.string.uuid ()

  const requester : UserEntity
  = UserEntity (UserUuid (requester_uuid))
    (UserEmail (faker.internet.email ()) (false))
    (UserPassword (faker.string.alpha (12)) (faker.string.alpha (12)))
    (UserType ('Delegate'))
    (UserUuid (father_uuid))
    (UserUuid (faker.string.uuid ()))

  const meta : CreateUserMeta
  = CreateUserMeta (requester_uuid)

  const findUserByUuid
  = mock.fn (FindUserByUuid)

  const userExistsByEmail
  = mock.fn (UserExistsByEmail)

  const userExistsByUuid
  = mock.fn (UserExistsByUuid)

  const genSalt
  = mock.fn (GenSalt)

  const hashString
  = mock.fn (HashString)

  const generateUuid
  = mock.fn (GenerateUuid)

  const saveUser
  = mock.fn (SaveUser)

  let handler : CreateUserHandler

  beforeEach(() => {
    findUserByUuid.mock.mockImplementation (async _ => Just (requester))
    userExistsByEmail.mock.mockImplementation (async _ => false)
    userExistsByUuid.mock.mockImplementation (async _ => true)

    handler
    = createUserHandler
        (findUserByUuid)
        (userExistsByEmail)
        (userExistsByUuid)
        (genSalt)
        (hashString)
        (generateUuid)
        (saveUser)
  })

  it ('should return REQUESTER_NOT_FOUND Failure', async () => {
    findUserByUuid.mock.mockImplementationOnce (async uuid => {
      assert.strictEqual (uuid, requester_uuid)

      return Nothing ()
    })

    const result
    = await handler (meta) (command)

    assert.strictEqual (isRight (result), true)

    const failure
    = (result as Right < Failure >).value

    assert.strictEqual (failure, REQUESTER_NOT_FOUND)
    assert.strictEqual (findUserByUuid.mock.callCount (), 1)
  })

  it ('should return EMAIL_IN_USE Failure', async () => {
    userExistsByEmail.mock.mockImplementationOnce (async email => {
      assert.strictEqual (email, command.email)

      return true
    })

    const result
    = await handler (meta) (command)

    assert.strictEqual (isRight (result), true)
    assert.strictEqual (userExistsByEmail.mock.callCount (), 1)
    assert.strictEqual (result.value, EMAIL_IN_USE)
  })

  it ('should return FATHER_DOESNT_EXIST Failure', async () => {
    userExistsByUuid.mock.mockImplementationOnce (async uuid => {
      assert.strictEqual (uuid, command.father_uuid)

      return false
    })

    const result
    = await handler (meta) (command)

    assert.strictEqual (isRight (result), true)
    assert.strictEqual (userExistsByUuid.mock.callCount (), 1)
    assert.strictEqual (result.value, FATHER_DOESNT_EXIST)
  })

  it ('should succesfully create the user', async () => {
    const salt
    = faker.string.alpha ()

    genSalt.mock.mockImplementation (() => salt)

    const hash
    = faker.string.alpha ()

    hashString.mock.mockImplementation ($salt => plain => {
      assert.strictEqual ($salt, salt)
      assert.strictEqual (plain, command.password)

      return hash
    })

    const uuid
    = faker.string.uuid ()

    generateUuid.mock.mockImplementation (() => uuid)

    let user_saved : UserEntity

    saveUser.mock.mockImplementation (async user => {
      assert.strictEqual (user.uuid.value, uuid)
      assert.strictEqual (user.email.value, command.email)
      assert.strictEqual (user.email.is_verified, false)
      assert.strictEqual (user.type.value, command.type)
      assert.strictEqual (user.father_uuid.value, command.father_uuid)

      user_saved = user

      return user
    })

    const result
    = await handler (meta) (command)

    assert.strictEqual (isLeft (result), true)

    const left
    = result as Left < UserEntity >

    assert.deepStrictEqual (left.value, user_saved!)
  })
})

