import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {environment} from '../../environments/environment';
import {Token} from '../model/token';
import jwtDecode, {InvalidTokenError} from 'jwt-decode';
import {UtilsService} from './utils.service';
import {ToastService} from './toast.service';
import {map} from 'rxjs/operators';
import {Utils} from '../shared/utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends UtilsService {
  token$: BehaviorSubject<Token | undefined> = new BehaviorSubject<
    Token | undefined
  >(undefined);

  constructor(
    private router: Router,
    protected httpClient: HttpClient,
    protected toast: ToastService
  ) {
    super(httpClient, toast);
  }

  private static setToken(token: string): void {
    localStorage.removeItem('token');
    localStorage.setItem('token', token);
  }

  private reject(loggout: boolean): Promise<boolean> {
    if (loggout) {
      this.logout(loggout);
    }
    return new Promise(resolve => resolve(false));
  }

  logout(showToast: boolean): void {
    localStorage.clear();
    sessionStorage.clear();
    this.token$.next(undefined);
    sessionStorage.setItem('redirectPage', '/');
    this.router.navigate(['/user/signin']).catch(err => console.error(err));
    if (showToast) {
      this.toast.success('user.logged_out');
    }
  }

  isAuthenticated(): Promise<boolean> {
    const token = this.token$.getValue();
    if (
      Utils.isNotBlank(token) &&
      (!token.exp || token.exp * 1000 > new Date().getTime())
    ) {
      return new Promise(resolve => resolve(true));
    } else {
      try {
        const jwtToken = jwtDecode<Token>(localStorage.getItem('token') ?? '');
        if (!jwtToken.exp || jwtToken.exp * 1000 > new Date().getTime()) {
          return new Promise(resolve => resolve(true));
        } else {
          return this.reject(false);
        }
      } catch (err) {
        return this.reject(false);
      }
    }
  }

  signin(username: string, password: string): Promise<boolean> {
    return this.httpClient
      .post<{token: string}>(
        `${environment.apiUrl}/${environment.userUrl}/signin`,
        {username, password},
        {observe: 'response'}
      )
      .pipe(
        map(
          (response: HttpResponse<{token: string}>) => {
            if (response.body !== null && response.body) {
              const token = response.body.token;
              AuthService.setToken(token);
              this.token$.next(jwtDecode<Token>(token));
              this.toast.success('user.signin.connected');
              return true;
            } else {
              console.error('no token', response.body);
              return true;
            }
          },
          (response: HttpErrorResponse) => {
            this.handleError(response);
            this.logout(false);
            return false;
          }
        )
      )
      .toPromise();
  }

  signup(
    username: string,
    password: string,
    favouriteLocation?: string
  ): Promise<number> {
    return new Promise<number>(resolve =>
      this.httpClient
        .post(
          `${environment.apiUrl}/${environment.userUrl}/signup`,
          {username, password, favouriteLocation},
          {observe: 'response'}
        )
        .subscribe(
          (response: HttpResponse<unknown>) => resolve(response.status),
          (response: HttpErrorResponse) => {
            this.handleError(response);
            return resolve(response.status);
          }
        )
    );
  }

  getCurrentUser(): void {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const jwtToken = jwtDecode<Token>(token);
        if (!jwtToken.exp || jwtToken.exp * 1000 > new Date().getTime()) {
          this.token$.next(jwtToken);
        } else {
          this.logout(false);
        }
      } else {
        this.logout(false);
      }
    } catch (err: unknown) {
      this.handleError(err as InvalidTokenError);
      this.logout(false);
    }
  }
}