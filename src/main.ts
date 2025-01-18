import {
  APP_INITIALIZER,
  enableProdMode,
  importProvidersFrom,
  inject,
} from '@angular/core';
import 'hammerjs';
import 'reflect-metadata';
import {environment} from './environments/environment';
import {AppComponent} from './app/app.component';
import {provideServiceWorker} from '@angular/service-worker';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {provideHttpClient, HttpClient} from '@angular/common/http';
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
import {
  TranslateLoader,
  TranslateService,
  provideTranslateService,
} from '@ngx-translate/core';
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import {registerLocaleData} from '@angular/common';
import {provideRouter, withViewTransitions} from '@angular/router';
import {routes} from './app/app-routing';
import {ConfigurationService} from '@services/configuration.service';
import {DateTimePipe} from '@shared/pipe/date-time.pipe';

if (environment.production) {
  enableProdMode();
}
registerLocaleData(localeFr);
registerLocaleData(localeEn);

bootstrapApplication(AppComponent, {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(),
    importProvidersFrom(BrowserModule, HammerModule, MatSnackBarModule),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    provideTranslateService({
      useDefaultLang: false,
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient): TranslateHttpLoader =>
          new TranslateHttpLoader(http, './assets/i18n/', '.json'),
        deps: [HttpClient],
      },
    }),
    DateTimePipe,
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const translateService = inject(TranslateService);
        return () =>
          translateService.use(
            translateService.getBrowserLang() === 'fr' ? 'fr' : 'en'
          );
      },
      deps: [TranslateService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const conf = inject(ConfigurationService);
        return () => conf.load();
      },
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
  ],
}).catch(err => console.error(err));
