import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Observer, throwError, EMPTY} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ToastService} from './toast.service';
import {
  HttpPagedRequest,
  HttpRequest,
  HttpBodyRequest,
} from '@model/http/http-request';

export type GobalError = Error | ErrorEvent | HttpErrorResponse | string;

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  static readonly bearer = 'Bearer ';
  protected baseUrl!: string;
  protected apiUrl!: string;

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

  protected static getErrorMessage(error: GobalError): string {
    let message: string;
    if (error instanceof HttpErrorResponse) {
      message = `Status ${error.status}: ${error.message}`;
    } else if (error instanceof ErrorEvent) {
      message = error.message;
    } else if (error instanceof Error) {
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

  public handleError(error: GobalError): void {
    console.error('handleError', error);
    this.toast.error(UtilsService.getErrorMessage(error));
  }

  protected post<T>(
    request: HttpBodyRequest,
    handleError = true
  ): Observable<HttpResponse<T>> {
    return this.httpClient
      .post<T>(
        `${this.baseUrl}/${this.apiUrl}/${request.url ?? ''}`,
        request.body,
        {
          headers: UtilsService.getHeaders(),
          observe: 'response',
          params: request.params,
          responseType: 'json',
        }
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (handleError) {
            this.handleError(err);
          }
          return throwError(err);
        })
      );
  }

  protected put<T>(request: HttpBodyRequest): Observable<HttpResponse<T>> {
    return this.httpClient
      .put<T>(
        `${this.baseUrl}/${this.apiUrl}/${request.url ?? ''}`,
        request.body,
        {
          headers: UtilsService.getHeaders(),
          observe: 'response',
          params: request.params,
          responseType: 'json',
        }
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.handleError(err);
          return throwError(err);
        })
      );
  }

  protected getPaged<T, U>(request?: HttpPagedRequest<U>): Observable<T> {
    return this.get({
      ...request,
      url: `${request?.url ?? ''}${request?.pageRequest?.toUrl()}`,
    });
  }

  protected get<T>(request?: HttpRequest): Observable<T> {
    return this.httpClient
      .get<T>(`${this.baseUrl}/${this.apiUrl}/${request?.url ?? ''}`, {
        headers: UtilsService.getHeaders(),
        params: request?.params,
      })
      .pipe(
        map((response: T) => response),
        catchError((err: HttpErrorResponse) => {
          this.handleError(err);
          return throwError(err);
        })
      );
  }

  protected delete(request?: HttpBodyRequest): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.baseUrl}/${this.apiUrl}/${request?.url ?? ''}`, {
        headers: UtilsService.getHeaders(),
        params: request?.params,
        body: request?.body,
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.handleError(err);
          return EMPTY;
        })
      );
  }
}
