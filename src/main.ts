import {
  enableProdMode,
  APP_INITIALIZER,
  importProvidersFrom,
} from '@angular/core';
import 'hammerjs';
import 'reflect-metadata';
import {environment} from './environments/environment';
import {AppComponent} from './app/app.component';
import {provideServiceWorker} from '@angular/service-worker';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {
  withInterceptorsFromDi,
  provideHttpClient,
  HttpClient,
} from '@angular/common/http';
import {
  BrowserModule,
  HammerModule,
  bootstrapApplication,
} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {
  MAT_RIPPLE_GLOBAL_OPTIONS,
  RippleGlobalOptions,
} from '@angular/material/core';
import {Configuration} from '@model/configuration';
import {ConfigurationService} from '@services/configuration.service';
import {Observable} from 'rxjs';
import {
  TranslateService,
  TranslateModule,
  TranslateLoader,
} from '@ngx-translate/core';
import {DateTimePipe} from '@shared/pipe/date-time.pipe';
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import {registerLocaleData} from '@angular/common';
import {provideRouter} from '@angular/router';
import {routes} from './app/app-routing';

if (environment.production) {
  enableProdMode();
}
registerLocaleData(localeFr);
registerLocaleData(localeEn);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      BrowserModule,
      HammerModule,
      MatSnackBarModule,
      TranslateModule.forRoot({
        useDefaultLang: false,
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient): TranslateHttpLoader =>
            new TranslateHttpLoader(http, './assets/i18n/', '.json'),
          deps: [HttpClient],
        },
      })
    ),
    DateTimePipe,
    {
      provide: APP_INITIALIZER,
      useFactory:
        (service: TranslateService): (() => Observable<string>) =>
        () =>
          service.use(service.getBrowserLang() === 'fr' ? 'fr' : 'en'),
      deps: [TranslateService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory:
        (conf: ConfigurationService): (() => Observable<Configuration>) =>
        () =>
          conf.load(),
      deps: [ConfigurationService],
      multi: true,
    },
    {
      provide: MAT_RIPPLE_GLOBAL_OPTIONS,
      useValue: {
        disabled: true,
        animation: {
          enterDuration: 0,
          exitDuration: 0,
        },
      } satisfies RippleGlobalOptions,
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch(err => console.error(err));
