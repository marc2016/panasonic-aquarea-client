import { SensorMode, ZoneSensor, ZoneType } from '../domain/enums'

export class ZoneInfo {
  public zoneId: number | null = null
  public zoneName: string | null = null
  public zoneType: ZoneType | null = null
  public coolMode: boolean | null = null
  public zoneSensor: ZoneSensor | null = null
  public heatSensor: SensorMode | null = null
  public coolSensor: SensorMode | null = null
}
