export enum MonitoredDay {
  sameDay = 'sameDay',
  nextDay = 'nextDay',
  twoDayLater = 'twoDayLater',
}

export type MonitoredDays = Record<MonitoredDay, boolean>;
