import { beforeEach, describe, it, mock } from 'node:test'
import assert from 'node:assert'

import { faker } from '@faker-js/faker'

import { GenerateUuid } from "#application/shared/generatos/uuid.generator.ts";
import { CreateUserCommand } from '#application/users/commands/create_user/create_user_command.ts'
import { createUserHandler, type CreateUserHandler } from '#application/users/commands/create_user/create_user_handler.ts'
import { SaveUser, UserExistsByEmail, UserExistsByUuid } from '#application/users/user.repository.ts'
import { isLeft, isRight, Left } from '#types/either.ts'
import { EMAIL_IN_USE, FATHER_DOESNT_EXIST } from '#application/users/failures/user.failures.ts'
import { GenSalt, HashString } from '#application/shared/hasher.ts'
import type { UserEntity } from '#domain/users/entities/user.entity.ts';

describe ('CreateUserHandler Test', () => {
  const command : CreateUserCommand
  = CreateUserCommand
      (faker.internet.email ())
      (faker.internet.password ())
      ('Company')
      (faker.string.uuid ())

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
    userExistsByEmail.mock.mockImplementation
      (async _ => false)

    userExistsByUuid.mock.mockImplementation
      (async _ => true)

    handler
    = createUserHandler
        (userExistsByEmail)
        (userExistsByUuid)
        (genSalt)
        (hashString)
        (generateUuid)
        (saveUser)
  })

  it ('should return EMAIL_IN_USE Failure', async () => {
    userExistsByEmail.mock.mockImplementationOnce (async email => {
      assert.strictEqual (email, command.email)

      return true
    })

    const result
    = await handler (command)

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
    = await handler (command)

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
      assert.strictEqual (user.uuid, uuid)
      assert.strictEqual (user.email.value, command.email)
      assert.strictEqual (user.email.is_verified, false)
      assert.strictEqual (user.type, command.type)
      assert.strictEqual (user.father_uuid, command.father_uuid)

      user_saved = user

      return user
    })

    const result
    = await handler (command)

    assert.strictEqual (isLeft (result), true)

    const left
    = result as Left < UserEntity >

    assert.deepStrictEqual (left.value, user_saved!)
  })
})

