import {NouiFormatter} from 'ng2-nouislider';
import {Utils} from '@shared/utils';

export class SliderFormatter {
  static hourFormatter: NouiFormatter = {
    to: (value: number): string => Utils.formatMinutes(value),
    from: (value: string): number => {
      const split = value.split(':');
      if (split.length !== 2) {
        return +value;
      } else {
        return Utils.timeToMinutes(+(split[0] ?? '0'), +(split[1] ?? '0'));
      }
    },
  };

  static defaultFormatter: NouiFormatter = {
    to: (value: number): string => `${Math.round(value)}`,
    from: (value: string): number => +value,
  };
}
