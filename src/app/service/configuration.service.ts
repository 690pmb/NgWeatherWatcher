import {Injectable} from '@angular/core';
import {Configuration} from '../model/configuration';
import {from, Observable, of} from 'rxjs';
import {tap, map} from 'rxjs/operators';
import {plainToInstance} from 'class-transformer';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  configuration!: Configuration;

  constructor() {}

  load(): Observable<Configuration> {
    return this.configuration
      ? of(this.configuration)
      : from(fetch('./assets/configuration.json').then(res => res.json())).pipe(
          map((config: Object) => plainToInstance(Configuration, config)),
          tap(
            (configuration: Configuration) =>
              (this.configuration = configuration)
          )
        );
  }

  get(): Configuration {
    if (this.configuration) {
      return this.configuration;
    } else {
      throw new Error('Configuration is not loaded');
    }
  }
}
