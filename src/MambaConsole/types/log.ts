export enum LogType {
  Log = 'log',
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Clear = 'clear'
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