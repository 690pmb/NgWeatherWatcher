import {Injectable} from '@angular/core';
import {Configuration} from '../model/configuration';
import {from, Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';

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
          tap(configuration => (this.configuration = configuration))
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
