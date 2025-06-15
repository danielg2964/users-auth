import { beforeEach, describe, it, mock } from 'node:test'
import assert from 'node:assert'

import { faker } from '@faker-js/faker'

import { CreateRoleMeta } from '#application/roles/commands/create_role/create_role.meta.ts'
import { CreateRoleCommand } from '#application/roles/commands/create_role/create_role.command.ts'
import { CreateRoleHandler } from '#application/roles/commands/create_role/create_role.handler.ts'

import { UserUuid } from '#domain/users/user.uuid.ts'
import { UserExistsByUuid } from '#application/users/user.repository.ts'
import { isLeft, isRight, Left, Right } from '#types/either.ts'
import type { Failure } from '#types/failure.ts'
import { REQUESTER_NOT_FOUND } from '#application/users/failures/user.failures.ts'
import { RoleExistsByName, SaveRole } from '#application/roles/role.repository.ts'
import { ROLE_NAME_IN_USE } from '#application/roles/failures/role.failures.ts'
import { GenerateUuid } from '#application/shared/generatos/uuid.generator.ts'
import type { RoleEntity } from '#domain/roles/entities/role.entity.ts'

describe ('CreateRoleHandler Test', () => {
  const requester_uuid
  = faker.string.uuid ()

  const meta
  = CreateRoleMeta (UserUuid (requester_uuid))

  const command
  = CreateRoleCommand (faker.vehicle.vehicle ()) (3)
      
  const userExistsByUuidMock
  = mock.fn (UserExistsByUuid)

  const roleExistsByNameMock 
  = mock.fn (RoleExistsByName)

  const role_uuid : string
  = faker.string.uuid ()

  const generateUuidMock
  = mock.fn (GenerateUuid)

  const saveRoleMock
  = mock.fn (SaveRole)

  let handler : CreateRoleHandler
  
  beforeEach (() => {
    userExistsByUuidMock.mock.mockImplementation (async uuid => {
      assert.strictEqual (uuid, requester_uuid)

      return true
    })

    roleExistsByNameMock.mock.mockImplementation (async name => {
      assert.strictEqual (name, command.name)

      return false
    })

    handler
    = CreateRoleHandler 
      (userExistsByUuidMock)
      (roleExistsByNameMock)
      (generateUuidMock)
      (saveRoleMock)
  })

  it ('should return REQUESTER_NOT_FOUND Failure', async () => {
    userExistsByUuidMock.mock.mockImplementationOnce (async uuid => {
      assert.strictEqual (uuid, requester_uuid)

      return false
    })

    const result
    = await handler (meta) (command)
    assert.strictEqual (isRight (result), true)

    const right
    = result as Right < Failure >
    assert.strictEqual (right.value, REQUESTER_NOT_FOUND)

    assert.strictEqual (userExistsByUuidMock.mock.callCount (), 1)
  })

  it ('should return ROLE_NAME_IN_USE Failure', async () => {
    roleExistsByNameMock.mock.mockImplementationOnce (async name => {
      assert.strictEqual (name, command.name)

      return true
    })

    const result
    = await handler (meta) (command)
    assert.strictEqual (isRight (result), true)

    const right
    = result as Right < Failure >
    assert.strictEqual (right.value, ROLE_NAME_IN_USE)

    assert.strictEqual (roleExistsByNameMock.mock.callCount (), 1)
  })

  it ('should successfully create Role', async () => {
    generateUuidMock.mock.mockImplementation (() => role_uuid)

    let role : RoleEntity

    saveRoleMock.mock.mockImplementation (async $role => {
      assert.strictEqual ($role.uuid.value, role_uuid)
      assert.strictEqual ($role.name.value, command.name)
      assert.strictEqual ($role.level.value, command.level)

      role = $role

      return role
    })
    

    const result
    = await handler (meta) (command)
    assert.strictEqual (isLeft (result), true)

    const left
    = result as Left < RoleEntity >
    assert.deepStrictEqual (left.value, role!)

    assert.strictEqual (saveRoleMock.mock.callCount (), 1)
  })
})

