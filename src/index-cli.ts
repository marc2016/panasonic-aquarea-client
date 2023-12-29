#!/usr/bin/env node

import { AquareaClient } from './AquareaClient.js'

import password from '@inquirer/password'
import { input } from '@inquirer/prompts'
import select from '@inquirer/select'

type Command = 'get-devices' | 'exit' | null

let client: AquareaClient

async function SelectCommand(): Promise<Command> {
  const nextCommand: Command = await select({
    message: 'Select a package manager',
    choices: [
      {
        name: 'Get device',
        value: 'get-devices',
        description: 'Get a device for a given guid',
      },
      {
        name: 'Exit',
        value: 'exit',
        description: 'Exit script',
      },
    ],
  })
  return nextCommand
}

async function start(): Promise<void> {
  const answers = {
    username: await input({ message: 'Username' }),
    password: await password({ message: 'Password' }),
  }

  client = new AquareaClient()
  await client.login(answers.username, answers.password)
  console.log('Login successful.')

  let nextCommand: Command = null
  while (nextCommand != 'exit') {
    nextCommand = await SelectCommand()
    switch (nextCommand) {
      case 'get-devices':
        await client.getDevices()
        break
      // case 'get-group':
      //   const selectedGroup = await SelectGroup()
      //   await SelectDevice(selectedGroup)
      //   break
      default:
        break
    }
  }
}

start()
