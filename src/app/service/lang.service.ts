import {inject, Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  static readonly DEFAULT_LANG = 'en';
  private static readonly SUPPORTED_LANGS = [
    'fr',
    'en',
    'es',
    'de',
    'it',
    'pt',
  ];

  translate = inject(TranslateService);
  private lang$ = new BehaviorSubject<string>(
    this.translate.getBrowserLang() ?? LangService.DEFAULT_LANG,
  );

  constructor() {
    this.lang$.subscribe(lang =>
      this.translate.use(
        LangService.SUPPORTED_LANGS.includes(lang)
          ? lang
          : LangService.DEFAULT_LANG,
      ),
    );
  }

  getLang(): Observable<string> {
    return this.lang$.asObservable();
  }

  setLang(lang?: string): void {
    this.lang$.next(lang ?? LangService.DEFAULT_LANG);
  }
}
