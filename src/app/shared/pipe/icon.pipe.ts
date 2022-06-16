import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'icon',
})
export class IconPipe implements PipeTransform {
  transform(url: string, isDay = true): unknown {
    if (
      !isDay &&
      [
        '122.png',
        '143.png',
        '185.png',
        '227.png',
        '230.png',
        '248.png',
        '260.png',
        '263.png',
        '266.png',
        '281.png',
        '284.png',
        '296.png',
        '302.png',
        '308.png',
        '311.png',
        '314.png',
        '326.png',
        '332.png',
        '338.png',
        '350.png',
        '389.png',
        '395.png',
      ].includes(url)
    ) {
      isDay = true;
    }
    return `./assets/icons/${isDay ? 'day' : 'night'}/${url}`;
  }
}
