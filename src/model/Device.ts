import { OperationMode } from '../domain/enums.js'

export class Device {
  public deviceId: string
  public name: string
  public longId: string
  public mode: OperationMode
  public hasTank: boolean
  public firmwareVersion: string
  //public zones: list[DeviceZoneInfo]

  constructor(
    deviceId: string,
    name: string,
    longId: string,
    mode: OperationMode,
    hasTank: boolean,
    firmwareVersion: string,
  ) {
    this.deviceId = deviceId
    this.name = name
    this.longId = longId
    this.mode = mode
    this.hasTank = hasTank
    this.firmwareVersion = firmwareVersion
  }
}
