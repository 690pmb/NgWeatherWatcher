import {Mode} from './mode';
import {NouiFormatter} from 'ng2-nouislider';

export type PipTypeValue = -1 | 0 | 1 | 2;

export type PipType = 'BIG' | 'NO_VALUE' | 'NONE' | 'SMALL';

export const pipTypeMapping: Record<PipType, PipTypeValue> = {
  NONE: -1,
  NO_VALUE: 0,
  SMALL: 1,
  BIG: 2,
};

export type Pip = {
  mode: Mode;
  density: number;
  values?: number;
  stepped?: boolean;
  filter?: (value: number) => PipTypeValue;
  format?: NouiFormatter;
};
