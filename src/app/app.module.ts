import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    TranslateLoader,
    TranslateModule,
    TranslateService
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { SharedModule } from './shared/shared.module';

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
                deps: [HttpClient]
            }
        })
    ],
    providers: [AuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(translate: TranslateService) {
        translate.use('fr');
        registerLocaleData(localeFr);
        registerLocaleData(localeEn);
    }
}
