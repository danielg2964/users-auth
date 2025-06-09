import { FindUserByEmail } from '#application/users/user.repository.ts'
import { mock } from 'node:test'

const main : () => Promise < void >
= async () => {
  const findUserByEmail : FindUserByEmail
  = mock.fn (FindUserByEmail, (_) => null!)

  console.log (findUserByEmail ('hola'))
}

await main()

