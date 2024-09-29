import {Injectable, isDevMode} from '@angular/core';
import {plainToInstance} from 'class-transformer';
import {from, Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Configuration} from '@model/configuration';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  configuration!: Configuration;

  load(): Observable<Configuration> {
    return this.configuration
      ? of(this.configuration)
      : from(
          window.fetch('./assets/configuration.json').then(res => res.json())
        ).pipe(
          map((config: unknown) => plainToInstance(Configuration, config)),
          tap((configuration: Configuration) => {
            this.configuration = configuration;
            if (!isDevMode()) {
              this.configuration.apiUrl = this.configuration.prodUrl;
            }
          })
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
