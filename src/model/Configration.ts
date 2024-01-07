import { OperationMode } from '../domain/enums'
import { TankInfo } from './TankInfo'
import { ZoneInfo } from './ZoneInfo'

export class Configration {
  public zoneInfo: ZoneInfo[] | null = null
  public a2wName: string | null = null
  public operationMode: OperationMode | null = null
  public deviceGuid: string | null = null
  public lastErrorNumber: string | null = null
  public bivalent: string | null = null
  public specialStatus: number | null = null
  public tankInfo: TankInfo[] | null = null
  public firmVersion: string | null = null
}
