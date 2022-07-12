import {registerLocaleData} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule, HammerModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthGuard} from './auth.guard';
import {SharedModule} from './shared/shared.module';
import {Observable} from 'rxjs';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HammerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule.forRoot(),
    TranslateModule.forRoot({
      useDefaultLang: false,
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient): TranslateHttpLoader =>
          new TranslateHttpLoader(http, './assets/i18n/', '.json'),
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    AuthGuard,
    {
      provide: APP_INITIALIZER,
      useFactory:
        (service: TranslateService): (() => Observable<string>) =>
        () =>
          service.use('fr'),
      deps: [TranslateService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    registerLocaleData(localeFr);
    registerLocaleData(localeEn);
  }
}
