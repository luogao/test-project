export enum LogType {
  Log = 'Log',
  Debug = 'Debug',
  Info = 'Info',
  Wran = 'Wran'
}

export enum LogDetailType {
  Str = 0,
  Number,
  Obj,
  Null,
  Undefined
}

export interface LogDetail  {
  value: any
  type: LogDetailType
}

export type LogItemType = {
  type: LogType
  data: string
  date: string
}