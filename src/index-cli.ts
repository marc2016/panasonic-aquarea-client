#!/usr/bin/env node

import { AquareaClient } from './AquareaClient.js'

import password from '@inquirer/password'
import { input } from '@inquirer/prompts'
import select from '@inquirer/select'
import { isArray } from 'lodash'
import { Device } from './model/Device.js'

type Command = 'get-devices' | 'exit' | null
type DeviceCommand = 'print-device' | 'get-long-id' | 'exit' | null

let client: AquareaClient

async function SelectCommand(): Promise<Command> {
  const nextCommand: Command = await select({
    message: 'Select a command',
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

async function selectDevice(): Promise<Device | null> {
  const devices = await client.getDevices()
  if (devices == null) {
    console.log('No devices found.')
    return null
  }
  console.log(`Found ${devices.length} device${devices.length == 1 ? '' : 's'}.`)

  const choicesDevices = new Array()
  for (let device of devices) {
    choicesDevices.push({
      name: device.configration?.at(0)?.a2wName,
      value: device,
    })
  }
  choicesDevices.push({
    name: 'Print all',
    value: devices,
  })
  const selectedObj: Device | Device[] = await select({
    message: 'Select a device or print all',
    choices: choicesDevices,
  })

  if (isArray(selectedObj)) {
    console.log(JSON.stringify(selectedObj, null, 2))
    return null
  }
  return selectedObj
}

async function selectDeviceCommand(device: Device) {
  let nextCommand: DeviceCommand = null
  while (nextCommand != 'exit') {
    nextCommand = await select({
      message: 'Select a command',
      choices: [
        {
          name: 'Get long id',
          value: 'get-long-id',
          description: 'Get a device for a given guid',
        },
        {
          name: 'Exit',
          value: 'exit',
          description: 'Exit script',
        },
      ],
    })

    switch (nextCommand) {
      case 'get-long-id':
        if (device.deviceGuid) {
          const longId = await client.getDeviceLongId(device.deviceGuid)
          console.log(`Device lond ID: ${longId}`)
        }
        break

      default:
        break
    }
  }
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
        const selectedDevice = await selectDevice()
        if (selectedDevice == null) continue
        await selectDeviceCommand(selectedDevice)
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
