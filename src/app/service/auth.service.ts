import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable, ReplaySubject, of} from 'rxjs';
import {Token} from '@model/token';
import {jwtDecode, InvalidTokenError} from 'jwt-decode';
import {UtilsService} from './utils.service';
import {ToastService} from './toast.service';
import {catchError, filter, map} from 'rxjs/operators';
import {Utils} from '@shared/utils';
import {ConfigurationService} from './configuration.service';
import {DateTime} from 'luxon';
import {EditUser} from '@model/edit-user';
import {LangService} from './lang.service';
import {NotificationService} from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends UtilsService {
  token$ = new ReplaySubject<Token | undefined>(1);

  constructor(
    private router: Router,
    protected override httpClient: HttpClient,
    protected override toast: ToastService,
    protected configurationService: ConfigurationService,
    private langService: LangService,
    private notificationService: NotificationService,
  ) {
    super(httpClient, toast);
    this.baseUrl = configurationService.get().apiUrl;
    this.apiUrl = configurationService.get().userUrl;
    this.token$.pipe(filter((t): t is Token => !!t)).subscribe(token => {
      this.langService.setLang(token.lang);
      if (environment.production) {
        this.notificationService.subscribeToNotifications();
      }
    });
  }

  logout(showToast: boolean, redirectUrl = ''): void {
    localStorage.clear();
    this.token$.next(undefined);
    sessionStorage.setItem('redirectPage', redirectUrl);
    this.router.navigate(['/user/signin']).catch(err => console.error(err));
    if (showToast) {
      this.toast.success('user.logged_out');
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.token$.asObservable().pipe(
      map(token => {
        if (
          Utils.isNotBlank(token) &&
          (!token.exp || token.exp * 1000 > new Date().getTime())
        ) {
          return true;
        } else {
          try {
            const jwtToken = jwtDecode<Token>(
              localStorage.getItem('token') ?? '',
            );
            if (!jwtToken.exp || jwtToken.exp * 1000 > new Date().getTime()) {
              return true;
            } else {
              return false;
            }
          } catch {
            return false;
          }
        }
      }),
    );
  }

  signin(username: string, password: string): Observable<boolean> {
    return this.post<{token: string}>(
      {
        url: 'signin',
        body: {
          username,
          password,
        },
      },
      false,
    ).pipe(
      map((response: HttpResponse<{token: string}>) => {
        if (response.body !== null && response.body) {
          this.setToken(response.body.token);
          this.toast.success('user.signin.connected');
        } else {
          console.error('no token', response.body);
        }
        return true;
      }),
      catchError((response: HttpErrorResponse) => {
        if (response.status !== 401) {
          this.handleError(response);
        }
        return of(false);
      }),
    );
  }

  signup(
    username: string,
    password: string,
    lang: string,
    favouriteLocation?: string,
  ): Observable<number> {
    return this.post(
      {
        url: 'signup',
        body: {
          username,
          password,
          favouriteLocation,
          lang,
          timezone: DateTime.now().toFormat('z'),
        },
      },
      false,
    ).pipe(
      map(response => response.status),
      catchError((response: HttpErrorResponse) => {
        if (response.status !== 409 && response.status !== 201) {
          this.handleError(response);
        }
        return of(response.status);
      }),
    );
  }

  edit(user: Partial<EditUser>): void {
    this.put<{token: string}>({body: user}).subscribe(
      response => {
        if (response.body !== null && response.body) {
          this.setToken(response.body?.token);
          this.toast.success('user.profile.updated');
        }
      },
      (response: HttpErrorResponse) => this.handleError(response),
    );
  }

  getCurrentUser(): void {
    const requestedUrl = `${window.location.pathname}${window.location.search}`;
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const jwtToken = jwtDecode<Token>(token);
        if (!jwtToken.exp || jwtToken.exp * 1000 > new Date().getTime()) {
          this.token$.next(jwtToken);
        } else {
          this.logout(false, requestedUrl);
        }
      } else {
        this.logout(false, requestedUrl);
      }
    } catch (err: unknown) {
      this.handleError(err as InvalidTokenError);
      this.logout(false);
    }
  }

  private setToken(token: string): void {
    AuthService.setToken(token);
    this.token$.next(jwtDecode<Token>(token));
  }

  private static setToken(token: string): void {
    localStorage.removeItem('token');
    localStorage.setItem('token', token);
  }
}
