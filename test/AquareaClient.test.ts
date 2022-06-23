import { AquareaClient } from '../src/AquareaClient'
import * as auth from './auth_data.json'

const password = auth.password
const username = auth.username

const client = new AquareaClient()

test('login', async () => {
  await client.login(username, password)
})
