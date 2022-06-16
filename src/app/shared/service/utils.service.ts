import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Observer, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ToastService} from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  static readonly bearer = 'Bearer ';

  constructor(
    protected httpClient: HttpClient,
    protected toast: ToastService
  ) {}

  public static findUserPosition(observer: Observer<string>): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position =>
          observer.next(
            `${position.coords.latitude},${position.coords.longitude}`
          ),
        err => {
          if (err.code === GeolocationPositionError.PERMISSION_DENIED) {
            observer.error('global.geolocation.denied');
          } else {
            this.findUserPosition(observer);
          }
        },
        {timeout: 5000}
      );
    } else {
      observer.error('global.geolocation.not_supported');
    }
  }

  protected static getErrorMessage(
    error: HttpErrorResponse | string | ErrorEvent
  ): string {
    let message: string;
    if (error instanceof HttpErrorResponse) {
      message = `Status ${error.status}: ${error.message}`;
    } else if (error instanceof ErrorEvent) {
      message = error.message;
    } else {
      message = error;
    }
    return message;
  }

  static getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'content-Type': 'application/json',
      authorization: UtilsService.bearer + localStorage.getItem('token'),
    });
  }

  public handleError(error: HttpErrorResponse | string | ErrorEvent): void {
    console.error('handleError', error);
    this.toast.error(UtilsService.getErrorMessage(error));
  }

  protected getPromise<T>(
    url: string,
    defaultValue: T,
    params?: HttpParams
  ): Promise<T> {
    return this.getObservable<T>(url, defaultValue, params).toPromise();
  }

  protected getObservable<T>(
    url: string,
    defaultValue: T,
    params?: HttpParams
  ): Observable<T> {
    return this.httpClient
      .get<T>(url, {headers: UtilsService.getHeaders(), params})
      .pipe(
        map((response: T) => response),
        catchError((err: HttpErrorResponse) => {
          this.handleError(err);
          return of(defaultValue);
        })
      );
  }
}
