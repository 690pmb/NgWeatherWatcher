import {Duration} from 'luxon';
import {NouiFormatter} from 'ng2-nouislider';
import {Utils} from '../../../shared/utils';

export class SliderFormatter {
  static hourFormatter: NouiFormatter = {
    to: (value: number): string => Utils.minutesToFormat(value),
    from: (value: string): number => {
      const split = value.split(':');
      if (split.length !== 2) {
        return +value;
      } else {
        return Duration.fromObject({
          hours: +split[0],
          minutes: +split[1],
        }).as('minutes');
      }
    },
  };
}
