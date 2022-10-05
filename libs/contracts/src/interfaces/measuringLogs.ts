import {StatusDevice} from "../enum"

export type MeasureData = {value: number, statusDevice: StatusDevice}
export type MeasuringLogs = Record<string, MeasureData>
