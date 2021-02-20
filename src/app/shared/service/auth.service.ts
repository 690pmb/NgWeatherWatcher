import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Token } from '../../model/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static readonly bearer = 'Bearer ';
  token$: BehaviorSubject<Token> = new BehaviorSubject(undefined);

  constructor(private router: Router, private httpClient: HttpClient) { }

  private static setToken(token: string): void {
    localStorage.removeItem('token');
    localStorage.setItem('token', token);
  }

  private reject(loggout: boolean): Promise<boolean> {
    if (loggout) {
      this.logout();
    }
    return new Promise(resolve => resolve(false));
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.token$.next(undefined);
    sessionStorage.setItem('redirectPage', '/');
    this.router.navigate(['/user/signin']);
  }

  isAuthenticated(): Promise<boolean> {
    const token = this.token$.getValue();
    if (token && (token).exp * 1000 > new Date().getTime()) {
      return new Promise(resolve => resolve(true));
    } else {
      try {
        const jwtToken = jwtDecode(localStorage.getItem('token')) as Token;
        if (jwtToken && (jwtToken).exp * 1000 > new Date().getTime()) {
          return new Promise(resolve => resolve(true));
        } else {
          return this.reject(false);
        }
      } catch (err) {
        return this.reject(false);
      }
    }
  }

  login(username: string, password: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      return this.httpClient.post(`${environment.apiUrl}/${environment.userUrl}/signin`,
        { username, password }, { observe: 'response' })
        .subscribe((response: HttpResponse<any>) => {
          if (response.body != null && response.body !== 'null' && response.body) {
            const token = response.body.token;
            AuthService.setToken(token);
            this.token$.next(jwtDecode(token));
            return resolve(true);
          } else {
            console.error('no token', response.body);
            return this.reject(true);
          }
        }, (response: HttpErrorResponse) => {
          console.error('error', response.error);
          return this.reject(false);
        });
    });
  }

  signup(username: string, password: string): Promise<number> {
    return new Promise<number>((resolve) => {
      return this.httpClient.post(`${environment.apiUrl}/${environment.userUrl}/signup`,
        { username, password }, { observe: 'response' })
        .subscribe((response: HttpResponse<any>) => {
          return resolve(response.status);
        }, (response: HttpErrorResponse) => {
          console.error('error', response.error);
          return resolve(response.status);
        });
    });
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: AuthService.bearer + localStorage.getItem('token')
    });
  }

}
