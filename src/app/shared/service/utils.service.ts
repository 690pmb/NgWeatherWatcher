import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  static readonly bearer = 'Bearer ';

  constructor(
    protected httpClient: HttpClient,
    protected toast: ToastService
  ) { }

  protected static encodeQueryUrl(query: string): string {
    return encodeURIComponent(query).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16));
  }

  protected static getErrorMessage(error: any): string {
    let message;
    if (error.response) {
      message = error.response.error;
    } else if (error.error && error.error.errors) {
      message = 'Status ' + error.status + ': ' + error.error.errors.join(', ');
    } else if (error.error) {
      message = error.error;
    } else if (error.message) {
      message = error.message;
    } else {
      message = 'Unknown Error';
    }
    return message;
  }

  static getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: UtilsService.bearer + localStorage.getItem('token')
    });
  }

  protected handleError(error: any): void {
    console.error('handleError', error);
    this.toast.error(UtilsService.getErrorMessage(error));
  }

  protected getPromise<T>(url: string, defaultValue: T): Promise<T> {
    return this.getObservable<T>(url, defaultValue).toPromise();
  }

  protected getObservable<T>(url: string, defaultValue: T, params?: HttpParams): Observable<T> {
    console.log('url', url);
    return this.httpClient.get<T>(url, { headers: UtilsService.getHeaders() , params})
      .pipe(map((response: T) => response),
        catchError((err: HttpErrorResponse) => {
          this.handleError(err);
          return of(defaultValue);
        }));
  }
}
